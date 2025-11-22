import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';

const EditTrip = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    title: '',
    destination: '',
    description: '',
    startDate: '',
    endDate: '',
    budget: { total: 0 },
    status: 'planning'
  });
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTrip();
  }, [id]);

  const fetchTrip = async () => {
    try {
      const response = await api.get(`/trips/${id}`);
      const trip = response.data.data;
      
      setFormData({
        title: trip.title,
        destination: trip.destination,
        description: trip.description || '',
        startDate: trip.startDate.split('T')[0],
        endDate: trip.endDate.split('T')[0],
        budget: { 
          total: trip.budget.total,
          spent: trip.budget.spent // Include spent amount
        },
        status: trip.status || 'planning'
      });
      setLoading(false);
    } catch (err) {
      console.error('Error fetching trip:', err);
      alert('Failed to load trip');
      navigate('/trips');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'totalBudget') {
      setFormData({ ...formData, budget: { total: Number(value) } });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (new Date(formData.endDate) <= new Date(formData.startDate)) {
      setError('End date must be after start date');
      return;
    }

    try {
      setSubmitting(true);
      
      // Send only the fields that should be updated
      const updateData = {
        title: formData.title,
        destination: formData.destination,
        description: formData.description,
        startDate: formData.startDate,
        endDate: formData.endDate,
        status: formData.status,
        budget: {
          total: Number(formData.budget.total) || 0,
          spent: Number(formData.budget.spent) || 0 // Include spent to avoid overwriting
        }
      };
      
      console.log('Sending update data:', updateData);
      
      await api.put(`/trips/${id}`, updateData);
      navigate(`/trips/${id}`);
    } catch (err) {
      console.error('Update trip error:', err);
      console.error('Error response:', err.response?.data);
      setError(err.response?.data?.message || 'Failed to update trip');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <button
          onClick={() => navigate(`/trips/${id}`)}
          className="mb-4 text-indigo-600 hover:text-indigo-800 font-semibold"
        >
          ← Back to Trip
        </button>

        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Edit Trip</h1>

          <form onSubmit={handleSubmit}>
            {error && (
              <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            {/* Trip Title */}
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">
                Trip Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                placeholder="e.g., Summer Vacation 2025"
              />
            </div>

            {/* Destination */}
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">
                Destination *
              </label>
              <input
                type="text"
                name="destination"
                value={formData.destination}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                placeholder="e.g., Paris, France"
              />
            </div>

            {/* Description */}
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="3"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                placeholder="Brief description..."
              />
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Start Date *
                </label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  End Date *
                </label>
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* Status */}
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">
                Trip Status *
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              >
                <option value="planning">🟡 Planning</option>
                <option value="confirmed">🔵 Confirmed</option>
                <option value="ongoing">🟢 Ongoing</option>
                <option value="completed">🟣 Completed</option>
                <option value="cancelled">🔴 Cancelled</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">
                Update the current status of your trip
              </p>
            </div>

            {/* Total Budget */}
            <div className="mb-6">
              <label className="block text-gray-700 font-semibold mb-2">
                Total Budget (₹)
              </label>
              <input
                type="number"
                name="totalBudget"
                value={formData.budget.total}
                onChange={handleChange}
                min="0"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                placeholder="e.g., 50000"
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-semibold disabled:bg-gray-400"
              >
                {submitting ? 'Updating...' : 'Update Trip'}
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
  );
};

export default EditTrip;