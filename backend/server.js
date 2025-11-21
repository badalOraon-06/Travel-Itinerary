const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const tripRoutes = require('./routes/trips');
const activityRoutes = require('./routes/activities');

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();

// Connect to database
connectDB();

// Middleware
app.use(cors()); // Allow cross-origin requests
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Test route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Welcome to Travel Itinerary Planner API',
    status: 'Server is running'
  });
});

// Auth routes
app.use('/api/auth', authRoutes);
// Trip routes
app.use('/api/trips', tripRoutes);
// Activity routes (standalone)
app.use('/api/activities', activityRoutes);

// Port from environment or default to 5000
const PORT = process.env.PORT || 5000;

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
});