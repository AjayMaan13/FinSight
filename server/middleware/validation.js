const { body, param, validationResult } = require('express-validator');

// Validation middleware handler
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }
  next();
};

// Auth validations
exports.validateRegistration = [
  body('firstName').trim().notEmpty().withMessage('First name is required'),
  body('lastName').trim().notEmpty().withMessage('Last name is required'),
  body('email').trim().isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  handleValidationErrors
];

exports.validateLogin = [
  body('email').trim().isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
  handleValidationErrors
];

// Transaction validations
exports.validateTransaction = [
  body('amount').isFloat({ min: 0.01 }).withMessage('Amount must be greater than 0'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('category').trim().notEmpty().withMessage('Category is required'),
  body('type').isIn(['income', 'expense']).withMessage('Type must be income or expense'),
  body('date').optional().isISO8601().withMessage('Invalid date format'),
  handleValidationErrors
];

// Goal validations
exports.validateGoal = [
  body('name').trim().notEmpty().withMessage('Goal name is required'),
  body('targetAmount').isFloat({ min: 0.01 }).withMessage('Target amount must be greater than 0'),
  body('targetDate').isISO8601().withMessage('Valid target date is required'),
  body('category').optional().trim(),
  body('priority').optional().isIn(['low', 'medium', 'high']).withMessage('Priority must be low, medium, or high'),
  handleValidationErrors
];

exports.validateGoalProgress = [
  body('amount').isFloat({ min: 0 }).withMessage('Amount must be 0 or greater'),
  handleValidationErrors
];

// UUID validation for params
exports.validateUUID = [
  param('id').isUUID().withMessage('Invalid ID format'),
  handleValidationErrors
];

// User validations
exports.validateProfileUpdate = [
  body('firstName').optional().trim().notEmpty().withMessage('First name cannot be empty'),
  body('lastName').optional().trim().notEmpty().withMessage('Last name cannot be empty'),
  body('email').optional().trim().isEmail().normalizeEmail().withMessage('Valid email is required'),
  handleValidationErrors
];

exports.validatePasswordChange = [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters'),
  handleValidationErrors
];