"""Warm-start / persist ML artifacts.

The forecasting and anomaly models are fit per-request on each user's own
transactions (which is the correct design for personalised finance). This
script exists to (a) validate the full pipeline end-to-end on synthetic data
and (b) persist a reference IsolationForest so the container can ship with a
sane default model if desired.

Run:  python train.py
"""

from __future__ import annotations

import os

import joblib
from sklearn.ensemble import IsolationForest

from ml.features import to_dataframe, transaction_features
from ml.forecast import forecast_balance
from ml.insights import generate_insights
from ml.synthetic import generate_transactions

MODELS_DIR = os.path.join(os.path.dirname(__file__), "models")


def main() -> None:
    os.makedirs(MODELS_DIR, exist_ok=True)
    txns = generate_transactions(days=180, seed=42)

    # Sanity-check the pipeline.
    fc = forecast_balance(txns, days=30)
    print(f"[forecast] model={fc['model']} points={len(fc['forecast'])}")

    ins = generate_insights(txns)
    print(f"[insights] generated {len(ins['insights'])} insight(s)")

    # Persist a reference anomaly model.
    feats = transaction_features(to_dataframe(txns))
    model = IsolationForest(n_estimators=200, contamination=0.05, random_state=42)
    model.fit(feats.to_numpy(dtype=float))
    path = os.path.join(MODELS_DIR, "anomaly_reference.pkl")
    joblib.dump(model, path)
    print(f"[anomaly] reference model saved -> {path}")


if __name__ == "__main__":
    main()
