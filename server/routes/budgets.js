const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getBudgets,
  createBudget,
  updateBudget,
  deleteBudget
} = require('../controllers/budgetController');

// Apply authentication middleware to all routes
router.use(protect);

// Budget routes
router.get('/', getBudgets);
router.post('/', createBudget);
router.put('/:id', updateBudget);
router.delete('/:id', deleteBudget);

module.exports = router;