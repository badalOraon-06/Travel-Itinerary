# 🌍 Travel Itinerary Planner

> A full-stack web application for planning and managing your travel itineraries with budget tracking, interactive maps, and weather forecasts.

![React](https://img.shields.io/badge/React-19.1.1-blue) ![Node.js](https://img.shields.io/badge/Node.js-22.x-green) ![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-brightgreen) ![License](https://img.shields.io/badge/license-MIT-blue)

---

## 🎥 Live Demo

🚀 **Coming Soon** - Application ready for deployment

---

## ✨ Features

### 🗺️ Trip Management

- ✅ Create, edit, and delete trips
- ✅ Set trip dates, destinations, and descriptions
- ✅ Trip status tracking (Planning, Confirmed, Ongoing, Completed, Cancelled)
- ✅ Search and filter trips by status
- ✅ Sort trips by date, title, or budget

### 💰 Budget Tracking

- ✅ Set trip budgets with automatic calculation
- ✅ Real-time spent vs. remaining tracking
- ✅ Visual progress bars with color-coded alerts
- ✅ Auto-update budget when activities are added/edited/deleted

### 📍 Activity Management

- ✅ Add activities with dates, times, costs, and categories
- ✅ Edit and delete activities
- ✅ Location-based activities with geocoding
- ✅ Interactive map view with activity markers
- ✅ Date validation (activities must be within trip dates)
- ✅ Sort activities by date, name, cost, or category
- ✅ Filter activities by category and status

### 🌤️ Weather Integration

- ✅ 5-day weather forecast for trip destinations
- ✅ Trip dates highlighted on weather timeline
- ✅ Temperature, conditions, and icons

### 📅 Calendar View

- ✅ Monthly calendar with all trips displayed
- ✅ Multi-day trip visualization
- ✅ Quick navigation to trip details

### 🔐 Authentication & Security

- ✅ User registration and login
- ✅ JWT-based authentication
- ✅ Protected routes and API endpoints
- ✅ Secure password hashing with bcrypt
- ✅ User profile management

### 📊 Dashboard & Analytics

- ✅ Trip statistics (Total, Upcoming, Ongoing, Completed)
- ✅ Budget overview across all trips
- ✅ Quick actions and recent trips
- ✅ Responsive sidebar navigation

---

## 🛠️ Tech Stack

### Frontend

- **Framework:** React 19.1.1
- **Build Tool:** Vite 7.x
- **Routing:** React Router v7
- **Styling:** Tailwind CSS 3.4
- **Maps:** Leaflet & React-Leaflet
- **HTTP Client:** Axios

### Backend

- **Runtime:** Node.js 22.x
- **Framework:** Express 5.x
- **Database:** MongoDB Atlas
- **Authentication:** JWT (JSON Web Tokens)
- **Password Hashing:** bcryptjs
- **Environment:** dotenv

### External APIs

- **Weather:** OpenWeatherMap API
- **Geocoding:** Nominatim OpenStreetMap API

---

## 📂 Project Structure

```
travel-itinerary/
├── backend/
│   ├── config/          # Database configuration
│   ├── controllers/     # Route controllers
│   ├── middleware/      # Auth middleware
│   ├── models/          # Mongoose models
│   ├── routes/          # API routes
│   ├── services/        # External API services
│   ├── utils/           # Utility functions
│   ├── .env             # Environment variables
│   └── server.js        # Entry point
│
├── frontend/
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── context/     # React Context (Auth)
│   │   ├── pages/       # Page components
│   │   ├── services/    # API services
│   │   ├── utils/       # Utility functions
│   │   ├── App.jsx      # Main app component
│   │   └── main.jsx     # Entry point
│   └── package.json
│
└── README.md
```

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js)
- **MongoDB Atlas Account** - [Sign up](https://www.mongodb.com/cloud/atlas)
- **OpenWeatherMap API Key** - [Get Free Key](https://openweathermap.org/api)
- **Git** (optional) - [Download](https://git-scm.com/)

---

## 🚀 Installation & Setup

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/badalOraon-06/Travel-Itinerary.git
cd Travel-Itinerary
```

### 2️⃣ Backend Setup

```bash
# Navigate to backend folder
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env with your credentials:
# MONGO_URI=your_mongodb_connection_string
# JWT_SECRET=your_secret_key
# WEATHER_API_KEY=your_openweathermap_key
# PORT=5000

# Start backend server
npm run dev
```

Backend will run on: **http://localhost:5000**

### 3️⃣ Frontend Setup

```bash
# Navigate to frontend folder (in new terminal)
cd frontend

# Install dependencies
npm install

# Start frontend development server
npm run dev
```

Frontend will run on: **http://localhost:5173**

### 4️⃣ Access the Application

Open your browser and visit: **http://localhost:5173**

---

## 🔐 Environment Variables

### Backend (.env)

```env
# MongoDB
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname

# JWT Authentication
JWT_SECRET=your_super_secret_key_min_32_characters
JWT_EXPIRE=30d

# Server Configuration
PORT=5000
NODE_ENV=development

# OpenWeatherMap API
WEATHER_API_KEY=your_openweathermap_api_key
```

### Frontend (.env) - Optional

```env
VITE_API_URL=http://localhost:5000
```

> ⚠️ **Never commit .env files to Git!** They're included in .gitignore

---

## 📡 API Endpoints

### Authentication

| Method | Endpoint             | Description       |
| ------ | -------------------- | ----------------- |
| POST   | `/api/auth/register` | Register new user |
| POST   | `/api/auth/login`    | Login user        |

### Trips

| Method | Endpoint         | Description        | Auth Required |
| ------ | ---------------- | ------------------ | ------------- |
| GET    | `/api/trips`     | Get all user trips | ✅            |
| POST   | `/api/trips`     | Create new trip    | ✅            |
| GET    | `/api/trips/:id` | Get single trip    | ✅            |
| PUT    | `/api/trips/:id` | Update trip        | ✅            |
| DELETE | `/api/trips/:id` | Delete trip        | ✅            |

### Activities

| Method | Endpoint                        | Description         | Auth Required |
| ------ | ------------------------------- | ------------------- | ------------- |
| GET    | `/api/trips/:tripId/activities` | Get trip activities | ✅            |
| POST   | `/api/trips/:tripId/activities` | Create activity     | ✅            |
| GET    | `/api/activities/:id`           | Get single activity | ✅            |
| PUT    | `/api/activities/:id`           | Update activity     | ✅            |
| DELETE | `/api/activities/:id`           | Delete activity     | ✅            |

### Weather & Utilities

| Method | Endpoint                        | Description          | Auth Required |
| ------ | ------------------------------- | -------------------- | ------------- |
| GET    | `/api/weather/:destination`     | Get weather forecast | ✅            |
| GET    | `/api/geocoding/search?q=...`   | Search locations     | ✅            |
| GET    | `/api/geocoding/reverse?lat...` | Reverse geocode      | ✅            |

---

## 📖 Usage Guide

### Creating Your First Trip

1. **Register/Login** to your account
2. Click **"Create New Trip"** on dashboard
3. Fill in trip details:
   - Title (e.g., "Goa Beach Vacation")
   - Destination (e.g., "Goa, India")
   - Start & End dates
   - Budget (optional)
4. Click **"Create Trip"**

### Adding Activities

1. Go to your trip details page
2. Click **"Add Activity"**
3. Enter activity details:
   - Name, Date, Time
   - Category (Sightseeing, Food, etc.)
   - Cost (auto-updates budget)
   - Location (with geocoding)
4. Click **"Add Activity"**

### Viewing Weather

- Weather automatically loads for trip destinations
- Shows 5-day forecast
- Trip dates highlighted in yellow

### Budget Tracking

- Budget auto-calculates when you add/edit/delete activities
- Progress bar shows spent vs. remaining
- Color coding: Green (safe), Yellow (warning), Red (over budget)

---

## 🚢 Deployment

### Backend (Railway/Render/Heroku)

1. Create account on deployment platform
2. Connect your GitHub repository
3. Set environment variables in platform dashboard
4. Deploy backend
5. Note your backend URL (e.g., `https://your-app.railway.app`)

### Frontend (Vercel/Netlify)

1. Create account on Vercel/Netlify
2. Connect your GitHub repository
3. Set build command: `npm run build`
4. Set build directory: `dist`
5. Add environment variable: `VITE_API_URL=your_backend_url`
6. Deploy

### MongoDB Atlas Configuration

- Whitelist deployment server IPs in Network Access
- Use production connection string in backend .env
- Enable authentication and use strong credentials

---

## ⚠️ Known Issues

- Weather API has rate limits (1000 calls/day on free tier)
- Geocoding uses free Nominatim API (max 1 request/second)
- Map requires internet connection to load tiles

---

## 🔮 Future Enhancements

- [ ] Mobile app version (React Native)
- [ ] Collaborative trip planning (share trips with friends)
- [ ] Expense splitting among travelers
- [ ] Flight/hotel booking integration
- [ ] PDF itinerary export
- [ ] Multi-currency support
- [ ] Offline mode with service workers
- [ ] Photo uploads for activities
- [ ] Social sharing features
- [ ] Trip recommendations based on preferences

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Badal Oraon**

- GitHub: [@badalOraon-06](https://github.com/badalOraon-06)
- Project: [Travel-Itinerary](https://github.com/badalOraon-06/Travel-Itinerary)

---

## 🙏 Acknowledgments

- [OpenWeatherMap](https://openweathermap.org/) for weather data API
- [OpenStreetMap](https://www.openstreetmap.org/) & Nominatim for geocoding services
- [Leaflet](https://leafletjs.com/) for interactive maps
- React & Node.js communities for excellent documentation
- All open-source contributors whose libraries made this project possible

---

## ⭐ Show Your Support

If you found this project helpful, please give it a ⭐ on GitHub!

---

**Built with ❤️ for travelers by travelers**
