"""Feature engineering for FinSight ML models.

Transactions arrive from the Node backend as a list of dicts shaped like:

    {
        "id": "<uuid>",
        "amount": 42.50,          # always positive in the DB
        "type": "income" | "expense",
        "category": "Food & Dining",
        "date": "2026-07-01",
        "description": "Groceries"
    }

This module normalises that into two useful shapes:

1. A per-transaction feature frame (for anomaly detection).
2. A continuous daily balance time series (for forecasting / insights).
"""

from __future__ import annotations

import numpy as np
import pandas as pd

# Columns we rely on downstream.
REQUIRED_COLS = ["amount", "type", "date"]


def to_dataframe(transactions) -> pd.DataFrame:
    """Convert a list of transaction dicts into a cleaned DataFrame.

    Adds a ``signed_amount`` column (positive for income, negative for
    expenses) and parses ``date`` to ``datetime64``. Rows with unparseable
    amounts or dates are dropped.
    """
    if isinstance(transactions, pd.DataFrame):
        df = transactions.copy()
    else:
        df = pd.DataFrame(transactions or [])

    if df.empty:
        return df

    # Ensure expected columns exist so downstream code is defensive.
    for col in ("amount", "type", "category", "date", "id", "description"):
        if col not in df.columns:
            df[col] = np.nan

    df["amount"] = pd.to_numeric(df["amount"], errors="coerce")
    df["date"] = pd.to_datetime(df["date"], errors="coerce")
    df = df.dropna(subset=["amount", "date"])

    if df.empty:
        return df

    df["type"] = df["type"].fillna("expense").astype(str).str.lower()
    df["category"] = df["category"].fillna("Uncategorized").astype(str)

    # Signed amount: income adds to balance, expenses subtract.
    sign = np.where(df["type"].eq("income"), 1.0, -1.0)
    df["signed_amount"] = df["amount"].astype(float) * sign

    return df.sort_values("date").reset_index(drop=True)


def daily_balance_series(df: pd.DataFrame, starting_balance: float = 0.0) -> pd.DataFrame:
    """Build a continuous daily time series of net flow and running balance.

    Missing calendar days are filled with zero net flow so the series is
    gap-free (required for stable lag/rolling features and forecasting).

    Returns a DataFrame indexed 0..N with columns:
        date, net_flow, balance
    """
    if df is None or df.empty:
        return pd.DataFrame(columns=["date", "net_flow", "balance"])

    daily = (
        df.groupby(df["date"].dt.normalize())["signed_amount"]
        .sum()
        .rename("net_flow")
    )

    # Reindex to a continuous daily range.
    full_range = pd.date_range(daily.index.min(), daily.index.max(), freq="D")
    daily = daily.reindex(full_range, fill_value=0.0)

    balance = starting_balance + daily.cumsum()

    out = pd.DataFrame(
        {
            "date": daily.index,
            "net_flow": daily.values,
            "balance": balance.values,
        }
    ).reset_index(drop=True)
    return out


def calendar_features(dates: pd.DatetimeIndex) -> pd.DataFrame:
    """Calendar features used by the forecasting model.

    Kept deterministic and free of leakage so the same transform applies to
    both training history and future forecast dates.
    """
    dates = pd.DatetimeIndex(dates)
    feats = pd.DataFrame(index=range(len(dates)))
    dow = dates.dayofweek
    feats["dow"] = dow
    feats["is_weekend"] = (dow >= 5).astype(int)
    feats["day_of_month"] = dates.day
    feats["month"] = dates.month
    feats["is_month_start"] = dates.is_month_start.astype(int)
    feats["is_month_end"] = dates.is_month_end.astype(int)

    # One-hot day-of-week captures weekly seasonality for linear models.
    for d in range(7):
        feats[f"dow_{d}"] = (dow == d).astype(int)

    return feats.reset_index(drop=True)


def transaction_features(df: pd.DataFrame) -> pd.DataFrame:
    """Per-transaction numeric features for anomaly detection.

    All features are computed relative to the user's own history so the
    detector adapts to each user's normal behaviour instead of a global rule.
    """
    if df is None or df.empty:
        return pd.DataFrame()

    work = df.copy()
    work["abs_amount"] = work["amount"].astype(float).abs()
    work["log_amount"] = np.log1p(work["abs_amount"])

    # Amount deviation within the transaction's own category.
    cat_stats = work.groupby("category")["abs_amount"].agg(["mean", "std", "median"])
    cat_stats = cat_stats.rename(
        columns={"mean": "cat_mean", "std": "cat_std", "median": "cat_median"}
    )
    work = work.merge(cat_stats, left_on="category", right_index=True, how="left")

    # Guard against zero / NaN std (single-transaction categories).
    work["cat_std"] = work["cat_std"].replace(0, np.nan)
    work["amount_zscore"] = (
        (work["abs_amount"] - work["cat_mean"]) / work["cat_std"]
    ).fillna(0.0)

    # Ratio to category median (how many times the "typical" spend).
    work["median_ratio"] = (
        work["abs_amount"] / work["cat_median"].replace(0, np.nan)
    ).fillna(1.0)

    dow = work["date"].dt.dayofweek
    work["dow"] = dow
    work["is_weekend"] = (dow >= 5).astype(int)

    feature_cols = [
        "log_amount",
        "amount_zscore",
        "median_ratio",
        "dow",
        "is_weekend",
    ]
    feats = work[feature_cols].astype(float).reset_index(drop=True)
    return feats
