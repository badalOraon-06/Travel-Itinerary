import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <div 
            onClick={() => navigate('/dashboard')}
            className="flex items-center cursor-pointer"
          >
            <h1 className="text-2xl font-bold text-indigo-600">
              🌍 Travel Planner
            </h1>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center gap-6">
            <button
              onClick={() => navigate('/dashboard')}
              className="text-gray-700 hover:text-indigo-600 font-medium transition"
            >
              Dashboard
            </button>
            <button
              onClick={() => navigate('/trips')}
              className="text-gray-700 hover:text-indigo-600 font-medium transition"
            >
              My Trips
            </button>
            <button
              onClick={() => navigate('/calendar')}
              className="text-gray-700 hover:text-indigo-600 font-medium transition"
            >
              Calendar
            </button>
            <button
              onClick={() => navigate('/profile')}
              className="text-gray-700 hover:text-indigo-600 font-medium transition"
            >
              Profile
            </button>
            
            {/* User Info & Logout */}
            <div className="flex items-center gap-4 ml-4 pl-4 border-l border-gray-300">
              <span className="text-gray-700">
                👤 <span className="font-semibold">{user?.name}</span>
              </span>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold transition"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;