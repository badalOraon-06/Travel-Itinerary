import { useState, useEffect } from 'react';
import api from '../utils/api';

const WeatherCard = ({ destination, startDate, endDate }) => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (destination) {
      fetchWeather();
    }
  }, [destination]);

  const fetchWeather = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await api.get(`/weather/${encodeURIComponent(destination)}`);
      setWeather(response.data.data);
    } catch (err) {
      console.error('Weather fetch error:', err);
      const errorMessage = err.response?.data?.message || 'Unable to load weather data';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getWeatherIcon = (iconCode) => {
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-center text-gray-500">
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  if (!weather) return null;

  // Check if trip dates are in the forecast range
  const tripStart = new Date(startDate);
  const tripEnd = new Date(endDate);
  const today = new Date();
  const forecastEnd = new Date();
  forecastEnd.setDate(forecastEnd.getDate() + 5);

  const isTripInForecastRange = tripStart <= forecastEnd;
  const tripStartsInFuture = tripStart > today;

  return (
    <div className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg shadow-lg p-6 text-white">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-2xl font-bold">Weather Forecast</h3>
          <p className="text-blue-100">
            {weather.city}, {weather.country}
          </p>
          {tripStartsInFuture && !isTripInForecastRange && (
            <p className="text-sm text-yellow-200 mt-1">
              ⚠️ Your trip is beyond 5-day forecast range
            </p>
          )}
        </div>
        <div className="text-4xl">🌤️</div>
      </div>

      {/* 5-Day Forecast */}
      <div className="grid grid-cols-5 gap-3 mt-4">
        {weather.forecast.map((day, index) => {
          const forecastDate = new Date(day.date);
          const isInTripRange = forecastDate >= tripStart && forecastDate <= tripEnd;
          
          return (
          <div
            key={index}
            className={`backdrop-blur-sm rounded-lg p-3 text-center hover:bg-white/30 transition ${
              isInTripRange 
                ? 'bg-yellow-400/30 ring-2 ring-yellow-300' 
                : 'bg-white/20'
            }`}
          >
            <p className="text-xs font-semibold mb-2">{formatDate(day.date)}</p>
            {isInTripRange && (
              <span className="text-xs bg-yellow-400 text-gray-800 px-2 py-0.5 rounded-full font-bold">
                Trip Day
              </span>
            )}
            <img
              src={getWeatherIcon(day.icon)}
              alt={day.weather}
              className="w-12 h-12 mx-auto"
            />
            <p className="text-sm font-medium mt-1">{day.weather}</p>
            <div className="mt-2">
              <p className="text-lg font-bold">{day.temp.max}°</p>
              <p className="text-xs text-blue-100">{day.temp.min}°</p>
            </div>
            <div className="mt-2 text-xs text-blue-100">
              <p>💧 {day.humidity}%</p>
              <p>💨 {day.wind} m/s</p>
            </div>
          </div>
        );
        })}
      </div>
    </div>
  );
};

export default WeatherCard;