# FinSight - Personal Finance Tracker

A modern, full-stack personal finance application that helps users track transactions, set financial goals, manage budgets, and gain insights into their spending patterns.

## 🎯 Key Features

- **Transaction Management**: Create, edit, delete, and import transactions from CSV
- **Goal Tracking**: Set and monitor financial goals with progress visualization
- **Budget Management**: Create and track budgets by category
- **Financial Insights**: Visual analytics with charts and spending patterns
- **User Authentication**: Secure JWT-based authentication with role management
- **Data Import**: CSV import functionality for bulk transaction uploads
- **Real-time Updates**: Dynamic dashboard with live financial summaries
- **Responsive Design**: Mobile-first design with dark theme
- **ML-Powered Features**: Balance forecasting and transaction anomaly detection (Future Enhancement)

## 🛠️ Technical Stack

### Frontend
- **React 19** with Hooks and Context API
- **Vite** for fast development and building
- **React Router** for client-side routing
- **Tailwind CSS** for styling and responsive design
- **Headless UI** for accessible UI components
- **Recharts** for data visualization
- **Papa Parse** for CSV processing
- **Axios** for API communication

### Backend
- **Node.js** with Express.js framework
- **PostgreSQL** as primary database
- **Sequelize ORM** for database operations
- **JWT** for authentication and authorization
- **bcrypt** for password hashing
- **Express Validator** for request validation
- **CORS** for cross-origin resource sharing
- **Swagger** for API documentation

### Machine Learning Service
- **Python & Flask** for ML API service
- **Pandas & NumPy** for data processing
- **Scikit-learn** for ML algorithms
- **Time Series Forecasting** for balance prediction
- **Anomaly Detection** for transaction analysis
- **Microservices Architecture** with separate ML service

### Development Tools
- **ESLint** for code linting
- **Git** for version control
- **Nodemon** for development server
- **dotenv** for environment configuration
- **Sequelize CLI** for database migrations

## 📁 Project Structure

```
finsight/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── context/       # React Context providers
│   │   ├── services/      # API service layer
│   │   └── hooks/         # Custom React hooks
│   └── public/
├── server/                # Node.js backend
│   ├── controllers/       # Request handlers
│   ├── models/           # Database models
│   ├── routes/           # API routes
│   ├── middleware/       # Custom middleware
│   ├── migrations/       # Database migrations
│   └── config/           # Configuration files
├── ml-service/           # Python ML service (Future)
│   ├── app.py           # Flask API server
│   ├── predict.py       # ML prediction models
│   ├── utils.py         # Data preprocessing
│   └── requirements.txt # Python dependencies
└── docs/                 # Documentation
```

## 🔧 Key Technical Skills Demonstrated

### Frontend Development
- Modern React development with functional components and hooks
- State management using Context API and useState/useEffect
- Component composition and reusability
- Form handling and validation
- Client-side routing with protected routes
- Responsive design implementation
- Data visualization with charts
- File upload and processing

### Backend Development
- RESTful API design and implementation
- Database modeling and relationships
- Authentication and authorization middleware
- Data validation and sanitization
- Error handling and logging
- Database migrations and seeding
- API documentation with Swagger

### Machine Learning & Data Science
- Python Flask microservice architecture
- Data preprocessing with Pandas/NumPy
- Time series forecasting implementation
- Anomaly detection algorithms
- Feature engineering for financial data
- ML model integration with REST APIs

### Database Design
- Relational database design with PostgreSQL
- Foreign key relationships between entities
- Database migrations for version control
- Data validation at the model level
- Query optimization with indexes

### Security
- JWT token authentication
- Password hashing with bcrypt
- Protected routes and middleware
- Input validation and sanitization
- CORS configuration

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL (v13 or higher)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/finsight.git
cd finsight
```

2. Install server dependencies
```bash
cd server
npm install
```

3. Install client dependencies
```bash
cd ../client
npm install
```

4. Set up environment variables
```bash
# In server directory, create .env file
cp .env.example .env
# Configure your database credentials and JWT secret
```

5. Run database migrations
```bash
cd server
npm run migrate
npm run seed
```

6. (Optional) Set up ML Service
```bash
cd ../ml-service
pip install -r requirements.txt
python app.py  # Runs on port 5002
```

7. Start the development servers
```bash
# Terminal 1 - Backend
cd server
npm run dev

# Terminal 2 - Frontend
cd client
npm run dev

# Terminal 3 - ML Service (optional)
cd ml-service
python app.py
```

## 📊 API Documentation

The API documentation is available at `http://localhost:5001/api-docs` when running the server.

### Main Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/transactions` - Get user transactions
- `POST /api/transactions` - Create transaction
- `GET /api/goals` - Get user goals
- `POST /api/goals` - Create goal
- `GET /api/transactions/summary` - Get financial summary

### ML Service Endpoints (Future Feature)
- `POST /ml/forecast` - Generate balance forecasts
- `POST /ml/anomaly` - Detect transaction anomalies

## 🎨 UI/UX Features

- **Dark Theme**: Modern dark interface for better user experience
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Interactive Charts**: Dynamic data visualization using Recharts
- **Loading States**: Proper loading indicators throughout the app
- **Error Handling**: User-friendly error messages and validation
- **Real-time Updates**: Dashboard updates dynamically with new data

## 🔍 Advanced Features

- **CSV Import**: Bulk import transactions with data validation
- **Data Filtering**: Advanced filtering options for transactions
- **Progress Tracking**: Visual progress indicators for goals
- **Monthly Trends**: Chart visualization of income/expense trends
- **Category Analytics**: Expense breakdown by category
- **ML Integration**: Microservice architecture with Python Flask for future ML features

## 🤖 Machine Learning Features (In Development)

The project includes a separate Python Flask service for machine learning capabilities:

### Balance Forecasting
- Predicts future account balances using time series analysis
- Takes into account historical spending patterns
- Provides 30-day financial outlook

### Anomaly Detection
- Identifies unusual transactions that deviate from normal patterns
- Flags potentially fraudulent or erroneous transactions
- Assigns anomaly scores for risk assessment

### Technical Implementation
- **Flask API**: RESTful endpoints for ML predictions
- **Data Preprocessing**: Pandas/NumPy for data cleaning and feature engineering
- **Future Models**: Ready for LSTM, Prophet, or Isolation Forest implementation
- **Microservice Design**: Scalable architecture for ML workloads

## 🧪 Testing

The project includes test configurations for:
- Unit tests with Jest
- API testing with Supertest
- Frontend component testing

## 🚀 Deployment

The application supports microservice deployment across multiple platforms:

### Frontend
- **Vercel**, **Netlify** for React application

### Backend API
- **Heroku**, **Railway**, **AWS EC2** for Node.js server

### Database
- **Heroku Postgres**, **AWS RDS**, **Railway Postgres**

### ML Service
- **Heroku**, **AWS Lambda**, **Google Cloud Run** for Python Flask service

## 📈 Performance Considerations

- Efficient database queries with proper indexing
- Pagination for large datasets
- Code splitting in React for optimal bundle sizes
- Memoization of expensive calculations
- Optimized images and assets

## 🔒 Security Measures

- JWT token authentication
- Password encryption with bcrypt
- Input validation and sanitization
- Protected API routes
- SQL injection prevention with Sequelize
- CORS configuration for secure cross-origin requests

## 📝 Skills Highlighted

### Technical Skills
- Full-stack JavaScript development
- Modern React ecosystem
- Node.js and Express.js
- PostgreSQL and SQL
- RESTful API design
- Database modeling and migrations
- Authentication and security
- Version control with Git
- **Python for Machine Learning**
- **Flask microservices**
- **Data science with Pandas/NumPy**
- **Time series analysis**
- **Anomaly detection algorithms**

### Soft Skills
- Problem-solving and debugging
- Code organization and architecture
- Documentation and commenting
- User experience design
- Performance optimization
- Testing and quality assurance

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👤 Author
**Your Name**
- GitHub: [@AjayMaan13](https://github.com/AjayMaan13)
- LinkedIn: [Ajaypartap Singh Maan](https://linkedin.com/ajaypartap-singh-maan)
- Email: your.email@example.com

---

*This project demonstrates proficiency in modern full-stack development, database design, user authentication, data visualization, and creating scalable, maintainable applications.*