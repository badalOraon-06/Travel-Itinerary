const Trip = require('../models/Trip');

// @desc    Create a new trip
// @route   POST /api/trips
// @access  Private
exports.createTrip = async (req, res) => {
  try {
    const { title, destination, description, startDate, endDate, budget } = req.body;

    // Validate required fields
    if (!title || !destination || !startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title, destination, start date, and end date'
      });
    }

    // Create trip with authenticated user's ID
    const trip = await Trip.create({
      title,
      destination,
      description,
      startDate,
      endDate,
      budget: budget || { total: 0, spent: 0 },
      user: req.user.id // From auth middleware
    });

    res.status(201).json({
      success: true,
      message: 'Trip created successfully',
      data: trip
    });
  } catch (error) {
    console.error('Create trip error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating trip',
      error: error.message
    });
  }
};

// @desc    Get all trips for logged-in user
// @route   GET /api/trips
// @access  Private
exports.getTrips = async (req, res) => {
  try {
    // Find all trips belonging to the authenticated user
    const trips = await Trip.find({ user: req.user.id }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: trips.length,
      data: trips
    });
  } catch (error) {
    console.error('Get trips error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching trips',
      error: error.message
    });
  }
};

// @desc    Get single trip by ID
// @route   GET /api/trips/:id
// @access  Private
exports.getTrip = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);

    // Check if trip exists
    if (!trip) {
      return res.status(404).json({
        success: false,
        message: 'Trip not found'
      });
    }

    // Check if trip belongs to logged-in user
    if (trip.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this trip'
      });
    }

    res.status(200).json({
      success: true,
      data: trip
    });
  } catch (error) {
    console.error('Get trip error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching trip',
      error: error.message
    });
  }
};

// @desc    Update trip
// @route   PUT /api/trips/:id
// @access  Private
exports.updateTrip = async (req, res) => {
  try {
    let trip = await Trip.findById(req.params.id);

    // Check if trip exists
    if (!trip) {
      return res.status(404).json({
        success: false,
        message: 'Trip not found'
      });
    }

    // Check if trip belongs to logged-in user
    if (trip.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this trip'
      });
    }

    // Update trip
    trip = await Trip.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,           // Return updated document
        runValidators: true  // Run model validations
      }
    );

    res.status(200).json({
      success: true,
      message: 'Trip updated successfully',
      data: trip
    });
  } catch (error) {
    console.error('Update trip error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating trip',
      error: error.message
    });
  }
};

// @desc    Delete trip
// @route   DELETE /api/trips/:id
// @access  Private
exports.deleteTrip = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);

    // Check if trip exists
    if (!trip) {
      return res.status(404).json({
        success: false,
        message: 'Trip not found'
      });
    }

    // Check if trip belongs to logged-in user
    if (trip.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this trip'
      });
    }

    // Delete trip
    await trip.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Trip deleted successfully',
      data: {}
    });
  } catch (error) {
    console.error('Delete trip error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting trip',
      error: error.message
    });
  }
};