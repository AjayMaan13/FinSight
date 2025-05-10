const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');
const { protect } = require('../middleware/authMiddleware');

// Apply authentication middleware to all transaction routes
router.use(protect);

// Transaction routes
router.get('/summary', transactionController.getTransactionSummary);
router.get('/monthly', transactionController.getMonthlyTrends);
router.get('/', transactionController.getTransactions);
router.get('/:id', transactionController.getTransaction);
router.post('/', transactionController.createTransaction);
router.put('/:id', transactionController.updateTransaction);
router.delete('/:id', transactionController.deleteTransaction);
router.post('/import', transactionController.importFromCSV);

module.exports = router;