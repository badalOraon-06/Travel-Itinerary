import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import api from '../utils/api';
import Navbar from '../components/Navbar';
import WeatherCard from '../components/WeatherCard';
import MapView from '../components/MapView';

const TripDetails = () => {
  const { id } = useParams(); // Get trip ID from URL
  const navigate = useNavigate();
  const location = useLocation();
  const [trip, setTrip] = useState(null);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [activitySortBy, setActivitySortBy] = useState('dateTime'); // Sort state

  useEffect(() => {
    fetchTripDetails();
    fetchActivities();
  }, [id]);

  // Refresh data when navigated back with refresh state (e.g., after editing activity)
  useEffect(() => {
    if (location.state?.refresh) {
      console.log('🔄 Refreshing trip data after activity update');
      fetchTripDetails();
      fetchActivities();
      // Clear the state to prevent refresh on subsequent navigations
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state]);

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

  // Sort activities based on selected criteria
  const getSortedActivities = () => {
    const sorted = [...activities];
    
    switch (activitySortBy) {
      case 'dateTime':
        // Sort by date, then by start time
        return sorted.sort((a, b) => {
          const dateCompare = new Date(a.date) - new Date(b.date);
          if (dateCompare !== 0) return dateCompare;
          return a.startTime.localeCompare(b.startTime);
        });
      
      case 'name':
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      
      case 'cost':
        return sorted.sort((a, b) => (b.cost || 0) - (a.cost || 0));
      
      case 'category':
        return sorted.sort((a, b) => a.category.localeCompare(b.category));
      
      default:
        return sorted;
    }
  };

  const sortedActivities = getSortedActivities();

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
        console.log('🗑️ Deleting activity:', activityId);
        await api.delete(`/trips/${id}/activities/${activityId}`);
        console.log('✅ Activity deleted, refreshing data...');
        // Refresh data to update budget
        await fetchTripDetails();
        await fetchActivities();
        console.log('✅ Data refreshed');
        alert('Activity deleted successfully!');
      } catch (err) {
        console.error('Error deleting activity:', err);
        alert('Failed to delete activity');
      }
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      setUpdatingStatus(true);
      console.log('Updating status to:', newStatus);
      
      // Only send status field to avoid validation issues
      const updateData = {
        status: newStatus
      };
      
      console.log('Update data:', updateData);
      const response = await api.put(`/trips/${id}`, updateData);
      console.log('Update response:', response.data);
      
      // Refresh trip data to get updated version
      fetchTripDetails();
      alert(`✅ Status updated to: ${newStatus.charAt(0).toUpperCase() + newStatus.slice(1)}`);
    } catch (err) {
      console.error('Error updating status:', err);
      console.error('Error response:', err.response?.data);
      alert(`❌ Failed to update status: ${err.response?.data?.message || err.message}`);
    } finally {
      setUpdatingStatus(false);
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
            <div>
              <p className="text-indigo-200 text-sm mb-1">Status</p>
              <select
                value={trip.status}
                onChange={(e) => handleStatusChange(e.target.value)}
                disabled={updatingStatus}
                className={`px-4 py-2 rounded-lg text-sm font-semibold cursor-pointer transition ${
                  trip.status === 'planning'
                    ? 'bg-yellow-100 text-yellow-800'
                    : trip.status === 'confirmed'
                    ? 'bg-blue-100 text-blue-800'
                    : trip.status === 'ongoing'
                    ? 'bg-green-100 text-green-800'
                    : trip.status === 'completed'
                    ? 'bg-purple-100 text-purple-800'
                    : trip.status === 'cancelled'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-gray-100 text-gray-800'
                } disabled:opacity-50`}
              >
                <option value="planning">🟡 Planning</option>
                <option value="confirmed">🔵 Confirmed</option>
                <option value="ongoing">🟢 Ongoing</option>
                <option value="completed">🟣 Completed</option>
                <option value="cancelled">🔴 Cancelled</option>
              </select>
            </div>
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

        {/* Map Section */}
        <MapView activities={activities} />

        {/* Activities Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-800">📋 Activities</h2>
            <button
              onClick={() => navigate(`/trips/${id}/activities/new`)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-semibold transition"
            >
              + Add Activity
            </button>
          </div>

          {/* Sort Controls */}
          {activities.length > 0 && (
            <div className="mb-4 flex items-center gap-3">
              <label className="text-sm font-semibold text-gray-700">Sort by:</label>
              <select
                value={activitySortBy}
                onChange={(e) => setActivitySortBy(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="dateTime">📅 Date & Time</option>
                <option value="name">🔤 Name (A-Z)</option>
                <option value="cost">💰 Cost (High to Low)</option>
                <option value="category">🏷️ Category</option>
              </select>
              <span className="text-sm text-gray-500">
                ({sortedActivities.length} {sortedActivities.length === 1 ? 'activity' : 'activities'})
              </span>
            </div>
          )}

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
              {sortedActivities.map((activity) => (
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