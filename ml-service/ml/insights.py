"""Computed spending insights.

Everything here is derived from the user's actual transactions — no hardcoded
strings. Powers the frontend Insights page: month-over-month category deltas,
savings rate, top movers, projected month-end balance, and optional
budget-risk flags.
"""

from __future__ import annotations

import numpy as np
import pandas as pd

from .features import daily_balance_series, to_dataframe
from .forecast import forecast_balance


def _month_key(dates: pd.Series) -> pd.Series:
    return dates.dt.to_period("M")


def generate_insights(transactions, budgets=None, starting_balance: float = 0.0) -> dict:
    """Produce structured insights and summary stats.

    Parameters
    ----------
    transactions : list[dict] | pd.DataFrame
    budgets : list[dict] | None
        Optional budgets shaped ``{category, amount, period}`` used for
        budget-risk flags.

    Returns
    -------
    dict with:
        insights : list[{type, title, message}]
        summary  : {avg_monthly_spending, top_category, savings_rate,
                    projected_month_end_balance}
        category_breakdown : list[{category, total}]   # current month
        monthly_trend      : list[{month, income, expense, balance}]
    """
    df = to_dataframe(transactions)
    if df.empty:
        return {
            "insights": [],
            "summary": {},
            "category_breakdown": [],
            "monthly_trend": [],
        }

    df["month"] = _month_key(df["date"])
    df["is_expense"] = df["type"].eq("expense")

    # ── Monthly trend (income / expense / net) ────────────────────────────
    grouped = df.groupby("month")
    monthly_trend = []
    for month, g in grouped:
        income = float(g.loc[g["type"].eq("income"), "amount"].sum())
        expense = float(g.loc[g["type"].eq("expense"), "amount"].sum())
        monthly_trend.append(
            {
                "month": str(month),
                "income": round(income, 2),
                "expense": round(expense, 2),
                "balance": round(income - expense, 2),
            }
        )
    monthly_trend.sort(key=lambda m: m["month"])

    months = sorted(df["month"].unique())
    current_month = months[-1]
    prev_month = months[-2] if len(months) >= 2 else None

    cur = df[df["month"].eq(current_month)]
    prev = df[df["month"].eq(prev_month)] if prev_month is not None else None

    # ── Current-month category breakdown (expenses only) ──────────────────
    cur_expenses = cur[cur["is_expense"]]
    cat_totals = (
        cur_expenses.groupby("category")["amount"].sum().sort_values(ascending=False)
    )
    category_breakdown = [
        {"category": c, "total": round(float(v), 2)} for c, v in cat_totals.items()
    ]

    # ── Summary stats ─────────────────────────────────────────────────────
    monthly_expense_totals = [m["expense"] for m in monthly_trend]
    avg_monthly_spending = (
        round(float(np.mean(monthly_expense_totals)), 2) if monthly_expense_totals else 0.0
    )
    top_category = category_breakdown[0]["category"] if category_breakdown else None

    cur_income = float(cur.loc[cur["type"].eq("income"), "amount"].sum())
    cur_expense = float(cur.loc[cur["type"].eq("expense"), "amount"].sum())
    savings_rate = (
        round((cur_income - cur_expense) / cur_income * 100, 1) if cur_income > 0 else 0.0
    )

    # Projected month-end balance from the forecast model.
    projected = None
    fc = forecast_balance(df, days=30, starting_balance=starting_balance)
    if fc["forecast"]:
        end_of_month = [
            p for p in fc["forecast"] if p["date"][:7] == str(current_month)
        ]
        target = end_of_month[-1] if end_of_month else fc["forecast"][-1]
        projected = target["balance"]

    # ── Narrative insights ────────────────────────────────────────────────
    insights = []

    # Top category month-over-month movers.
    if prev is not None:
        prev_cat = prev[prev["is_expense"]].groupby("category")["amount"].sum()
        for category, cur_total in cat_totals.items():
            prev_total = float(prev_cat.get(category, 0.0))
            if prev_total <= 0:
                continue
            change = (cur_total - prev_total) / prev_total * 100
            if change >= 20:
                insights.append(
                    {
                        "type": "warning",
                        "title": "Spending Alert",
                        "message": (
                            f"Your {category} spending is up "
                            f"{round(change)}% vs last month "
                            f"(${round(cur_total)} vs ${round(prev_total)})."
                        ),
                    }
                )
            elif change <= -20:
                insights.append(
                    {
                        "type": "success",
                        "title": "Nice Improvement",
                        "message": (
                            f"You cut {category} spending by "
                            f"{abs(round(change))}% vs last month."
                        ),
                    }
                )

    # Savings-rate insight.
    if cur_income > 0:
        if savings_rate >= 20:
            insights.append(
                {
                    "type": "success",
                    "title": "Healthy Savings Rate",
                    "message": f"You're saving {savings_rate}% of your income this month.",
                }
            )
        elif savings_rate < 0:
            insights.append(
                {
                    "type": "warning",
                    "title": "Spending Exceeds Income",
                    "message": (
                        f"You've spent ${round(cur_expense)} against "
                        f"${round(cur_income)} of income this month."
                    ),
                }
            )

    # Budget-risk flags.
    if budgets:
        budget_map = {}
        for b in budgets:
            try:
                budget_map[str(b["category"])] = float(b["amount"])
            except (KeyError, TypeError, ValueError):
                continue
        for category, limit in budget_map.items():
            spent = float(cat_totals.get(category, 0.0))
            if limit > 0 and spent >= limit:
                insights.append(
                    {
                        "type": "warning",
                        "title": "Budget Exceeded",
                        "message": (
                            f"{category}: ${round(spent)} spent of a "
                            f"${round(limit)} budget."
                        ),
                    }
                )
            elif limit > 0 and spent >= 0.8 * limit:
                insights.append(
                    {
                        "type": "info",
                        "title": "Approaching Budget",
                        "message": (
                            f"{category} is at {round(spent / limit * 100)}% "
                            f"of its ${round(limit)} budget."
                        ),
                    }
                )

    if not insights:
        insights.append(
            {
                "type": "info",
                "title": "Looking Good",
                "message": "No unusual spending patterns detected this month.",
            }
        )

    return {
        "insights": insights,
        "summary": {
            "avg_monthly_spending": avg_monthly_spending,
            "top_category": top_category,
            "savings_rate": savings_rate,
            "projected_month_end_balance": projected,
        },
        "category_breakdown": category_breakdown,
        "monthly_trend": monthly_trend,
    }
