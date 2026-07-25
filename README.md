# 💰 FinSight — Personal Finance Tracker

[![React](https://img.shields.io/badge/React-19-blue.svg)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-13+-blue.svg)](https://postgresql.org/)
[![Python](https://img.shields.io/badge/Python-3.10+-yellow.svg)](https://python.org/)
[![CI](https://github.com/AjayMaan13/FinSight/actions/workflows/ci.yml/badge.svg)](https://github.com/AjayMaan13/FinSight/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A full-stack personal finance platform with a **microservices architecture**: a React SPA, a Node/Express REST API, and a Python/Flask **machine-learning service** that forecasts balances, detects anomalous transactions, and generates spending insights — all containerized and CI-tested.

> **🔗 Live demo:** _not deployed yet — see [Roadmap](#-roadmap)_ &nbsp;·&nbsp; **Demo login (local):** `john@example.com` / `password123`

---

## 📸 Screenshots

| Dashboard | ML Insights & Forecast |
|-----------|------------------------|
| _add `docs/dashboard.png`_ | _add `docs/insights.png`_ |

See [`docs/README.md`](docs/README.md) for how to generate these.

---

## 🎯 Features

- 💳 **Transaction Management** — create, edit, delete, filter, paginate, and bulk-import from CSV
- 🎯 **Goal Tracking** — set financial goals and monitor progress toward targets
- 💰 **Budget Management** — per-category budgets with alert thresholds and over-budget flags
- 📊 **Financial Insights** — charts for monthly trends, category breakdowns, and balance forecasts
- 🤖 **ML-Powered Analytics** — 30-day balance forecasting with confidence bands, transaction anomaly detection, and computed spending insights
- 🔐 **Authentication** — JWT-based auth with bcrypt password hashing and protected routes
- 📤 **Data Import** — CSV upload for bulk transactions
- ⚡ **Real-time Dashboard** — live financial summaries
- 📱 **Responsive Design** — mobile-first dark theme

---

## 🏗️ Architecture

```
                     ┌─────────────────┐
                     │   React SPA      │  Vite · Tailwind · Recharts
                     │  (client:5173)   │
                     └────────┬─────────┘
                              │ REST (axios + JWT)
                     ┌────────▼─────────┐
                     │  Node/Express    │  Sequelize ORM · JWT · Swagger
                     │   API (:5001)    │
                     └────┬────────┬────┘
              Sequelize   │        │  HTTP (JSON)
                     ┌────▼───┐ ┌──▼──────────────┐
                     │Postgres│ │ Flask ML Service │  scikit-learn
                     │ (:5432)│ │    (:5002)       │  Ridge · IsolationForest
                     └────────┘ └──────────────────┘
```

The Node API is the single entry point for the client. It brokers the user's
data to the ML service and **degrades gracefully** (returns `503`) if ML is
offline, so the core app keeps working.

---

## 🛠️ Tech Stack

| Layer | Technologies |
|-------|-------------|
| **Frontend** | React 19, Vite, Tailwind CSS, Recharts, React Router, Axios |
| **Backend** | Node.js, Express, PostgreSQL, Sequelize ORM, JWT, bcrypt, Swagger |
| **ML Service** | Python, Flask, Pandas, NumPy, scikit-learn (Ridge regression, Isolation Forest) |
| **Testing** | Jest + Supertest (API), pytest (ML), Vitest + RTL (client) |
| **DevOps** | Docker, docker-compose, GitHub Actions CI |

---

## 🚀 Quick Start

### Option A — Docker (one command)

```bash
git clone https://github.com/AjayMaan13/FinSight.git
cd FinSight
docker compose up --build
```

Works with zero setup — `docker-compose.yml` falls back to demo-safe
defaults. To customize (real `JWT_SECRET`, DB credentials, etc.), copy the
root `.env.example` to `.env` first: `cp .env.example .env`.

This boots Postgres, runs migrations + seeders, starts the API and ML
service, and serves the client via nginx. Then open **http://localhost:5173**
and sign in with `john@example.com` / `password123`.

### Option B — Run each service manually

```bash
# 1. Database
#    Create a PostgreSQL database named `finsight`.

# 2. Backend API
cd server
npm install
cp .env.example .env                    # set DB creds + JWT_SECRET
npm run migrate && npm run seed
npm run dev                             # http://localhost:5001

# 3. ML service
cd ../ml-service
python3.10 -m venv venv && source venv/bin/activate
pip install -r requirements.txt
python app.py                           # http://localhost:5002

# 4. Frontend
cd ../client
npm install
cp .env.example .env
npm run dev                             # http://localhost:5173
```

> **Note:** the ML service pins scientific packages (numpy/pandas/scikit-learn)
> that ship prebuilt wheels for **Python 3.10–3.12**. Use one of those for the
> venv (the Docker image uses `python:3.11`).

---

## 🧪 Testing

```bash
# Backend API (Jest + Supertest)
cd server && npm test

# ML service (pytest — 18 tests)
cd ml-service && source venv/bin/activate && pytest -q

# Frontend (Vitest + React Testing Library)
cd client && npm test
```

CI runs all three suites plus linting on every push via
[`.github/workflows/ci.yml`](.github/workflows/ci.yml).

---

## 📊 API Documentation

Interactive Swagger docs at **`http://localhost:5001/api-docs`**.

**Core endpoints**

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/register` | Register a new user |
| `POST` | `/api/auth/login` | Authenticate, returns JWT |
| `GET`  | `/api/transactions` | Paginated, filterable transactions |
| `POST` | `/api/transactions` | Create a transaction |
| `POST` | `/api/transactions/import` | Bulk CSV import |
| `GET`  | `/api/goals` | List goals with progress |
| `GET`  | `/api/budgets` | List budgets |

**ML endpoints** (Node API → Python ML service)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/ml/forecast` | 30-day balance forecast with 95% confidence band |
| `GET` | `/api/ml/anomalies` | Isolation Forest anomaly detection |
| `GET` | `/api/ml/insights` | Month-over-month spending insights |

---

## 🤖 Machine Learning

Real models — not heuristics — served from a Python/Flask microservice and fit
**per-user on that user's own transactions** (no global thresholds; it adapts
to each person's normal behaviour). Full details in
[`ml-service/README.md`](ml-service/README.md).

| Capability | Technique | Notes |
|-----------|-----------|-------|
| **Balance forecasting** | Ridge regression on calendar/seasonality features | Predicts daily net cash flow → integrates to a balance path with a **95% confidence band that widens with the horizon** (variance accumulates like a random walk). Seasonal-average fallback on sparse history. |
| **Anomaly detection** | Isolation Forest (scikit-learn) | Features: category z-score, ratio to category median, log amount, weekday. Returns a normalized score and a **feature-derived reason** (e.g. "Unusually large amount for this category"). |
| **Spending insights** | Aggregation + forecast | Month-over-month category deltas, savings rate, top movers, projected month-end balance, budget-risk flags. |

**Feature engineering** (Pandas/NumPy): continuous gap-free daily balance
series, calendar features (day-of-week/-month, seasonality), and per-transaction
deviation features. Covered by an 18-test `pytest` suite.

```bash
curl -X POST http://localhost:5002/forecast \
  -H "Content-Type: application/json" \
  -d '{"transactions": [...], "days": 30}'
# → { "success": true, "model": "ridge_calendar",
#     "forecast": [ { "date": "...", "balance": 1024.1, "lower": 980.4, "upper": 1067.8 }, ... ] }
```

---

## 📁 Project Structure

```
FinSight/
├── client/                 # React frontend
│   └── src/
│       ├── components/     # UI + charts (incl. BalanceForecastChart)
│       ├── pages/          # Dashboard, Transactions, Goals, Insights, …
│       ├── context/        # Auth context
│       └── services/       # Axios API layer (incl. mlAPI)
├── server/                 # Node/Express API
│   ├── controllers/        # Request handlers (incl. mlController)
│   ├── models/             # Sequelize models
│   ├── routes/             # API routes (incl. ml)
│   ├── middleware/         # Auth, validation, error handling
│   ├── migrations/         # DB schema
│   └── seeders/            # Demo data
├── ml-service/             # Python ML microservice
│   ├── ml/                 # features, forecast, anomaly, insights
│   ├── tests/              # pytest suite
│   ├── app.py              # Flask API
│   └── train.py            # pipeline validation + model persistence
├── docker-compose.yml      # Full stack: db + api + ml + client
├── render.yaml              # Render Blueprint: one-click deploy of the whole stack
└── .github/workflows/      # CI
```

---

## ☁️ Deployment

[`render.yaml`](render.yaml) is a [Render Blueprint](https://render.com/docs/infrastructure-as-code)
that provisions the entire stack — Postgres, the API, the ML service, and the
static client — from one deploy:

1. Push this repo to your own GitHub account.
2. On [Render](https://dashboard.render.com/blueprints), click **New →
   Blueprint**, connect the repo, and confirm. Render reads `render.yaml` and
   creates all four services automatically (`JWT_SECRET` is auto-generated;
   DB credentials are wired between services for you).
3. First boot runs migrations + seeds a demo account automatically.

All services use Render's **free tier**, which spins down after 15 minutes of
inactivity — the first request after a break takes ~30–60s to wake up. That's
expected, not a bug.

**One manual step:** the client's `VITE_API_URL` is baked into the JS bundle
at build time and is hardcoded in `render.yaml` to
`https://finsight-server.onrender.com/api`, matching the server's `name:`
field. If Render assigns your server a different subdomain (e.g. because that
name is already taken), update `VITE_API_URL` in the Render dashboard and
manually redeploy the client.

---

## 🗺️ Roadmap

- [ ] Deploy via the Blueprint above and add the live demo link + screenshots
- [ ] Code-split the client bundle (currently one 900KB+ chunk)

---

## 👨‍💻 Author

**Ajaypartap Singh Maan**
[GitHub](https://github.com/AjayMaan13) • [LinkedIn](https://linkedin.com/in/ajaypartap-singh-maan) • ajayapsmaanm13@gmail.com

---

## 📄 License

[MIT](LICENSE)

⭐ **Star if you find it helpful!**
