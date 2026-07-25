# 🤖 FinSight ML Service

A Python/Flask microservice providing real machine-learning features for
FinSight: balance forecasting, transaction anomaly detection, and computed
spending insights.

## Models

| Endpoint | Technique | What it does |
|----------|-----------|--------------|
| `POST /forecast` | Ridge regression on calendar features + random-walk confidence band | Predicts daily net cash flow from day-of-week / day-of-month / month seasonality, integrates to a 30-day balance path with a widening 95% confidence interval. Falls back to a seasonal-average heuristic when history is sparse. |
| `POST /anomaly` | Isolation Forest (scikit-learn) | Flags unusual transactions using per-user features (category z-score, ratio to category median, log amount, weekday). Returns a normalised score and a feature-derived reason. |
| `POST /insights` | Aggregation + forecast | Month-over-month category deltas, savings rate, top movers, projected month-end balance, and budget-risk flags. |

Models are fit **per request on each user's own transactions**, which is the
right design for personalised finance (no global thresholds, adapts to each
user's normal behaviour).

## Run locally

```bash
cd ml-service
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt

# Validate the pipeline on synthetic data
python train.py

# Start the API (dev)
python app.py            # http://localhost:5002
```

## Test

```bash
pytest -q
```

## API examples

```bash
curl -X POST http://localhost:5002/forecast \
  -H "Content-Type: application/json" \
  -d '{"transactions": [{"amount": 100, "type": "income", "category": "Salary", "date": "2026-01-01"}], "days": 30}'
```

Response shape:

```json
{
  "success": true,
  "model": "ridge_calendar",
  "forecast": [
    {"date": "2026-07-24", "balance": 1024.11, "lower": 980.4, "upper": 1067.8}
  ]
}
```

## Request format

Transactions match the backend's shape:

```json
{
  "id": "uuid",
  "amount": 42.50,
  "type": "income | expense",
  "category": "Food & Dining",
  "date": "2026-07-01",
  "description": "Groceries"
}
```
