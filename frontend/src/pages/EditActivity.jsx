import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import Navbar from '../components/Navbar';

const EditActivity = () => {
  const { id, activityId } = useParams(); // Trip ID and Activity ID
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    date: '',
    startTime: '',
    endTime: '',
    cost: 0,
    category: 'sightseeing',
    notes: '',
    location: {
      address: '',
      coordinates: {
        latitude: 0,
        longitude: 0
      }
    }
  });
  
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [geocoding, setGeocoding] = useState(false);

  useEffect(() => {
    fetchTrip();
    fetchActivity();
  }, [id, activityId]);

  const fetchTrip = async () => {
    try {
      const response = await api.get(`/trips/${id}`);
      setTrip(response.data.data);
    } catch (err) {
      console.error('Error fetching trip:', err);
      alert('Failed to load trip details');
      navigate('/trips');
    }
  };

  const fetchActivity = async () => {
    try {
      const response = await api.get(`/activities/${activityId}`);
      const activity = response.data.data;
      
      setFormData({
        name: activity.name,
        date: activity.date.split('T')[0],
        startTime: activity.startTime,
        endTime: activity.endTime,
        cost: activity.cost,
        category: activity.category,
        notes: activity.notes || '',
        location: {
          address: activity.location?.address || '',
          coordinates: {
            latitude: activity.location?.coordinates?.latitude || 0,
            longitude: activity.location?.coordinates?.longitude || 0
          }
        }
      });
      setLoading(false);
    } catch (err) {
      console.error('Error fetching activity:', err);
      alert('Failed to load activity');
      navigate(`/trips/${id}`);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'address') {
      setFormData({
        ...formData,
        location: { ...formData.location, address: value }
      });
    } else if (name === 'latitude' || name === 'longitude') {
      setFormData({
        ...formData,
        location: {
          ...formData.location,
          coordinates: {
            ...formData.location.coordinates,
            [name]: Number(value) || 0
          }
        }
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleGeocode = async () => {
    if (!formData.location.address) {
      setError('Please enter an address first');
      return;
    }

    try {
      setGeocoding(true);
      setError('');
      const response = await api.get('/geocode', {
        params: { address: formData.location.address }
      });
      
      const { latitude, longitude, displayName } = response.data.data;
      
      setFormData({
        ...formData,
        location: {
          address: displayName, // Use full formatted address
          coordinates: { latitude, longitude }
        }
      });
      
      alert(`✅ Location found!\nLat: ${latitude}\nLng: ${longitude}`);
    } catch (err) {
      console.error('Geocoding error:', err);
      setError('Could not find location. Try a more specific address or enter coordinates manually.');
    } finally {
      setGeocoding(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.endTime <= formData.startTime) {
      setError('End time must be after start time');
      return;
    }

    // Validate activity date is within trip date range
    const activityDate = new Date(formData.date);
    const tripStartDate = new Date(trip.startDate);
    const tripEndDate = new Date(trip.endDate);
    
    if (activityDate < tripStartDate || activityDate > tripEndDate) {
      setError(`Activity date must be between ${tripStartDate.toLocaleDateString()} and ${tripEndDate.toLocaleDateString()}`);
      return;
    }

    try {
      setSubmitting(true);
      await api.put(`/activities/${activityId}`, formData);
      // Navigate with state to trigger refresh
      navigate(`/trips/${id}`, { state: { refresh: true } });
    } catch (err) {
      console.error('Update activity error:', err);
      setError(err.response?.data?.message || 'Failed to update activity');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-2xl mx-auto px-4">
          <button
            onClick={() => navigate(`/trips/${id}`)}
            className="mb-4 text-indigo-600 hover:text-indigo-800 font-semibold"
          >
            ← Back to Trip
          </button>

          <div className="bg-white rounded-lg shadow-md p-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Edit Activity</h1>
            
            <form onSubmit={handleSubmit}>
              {error && (
                <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}

              {/* Activity Name */}
              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2">
                  Activity Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  placeholder="e.g., Beach Visit"
                />
              </div>

              {/* Date */}
              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2">
                  Date * <span className="text-sm text-gray-500">(Must be between trip dates)</span>
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  min={trip?.startDate?.split('T')[0]}
                  max={trip?.endDate?.split('T')[0]}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Trip dates: {new Date(trip?.startDate).toLocaleDateString()} - {new Date(trip?.endDate).toLocaleDateString()}
                </p>
              </div>

              {/* Time */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Start Time *
                  </label>
                  <input
                    type="time"
                    name="startTime"
                    value={formData.startTime}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    End Time *
                  </label>
                  <input
                    type="time"
                    name="endTime"
                    value={formData.endTime}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* Category and Cost */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Category *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="sightseeing">Sightseeing</option>
                    <option value="food">Food</option>
                    <option value="accommodation">Accommodation</option>
                    <option value="transport">Transport</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Cost (₹)
                  </label>
                  <input
                    type="number"
                    name="cost"
                    value={formData.cost}
                    onChange={handleChange}
                    min="0"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    placeholder="0"
                  />
                </div>
              </div>

              {/* Location Section */}
              <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                  📍 Location (Optional - for map display)
                </h3>
                
                {/* Address with Geocode Button */}
                <div className="mb-3">
                  <label className="block text-gray-700 font-semibold mb-2">
                    Address / Place Name
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      name="address"
                      value={formData.location.address}
                      onChange={handleChange}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                      placeholder="e.g., Calangute Beach, Goa"
                    />
                    <button
                      type="button"
                      onClick={handleGeocode}
                      disabled={geocoding || !formData.location.address}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold transition disabled:bg-gray-400 whitespace-nowrap"
                    >
                      {geocoding ? '🔍 Finding...' : '🔍 Find Coordinates'}
                    </button>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">
                    💡 Enter a place name and click "Find Coordinates" to auto-fill lat/lng
                  </p>
                </div>

                {/* Coordinates (Auto-filled or Manual) */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      Latitude
                    </label>
                    <input
                      type="number"
                      name="latitude"
                      value={formData.location.coordinates.latitude}
                      onChange={handleChange}
                      step="any"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-gray-50"
                      placeholder="Auto-filled"
                      readOnly={geocoding}
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      Longitude
                    </label>
                    <input
                      type="number"
                      name="longitude"
                      value={formData.location.coordinates.longitude}
                      onChange={handleChange}
                      step="any"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-gray-50"
                      placeholder="Auto-filled"
                      readOnly={geocoding}
                    />
                  </div>
                </div>
                
                <p className="text-xs text-gray-500 mt-2 italic">
                  Coordinates are auto-filled when you use "Find Coordinates" button
                </p>
              </div>

              {/* Notes */}
              <div className="mb-6">
                <label className="block text-gray-700 font-semibold mb-2">
                  Notes
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  placeholder="Optional notes..."
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-semibold disabled:bg-gray-400"
                >
                  {submitting ? 'Updating...' : 'Update Activity'}
                </button>
                <button
                  type="button"
                  onClick={() => navigate(`/trips/${id}`)}
                  className="px-6 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditActivity;