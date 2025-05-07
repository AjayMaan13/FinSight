# FinSight - AI-Driven Financial Health Dashboard

FinSight is a personal financial insights dashboard that empowers users to make informed decisions using AI/ML models and real-time financial data. This project aligns with RBC Borealis's focus on intelligent, scalable, data-driven solutions.

## 🧩 App Overview

FinSight is a full-stack web app that:
- Connects to users' banking transactions (simulated/demo data or Plaid API for dev)
- Analyzes spending patterns using machine learning
- Gives personalized financial advice (e.g., budgeting, saving, investments)
- Detects anomalies in spending behavior (fraud or overspending risk)
- Forecasts monthly balances using time-series forecasting
- Recommends financial products based on usage patterns

## 🔨 Tech Stack

- **Frontend**: React.js + Tailwind CSS (modern, responsive UI)
- **Backend**: Node.js + Express
- **Database**: MongoDB (for flexibility) or PostgreSQL (for relational integrity)
- **Auth**: Firebase Auth / JWT
- **ML/AI Integration**: Python (Flask API) or use TensorFlow.js in-browser
- **Data Visualization**: Chart.js, D3.js
- **APIs**: Plaid (sandbox) or mock bank transaction data
- **Hosting**: Vercel (Frontend) + Render/Heroku (Backend)

## 📊 Features

- **Secure Login & Onboarding**
- **Transaction Dashboard**
  - Categorize income/spending
  - Visualize spending patterns
- **AI-Powered Insights**
  - Budget suggestions
  - Detect risky trends (overspending, low balance alerts)
  - Recommend financial products
- **Monthly Forecast**
  - Predict next 30-day financial status
- **Savings Goals Tracker**
  - Create/monitor goals
  - Project timelines using AI predictions
- **Anomaly Detection**
  - Highlight unusual or fraudulent transactions

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- Python 3.8+ (for ML service)
- MongoDB or PostgreSQL

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/finsight.git
cd finsight
```

2. Set up the frontend:
```bash
cd client
npm install
npm run dev
```

3. Set up the backend:
```bash
cd ../server
npm install
npm run dev
```

4. Set up the ML service:
```bash
cd ../ml-service
pip install -r requirements.txt
python app.py
```

## 🧠 ML Model Features

- Unsupervised learning (clustering) → user segmentation
- Reinforcement learning → smart budgeting suggestions
- Time series forecasting (LSTM or Prophet) → balance predictions
- Anomaly detection (Isolation Forest / Autoencoder) → flagging unusual transactions

## 📈 Business Value

- Enhances customer financial literacy
- Personalizes the financial experience
- Uses AI to improve client financial wellness
- Aligns with the mission to build intelligent tools that help communities thrive using scalable AI

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.