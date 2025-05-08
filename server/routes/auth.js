const express = require('express');
const router = express.Router();
const { 
  register, 
  login, 
  getCurrentUser, 
  forgotPassword, 
  resetPassword,
  logout 
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);

// Protected routes
router.get('/me', protect, getCurrentUser);
router.post('/logout', protect, logout);

module.exports = router;