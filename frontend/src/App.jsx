import React, { useContext } from 'react'
import { Routes, Route, Navigate, Link } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Marketplace from './pages/Marketplace'
import Dashboard from './pages/Dashboard'
import ProtectedRoute from './components/ProtectedRoute'
import NotificationBell from './components/NotificationBell'
import { AuthContext } from './context/AuthContext'

export default function App() {
  const { user, logout } = useContext(AuthContext)

  return (
    <div className="min-h-screen">
      <header className="bg-white shadow">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="text-xl font-bold text-green-700">
            🌾 AgriSmart
          </Link>
          <nav className="flex items-center space-x-4">
            <Link 
              to="/marketplace" 
              className="text-sm text-gray-600 hover:text-gray-900 transition"
            >
              Marketplace
            </Link>
            {user ? (
              <>
                <Link 
                  to="/dashboard" 
                  className="text-sm text-gray-600 hover:text-gray-900 transition"
                >
                  Dashboard
                </Link>
                <NotificationBell />
                <div className="flex items-center space-x-3 border-l border-gray-300 pl-4 ml-2">
                  <div className="text-sm">
                    <div className="font-semibold text-gray-900">{user.name}</div>
                    <div className="text-xs text-gray-500 capitalize">{user.role}</div>
                  </div>
                  <button
                    onClick={logout}
                    className="text-sm bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition"
                    aria-label="Logout"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="text-sm text-gray-600 hover:text-gray-900 transition"
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="text-sm bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition"
                >
                  Register
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-4">
        <Routes>
          <Route path="/" element={<Navigate to="/marketplace" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="*" element={
            <div className="py-20 text-center">
              <h2 className="text-2xl font-semibold mb-2">404 - Page Not Found</h2>
              <Link to="/marketplace" className="text-green-600 hover:underline">
                Go to Marketplace
              </Link>
            </div>
          } />
        </Routes>
      </main>

      <footer className="mt-12 py-6 bg-gray-100 text-center text-sm text-gray-600">
        <p>© 2025 AgriSmart - Connecting Farmers and Buyers</p>
      </footer>
    </div>
  )
}
