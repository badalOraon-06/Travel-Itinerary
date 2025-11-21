import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-6xl font-bold text-gray-800 mb-6">
            🌍 Travel Planner
          </h1>
          <p className="text-2xl text-gray-600 mb-8">
            Plan your perfect trip with ease
          </p>
          <p className="text-lg text-gray-500 mb-12">
            Organize your itinerary, track your budget, and make every journey memorable
          </p>

          {/* CTA Buttons */}
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => navigate('/register')}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition shadow-lg"
            >
              Get Started
            </button>
            <button
              onClick={() => navigate('/login')}
              className="bg-white hover:bg-gray-50 text-indigo-600 px-8 py-4 rounded-lg text-lg font-semibold transition shadow-lg border-2 border-indigo-600"
            >
              Login
            </button>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-8 mt-20 max-w-6xl mx-auto">
          {/* Feature 1 */}
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="text-5xl mb-4">📋</div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">
              Organize Itinerary
            </h3>
            <p className="text-gray-600">
              Plan your daily activities with detailed schedules and locations
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="text-5xl mb-4">💰</div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">
              Track Budget
            </h3>
            <p className="text-gray-600">
              Monitor your spending and stay within your travel budget
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="text-5xl mb-4">✈️</div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">
              Multiple Trips
            </h3>
            <p className="text-gray-600">
              Manage all your trips in one place, past and upcoming
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center py-8 text-gray-600">
        <p>© 2025 Travel Planner. Made with ❤️ for travelers</p>
      </footer>
    </div>
  );
};

export default Home;