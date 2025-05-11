const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getGoals,
  getGoal,
  createGoal,
  updateGoal,
  deleteGoal,
  updateGoalProgress,
  getGoalStats
} = require('../controllers/goalController');
const { validateGoal, validateGoalProgress, validateUUID } = require('../middleware/validation');

// Apply authentication middleware to all routes
router.use(protect);

// Goal routes
router.get('/stats', getGoalStats);
router.get('/', getGoals);
router.get('/:id', validateUUID, getGoal);
router.post('/', validateGoal, createGoal);
router.put('/:id', validateUUID, validateGoal, updateGoal);
router.delete('/:id', validateUUID, deleteGoal);
router.put('/:id/progress', validateUUID, validateGoalProgress, updateGoalProgress);

module.exports = router;