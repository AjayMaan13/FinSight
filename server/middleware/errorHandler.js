const ApiError = require('../utils/apiError');

// Catch async errors
exports.catchAsync = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Global error handler
exports.globalErrorHandler = (err, req, res, next) => {
  let { statusCode = 500, message = 'Something went wrong!' } = err;

  // Log error
  console.error(err);

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(e => e.message);
    message = `Invalid input data. ${errors.join('. ')}`;
    statusCode = 400;
  }

  // Sequelize errors
  if (err.name === 'SequelizeValidationError') {
    const errors = err.errors.map(e => e.message);
    message = `Validation error: ${errors.join('. ')}`;
    statusCode = 400;
  }

  if (err.name === 'SequelizeUniqueConstraintError') {
    message = 'Duplicate field value entered';
    statusCode = 400;
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    message = 'Invalid token';
    statusCode = 401;
  }

  if (err.name === 'TokenExpiredError') {
    message = 'Token expired';
    statusCode = 401;
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

// 404 handler
exports.notFound = (req, res, next) => {
  const error = new ApiError(`Route ${req.originalUrl} not found`, 404);
  next(error);
};