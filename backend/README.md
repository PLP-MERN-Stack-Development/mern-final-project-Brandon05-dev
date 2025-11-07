# AgriSmart Backend - Phase 1

## Backend Foundation & User Authentication

This directory contains the backend implementation for the AgriSmart Farmer Marketplace & Pricing platform.

### 🚀 Phase 1 Features Implemented

✅ **Server Setup**
- Express.js server with middleware (CORS, JSON parsing)
- MongoDB connection via Mongoose
- Socket.io initialization for real-time features
- Environment variable configuration

✅ **User Authentication System**
- User model with role-based access (Farmer/Buyer)
- Secure password hashing with bcryptjs
- JWT token generation and verification
- Registration and login endpoints
- Protected route middleware

✅ **Security Features**
- JWT-based authentication
- Role-based authorization middleware
- Password hashing (bcrypt with salt rounds)
- Input validation
- Secure headers and CORS configuration

---

## 📁 Project Structure

```
backend/
├── controllers/
│   └── auth.js           # Authentication logic (register, login, getMe)
├── middleware/
│   └── auth.js           # JWT verification & role-based authorization
├── models/
│   └── User.js           # User schema with validation
├── routes/
│   └── auth.js           # Authentication endpoints
├── .env                  # Environment variables
├── .gitignore            # Git ignore file
├── server.js             # Main server entry point
└── package.json          # Dependencies and scripts
```

---

## 🛠️ Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)

### Installation

1. **Install dependencies:**
   ```bash
   cd backend
   npm install
   ```

2. **Configure environment variables:**
   
   Update the `.env` file with your configuration:
   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/agrismart
   JWT_SECRET=your_super_secret_jwt_key_change_in_production
   NODE_ENV=development
   ```

   For production, use a strong JWT_SECRET and secure MongoDB connection string.

3. **Start the server:**
   ```bash
   # Development mode (with nodemon)
   npm run dev
   
   # Production mode
   npm start
   ```

---

## 📡 API Endpoints

### Authentication Routes

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/v1/auth/register` | Register a new user | Public |
| POST | `/api/v1/auth/login` | Login user | Public |
| GET | `/api/v1/auth/me` | Get current user profile | Private |

### Health Check

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/v1/health` | Server health status | Public |

---

## 🧪 Testing the API

### 1. Register a new Farmer

```bash
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "farmer@example.com",
    "password": "securepass123",
    "role": "Farmer",
    "location": "Nairobi, Kenya",
    "phone": "+254712345678"
  }'
```

**Expected Response:**
```json
{
  "status": "success",
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "...",
      "name": "John Doe",
      "email": "farmer@example.com",
      "role": "Farmer",
      "location": "Nairobi, Kenya",
      "phone": "+254712345678"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 2. Register a Buyer

```bash
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Smith",
    "email": "buyer@example.com",
    "password": "buyerpass123",
    "role": "Buyer",
    "location": "Mombasa, Kenya"
  }'
```

### 3. Login

```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "farmer@example.com",
    "password": "securepass123"
  }'
```

### 4. Get Current User Profile (Protected)

```bash
curl -X GET http://localhost:5000/api/v1/auth/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

---

## 🔐 Authentication & Authorization

### How JWT Works

1. **Registration/Login**: User provides credentials → Server generates JWT token
2. **Subsequent Requests**: Client includes token in Authorization header: `Bearer <token>`
3. **Server Verification**: Middleware verifies token → Attaches user to request → Proceeds to route handler

### Role-Based Access Control

The `authorize` middleware restricts access based on user roles:

```javascript
// Only Farmers can access this route
router.post('/products', protect, authorize('Farmer'), createProduct);

// Only Buyers can access this route
router.post('/orders', protect, authorize('Buyer'), createOrder);
```

---

## 🗄️ Database Models

### User Model

```javascript
{
  name: String,           // User's full name
  email: String,          // Unique email (used for login)
  password: String,       // Hashed password (bcrypt)
  role: String,           // 'Farmer' or 'Buyer'
  location: String,       // User's location
  phone: String,          // Contact number (optional)
  isActive: Boolean,      // Account status
  timestamps: true        // createdAt, updatedAt
}
```

---

## ⚙️ Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port | `5000` |
| `MONGO_URI` | MongoDB connection string | `mongodb://localhost:27017/agrismart` |
| `JWT_SECRET` | Secret key for JWT signing | `your_secret_key_here` |
| `NODE_ENV` | Environment mode | `development` or `production` |
| `FRONTEND_URL` | Frontend URL for CORS | `http://localhost:5173` |

---

## 🐛 Troubleshooting

### MongoDB Connection Issues

If you see "MongoDB Connection Error":
- Ensure MongoDB is running locally (`mongod`)
- Or update `MONGO_URI` to point to a cloud database (MongoDB Atlas)

### Port Already in Use

If port 5000 is occupied:
- Change `PORT` in `.env` to a different port (e.g., `5001`)
- Or kill the process using port 5000

---

## 📝 Next Steps

**Phase 2: Marketplace Core Models & CRUD**
- Product model and CRUD operations
- MarketPrice model for price lookup
- Role-based product management (Farmers only)
- Product filtering and search

---

## 👨‍💻 Development Scripts

```bash
# Start server (production)
npm start

# Start server with auto-reload (development)
npm run dev

# Run tests (Phase 4)
npm test
```

---

## 📄 License

This project is part of the PLP MERN Stack Development capstone project.
