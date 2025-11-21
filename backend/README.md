# Backend - Travel Itinerary Planner API

RESTful API for the Travel Itinerary Planner application.

## 🚀 Quick Start

### Prerequisites

- Node.js v18+
- MongoDB Atlas account

### Installation

1. **Install dependencies**

```bash
npm install
```

2. **Set up environment variables**

```bash
# Copy the example file
cp .env.example .env

# Edit .env with your values
```

3. **Run in development**

```bash
npm run dev
```

The server will start at `http://localhost:5000`

## 📝 Environment Variables

Create a `.env` file in the backend folder:

```env
PORT=5000
NODE_ENV=development
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

### Getting MongoDB URI

1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Select your cluster
3. Click "Connect" → "Connect your application"
4. Copy the connection string
5. Replace `<password>` with your database password

### Generating JWT Secret

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## 🛠️ Available Scripts

| Script        | Description                    |
| ------------- | ------------------------------ |
| `npm start`   | Run in production mode         |
| `npm run dev` | Run with nodemon (auto-reload) |

## 📚 API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Trips

- `GET /api/trips` - Get all trips (auth required)
- `POST /api/trips` - Create trip (auth required)
- `GET /api/trips/:id` - Get single trip (auth required)
- `PUT /api/trips/:id` - Update trip (auth required)
- `DELETE /api/trips/:id` - Delete trip (auth required)

### Activities

- `GET /api/activities` - Get all activities (auth required)
- `POST /api/trips/:tripId/activities` - Add activity to trip (auth required)
- `PUT /api/activities/:id` - Update activity (auth required)
- `DELETE /api/activities/:id` - Delete activity (auth required)

## 🌐 Deployment

See [DEPLOYMENT_GUIDE.md](../DEPLOYMENT_GUIDE.md) for detailed instructions.

### Deploy to Render

1. Push code to GitHub
2. Create new Web Service on Render
3. Connect GitHub repository
4. Set root directory to `backend`
5. Add environment variables
6. Deploy!

## 🐛 Troubleshooting

### Cannot connect to MongoDB

- Check if your IP is whitelisted in MongoDB Atlas
- Verify MONGO_URI is correct
- Ensure database password doesn't contain special characters

### Port already in use

```bash
# Find and kill process on port 5000
netstat -ano | findstr :5000
taskkill /PID <process_id> /F
```

## 📦 Dependencies

- **express** - Web framework
- **mongoose** - MongoDB ODM
- **bcryptjs** - Password hashing
- **jsonwebtoken** - JWT authentication
- **cors** - Enable CORS
- **dotenv** - Environment variables
