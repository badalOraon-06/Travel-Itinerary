import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import Navbar from '../components/Navbar';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [stats, setStats] = useState({
    totalTrips: 0,
    upcomingTrips: 0,
    ongoingTrips: 0,
    completedTrips: 0,
    totalBudget: 0,
    totalSpent: 0,
    totalActivities: 0
  });
  
  const [upcomingTrips, setUpcomingTrips] = useState([]);
  const [recentTrips, setRecentTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const tripsResponse = await api.get('/trips');
      const trips = tripsResponse.data.data || [];
      
      // Calculate statistics
      const totalTrips = trips.length;
      const upcomingTrips = trips.filter(t => 
        t.status === 'planning' || t.status === 'confirmed'
      ).length;
      const ongoingTrips = trips.filter(t => t.status === 'ongoing').length;
      const completedTrips = trips.filter(t => t.status === 'completed').length;
      const totalBudget = trips.reduce((sum, t) => sum + (t.budget?.total || 0), 0);
      const totalSpent = trips.reduce((sum, t) => sum + (t.budget?.spent || 0), 0);
      
      // Get upcoming trips (next 3)
      const upcoming = trips
        .filter(t => t.status === 'planning' || t.status === 'confirmed')
        .sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
        .slice(0, 3);
      
      // Get recent trips (last 3 updated)
      const recent = [...trips]
        .sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt))
        .slice(0, 3);
      
      // Get total activities count
      let totalActivities = 0;
      for (const trip of trips) {
        try {
          const activitiesResponse = await api.get(`/trips/${trip._id}/activities`);
          totalActivities += (activitiesResponse.data.data || []).length;
        } catch (err) {
          console.error('Error fetching activities for trip:', trip._id);
        }
      }
      
      setStats({
        totalTrips,
        upcomingTrips,
        ongoingTrips,
        completedTrips,
        totalBudget,
        totalSpent,
        totalActivities
      });
      
      setUpcomingTrips(upcoming);
      setRecentTrips(recent);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const getBudgetPercentage = () => {
    if (stats.totalBudget === 0) return 0;
    return Math.min(Math.round((stats.totalSpent / stats.totalBudget) * 100), 100);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navbar />

      {/* Dashboard Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Welcome Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              Welcome back, {user?.name}! 👋
            </h1>
            <p className="text-gray-600">Here's an overview of your travel plans</p>
          </div>

          {/* Stats Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Total Trips */}
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
              <div className="flex items-center justify-between mb-4">
                <div className="text-4xl">✈️</div>
                <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-1 rounded">ALL TIME</span>
              </div>
              <p className="text-gray-600 text-sm mb-1">Total Trips</p>
              <p className="text-4xl font-bold text-indigo-600">{stats.totalTrips}</p>
            </div>

            {/* Upcoming Trips */}
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
              <div className="flex items-center justify-between mb-4">
                <div className="text-4xl">🗓️</div>
                <span className="text-xs font-semibold text-blue-600 bg-blue-100 px-2 py-1 rounded">UPCOMING</span>
              </div>
              <p className="text-gray-600 text-sm mb-1">Planned Trips</p>
              <p className="text-4xl font-bold text-blue-600">{stats.upcomingTrips}</p>
            </div>

            {/* Ongoing Trips */}
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
              <div className="flex items-center justify-between mb-4">
                <div className="text-4xl">🚀</div>
                <span className="text-xs font-semibold text-green-600 bg-green-100 px-2 py-1 rounded">ACTIVE</span>
              </div>
              <p className="text-gray-600 text-sm mb-1">Ongoing Trips</p>
              <p className="text-4xl font-bold text-green-600">{stats.ongoingTrips}</p>
            </div>

            {/* Completed Trips */}
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
              <div className="flex items-center justify-between mb-4">
                <div className="text-4xl">✅</div>
                <span className="text-xs font-semibold text-purple-600 bg-purple-100 px-2 py-1 rounded">DONE</span>
              </div>
              <p className="text-gray-600 text-sm mb-1">Completed</p>
              <p className="text-4xl font-bold text-purple-600">{stats.completedTrips}</p>
            </div>
          </div>

          {/* Budget Overview & Activities */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Budget Card */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">💰 Budget Overview</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Budget</span>
                  <span className="text-2xl font-bold text-indigo-600">₹{stats.totalBudget.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Spent</span>
                  <span className="text-2xl font-bold text-red-600">₹{stats.totalSpent.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Remaining</span>
                  <span className="text-2xl font-bold text-green-600">
                    ₹{(stats.totalBudget - stats.totalSpent).toLocaleString()}
                  </span>
                </div>
                
                {/* Progress Bar */}
                <div className="pt-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Budget Used</span>
                    <span className="font-semibold">{getBudgetPercentage()}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-4">
                    <div
                      className={`h-4 rounded-full transition-all ${
                        getBudgetPercentage() > 90 ? 'bg-red-600' : 
                        getBudgetPercentage() > 70 ? 'bg-yellow-600' : 
                        'bg-green-600'
                      }`}
                      style={{ width: `${getBudgetPercentage()}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Activities Card */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">📋 Activities Summary</h3>
              <div className="flex items-center justify-center h-40">
                <div className="text-center">
                  <div className="text-6xl mb-4">🎯</div>
                  <p className="text-5xl font-bold text-indigo-600 mb-2">{stats.totalActivities}</p>
                  <p className="text-gray-600 font-semibold">Total Activities Planned</p>
                </div>
              </div>
              <button
                onClick={() => navigate('/trips')}
                className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-semibold transition"
              >
                View All Trips
              </button>
            </div>
          </div>

          {/* Upcoming & Recent Trips */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Upcoming Trips */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800">🗓️ Upcoming Trips</h3>
                <button
                  onClick={() => navigate('/calendar')}
                  className="text-sm text-indigo-600 hover:text-indigo-800 font-semibold"
                >
                  View Calendar →
                </button>
              </div>
              
              {upcomingTrips.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">No upcoming trips planned</p>
                  <button
                    onClick={() => navigate('/trips/new')}
                    className="text-indigo-600 hover:text-indigo-800 font-semibold"
                  >
                    + Create Your First Trip
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {upcomingTrips.map((trip) => (
                    <div
                      key={trip._id}
                      onClick={() => navigate(`/trips/${trip._id}`)}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition cursor-pointer"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold text-gray-800">{trip.title}</h4>
                        <span className={`text-xs px-2 py-1 rounded font-semibold ${
                          trip.status === 'confirmed' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {trip.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">📍 {trip.destination}</p>
                      <p className="text-sm text-gray-600">
                        📅 {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Recent Trips */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800">🕒 Recent Updates</h3>
                <button
                  onClick={() => navigate('/trips')}
                  className="text-sm text-indigo-600 hover:text-indigo-800 font-semibold"
                >
                  View All →
                </button>
              </div>
              
              {recentTrips.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">No trips yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentTrips.map((trip) => (
                    <div
                      key={trip._id}
                      onClick={() => navigate(`/trips/${trip._id}`)}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition cursor-pointer"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold text-gray-800">{trip.title}</h4>
                        <span className={`text-xs px-2 py-1 rounded font-semibold ${
                          trip.status === 'planning' ? 'bg-yellow-100 text-yellow-800' :
                          trip.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                          trip.status === 'ongoing' ? 'bg-green-100 text-green-800' :
                          trip.status === 'completed' ? 'bg-purple-100 text-purple-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {trip.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">📍 {trip.destination}</p>
                      <p className="text-sm text-gray-600">
                        💰 ₹{trip.budget?.spent || 0} / ₹{trip.budget?.total || 0}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">⚡ Quick Actions</h3>
            <div className="grid md:grid-cols-4 gap-4">
              <button
                onClick={() => navigate('/trips/new')}
                className="bg-indigo-600 hover:bg-indigo-700 text-white p-4 rounded-lg font-semibold transition shadow-md"
              >
                <div className="text-3xl mb-2">✈️</div>
                Create New Trip
              </button>
              <button
                onClick={() => navigate('/trips')}
                className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-lg font-semibold transition shadow-md"
              >
                <div className="text-3xl mb-2">📋</div>
                View All Trips
              </button>
              <button
                onClick={() => navigate('/calendar')}
                className="bg-green-600 hover:bg-green-700 text-white p-4 rounded-lg font-semibold transition shadow-md"
              >
                <div className="text-3xl mb-2">📅</div>
                Calendar View
              </button>
              <button
                onClick={() => navigate('/profile')}
                className="bg-purple-600 hover:bg-purple-700 text-white p-4 rounded-lg font-semibold transition shadow-md"
              >
                <div className="text-3xl mb-2">👤</div>
                My Profile
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;