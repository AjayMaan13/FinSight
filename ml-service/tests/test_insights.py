from ml.insights import generate_insights
from ml.synthetic import generate_transactions


def test_insights_structure():
    txns = generate_transactions(days=120, seed=9)
    result = generate_insights(txns)
    assert "insights" in result
    assert "summary" in result
    assert "category_breakdown" in result
    assert "monthly_trend" in result
    assert isinstance(result["insights"], list)
    assert len(result["insights"]) >= 1


def test_summary_fields_present():
    txns = generate_transactions(days=120, seed=9)
    summary = generate_insights(txns)["summary"]
    assert "avg_monthly_spending" in summary
    assert "savings_rate" in summary
    assert "top_category" in summary


def test_budget_exceeded_flag():
    txns = generate_transactions(days=60, seed=2)
    # Force a tiny budget so it is certainly exceeded.
    budgets = [{"category": "Food & Dining", "amount": 1.0, "period": "monthly"}]
    result = generate_insights(txns, budgets=budgets)
    titles = [i["title"] for i in result["insights"]]
    assert any("Budget" in t for t in titles)


def test_empty_input():
    result = generate_insights([])
    assert result["insights"] == []
    assert result["monthly_trend"] == []
