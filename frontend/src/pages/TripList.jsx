import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import Navbar from '../components/Navbar';

const TripList = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Filter and search states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('startDate');
  const [showFilters, setShowFilters] = useState(false);

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

  // Filter and sort trips
  const getFilteredAndSortedTrips = () => {
    let filtered = [...trips];

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (trip) =>
          trip.title.toLowerCase().includes(term) ||
          trip.destination.toLowerCase().includes(term)
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter((trip) => trip.status === statusFilter);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'startDate':
          return new Date(a.startDate) - new Date(b.startDate);
        case 'endDate':
          return new Date(a.endDate) - new Date(b.endDate);
        case 'title':
          return a.title.localeCompare(b.title);
        case 'budget':
          return (b.budget?.total || 0) - (a.budget?.total || 0);
        default:
          return 0;
      }
    });

    return filtered;
  };

  const filteredTrips = getFilteredAndSortedTrips();

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
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">My Trips</h1>
          <button
            onClick={() => navigate('/trips/new')}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors shadow-md"
          >
            + Create New Trip
          </button>
        </div>

        {/* Search and Filter Section */}
        {trips.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            {/* Search Bar */}
            <div className="mb-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="🔍 Search by title or destination..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                <span className="absolute left-3 top-3.5 text-gray-400">🔍</span>
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

            {/* Filter Toggle Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="text-indigo-600 hover:text-indigo-800 font-semibold mb-3 flex items-center gap-2"
            >
              {showFilters ? '▼' : '▶'} Filters & Sort
            </button>

            {/* Filters (Collapsible) */}
            {showFilters && (
              <div className="grid md:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
                {/* Status Filter */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="all">All Status</option>
                    <option value="planning">Planning</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="ongoing">Ongoing</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                {/* Sort By */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Sort By
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="startDate">Start Date</option>
                    <option value="endDate">End Date</option>
                    <option value="title">Title (A-Z)</option>
                    <option value="budget">Budget (High to Low)</option>
                  </select>
                </div>

                {/* Clear Filters */}
                <div className="flex items-end">
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setStatusFilter('all');
                      setSortBy('startDate');
                    }}
                    className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-semibold transition"
                  >
                    Clear All Filters
                  </button>
                </div>
              </div>
            )}

            {/* Results Count */}
            <div className="mt-4 text-sm text-gray-600">
              Showing <span className="font-semibold">{filteredTrips.length}</span> of{' '}
              <span className="font-semibold">{trips.length}</span> trip(s)
            </div>
          </div>
        )}

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
        ) : filteredTrips.length === 0 ? (
          // No results from filters
          <div className="text-center py-12 bg-white rounded-lg shadow-md">
            <p className="text-gray-500 text-lg mb-4">No trips match your filters</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('all');
                setSortBy('startDate');
              }}
              className="text-indigo-600 hover:text-indigo-800 font-semibold"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          // Trip cards
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTrips.map((trip) => (
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
                        ₹{trip.budget?.spent || 0} / ₹{trip.budget?.total || 0}
                      </span>
                    </div>
                    {/* Budget Progress Bar */}
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-indigo-600 h-2 rounded-full transition-all"
                        style={{ 
                          width: `${
                            trip.budget?.total > 0 
                              ? Math.min(((trip.budget?.spent || 0) / trip.budget.total) * 100, 100) 
                              : 0
                          }%` 
                        }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      ₹{(trip.budget?.total || 0) - (trip.budget?.spent || 0)} remaining
                    </p>
                  </div>

                  {/* Status Badge */}
                  <div className="flex justify-between items-center">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
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