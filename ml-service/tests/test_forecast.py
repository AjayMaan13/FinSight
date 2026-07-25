from ml.forecast import forecast_balance
from ml.synthetic import generate_transactions


def test_forecast_returns_requested_horizon():
    txns = generate_transactions(days=120, seed=7)
    result = forecast_balance(txns, days=30)
    assert result["model"] == "ridge_calendar"
    assert len(result["forecast"]) == 30


def test_forecast_confidence_band_widens_with_horizon():
    txns = generate_transactions(days=120, seed=7)
    forecast = forecast_balance(txns, days=30)["forecast"]
    first_width = forecast[0]["upper"] - forecast[0]["lower"]
    last_width = forecast[-1]["upper"] - forecast[-1]["lower"]
    # Uncertainty accumulates like a random walk -> band gets wider.
    assert last_width > first_width


def test_forecast_band_brackets_estimate():
    txns = generate_transactions(days=120, seed=7)
    for p in forecast_balance(txns, days=30)["forecast"]:
        assert p["lower"] <= p["balance"] <= p["upper"]


def test_forecast_falls_back_on_sparse_data():
    txns = generate_transactions(days=5, seed=3)
    result = forecast_balance(txns, days=10)
    assert result["model"] in ("seasonal_fallback", "none")


def test_forecast_empty_input():
    result = forecast_balance([], days=30)
    assert result["forecast"] == []
