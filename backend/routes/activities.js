const express = require('express');
const router = express.Router({ mergeParams: true });
const {
  createActivity,
  getActivities,
  getActivity,
  updateActivity,
  deleteActivity
} = require('../controllers/activityController');
const { protect } = require('../middleware/auth');

// All routes require authentication
router.use(protect);

// /api/trips/:tripId/activities
router.route('/')
  .post(createActivity)      // Create activity for a trip
  .get(getActivities);       // Get all activities for a trip

// /api/activities/:id
router.route('/:id')
  .get(getActivity)          // Get single activity
  .put(updateActivity)       // Update activity
  .delete(deleteActivity);   // Delete activity

module.exports = router;