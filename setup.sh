#!/bin/bash

# AgriSmart Setup Script
# This script automates the setup process for both backend and frontend

echo "🌾 AgriSmart Setup Script"
echo "=========================="
echo ""

# Check for Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js v18+ first."
    echo "   Download from: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js $(node -v) detected"

# Check for MongoDB
if ! command -v mongod &> /dev/null; then
    echo "⚠️  MongoDB not found locally. Make sure MongoDB is running or use MongoDB Atlas."
else
    echo "✅ MongoDB detected"
fi

echo ""
echo "📦 Installing Dependencies..."
echo ""

# Setup Backend
echo "🔧 Setting up backend..."
cd backend || exit
npm install
if [ $? -eq 0 ]; then
    echo "✅ Backend dependencies installed"
else
    echo "❌ Backend installation failed"
    exit 1
fi

# Create .env if it doesn't exist
if [ ! -f .env ]; then
    cp .env.example .env
    echo "✅ Created backend/.env from template"
    echo "⚠️  Please update backend/.env with your MongoDB URI and JWT secret"
else
    echo "ℹ️  backend/.env already exists"
fi

cd ..

echo ""
echo "🎨 Setting up frontend..."
cd frontend || exit
npm install
if [ $? -eq 0 ]; then
    echo "✅ Frontend dependencies installed"
else
    echo "❌ Frontend installation failed"
    exit 1
fi

# Create .env if it doesn't exist
if [ ! -f .env ]; then
    cp .env.example .env
    echo "✅ Created frontend/.env from template"
else
    echo "ℹ️  frontend/.env already exists"
fi

cd ..

echo ""
echo "=========================="
echo "✅ Setup Complete!"
echo ""
echo "Next steps:"
echo "1. Edit backend/.env with your MongoDB URI and JWT secret"
echo "2. Edit frontend/.env if needed (default: http://localhost:5000)"
echo ""
echo "To start the application:"
echo ""
echo "Terminal 1 (Backend):"
echo "  cd backend"
echo "  node server.js"
echo ""
echo "Terminal 2 (Frontend):"
echo "  cd frontend"
echo "  npm run dev"
echo ""
echo "Then visit: http://localhost:5173"
echo ""
echo "🌾 Happy coding!"
