import pandas as pd

from ml.features import (
    daily_balance_series,
    to_dataframe,
    transaction_features,
)
from ml.synthetic import generate_transactions


def test_to_dataframe_signs_amounts():
    txns = [
        {"amount": 100, "type": "income", "category": "Salary", "date": "2026-01-01"},
        {"amount": 40, "type": "expense", "category": "Food", "date": "2026-01-02"},
    ]
    df = to_dataframe(txns)
    assert df.loc[0, "signed_amount"] == 100
    assert df.loc[1, "signed_amount"] == -40


def test_to_dataframe_drops_bad_rows():
    txns = [
        {"amount": "not-a-number", "type": "expense", "date": "2026-01-01"},
        {"amount": 10, "type": "expense", "date": "not-a-date"},
        {"amount": 20, "type": "expense", "date": "2026-01-03"},
    ]
    df = to_dataframe(txns)
    assert len(df) == 1


def test_daily_balance_series_is_gap_free():
    txns = [
        {"amount": 100, "type": "income", "date": "2026-01-01"},
        {"amount": 30, "type": "expense", "date": "2026-01-05"},
    ]
    series = daily_balance_series(txns := to_dataframe(txns), starting_balance=0)
    # Jan 1..5 inclusive == 5 continuous days.
    assert len(series) == 5
    assert series["date"].is_monotonic_increasing
    # Running balance ends at 100 - 30 = 70.
    assert round(series["balance"].iloc[-1], 2) == 70.0


def test_transaction_features_shape():
    txns = generate_transactions(days=60, seed=1)
    feats = transaction_features(to_dataframe(txns))
    assert not feats.empty
    assert set(["log_amount", "amount_zscore", "median_ratio"]).issubset(feats.columns)


def test_empty_input_returns_empty():
    assert to_dataframe([]).empty
    assert daily_balance_series(pd.DataFrame()).empty
