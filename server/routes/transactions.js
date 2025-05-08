// routes/transactions.js
const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');
const { authenticateToken } = require('../middleware/authMiddleware');

// Apply authentication middleware to all transaction routes
router.use(authenticateToken);

// Transaction routes
router.get('/monthly', transactionController.getMonthlyTrends);
router.get('/', transactionController.getTransactions);
router.get('/summary', transactionController.getTransactionSummary);
router.get('/:id', transactionController.getTransaction);
router.post('/', transactionController.createTransaction);
router.put('/:id', transactionController.updateTransaction);
router.delete('/:id', transactionController.deleteTransaction);

module.exports = router;