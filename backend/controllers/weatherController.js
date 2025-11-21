const { getWeatherByCity } = require('../services/weatherService');

// @desc    Get weather forecast for a destination
// @route   GET /api/weather/:destination
// @access  Private
exports.getWeather = async (req, res) => {
  try {
    const { destination } = req.params;

    if (!destination) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a destination'
      });
    }

    // Fetch weather data
    const weatherData = await getWeatherByCity(destination);

    res.status(200).json({
      success: true,
      data: weatherData
    });
  } catch (error) {
    console.error('Get weather error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching weather data'
    });
  }
};