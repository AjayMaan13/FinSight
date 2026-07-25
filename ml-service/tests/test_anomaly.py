from ml.anomaly import detect_anomalies
from ml.synthetic import generate_transactions


def test_detects_injected_anomalies():
    # Synthetic data injects a few very large expenses.
    txns = generate_transactions(days=120, seed=11, inject_anomalies=True)
    result = detect_anomalies(txns, contamination=0.05)
    assert result["model"] == "isolation_forest"
    assert len(result["anomalies"]) > 0
    # The most anomalous should be a large-amount reason.
    top = result["anomalies"][0]
    assert top["anomaly_score"] >= result["anomalies"][-1]["anomaly_score"]
    assert "amount" in top and top["amount"] > 0


def test_scores_sorted_descending():
    txns = generate_transactions(days=120, seed=5)
    anomalies = detect_anomalies(txns)["anomalies"]
    scores = [a["anomaly_score"] for a in anomalies]
    assert scores == sorted(scores, reverse=True)


def test_insufficient_data_returns_empty():
    txns = generate_transactions(days=2, seed=1, inject_anomalies=False)
    result = detect_anomalies(txns[:5])
    assert result["model"] == "insufficient_data"
    assert result["anomalies"] == []


def test_reasons_are_human_readable():
    txns = generate_transactions(days=120, seed=11)
    for a in detect_anomalies(txns)["anomalies"]:
        assert isinstance(a["reason"], str) and len(a["reason"]) > 0
