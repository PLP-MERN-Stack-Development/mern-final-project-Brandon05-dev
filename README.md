# AgriSmart: Farmer Marketplace & Pricing 🌾

> **Full-Stack MERN Capstone Project**  
> Secure, responsive marketplace connecting Farmers and Buyers with real-time updates

**Project Status:** All Phases Complete ✅ | [View Deployment Guide](DEPLOYMENT.md)

---

## 🎯 Project Overview

**AgriSmart** is a full-featured marketplace platform designed to bridge the gap between agricultural producers and consumers. The platform enables:

- **Farmers (Sellers):** List products, manage inventory, track orders, view market prices
- **Buyers:** Browse products, place orders, track purchases in real-time
- **Real-Time Updates:** Socket.io integration for instant order notifications

### Core Features

✅ **Completed Features:**
- ✅ Secure user authentication (JWT-based)
- ✅ Role-based authorization (Farmer/Buyer)
- ✅ Product CRUD with search and filtering
- ✅ Order management system
- ✅ Real-time notifications (Socket.io)
- ✅ Market price tracking
- ✅ Responsive React frontend
- ✅ Protected routes
- ✅ Comprehensive test suite (27/27 tests passing)

---

## 🏗️ Technology Stack

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js 4.18.2
- **Database:** MongoDB with Mongoose 8.0.0
- **Authentication:** JWT 9.0.2 + bcryptjs 2.4.3
- **Real-Time:** Socket.io 4.6.1
- **Testing:** Jest 29.7.0 + Supertest 6.3.3
- **Security:** CORS 2.8.5

### Frontend
- **Library:** React 18.2.0
- **Build Tool:** Vite 5.0.0
- **Routing:** React Router DOM 6.14.1
- **HTTP Client:** Axios 1.4.0
- **Styling:** Tailwind CSS
- **Real-Time:** socket.io-client 4.6.1
- **State Management:** Context API

---

## 🚀 Quick Start

### Prerequisites

- Node.js v18+ ([Download](https://nodejs.org/))
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
   cp .env.example .env
   # Edit .env with your MongoDB URI and JWT secret
   ```

3. **Setup Frontend**
   ```bash
   cd ../frontend
   npm install
   cp .env.example .env
   # Edit .env with your backend URL
   ```

4. **Start MongoDB** (if running locally)
   ```bash
   mongod
   ```

5. **Run the Application**
   
   Terminal 1 (Backend):
   ```bash
   cd backend
   node server.js
   ```
   
   Terminal 2 (Frontend):
   ```bash
   cd frontend
   npm run dev
   ```

6. **Access the Application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

---

## 🧪 Testing

### Backend Test Suite (27 Tests)

```bash
cd backend
npm test
```

**Test Coverage:**
- ✅ Unit Tests: Password hashing, JWT generation/verification (7 tests)
- ✅ Integration Tests: Product CRUD operations (10 tests)
- ✅ Integration Tests: Order management (10 tests)

---

## 📁 Project Structure

```
mern-final-project-Brandon05-dev/
├── backend/
│   ├── __tests__/
│   │   ├── unit/
│   │   │   └── auth.test.js
│   │   └── integration/
│   │       ├── product.test.js
│   │       └── order.test.js
│   ├── controllers/
│   │   ├── auth.js
│   │   ├── product.js
│   │   ├── order.js
│   │   └── marketPrice.js
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Product.js
│   │   ├── Order.js
│   │   └── MarketPrice.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── product.js
│   │   ├── order.js
│   │   └── marketPrice.js
│   ├── .env.example
│   ├── server.js
│   ├── jest.config.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ProtectedRoute.jsx
│   │   │   ├── NotificationBell.jsx
│   │   │   ├── FarmerProducts.jsx
│   │   │   ├── FarmerOrders.jsx
│   │   │   └── BuyerOrders.jsx
│   │   ├── context/
│   │   │   ├── AuthContext.jsx
│   │   │   └── SocketContext.jsx
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Marketplace.jsx
│   │   │   └── Dashboard.jsx
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env.example
│   ├── vite.config.js
│   └── package.json
├── DEPLOYMENT.md
├── PROJECT_STATUS.md
└── README.md
```

---

## 📡 API Documentation

### Authentication Endpoints

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/v1/auth/register` | Public | Register new user (Farmer/Buyer) |
| POST | `/api/v1/auth/login` | Public | Login user, returns JWT token |
| GET | `/api/v1/auth/me` | Private | Get authenticated user profile |

### Product Endpoints

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/v1/products` | Public | Get all products (with filters) |
| GET | `/api/v1/products/:id` | Public | Get single product |
| POST | `/api/v1/products` | Farmer | Create new product |
| PUT | `/api/v1/products/:id` | Farmer (Owner) | Update product |
| DELETE | `/api/v1/products/:id` | Farmer (Owner) | Delete product |
| GET | `/api/v1/products/farmer/my-products` | Farmer | Get farmer's products |

### Order Endpoints

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/v1/orders` | Buyer | Create new order |
| GET | `/api/v1/orders/buyer` | Buyer | Get buyer's orders |
| GET | `/api/v1/orders/farmer` | Farmer | Get farmer's received orders |
| PUT | `/api/v1/orders/:id/status` | Farmer | Update order status |
| PUT | `/api/v1/orders/:id/cancel` | Buyer/Farmer | Cancel order |

### Market Price Endpoints

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/v1/market-prices` | Public | Get market prices |
| POST | `/api/v1/market-prices` | Private | Create market price |

### Real-Time Events (Socket.io)

| Event | Trigger | Description |
|-------|---------|-------------|
| `newOrder` | Order created | Notify farmer of new order |
| `orderStatusUpdated` | Status changed | Notify buyer of status change |
| `orderCancelled` | Order cancelled | Notify relevant party |

---

## 🗄️ Database Models

### User Model
```javascript
{
  name: String,           // Required, 2-50 chars
  email: String,          // Required, unique
  password: String,       // Required, hashed with bcrypt
  role: String,           // Enum: 'Farmer' or 'Buyer'
  location: String,       // Required
  phone: String,          // Optional
  isActive: Boolean,      // Default: true
  createdAt: Date,        // Auto-generated
  updatedAt: Date         // Auto-generated
}
```

### Product Model
```javascript
{
  name: String,           // Required
  description: String,    // Required
  category: String,       // Required
  price: Number,          // Required, min: 0
  quantity: Number,       // Required, min: 0
  unit: String,           // Required (kg, liters, pieces)
  farmer: ObjectId,       // Ref: User
  inStock: Boolean,       // Auto-updated based on quantity
  images: [String],       // Optional URLs
  location: String,       // Required
  createdAt: Date,
  updatedAt: Date
}
```

### Order Model
```javascript
{
  buyer: ObjectId,        // Ref: User
  farmer: ObjectId,       // Ref: User
  product: ObjectId,      // Ref: Product
  quantity: Number,       // Required, min: 1
  totalPrice: Number,     // Auto-calculated
  status: String,         // Enum: pending, confirmed, processing, shipped, delivered, cancelled
  deliveryAddress: String,// Required
  deliveredAt: Date,      // Auto-set when delivered
  createdAt: Date,
  updatedAt: Date
}
```

### MarketPrice Model
```javascript
{
  productCategory: String,// Required
  averagePrice: Number,   // Required
  region: String,         // Required
  lastUpdated: Date,      // Auto-generated
}
```

---

## ✅ All Phases Complete

| Phase | Status | Description |
|-------|--------|-------------|
| Phase 1 | ✅ Complete | Backend Foundation & Authentication |
| Phase 2 | ✅ Complete | Product CRUD & Market Pricing |
| Phase 3 | ✅ Complete | Orders & Real-Time (Socket.io) |
| Phase 4 | ✅ Complete | Backend Testing (27/27 passing) |
| Phase 5 | ✅ Complete | React Frontend & Auth UI |
| Phase 6 | ✅ Complete | Marketplace UI & Real-Time Features |
| Phase 7 | ✅ Complete | Testing & Deployment Preparation |

[View deployment guide →](DEPLOYMENT.md)

---

## 🚀 Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for comprehensive deployment instructions covering:
- Render (Free tier available)
- Railway
- VPS (DigitalOcean, AWS)
- MongoDB Atlas setup
- Environment configuration
- SSL/HTTPS setup
- Monitoring and maintenance

---

## 🎥 Features Showcase

### For Farmers:
- Create and manage product listings
- View and update incoming orders
- Receive real-time order notifications
- Track inventory levels
- View market prices

### For Buyers:
- Browse marketplace with search/filter
- Place orders directly from product listings
- Track order status in real-time
- View order history
- Receive status update notifications

### Real-Time Features:
- 🔔 Instant notifications for new orders
- 🔔 Order status change alerts
- 🔔 Live updates without page refresh

---

## 🔒 Security Features

- ✅ Password hashing with bcrypt (10 salt rounds)
- ✅ JWT token-based authentication (30-day expiration)
- ✅ Protected routes with middleware
- ✅ Role-based access control
- ✅ CORS configuration
- ✅ Input validation on all endpoints
- ✅ MongoDB injection protection

---

## 🧪 Testing Results

**All 27 Tests Passing ✅**

```
Test Suites: 3 passed, 3 total
Tests:       27 passed, 27 total
Time:        14.007 s

✅ Auth Unit Tests (7 tests)
✅ Product Integration Tests (10 tests)
✅ Order Integration Tests (10 tests)
```

---

## 📚 Documentation

- [Backend API Documentation](backend/README.md)
- [Frontend Documentation](frontend/README.md)
- [Deployment Guide](DEPLOYMENT.md)
- [Project Status](PROJECT_STATUS.md)

---

## 🤝 Contributing

This is a capstone project for educational purposes. However, feedback and suggestions are welcome!

---

## 📄 License

This project is developed as part of the PLP MERN Stack Development course.

---

## 👨‍💻 Developer

**Brandon**  
PLP MERN Stack Development Program  
GitHub: [@Brandon05-dev](https://github.com/PLP-MERN-Stack-Development/mern-final-project-Brandon05-dev)

---

## 🙏 Acknowledgments

- PLP Academy for the comprehensive MERN stack curriculum
- MongoDB for the excellent database documentation
- The React and Express.js communities

---

**🌾 AgriSmart - Empowering Farmers, Connecting Communities**
 