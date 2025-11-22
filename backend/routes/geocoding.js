const express = require('express');
const router = express.Router();
const { geocode } = require('../controllers/geocodingController');
const { protect } = require('../middleware/auth');

// All geocoding routes require authentication
router.use(protect);

// GET /api/geocode?address=...
router.get('/', geocode);

module.exports = router;