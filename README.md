# 💰 FinSight - Personal Finance Tracker

[![React](https://img.shields.io/badge/React-19-blue.svg)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-13+-blue.svg)](https://postgresql.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Modern full-stack personal finance application that helps users track transactions, set financial goals, manage budgets, and gain insights into spending patterns with microservices architecture.

## 🎯 Features

- 💳 **Transaction Management** - Create, edit, delete, and import transactions from CSV
- 🎯 **Goal Tracking** - Set and monitor financial goals with progress visualization  
- 💰 **Budget Management** - Create and track budgets by category
- 📊 **Financial Insights** - Visual analytics with charts and spending patterns
- 🔐 **User Authentication** - Secure JWT-based authentication with role management
- 📤 **Data Import** - CSV import functionality for bulk transaction uploads
- ⚡ **Real-time Updates** - Dynamic dashboard with live financial summaries
- 📱 **Responsive Design** - Mobile-first design with dark theme
- 🤖 **ML-Powered Features** - Balance forecasting and anomaly detection (in progress)

## 🛠️ Tech Stack

**Frontend:** React 19, Vite, Tailwind CSS, Recharts, React Router  
**Backend:** Node.js, Express.js, PostgreSQL, Sequelize ORM, JWT authentication  
**ML Service:** Python Flask (in progress), Pandas, NumPy, Scikit-learn  
**Tools:** ESLint, Git, Swagger API documentation, bcrypt security

## 🚀 Quick Start

### Installation & Setup
```bash
# Clone and install dependencies
git clone https://github.com/AjayMaan13/FinSight.git
cd FinSight

# Server setup
cd server && npm install
cp .env.example .env  # Configure database credentials

# Client setup  
cd ../client && npm install

# Database setup
cd ../server
npm run migrate && npm run seed
```

### Running the Application
```bash
# Terminal 1 - Backend API
cd server && npm run dev

# Terminal 2 - Frontend
cd client && npm run dev

# Terminal 3 - ML Service (in progress)
cd ml-service && python app.py
```

## 📁 Structure

```
FinSight/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── context/       # React Context providers
│   │   └── services/      # API service layer
├── server/                # Node.js backend
│   ├── controllers/       # Request handlers
│   ├── models/           # Database models  
│   ├── routes/           # API routes
│   ├── middleware/       # Authentication middleware
│   └── migrations/       # Database migrations
└── ml-service/           # Python ML service (in progress)
    ├── app.py           # Flask API server
    ├── predict.py       # ML prediction models
    └── requirements.txt # Python dependencies
```

## 📊 API Documentation

**Core Endpoints:**
- `POST /api/auth/register` - User registration with validation
- `POST /api/auth/login` - JWT token authentication
- `GET /api/transactions` - Paginated transaction retrieval
- `POST /api/transactions` - Create transaction with validation
- `GET /api/goals` - Financial goal tracking
- `POST /api/goals` - Goal creation with progress tracking

**ML Endpoints (in progress):**
- `POST /ml/forecast` - Balance prediction using time series
- `POST /ml/anomaly` - Transaction anomaly detection

## 🤖 Machine Learning Features (In Progress)

### Planned ML Capabilities
- **Balance Forecasting** - Time series analysis for 30-day financial outlook
- **Anomaly Detection** - Unusual transaction pattern identification
- **Spending Insights** - ML-driven financial behavior analysis

### Technical ML Stack
- **Flask API** - RESTful endpoints for ML predictions
- **Data Processing** - Pandas/NumPy for feature engineering
- **Algorithms** - Scikit-learn for forecasting and anomaly detection
- **Microservice Architecture** - Scalable ML workload design

## 👨‍💻 Author

**Ajaypartap Singh Maan**  
[GitHub](https://github.com/AjayMaan13) • [LinkedIn](https://linkedin.com/in/ajaypartap-singh-maan) • ajayapsmaanm13@gmail.com

---

⭐ **Star if helpful!**
