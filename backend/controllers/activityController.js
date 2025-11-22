const Activity = require('../models/Activity');
const Trip = require('../models/Trip');

// @desc    Create a new activity for a trip
// @route   POST /api/trips/:tripId/activities
// @access  Private
exports.createActivity = async (req, res) => {
  try {
    const { tripId } = req.params;

    // Check if trip exists and belongs to user
    const trip = await Trip.findById(tripId);
    if (!trip) {
      return res.status(404).json({
        success: false,
        message: 'Trip not found'
      });
    }

    if (trip.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to add activities to this trip'
      });
    }

    // Validate activity date is within trip date range
    if (req.body.date) {
      const activityDate = new Date(req.body.date);
      const tripStartDate = new Date(trip.startDate);
      const tripEndDate = new Date(trip.endDate);
      
      if (activityDate < tripStartDate || activityDate > tripEndDate) {
        return res.status(400).json({
          success: false,
          message: `Activity date must be between ${tripStartDate.toLocaleDateString()} and ${tripEndDate.toLocaleDateString()}`
        });
      }
    }

    // Create activity
    const activity = await Activity.create({
      ...req.body,
      trip: tripId
    });

    // Update trip's spent budget if cost is provided
    if (req.body.cost) {
      console.log(`💰 Adding cost to budget:`);
      console.log(`  Previous spent: ₹${trip.budget.spent}`);
      console.log(`  Activity cost: ₹${req.body.cost}`);
      trip.budget.spent += Number(req.body.cost);
      console.log(`  New spent: ₹${trip.budget.spent}`);
      await trip.save();
    }

    res.status(201).json({
      success: true,
      message: 'Activity created successfully',
      data: activity
    });
  } catch (error) {
    console.error('Create activity error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating activity',
      error: error.message
    });
  }
};

// @desc    Get all activities for a trip
// @route   GET /api/trips/:tripId/activities
// @access  Private
exports.getActivities = async (req, res) => {
  try {
    const { tripId } = req.params;

    // Check if trip exists and belongs to user
    const trip = await Trip.findById(tripId);
    if (!trip) {
      return res.status(404).json({
        success: false,
        message: 'Trip not found'
      });
    }

    if (trip.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this trip'
      });
    }

    // Get all activities for this trip, sorted by date
    const activities = await Activity.find({ trip: tripId }).sort({ date: 1, startTime: 1 });

    res.status(200).json({
      success: true,
      count: activities.length,
      data: activities
    });
  } catch (error) {
    console.error('Get activities error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching activities',
      error: error.message
    });
  }
};

// @desc    Get single activity
// @route   GET /api/activities/:id
// @access  Private
exports.getActivity = async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id);
    
    if (!activity) {
      return res.status(404).json({
        success: false,
        message: 'Activity not found'
      });
    }

    res.status(200).json({
      success: true,
      data: activity
    });
  } catch (error) {
    console.error('Get activity error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching activity',
      error: error.message
    });
  }
};

// @desc    Update activity
// @route   PUT /api/activities/:id
// @access  Private
exports.updateActivity = async (req, res) => {
  try {
    let activity = await Activity.findById(req.params.id).populate('trip');

    if (!activity) {
      return res.status(404).json({
        success: false,
        message: 'Activity not found'
      });
    }

    // Check if trip belongs to logged-in user
    if (activity.trip.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this activity'
      });
    }

    // Validate activity date is within trip date range if date is being updated
    if (req.body.date) {
      const trip = await Trip.findById(activity.trip._id);
      const activityDate = new Date(req.body.date);
      const tripStartDate = new Date(trip.startDate);
      const tripEndDate = new Date(trip.endDate);
      
      if (activityDate < tripStartDate || activityDate > tripEndDate) {
        return res.status(400).json({
          success: false,
          message: `Activity date must be between ${tripStartDate.toLocaleDateString()} and ${tripEndDate.toLocaleDateString()}`
        });
      }
    }

    // If cost is being updated, adjust trip budget
    if (req.body.cost !== undefined && req.body.cost !== activity.cost) {
      const trip = await Trip.findById(activity.trip._id);
      console.log(`💰 Updating activity cost:`);
      console.log(`  Previous spent: ₹${trip.budget.spent}`);
      console.log(`  Old activity cost: ₹${activity.cost}`);
      console.log(`  New activity cost: ₹${req.body.cost}`);
      trip.budget.spent = trip.budget.spent - Number(activity.cost) + Number(req.body.cost);
      console.log(`  New spent: ₹${trip.budget.spent}`);
      await trip.save();
    }

    // Update activity
    activity = await Activity.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    res.status(200).json({
      success: true,
      message: 'Activity updated successfully',
      data: activity
    });
  } catch (error) {
    console.error('Update activity error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating activity',
      error: error.message
    });
  }
};

// @desc    Delete activity
// @route   DELETE /api/activities/:id
// @access  Private
exports.deleteActivity = async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id).populate('trip');

    if (!activity) {
      return res.status(404).json({
        success: false,
        message: 'Activity not found'
      });
    }

    // Check if trip belongs to logged-in user
    if (activity.trip.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this activity'
      });
    }

    // Update trip budget before deleting
    if (activity.cost > 0) {
      const trip = await Trip.findById(activity.trip._id);
      console.log(`💰 Deleting activity and updating budget:`);
      console.log(`  Previous spent: ₹${trip.budget.spent}`);
      console.log(`  Activity cost to subtract: ₹${activity.cost}`);
      trip.budget.spent -= Number(activity.cost);
      console.log(`  New spent: ₹${trip.budget.spent}`);
      await trip.save();
    }

    // Delete activity
    await activity.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Activity deleted successfully',
      data: {}
    });
  } catch (error) {
    console.error('Delete activity error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting activity',
      error: error.message
    });
  }
};