const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger/swaggerConfig');
const { globalErrorHandler, notFound } = require('./middleware/errorHandler');

// Load env vars
dotenv.config();

// Import database
const db = require('./models');

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const transactionRoutes = require('./routes/transactions');
const goalRoutes = require('./routes/goals');

// Initialize app
const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:5173', // Your Vite dev server URL
  credentials: true
}));
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// API Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/goals', goalRoutes);

// Base route
app.get('/', (req, res) => {
  res.send('FinSight API is running... Visit /api-docs for documentation');
});

// 404 handler
app.use(notFound);

// Global error handler
app.use(globalErrorHandler);

const PORT = process.env.PORT || 5001;

// Sync database and start server
db.sequelize.sync({ alter: process.env.NODE_ENV === 'development' })
  .then(() => {
    console.log('Database connected');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => {
    console.error('Failed to connect to database:', err);
  });

module.exports = app;