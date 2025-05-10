const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');

// Apply authentication middleware
router.use(protect);

// Placeholder routes - controllers will be created later
router.get('/', (req, res) => res.json({ message: 'Get all goals' }));
router.get('/:id', (req, res) => res.json({ message: 'Get single goal' }));
router.post('/', (req, res) => res.json({ message: 'Create goal' }));
router.put('/:id', (req, res) => res.json({ message: 'Update goal' }));
router.delete('/:id', (req, res) => res.json({ message: 'Delete goal' }));
router.put('/:id/progress', (req, res) => res.json({ message: 'Update goal progress' }));

module.exports = router;