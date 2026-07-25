"""Transaction anomaly detection using an Isolation Forest.

The model is fit on the user's own transaction features (see
``features.transaction_features``), so "normal" is defined per user rather
than by a global threshold. Each flagged transaction comes back with a real,
feature-derived reason instead of a random label.
"""

from __future__ import annotations

import numpy as np
from sklearn.ensemble import IsolationForest

from .features import to_dataframe, transaction_features

# Below this many transactions there isn't enough signal to model outliers.
MIN_TX_FOR_MODEL = 10


def _reason_for(row) -> str:
    """Derive a human-readable reason from which feature deviated most."""
    z = row.get("amount_zscore", 0.0)
    ratio = row.get("median_ratio", 1.0)
    is_weekend = row.get("is_weekend", 0)

    if z >= 2.5 or ratio >= 3.0:
        return "Unusually large amount for this category"
    if z <= -2.0:
        return "Unusually small amount for this category"
    if ratio >= 2.0:
        return "Amount well above the typical spend in this category"
    if is_weekend:
        return "Atypical transaction pattern (weekend activity)"
    return "Overall pattern deviates from your usual activity"


def detect_anomalies(transactions, contamination: float = 0.05) -> dict:
    """Flag anomalous transactions.

    Parameters
    ----------
    transactions : list[dict] | pd.DataFrame
    contamination : float
        Expected proportion of anomalies (0 < c < 0.5). Passed to
        IsolationForest.

    Returns
    -------
    dict with keys ``model`` and ``anomalies`` (list of
    ``{transaction_id, anomaly_score, reason, amount, category, date}``),
    sorted most-anomalous first.
    """
    df = to_dataframe(transactions)
    if df.empty or len(df) < MIN_TX_FOR_MODEL:
        return {"model": "insufficient_data", "anomalies": []}

    feats = transaction_features(df)
    X = feats.to_numpy(dtype=float)

    contamination = float(min(max(contamination, 0.001), 0.49))

    model = IsolationForest(
        n_estimators=200,
        contamination=contamination,
        random_state=42,
    )
    labels = model.fit_predict(X)  # -1 == anomaly
    # Higher score == more anomalous (negate the signed decision function).
    raw = -model.score_samples(X)

    # Normalise scores to 0..1 for a friendly UI value.
    lo, hi = raw.min(), raw.max()
    norm = (raw - lo) / (hi - lo) if hi > lo else np.zeros_like(raw)

    anomalies = []
    for i, (label, score) in enumerate(zip(labels, norm)):
        if label != -1:
            continue
        row = df.iloc[i]
        feat_row = feats.iloc[i]
        anomalies.append(
            {
                "transaction_id": (
                    None if row.get("id") is None or (isinstance(row.get("id"), float) and np.isnan(row.get("id")))
                    else str(row.get("id"))
                ),
                "anomaly_score": round(float(score), 4),
                "reason": _reason_for(feat_row),
                "amount": round(float(row["amount"]), 2),
                "category": str(row["category"]),
                "date": row["date"].strftime("%Y-%m-%d"),
                "description": None if row.get("description") is None else str(row.get("description")),
            }
        )

    anomalies.sort(key=lambda a: a["anomaly_score"], reverse=True)
    return {"model": "isolation_forest", "anomalies": anomalies}
