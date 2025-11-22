import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import Navbar from '../components/Navbar';

const Profile = () => {
  const { user } = useAuth();
  
  const [stats, setStats] = useState({
    totalTrips: 0,
    upcomingTrips: 0,
    completedTrips: 0,
    totalBudget: 0,
    totalSpent: 0
  });
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserStats();
  }, []);

  const fetchUserStats = async () => {
    try {
      setLoading(true);
      const response = await api.get('/trips');
      const trips = response.data.data || [];
      
      const totalTrips = trips.length;
      const upcomingTrips = trips.filter(t => t.status === 'planning' || t.status === 'confirmed').length;
      const completedTrips = trips.filter(t => t.status === 'completed').length;
      const totalBudget = trips.reduce((sum, t) => sum + (t.budget?.total || 0), 0);
      const totalSpent = trips.reduce((sum, t) => sum + (t.budget?.spent || 0), 0);
      
      setStats({
        totalTrips,
        upcomingTrips,
        completedTrips,
        totalBudget,
        totalSpent
      });
    } catch (err) {
      console.error('Error fetching stats:', err);
    } finally {
      setLoading(false);
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
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">My Profile</h1>

        <div className="grid md:grid-cols-2 gap-6">
          {/* User Information */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
              👤 Account Information
            </h2>
            <div className="space-y-4">
              <div className="flex items-center gap-4 pb-4 border-b">
                <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center text-3xl font-bold text-indigo-600">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-xl font-bold text-gray-800">{user?.name}</p>
                  <p className="text-gray-600">{user?.email}</p>
                </div>
              </div>
              <div className="pt-2">
                <p className="text-sm text-gray-600 mb-1">Member Since</p>
                <p className="text-lg font-semibold text-gray-800">
                  {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </p>
              </div>
            </div>
          </div>

          {/* Travel Statistics */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6">📊 Travel Statistics</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-3 border-b">
                <span className="text-gray-600">Total Trips</span>
                <span className="text-2xl font-bold text-indigo-600">{stats.totalTrips}</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b">
                <span className="text-gray-600">Upcoming</span>
                <span className="text-2xl font-bold text-blue-600">{stats.upcomingTrips}</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b">
                <span className="text-gray-600">Completed</span>
                <span className="text-2xl font-bold text-green-600">{stats.completedTrips}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Budget Overview */}
        <div className="mt-6 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-6">💰 Budget Overview</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-indigo-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-2">Total Budget</p>
              <p className="text-3xl font-bold text-indigo-600">₹{stats.totalBudget.toLocaleString()}</p>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-2">Total Spent</p>
              <p className="text-3xl font-bold text-red-600">₹{stats.totalSpent.toLocaleString()}</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-2">Remaining</p>
              <p className="text-3xl font-bold text-green-600">
                ₹{(stats.totalBudget - stats.totalSpent).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
