# AgriSmart: Farmer Marketplace & Pricing 🌾

> **Full-Stack MERN Capstone Project**  
> Secure, responsive marketplace connecting Farmers and Buyers

**Project Status:** Phase 1 Complete ✅ | [View Detailed Status](PROJECT_STATUS.md)

---

## 🎯 Project Overview

**AgriSmart** is a full-featured marketplace platform designed to bridge the gap between agricultural producers and consumers. The platform enables:

- **Farmers (Sellers):** List products, manage inventory, track orders, view market prices
- **Buyers:** Browse products, place orders, track purchases in real-time
- **Real-Time Updates:** Socket.io integration for instant order notifications

### Core Features

✅ **Phase 1 - Completed:**
- Secure user authentication (JWT-based)
- Role-based authorization (Farmer/Buyer)
- User registration and login
- Protected API routes
- MongoDB integration

🚧 **Upcoming Phases:**
- Phase 2: Product CRUD & Market Pricing
- Phase 3: Order System & Real-Time Updates
- Phase 4: Backend Testing (Jest/Supertest)
- Phase 5: React Frontend & Auth UI
- Phase 6: Marketplace UI & Real-Time Features
- Phase 7: Deployment & Documentation

---

## 🏗️ Technology Stack

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB (Mongoose ODM)
- **Authentication:** JWT (JSON Web Tokens)
- **Real-Time:** Socket.io
- **Security:** bcryptjs, CORS

### Frontend (Phase 5+)
- **Library:** React.js (Hooks)
- **Routing:** React Router DOM
- **HTTP Client:** Axios
- **Styling:** Tailwind CSS
- **State Management:** Context API

### Testing
- **Backend:** Jest, Supertest
- **Frontend:** React Testing Library

---

## 🚀 Quick Start

### Prerequisites

- Node.js v16+ ([Download](https://nodejs.org/))
- MongoDB ([Local Installation](https://www.mongodb.com/docs/manual/installation/) or [Atlas Account](https://www.mongodb.com/cloud/atlas))
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/PLP-MERN-Stack-Development/mern-final-project-Brandon05-dev.git
   cd mern-final-project-Brandon05-dev
   ```

2. **Setup Backend**
   ```bash
   cd backend
   npm install
   ```

3. **Configure Environment**
   
   Update `backend/.env` with your settings:
   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/agrismart
   JWT_SECRET=your_super_secret_jwt_key_here
   NODE_ENV=development
   ```

4. **Start MongoDB** (if running locally)
   ```bash
   mongod
   ```

5. **Run the Backend Server**
   ```bash
   npm run dev
   ```

   Server will be available at: `http://localhost:5000`

---

## 🧪 Testing the API

### Automated Test Suite

```bash
cd backend
./test-api.sh
```

### Manual Testing (curl examples)

**Register a Farmer:**
```bash
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Farmer",
    "email": "farmer@example.com",
    "password": "securepass123",
    "role": "Farmer",
    "location": "Nairobi, Kenya",
    "phone": "+254712345678"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "farmer@example.com",
    "password": "securepass123"
  }'
```

**Get Profile (Protected):**
```bash
curl -X GET http://localhost:5000/api/v1/auth/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## 📁 Project Structure

```
mern-final-project-Brandon05-dev/
├── backend/
│   ├── controllers/       # Business logic
│   │   └── auth.js
│   ├── middleware/        # Custom middleware
│   │   └── auth.js
│   ├── models/            # Database schemas
│   │   └── User.js
│   ├── routes/            # API routes
│   │   └── auth.js
│   ├── .env               # Environment variables
│   ├── server.js          # Server entry point
│   ├── package.json       # Dependencies
│   └── README.md          # Backend docs
├── frontend/              # (Phase 5+)
├── PROJECT_STATUS.md      # Detailed status
└── README.md              # This file
```

---

## 📡 API Documentation

### Authentication Endpoints

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/v1/auth/register` | Public | Register new user |
| POST | `/api/v1/auth/login` | Public | Login user |
| GET | `/api/v1/auth/me` | Private | Get user profile |

### Health Check

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/health` | Server status |

Full API documentation: [Backend README](backend/README.md)

---

## 🗄️ Database Models

### User Model (Phase 1)

```javascript
{
  name: String,      // Required, 2-50 chars
  email: String,     // Required, unique
  password: String,  // Required, hashed
  role: String,      // 'Farmer' or 'Buyer'
  location: String,  // Required
  phone: String,     // Optional
  isActive: Boolean, // Default: true
  timestamps: true   // Auto-generated
}
```

---

## ✅ Phase 1 Completion Checklist

- [x] Backend project initialization
- [x] Express server setup
- [x] MongoDB connection
- [x] User model with validation
- [x] Password hashing (bcrypt)
- [x] JWT authentication
- [x] Registration endpoint
- [x] Login endpoint
- [x] Protected routes middleware
- [x] Role-based authorization
- [x] API testing script
- [x] Documentation

---

## 📝 Development Progress

| Phase | Status | Description |
|-------|--------|-------------|
| Phase 1 | ✅ Complete | Backend Foundation & Authentication |
| Phase 2 | 🔜 Next | Product CRUD & Market Pricing |
| Phase 3 | ⏳ Pending | Orders & Real-Time (Socket.io) |
| Phase 4 | ⏳ Pending | Backend Testing |
| Phase 5 | ⏳ Pending | React Frontend & Auth UI |
| Phase 6 | ⏳ Pending | Marketplace UI & Real-Time |
| Phase 7 | ⏳ Pending | Deployment & Documentation |

[View detailed progress →](PROJECT_STATUS.md)

---

## 🎥 Project Demonstration

> Video demonstration will be added in Phase 7

---

## 🌐 Live Deployment

> Deployment links will be added in Phase 7

**Backend:** TBD  
**Frontend:** TBD

--- 