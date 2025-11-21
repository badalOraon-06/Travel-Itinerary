const express = require('express');
const router = express.Router();
const {
  createTrip,
  getTrips,
  getTrip,
  updateTrip,
  deleteTrip
} = require('../controllers/tripController');
const { protect } = require('../middleware/auth');

// Import activity routes
const activityRoutes = require('./activities');

// All routes require authentication
// Apply protect middleware to all routes
router.use(protect);

// Re-route to activity routes
router.use('/:tripId/activities', activityRoutes);

// /api/trips
router.route('/')
  .post(createTrip)      // Create trip
  .get(getTrips);        // Get all user's trips

// /api/trips/:id
router.route('/:id')
  .get(getTrip)          // Get single trip
  .put(updateTrip)       // Update trip
  .delete(deleteTrip);   // Delete trip

module.exports = router;