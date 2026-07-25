"""Synthetic transaction generator.

Used to (a) train/warm the models when a user has little history and (b) give
tests and demos realistic, reproducible data. Generation is seeded so output
is deterministic.
"""

from __future__ import annotations

from datetime import datetime, timedelta

import numpy as np

CATEGORIES = {
    "Food & Dining": (12, 45),
    "Transportation": (8, 30),
    "Shopping": (20, 120),
    "Utilities": (40, 160),
    "Entertainment": (10, 60),
    "Groceries": (25, 90),
}


def generate_transactions(days: int = 120, seed: int = 42, inject_anomalies: bool = True):
    """Generate a list of synthetic transaction dicts spanning ``days``.

    Models a biweekly salary as income and daily discretionary expenses with
    weekend uplift. Optionally injects a few clear outliers so anomaly
    detection has something to find.
    """
    rng = np.random.default_rng(seed)
    start = datetime.now() - timedelta(days=days)
    txns = []
    tid = 0
    cats = list(CATEGORIES.items())

    for d in range(days):
        date = start + timedelta(days=d)
        date_str = date.strftime("%Y-%m-%d")

        # Biweekly salary.
        if d % 14 == 0:
            tid += 1
            txns.append(
                {
                    "id": f"tx-{tid}",
                    "amount": round(float(rng.normal(2200, 80)), 2),
                    "type": "income",
                    "category": "Salary",
                    "date": date_str,
                    "description": "Payroll deposit",
                }
            )

        # 0-3 expenses per day, more on weekends.
        base = 2 if date.weekday() >= 5 else 1
        n_exp = int(rng.integers(base, base + 2))
        for _ in range(n_exp):
            category, (lo, hi) = cats[int(rng.integers(0, len(cats)))]
            amount = float(rng.uniform(lo, hi))
            tid += 1
            txns.append(
                {
                    "id": f"tx-{tid}",
                    "amount": round(amount, 2),
                    "type": "expense",
                    "category": category,
                    "date": date_str,
                    "description": f"{category} purchase",
                }
            )

    if inject_anomalies and txns:
        # A handful of clearly abnormal large expenses.
        for _ in range(3):
            idx = int(rng.integers(0, len(txns)))
            category, (_, hi) = cats[int(rng.integers(0, len(cats)))]
            tid += 1
            txns.append(
                {
                    "id": f"tx-{tid}",
                    "amount": round(float(hi * rng.uniform(6, 10)), 2),
                    "type": "expense",
                    "category": category,
                    "date": txns[idx]["date"],
                    "description": f"Large {category} charge",
                }
            )

    return txns
