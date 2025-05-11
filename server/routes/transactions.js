const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');
const { protect } = require('../middleware/authMiddleware');
const { validateTransaction, validateUUID } = require('../middleware/validation');

// Apply authentication middleware to all transaction routes
router.use(protect);

// Transaction routes
router.get('/summary', transactionController.getTransactionSummary);
router.get('/monthly', transactionController.getMonthlyTrends);
router.get('/', transactionController.getTransactions);
router.get('/:id', validateUUID, transactionController.getTransaction);
router.post('/', validateTransaction, transactionController.createTransaction);
router.put('/:id', validateUUID, validateTransaction, transactionController.updateTransaction);
router.delete('/:id', validateUUID, transactionController.deleteTransaction);
router.post('/import', transactionController.importFromCSV);

module.exports = router;