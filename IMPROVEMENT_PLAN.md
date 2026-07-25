# 🚀 FinSight — Resume-Worthy Improvement Plan

A phased plan to take FinSight from "working demo with gaps" to a polished, deployable, resume-worthy full-stack + ML project.

---

## 📋 Current State Assessment (2026-07-23)

### What already works
- **Backend (Node/Express/PostgreSQL/Sequelize):** Auth (JWT + bcrypt), Transactions (CRUD + summary + monthly + CSV import), Goals (CRUD + progress + stats), Users, Swagger docs, validation middleware, global error handler.
- **Frontend (React 19 + Vite + Tailwind + Recharts):** Login/Register/Forgot/Reset, Dashboard, Transactions, Goals, Insights, Settings, Profile, protected routes, auth context, axios service layer.
- **Data model:** Users, Transactions, Goals, Budgets — with migrations + seeders (users, transactions, goals).

### 🔴 Bugs / broken things (fix first — these break the app or the repo)
| # | Issue | Impact |
|---|-------|--------|
| B1 | **Root `.gitignore` is corrupt** — it contains a literal `echo "..." > .gitignore` shell command instead of ignore rules. `.env`, `node_modules` are NOT ignored at repo root. | Secrets can be committed; huge diffs. |
| B2 | **`budgets` route never mounted** in `server.js`, and `budgetController`/`Budget` model exist + frontend `budgetAPI` calls them. Every budget call 404s. | Advertised feature is dead. |
| B3 | **No `.env.example`** despite README telling users to `cp .env.example .env`. | Nobody can run it. |
| B4 | **ML service is 100% fake** — `predict.py` returns `np.random`/`random.sample`. Folder literally named `ml-service-yet-to-add`. | The headline "ML-Powered" claim is false. |
| B5 | **Insights page uses hardcoded mock data** — not wired to backend or ML. | Looks real in screenshots, but isn't. |
| B6 | **No Budget migration/seeder alignment check** + `sequelize.sync({ alter })` runs alongside migrations. | Schema drift / conflicts. |
| B7 | **Zero tests** despite `jest` + `supertest` installed and a `test` script. | Biggest credibility gap for a backend resume. |

### 🟡 Missing for "resume-worthy"
- **Real ML** (forecasting + anomaly detection that actually learns from data).
- **Tests** (backend integration + ML unit tests + a few frontend tests).
- **CI** (GitHub Actions: lint + test on every push).
- **Docker + docker-compose** (one command to run the whole stack incl. Postgres).
- **Live deployment** + demo link (recruiters click links, not clone repos).
- **README polish**: architecture diagram, screenshots/GIF, honest ML section, badges that reflect reality.
- **ML ↔ backend ↔ frontend wiring** so Insights/Dashboard show real predictions.

---

## 🎯 Phased Plan

Each phase is independently shippable. Ordered so the app is never broken between phases.

### **Phase 0 — Stop the bleeding (bug fixes)** ⏱️ ~1–2 hrs
Goal: repo is safe to run and clone.
- [ ] Rewrite root `.gitignore` with real rules (node, python, env, dist, coverage). (B1)
- [ ] Mount `budgetRoutes` in `server.js` + confirm `budgets.js` route file wiring. (B2)
- [ ] Add `server/.env.example` with every var the code reads (DB, JWT, PORT, `ML_SERVICE_URL`). (B3)
- [ ] Add `client/.env.example` (`VITE_API_URL`, `VITE_ML_URL`).
- [ ] Add a Budget seeder so demo data is complete. (B6)
- [ ] Decide schema strategy: keep **migrations** as source of truth; set `sync({ alter })` off outside dev. (B6)
- [ ] Rename `ml-service-yet-to-add/` → `ml-service/` (matches README + docker). (B4)

**Deliverable:** `git clone` → configure `.env` → `npm run migrate && npm run seed` → app runs end to end.

---

### **Phase 1 — Real ML Service** ⏱️ ~1–2 days  ⭐ *the differentiator*
Goal: replace random numbers with genuine models, served over a clean Flask API.

**1a. Data & features**
- [ ] `data.py` — build a daily time series from raw transactions (resample to daily net cashflow → running balance), engineer features: day-of-week, day-of-month, rolling means (7/30d), lag features, is_weekend, is_month_start/end.
- [ ] Synthetic data generator for training/demo when a user has few transactions.

**1b. Balance forecasting (`/forecast`)**
- [ ] Model: **Holt-Winters / SARIMAX (statsmodels)** or **linear regression on lag+calendar features (scikit-learn)** — pick scikit-learn Ridge/GradientBoosting for zero extra heavy deps and explainability.
- [ ] Output 30-day forecast with **confidence band** (lower/upper) — great for the chart.
- [ ] Graceful fallback (trend + seasonality heuristic) when data is sparse, clearly flagged `"model": "fallback"`.

**1c. Anomaly detection (`/anomaly`)**
- [ ] Model: **IsolationForest** (scikit-learn) on features [amount z-score by category, day-of-week, time-since-last-similar, amount vs. category rolling median].
- [ ] Return real per-transaction score + human-readable reason derived from which feature deviated (not random).

**1d. Spending insights (`/insights`)** *(new, powers the Insights page)*
- [ ] Month-over-month category deltas, top movers, savings rate, projected month-end, budget-risk flags — computed, not hardcoded.

**1e. Service quality**
- [ ] `train.py` to fit + persist models with `joblib` (`models/*.pkl`); load at startup.
- [ ] Pydantic-style request validation, consistent JSON error shape, `/health` endpoint.
- [ ] `pytest` unit tests for `data`, `forecast`, `anomaly` (deterministic with fixed seeds).
- [ ] Pin deps; add `Dockerfile`.

**Deliverable:** `POST /forecast`, `/anomaly`, `/insights`, `/health` return real, tested results.

---

### **Phase 2 — Wire ML into the app** ⏱️ ~half day
Goal: predictions flow user → backend → ML → UI.
- [ ] Backend `mlController.js` + `routes/ml.js`: `GET /api/ml/forecast`, `/api/ml/anomalies`, `/api/ml/insights` — pull the user's transactions from Postgres, call the Flask service (`ML_SERVICE_URL`), cache briefly, handle ML-down gracefully.
- [ ] Frontend `mlAPI` in `services/api.js`.
- [ ] **Insights page:** replace all hardcoded arrays with live data + loading/empty/error states. (B5)
- [ ] **Dashboard:** add a 30-day forecast chart (with confidence band) and an "Unusual transactions" widget.

**Deliverable:** Insights & Dashboard show real ML output.

---

### **Phase 3 — Tests** ⏱️ ~1 day  ⭐ *credibility*
- [ ] Backend: `supertest` integration tests for auth, transactions, goals, budgets (happy + auth-fail + validation paths). Use a test DB / SQLite-in-memory or `pg-mem`.
- [ ] ML: `pytest` suite (already in Phase 1) + coverage.
- [ ] Frontend: a few Vitest + React Testing Library tests (auth flow, a chart renders, protected route redirects).
- [ ] Add coverage badges.

**Deliverable:** `npm test` (server), `pytest` (ml), `npm test` (client) all green.

---

### **Phase 4 — Dockerize & one-command run** ⏱️ ~half day
- [ ] `Dockerfile` for each of client / server / ml-service.
- [ ] `docker-compose.yml`: postgres + server + ml-service + client, healthchecks, auto-migrate/seed on boot.
- [ ] `docker compose up` boots the entire stack.

**Deliverable:** `docker compose up` → full app at `localhost`.

---

### **Phase 5 — CI/CD** ⏱️ ~half day
- [ ] `.github/workflows/ci.yml`: matrix — lint + test server, test ml (pytest), build + lint client, on push/PR.
- [ ] Status badges in README.

**Deliverable:** Green CI badge on every push.

---

### **Phase 6 — Deploy + polish** ⏱️ ~1 day  ⭐ *what recruiters actually click*
- [ ] Deploy: client → Vercel/Netlify; server + ml → Render/Railway/Fly; managed Postgres (Neon/Supabase/Render).
- [ ] Seed a demo account; add "Try demo" credentials to README.
- [ ] README: architecture diagram, screenshots/GIF, **live demo link**, honest ML write-up (models used, features, limitations), accurate badges.
- [ ] Short "How it works" section on the ML models (talking points for interviews).

**Deliverable:** A live URL + a README a recruiter can skim in 60s.

---

## 🗺️ Suggested order & effort
`Phase 0 → 1 → 2 → 3 → 4 → 5 → 6`

Highest resume ROI if time-boxed: **Phase 0, 1, 2, 6** (working app + real ML + live demo). Phases 3–5 (tests, Docker, CI) are what separate a "student project" from an "engineer's project" — do them if you can.

## 🎤 Interview talking points this unlocks
- Microservice architecture (Node API + Python ML service) and why you split them.
- Real ML: IsolationForest for anomalies, feature engineering for time-series forecasting, confidence intervals.
- Testing strategy across three stacks + CI.
- Containerization and one-command local dev.

---
*Generated as the working plan. We start at Phase 0 → Phase 1 (ML).*
