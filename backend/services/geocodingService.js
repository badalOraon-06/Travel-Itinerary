const axios = require('axios');

// Cache for geocoding results
const geocodeCache = new Map();
const CACHE_DURATION = 86400000; // 24 hours

const geocodeAddress = async (address) => {
  try {
    // Check cache first
    const cacheKey = address.toLowerCase().trim();
    const cached = geocodeCache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      console.log('Returning cached geocode for:', address);
      return cached.data;
    }

    // Use Nominatim (OpenStreetMap) - free, no API key needed
    const response = await axios.get(
      'https://nominatim.openstreetmap.org/search',
      {
        params: {
          q: address,
          format: 'json',
          limit: 1,
          addressdetails: 1
        },
        headers: {
          'User-Agent': 'TravelItineraryPlanner/1.0' // Required by Nominatim
        }
      }
    );

    if (response.data.length === 0) {
      throw new Error('Location not found');
    }

    const result = response.data[0];
    const geocodeData = {
      latitude: parseFloat(result.lat),
      longitude: parseFloat(result.lon),
      displayName: result.display_name,
      address: result.address
    };

    // Cache the result
    geocodeCache.set(cacheKey, {
      data: geocodeData,
      timestamp: Date.now()
    });

    return geocodeData;
  } catch (error) {
    console.error('Geocoding error:', error.message);
    throw new Error('Failed to geocode address');
  }
};

module.exports = {
  geocodeAddress
};