"""Balance forecasting.

Approach
--------
We model **daily net cash flow** as a function of calendar features
(day-of-week seasonality, day-of-month, month) using ridge regression, then
integrate the predicted daily flows into a running balance forecast.

Because a balance is the cumulative sum of daily flows, forecast uncertainty
grows with the horizon like a random walk: the variance at day *t* is roughly
``t * residual_variance``. We use that to produce a widening 95% confidence
band, which is both statistically principled and visually informative.

When there is too little history to fit a model reliably, we fall back to a
transparent seasonal-average heuristic and flag it in the response
(``"model": "seasonal_fallback"``).
"""

from __future__ import annotations

from datetime import timedelta

import numpy as np
import pandas as pd
from sklearn.linear_model import Ridge

from .features import calendar_features, daily_balance_series, to_dataframe

# Minimum days of history before we trust the regression model.
MIN_DAYS_FOR_MODEL = 14
Z_95 = 1.96


def _fallback_forecast(series: pd.DataFrame, horizon: int) -> dict:
    """Seasonal-average fallback for sparse data.

    Predicts each future day's net flow as the mean flow for that day of week
    (falling back to the overall mean), then integrates to a balance path.
    """
    net = series["net_flow"]
    dow_means = net.groupby(series["date"].dt.dayofweek).mean()
    overall_mean = float(net.mean())
    resid_std = float(net.std(ddof=1)) if len(net) > 1 else abs(overall_mean) or 1.0

    last_balance = float(series["balance"].iloc[-1])
    last_date = series["date"].iloc[-1]

    points = []
    balance = last_balance
    for step in range(1, horizon + 1):
        date = last_date + timedelta(days=step)
        daily = float(dow_means.get(date.dayofweek, overall_mean))
        balance += daily
        band = Z_95 * resid_std * np.sqrt(step)
        points.append(
            {
                "date": date.strftime("%Y-%m-%d"),
                "balance": round(balance, 2),
                "lower": round(balance - band, 2),
                "upper": round(balance + band, 2),
            }
        )
    return {"model": "seasonal_fallback", "forecast": points}


def forecast_balance(transactions, days: int = 30, starting_balance: float = 0.0) -> dict:
    """Forecast the next ``days`` of daily balance.

    Parameters
    ----------
    transactions : list[dict] | pd.DataFrame
        Raw user transactions.
    days : int
        Forecast horizon.
    starting_balance : float
        Balance before the first transaction in history.

    Returns
    -------
    dict with keys ``model`` and ``forecast`` (list of
    ``{date, balance, lower, upper}``). Returns an empty forecast if there is
    no usable history.
    """
    df = to_dataframe(transactions)
    series = daily_balance_series(df, starting_balance=starting_balance)

    if series.empty:
        return {"model": "none", "forecast": []}

    if len(series) < MIN_DAYS_FOR_MODEL:
        return _fallback_forecast(series, days)

    # Train: predict daily net flow from calendar features.
    X = calendar_features(pd.DatetimeIndex(series["date"]))
    y = series["net_flow"].to_numpy(dtype=float)

    model = Ridge(alpha=1.0)
    model.fit(X.to_numpy(dtype=float), y)

    # Residual std drives the confidence band width.
    resid = y - model.predict(X.to_numpy(dtype=float))
    resid_std = float(np.std(resid, ddof=1)) if len(resid) > 1 else 1.0
    if resid_std == 0:
        resid_std = 1e-6

    last_balance = float(series["balance"].iloc[-1])
    last_date = series["date"].iloc[-1]

    future_dates = pd.DatetimeIndex(
        [last_date + timedelta(days=step) for step in range(1, days + 1)]
    )
    Xf = calendar_features(future_dates).to_numpy(dtype=float)
    predicted_flows = model.predict(Xf)

    balances = last_balance + np.cumsum(predicted_flows)

    points = []
    for step, (date, balance) in enumerate(zip(future_dates, balances), start=1):
        band = Z_95 * resid_std * np.sqrt(step)
        points.append(
            {
                "date": date.strftime("%Y-%m-%d"),
                "balance": round(float(balance), 2),
                "lower": round(float(balance - band), 2),
                "upper": round(float(balance + band), 2),
            }
        )

    return {"model": "ridge_calendar", "forecast": points}
