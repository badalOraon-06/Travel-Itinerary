const { geocodeAddress } = require('../services/geocodingService');

// @desc    Geocode an address to coordinates
// @route   GET /api/geocode?address=...
// @access  Private
exports.geocode = async (req, res) => {
  try {
    const { address } = req.query;

    if (!address) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an address'
      });
    }

    const result = await geocodeAddress(address);

    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Geocode error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to geocode address'
    });
  }
};