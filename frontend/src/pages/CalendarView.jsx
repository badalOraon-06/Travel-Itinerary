import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import Navbar from '../components/Navbar';

const CalendarView = () => {
  const navigate = useNavigate();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  useEffect(() => {
    fetchTrips();
  }, []);

  const fetchTrips = async () => {
    try {
      setLoading(true);
      const response = await api.get('/trips');
      setTrips(response.data.data || []);
    } catch (err) {
      console.error('Error fetching trips:', err);
    } finally {
      setLoading(false);
    }
  };

  // Get first day of month (0 = Sunday, 6 = Saturday)
  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  // Get number of days in month
  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  // Check if a date has any trips
  const getTripsForDate = (day) => {
    const dateToCheck = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    );
    
    return trips.filter(trip => {
      const startDate = new Date(trip.startDate);
      const endDate = new Date(trip.endDate);
      
      // Set all times to midnight for accurate date comparison
      dateToCheck.setHours(0, 0, 0, 0);
      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(0, 0, 0, 0);
      
      return dateToCheck >= startDate && dateToCheck <= endDate;
    });
  };

  // Navigation functions
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Generate calendar days
  const generateCalendarDays = () => {
    const firstDay = getFirstDayOfMonth(currentDate);
    const daysInMonth = getDaysInMonth(currentDate);
    const days = [];

    // Empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="min-h-24 bg-gray-50"></div>);
    }

    // Calendar days
    for (let day = 1; day <= daysInMonth; day++) {
      const tripsOnDay = getTripsForDate(day);
      const today = new Date();
      const isToday = 
        day === today.getDate() &&
        currentDate.getMonth() === today.getMonth() &&
        currentDate.getFullYear() === today.getFullYear();

      days.push(
        <div
          key={day}
          className={`min-h-24 border border-gray-200 p-2 ${
            isToday ? 'bg-indigo-50 ring-2 ring-indigo-500' : 'bg-white'
          } hover:bg-gray-50 transition`}
        >
          <div className={`text-sm font-semibold mb-1 ${isToday ? 'text-indigo-600' : 'text-gray-700'}`}>
            {day}
            {isToday && <span className="ml-1 text-xs">(Today)</span>}
          </div>
          <div className="space-y-1">
            {tripsOnDay.slice(0, 2).map((trip) => {
              const startDate = new Date(trip.startDate);
              const currentDayDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
              const isFirstDay = startDate.toDateString() === currentDayDate.toDateString();
              
              return (
                <div
                  key={trip._id}
                  onClick={() => navigate(`/trips/${trip._id}`)}
                  className={`text-xs p-1 rounded cursor-pointer transition hover:opacity-80 ${
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
                  title={`${trip.title} - ${trip.destination}`}
                >
                  {isFirstDay && '📍'} {trip.title.length > 15 ? trip.title.substring(0, 15) + '...' : trip.title}
                </div>
              );
            })}
            {tripsOnDay.length > 2 && (
              <div className="text-xs text-gray-500 pl-1">
                +{tripsOnDay.length - 2} more
              </div>
            )}
          </div>
        </div>
      );
    }

    return days;
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
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">📅 Calendar View</h1>
          <p className="text-gray-600">Visual overview of your travel schedule</p>
        </div>

        {/* Calendar Controls */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex justify-between items-center">
            <button
              onClick={goToPreviousMonth}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg font-semibold text-gray-700 transition"
            >
              ← Previous
            </button>
            
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-800">
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h2>
              <button
                onClick={goToToday}
                className="mt-1 text-sm text-indigo-600 hover:text-indigo-800 font-semibold"
              >
                Go to Today
              </button>
            </div>

            <button
              onClick={goToNextMonth}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg font-semibold text-gray-700 transition"
            >
              Next →
            </button>
          </div>
        </div>

        {/* Legend */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">Status Legend:</h3>
          <div className="flex flex-wrap gap-3">
            <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded">Planning</span>
            <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded">Confirmed</span>
            <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded">Ongoing</span>
            <span className="px-3 py-1 bg-purple-100 text-purple-800 text-xs font-semibold rounded">Completed</span>
            <span className="px-3 py-1 bg-red-100 text-red-800 text-xs font-semibold rounded">Cancelled</span>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Day Headers */}
          <div className="grid grid-cols-7 bg-indigo-600 text-white">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="p-3 text-center font-semibold">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7">
            {generateCalendarDays()}
          </div>
        </div>

        {/* Summary Stats */}
        <div className="mt-6 grid md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow-md p-4">
            <p className="text-sm text-gray-600">Total Trips</p>
            <p className="text-2xl font-bold text-indigo-600">{trips.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4">
            <p className="text-sm text-gray-600">This Month</p>
            <p className="text-2xl font-bold text-blue-600">
              {trips.filter(trip => {
                const start = new Date(trip.startDate);
                const end = new Date(trip.endDate);
                return (
                  (start.getMonth() === currentDate.getMonth() && start.getFullYear() === currentDate.getFullYear()) ||
                  (end.getMonth() === currentDate.getMonth() && end.getFullYear() === currentDate.getFullYear())
                );
              }).length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4">
            <p className="text-sm text-gray-600">Upcoming</p>
            <p className="text-2xl font-bold text-green-600">
              {trips.filter(t => t.status === 'planning' || t.status === 'confirmed').length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4">
            <p className="text-sm text-gray-600">Completed</p>
            <p className="text-2xl font-bold text-purple-600">
              {trips.filter(t => t.status === 'completed').length}
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-6 text-center">
          <button
            onClick={() => navigate('/trips/new')}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-lg font-semibold transition shadow-md"
          >
            + Create New Trip
          </button>
        </div>
      </div>
    </div>
  );
};

export default CalendarView;
