import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import Navbar from '../components/Navbar';
import WeatherCard from '../components/WeatherCard';

const TripDetails = () => {
  const { id } = useParams(); // Get trip ID from URL
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTripDetails();
    fetchActivities();
  }, [id]);

  const fetchTripDetails = async () => {
    try {
      const response = await api.get(`/trips/${id}`);
      setTrip(response.data.data);
    } catch (err) {
      console.error('Error fetching trip:', err);
      alert('Failed to load trip details');
      navigate('/trips');
    }
  };

  const fetchActivities = async () => {
    try {
      const response = await api.get(`/trips/${id}/activities`);
      setActivities(response.data.data || []);
    } catch (err) {
      console.error('Error fetching activities:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTrip = async () => {
    if (window.confirm('Are you sure you want to delete this trip? This action cannot be undone.')) {
      try {
        await api.delete(`/trips/${id}`);
        alert('Trip deleted successfully!');
        navigate('/trips');
      } catch (err) {
        console.error('Error deleting trip:', err);
        alert('Failed to delete trip');
      }
    }
  };

  const handleDeleteActivity = async (activityId) => {
    if (window.confirm('Are you sure you want to delete this activity?')) {
      try {
        await api.delete(`/trips/${id}/activities/${activityId}`);
        // Refresh data
        fetchTripDetails();
        fetchActivities();
      } catch (err) {
        console.error('Error deleting activity:', err);
        alert('Failed to delete activity');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!trip) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate('/trips')}
          className="mb-4 flex items-center text-indigo-600 hover:text-indigo-800 font-semibold"
        >
          ← Back to Trips
        </button>

        {/* Trip Header Card */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg shadow-lg p-8 text-white mb-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-4xl font-bold mb-2">{trip.title}</h1>
              <p className="text-xl mb-2">📍 {trip.destination}</p>
              {trip.description && (
                <p className="text-indigo-100 mt-2">{trip.description}</p>
              )}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => navigate(`/trips/${id}/edit`)}
                className="bg-white text-indigo-600 px-4 py-2 rounded-lg hover:bg-indigo-50 font-semibold transition"
              >
                ✏️ Edit
              </button>
              <button
                onClick={handleDeleteTrip}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 font-semibold transition"
              >
                🗑️ Delete
              </button>
            </div>
          </div>

          {/* Dates and Status */}
          <div className="flex items-center gap-6 mt-4">
            <div>
              <p className="text-indigo-200 text-sm">Travel Dates</p>
              <p className="text-lg font-semibold">
                {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}
              </p>
            </div>
            <span
              className={`px-4 py-2 rounded-full text-sm font-semibold ${
                trip.status === 'upcoming'
                  ? 'bg-blue-100 text-blue-800'
                  : trip.status === 'ongoing'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              {trip.status.charAt(0).toUpperCase() + trip.status.slice(1)}
            </span>
          </div>
        </div>

        {/* Budget Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">💰 Budget Overview</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <p className="text-gray-600 text-sm mb-1">Total Budget</p>
              <p className="text-3xl font-bold text-indigo-600">₹{trip.budget?.total || 0}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm mb-1">Spent</p>
              <p className="text-3xl font-bold text-red-600">₹{trip.budget?.spent || 0}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm mb-1">Remaining</p>
              <p className="text-3xl font-bold text-green-600">
                ₹{(trip.budget?.total || 0) - (trip.budget?.spent || 0)}
              </p>
            </div>
          </div>
          {/* Progress Bar */}
          <div className="mt-6">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Budget Usage</span>
              <span>
                {(trip.budget?.total || 0) > 0
                  ? Math.round(((trip.budget?.spent || 0) / trip.budget.total) * 100)
                  : 0}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className={`h-3 rounded-full transition-all ${
                  (trip.budget?.spent || 0) > (trip.budget?.total || 0)
                    ? 'bg-red-600'
                    : 'bg-indigo-600'
                }`}
                style={{
                  width: `${
                    (trip.budget?.total || 0) > 0
                      ? Math.min(((trip.budget?.spent || 0) / trip.budget.total) * 100, 100)
                      : 0
                  }%`
                }}
              ></div>
            </div>
          </div>
        </div>

        {/* Weather Section */}
        <WeatherCard 
          destination={trip.destination} 
          startDate={trip.startDate}
          endDate={trip.endDate}
        />

        {/* Activities Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">📋 Activities</h2>
            <button
              onClick={() => navigate(`/trips/${id}/activities/new`)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-semibold transition"
            >
              + Add Activity
            </button>
          </div>

          {activities.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">No activities yet. Start planning your itinerary!</p>
              <button
                onClick={() => navigate(`/trips/${id}/activities/new`)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-semibold transition"
              >
                Add First Activity
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {activities.map((activity) => (
                <div
                  key={activity._id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-800 mb-1">
                        {activity.name}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                        <span>📅 {new Date(activity.date).toLocaleDateString()}</span>
                        <span>
                          🕐 {activity.startTime} - {activity.endTime}
                        </span>
                        {activity.cost > 0 && (
                          <span className="font-semibold text-indigo-600">
                            💰 ₹{activity.cost}
                          </span>
                        )}
                      </div>
                      {activity.location && (
                        <p className="text-sm text-gray-600">📍 {activity.location.address}</p>
                      )}
                      {activity.notes && (
                        <p className="text-sm text-gray-700 mt-2">{activity.notes}</p>
                      )}
                    </div>
                    <div className="flex flex-col gap-2 ml-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          activity.category === 'sightseeing'
                            ? 'bg-blue-100 text-blue-800'
                            : activity.category === 'food'
                            ? 'bg-orange-100 text-orange-800'
                            : activity.category === 'accommodation'
                            ? 'bg-purple-100 text-purple-800'
                            : activity.category === 'transport'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {activity.category}
                      </span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => navigate(`/trips/${id}/activities/${activity._id}/edit`)}
                          className="text-indigo-600 hover:text-indigo-800 text-sm font-semibold"
                        >
                          ✏️ Edit
                        </button>
                        <button
                          onClick={() => handleDeleteActivity(activity._id)}
                          className="text-red-600 hover:text-red-800 text-sm font-semibold"
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TripDetails;