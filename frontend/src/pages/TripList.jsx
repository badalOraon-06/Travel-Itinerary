import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import Navbar from '../components/Navbar';

const TripList = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        setLoading(true);
        const response = await api.get('/trips');
        console.log('API Response:', response.data);
        // Backend returns { success: true, data: [...trips] }
        // So we need response.data.data
        setTrips(response.data.data || response.data);
      } catch (err) {
        console.error('Fetch error:', err);
        setError('Failed to fetch trips');
      } finally {
        setLoading(false);
      }
    };

    fetchTrips();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">My Trips</h1>
          <button
            onClick={() => navigate('/trips/new')}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors shadow-md"
          >
            + Create New Trip
          </button>
        </div>

        {/* Empty State */}
        {trips.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg mb-4">No trips yet. Start planning your adventure!</p>
            <button
              onClick={() => navigate('/trips/new')}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Create Your First Trip
            </button>
          </div>
        ) : (
          // Trip cards
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trips.map((trip) => (
              <div
                key={trip._id}
                onClick={() => navigate(`/trips/${trip._id}`)}
                className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow cursor-pointer overflow-hidden"
              >
                {/* Card Header */}
                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-4 text-white">
                  <h2 className="text-xl font-bold mb-1">{trip.title}</h2>
                  <p className="text-indigo-100 flex items-center">
                    📍 {trip.destination}
                  </p>
                </div>

                {/* Card Body */}
                <div className="p-4">
                  {/* Dates */}
                  <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-1">📅 Travel Dates</p>
                    <p className="text-gray-800 font-medium">
                      {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}
                    </p>
                  </div>

                  {/* Budget */}
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-600">💰 Budget</span>
                      <span className="text-sm font-semibold text-gray-800">
                        ₹{trip.budget.spent} / ₹{trip.budget.total}
                      </span>
                    </div>
                    {/* Budget Progress Bar */}
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-indigo-600 h-2 rounded-full transition-all"
                        style={{ width: `${Math.min((trip.budget.spent / trip.budget.total) * 100, 100)}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      ₹{trip.budget.total - trip.budget.spent} remaining
                    </p>
                  </div>

                  {/* Status Badge */}
                  <div className="flex justify-between items-center">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        trip.status === 'upcoming'
                          ? 'bg-blue-100 text-blue-800'
                          : trip.status === 'ongoing'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {trip.status.charAt(0).toUpperCase() + trip.status.slice(1)}
                    </span>
                    <span className="text-indigo-600 text-sm font-medium">View Details →</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TripList;