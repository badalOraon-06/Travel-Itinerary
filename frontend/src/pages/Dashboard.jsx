import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navbar />

      {/* Dashboard Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">
            Your Dashboard
          </h2>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Total Trips</p>
                  <p className="text-3xl font-bold text-blue-600">0</p>
                </div>
                <div className="text-4xl">✈️</div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Upcoming</p>
                  <p className="text-3xl font-bold text-green-600">0</p>
                </div>
                <div className="text-4xl">📅</div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Completed</p>
                  <p className="text-3xl font-bold text-purple-600">0</p>
                </div>
                <div className="text-4xl">✅</div>
              </div>
            </div>
          </div>

          {/* Welcome Message */}
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">
              🎉 Welcome to Your Travel Dashboard!
            </h3>
            <p className="text-gray-600 mb-6">
              You're successfully logged in as <strong>{user?.email}</strong>
            </p>
            <p className="text-gray-600 mb-6">
              This is where you'll manage all your trips and activities.
              <br />
              More features coming soon!
            </p>
            <button
              onClick={() => navigate('/trips')}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors shadow-md"
            >
              View My Trips
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;