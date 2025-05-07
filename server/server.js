const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Database connection
const db = require('./models');

// Middleware
app.use(cors());
app.use(express.json());

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to FinSight API with PostgreSQL' });
});

// Routes will be added here
// app.use('/api/auth', require('./routes/auth'));
// app.use('/api/transactions', require('./routes/transactions'));
// app.use('/api/ml', require('./routes/ml'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'production' ? {} : err
  });
});

// Start server and sync with database
const PORT = process.env.PORT || 5000;

db.sequelize.sync({ force: false })
  .then(() => {
    console.log('Database synchronized successfully');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Failed to sync database:', err);
  });