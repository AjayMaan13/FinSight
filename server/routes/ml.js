const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const mlController = require('../controllers/mlController');

// All ML routes require authentication.
router.use(protect);

router.get('/forecast', mlController.getForecast);
router.get('/anomalies', mlController.getAnomalies);
router.get('/insights', mlController.getInsights);

module.exports = router;
