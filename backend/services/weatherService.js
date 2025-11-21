const axios = require('axios');

// Cache for weather data (to avoid hitting API limits)
const weatherCache = new Map();
const CACHE_DURATION = 3600000; // 1 hour in milliseconds

const getWeatherByCity = async (city) => {
  try {
    // Check cache first
    const cacheKey = city.toLowerCase();
    const cached = weatherCache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      console.log('Returning cached weather data for:', city);
      return cached.data;
    }

    // Fetch from OpenWeatherMap API
    const API_KEY = process.env.WEATHER_API_KEY;
    
    if (!API_KEY) {
      throw new Error('Weather API key not configured');
    }

    // Get 5-day forecast
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast`,
      {
        params: {
          q: city,
          appid: API_KEY,
          units: 'metric', // Celsius
          cnt: 40 // 5 days * 8 (3-hour intervals)
        }
      }
    );

    // Parse and format the data
    const forecastData = parseForecastData(response.data);

    // Cache the result
    weatherCache.set(cacheKey, {
      data: forecastData,
      timestamp: Date.now()
    });

    return forecastData;
  } catch (error) {
    console.error('Weather API error for city:', city);
    console.error('Error details:', error.response?.data || error.message);
    
    if (error.response?.status === 404) {
      throw new Error(`City "${city}" not found. Try a major city name.`);
    }
    
    if (error.response?.status === 401) {
      throw new Error('Invalid API key. Please check your Weather API configuration.');
    }
    
    throw new Error(error.response?.data?.message || 'Failed to fetch weather data');
  }
};

// Parse and format forecast data
const parseForecastData = (data) => {
  const dailyForecasts = {};

  // Group forecasts by date
  data.list.forEach((item) => {
    const date = item.dt_txt.split(' ')[0]; // Get date part (YYYY-MM-DD)
    
    if (!dailyForecasts[date]) {
      dailyForecasts[date] = {
        date,
        temps: [],
        conditions: [],
        icons: [],
        humidity: [],
        wind: []
      };
    }

    dailyForecasts[date].temps.push(item.main.temp);
    dailyForecasts[date].conditions.push(item.weather[0].main);
    dailyForecasts[date].icons.push(item.weather[0].icon);
    dailyForecasts[date].humidity.push(item.main.humidity);
    dailyForecasts[date].wind.push(item.wind.speed);
  });

  // Calculate daily averages
  const forecast = Object.values(dailyForecasts).slice(0, 5).map((day) => ({
    date: day.date,
    temp: {
      min: Math.round(Math.min(...day.temps)),
      max: Math.round(Math.max(...day.temps)),
      avg: Math.round(day.temps.reduce((a, b) => a + b) / day.temps.length)
    },
    weather: day.conditions[0], // Most common condition
    icon: day.icons[0],
    humidity: Math.round(day.humidity.reduce((a, b) => a + b) / day.humidity.length),
    wind: Math.round(day.wind.reduce((a, b) => a + b) / day.wind.length)
  }));

  return {
    city: data.city.name,
    country: data.city.country,
    forecast
  };
};

module.exports = {
  getWeatherByCity
};