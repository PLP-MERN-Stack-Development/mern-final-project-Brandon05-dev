# AgriSmart: Farmer Marketplace & Pricing
## MERN Stack Capstone Project

> **Project Status:** Phase 1 Complete ✅  
> **Current Phase:** Backend Foundation & User Authentication  
> **Next Phase:** Marketplace Core Models & CRUD

---

## 📋 Project Overview

**AgriSmart** is a secure, responsive marketplace platform connecting Farmers (Sellers) and Buyers. The application enables farmers to list agricultural products, buyers to browse and purchase items, and both parties to track orders in real-time.

### Technology Stack

- **Backend:** Node.js, Express.js, MongoDB (Mongoose)
- **Authentication:** JWT (JSON Web Tokens)
- **Real-Time:** Socket.io
- **Frontend:** React (with Hooks), React Router DOM, Axios, Tailwind CSS
- **Testing:** Jest, Supertest (Backend), React Testing Library (Frontend)

---

## ✅ Phase 1: Completed Features

### Backend Foundation
- ✅ Express server with middleware configuration
- ✅ MongoDB connection with Mongoose
- ✅ Socket.io initialization (ready for Phase 3)
- ✅ Environment variable management (.env)
- ✅ CORS configuration for cross-origin requests
- ✅ Global error handling

### User Authentication System
- ✅ User Model with role-based fields (Farmer/Buyer)
- ✅ Password hashing with bcryptjs (salt rounds: 10)
- ✅ JWT token generation (30-day expiration)
- ✅ Registration endpoint (`/api/v1/auth/register`)
- ✅ Login endpoint (`/api/v1/auth/login`)
- ✅ Protected profile endpoint (`/api/v1/auth/me`)

### Security & Authorization
- ✅ JWT verification middleware (`protect`)
- ✅ Role-based authorization middleware (`authorize`)
- ✅ Password comparison method on User model
- ✅ Input validation and error handling
- ✅ Secure password storage (never exposed in responses)

### Testing & Validation
- ✅ Health check endpoint
- ✅ All authentication endpoints tested
- ✅ Comprehensive test script (`test-api.sh`)
- ✅ Successfully registered Farmers and Buyers
- ✅ Token-based authentication verified

---

## 📁 Current Project Structure

```
mern-final-project-Brandon05-dev/
├── backend/
│   ├── controllers/
│   │   └── auth.js               # Authentication logic
│   ├── middleware/
│   │   └── auth.js               # JWT & authorization middleware
│   ├── models/
│   │   └── User.js               # User schema
│   ├── routes/
│   │   └── auth.js               # Auth API routes
│   ├── .env                      # Environment variables
│   ├── .gitignore                # Git ignore configuration
│   ├── package.json              # Node dependencies
│   ├── server.js                 # Main server file
│   ├── test-api.sh               # API test script
│   └── README.md                 # Backend documentation
├── README.md                     # Project overview
└── Week8-Assignment.md           # Assignment requirements
```

---

## 🗄️ Database Schema

### User Model

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | String | Yes | User's full name (2-50 chars) |
| `email` | String | Yes | Unique email (used for login) |
| `password` | String | Yes | Hashed password (min 6 chars) |
| `role` | String (enum) | Yes | 'Farmer' or 'Buyer' |
| `location` | String | Yes | User's location |
| `phone` | String | No | Contact number |
| `isActive` | Boolean | No | Account status (default: true) |
| `timestamps` | - | Auto | createdAt, updatedAt |

---

## 🔌 API Endpoints

### Authentication (`/api/v1/auth`)

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/register` | Public | Register new user (Farmer/Buyer) |
| POST | `/login` | Public | Login with email/password |
| GET | `/me` | Private | Get authenticated user profile |

### System

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/v1/health` | Public | Server health check |

---

## 🧪 Testing Results

All Phase 1 tests passing:

```bash
✓ Health check passed
✓ Farmer registration passed
✓ Buyer registration passed
✓ Farmer login passed
✓ Protected route access passed
✓ Invalid login correctly rejected
```

### Sample Test Users

| Role | Email | Password | Location |
|------|-------|----------|----------|
| Farmer | john.farmer@agrismart.com | farmer123 | Nairobi, Kenya |
| Buyer | jane.buyer@agrismart.com | buyer123 | Mombasa, Kenya |

---

## 🚀 Running the Application

### Start Backend Server

```bash
cd backend
npm install
npm run dev
```

Server will start on: `http://localhost:5000`

### Test API Endpoints

```bash
# Run comprehensive test suite
./backend/test-api.sh

# Manual testing with curl
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"test123","role":"Farmer","location":"Nairobi"}'
```

---

## 📝 Next Steps: Phase 2

### Marketplace Core Models & CRUD

The next phase will implement:

1. **Product Model**
   - Schema with farmer reference (ObjectId)
   - Fields: name, description, price, quantity, category, image
   - CRUD operations (Create, Read, Update, Delete)

2. **MarketPrice Model**
   - Daily average crop prices
   - Simple lookup functionality

3. **Product Controllers & Routes**
   - `POST /api/v1/products` (Farmer only)
   - `GET /api/v1/products` (Public with filtering)
   - `GET /api/v1/products/:id` (Public)
   - `PUT /api/v1/products/:id` (Owner only)
   - `DELETE /api/v1/products/:id` (Owner only)

4. **Role-Based Authorization**
   - Strict enforcement on product modification
   - Only owning Farmer can edit/delete their products

5. **Search & Filtering**
   - Filter by crop name, location, price range
   - Search functionality

---

## 🔐 Environment Variables

Update `backend/.env` with your configuration:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/agrismart
JWT_SECRET=your_super_secret_jwt_key_change_in_production
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

**⚠️ Security Note:** Never commit `.env` to version control. Use strong secrets in production.

---

## 📚 Resources & Documentation

- [Express.js Documentation](https://expressjs.com/)
- [Mongoose Documentation](https://mongoosejs.com/)
- [JWT Documentation](https://jwt.io/)
- [Socket.io Documentation](https://socket.io/)

---

## 👨‍💻 Development Team

**AgriSmart Architect** - Senior Full-Stack MERN Specialist

---

## 📜 License

This project is part of the PLP MERN Stack Development capstone project.

---

**Last Updated:** November 7, 2025  
**Phase:** 1 of 7 Complete ✅
