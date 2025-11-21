const express = require('express');
const router = express.Router();
const { getWeather } = require('../controllers/weatherController');
const { protect } = require('../middleware/auth');

// All weather routes require authentication
router.use(protect);

// GET /api/weather/:destination
router.get('/:destination', getWeather);

module.exports = router;