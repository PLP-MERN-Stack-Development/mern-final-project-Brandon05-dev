import React, { createContext, useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

export const AuthContext = createContext()

const BACKEND = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'
const api = axios.create({ baseURL: BACKEND })

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(() => localStorage.getItem('agrismart_token'))
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`
      // Optionally fetch user profile
      api.get('/api/v1/auth/me')
        .then(res => setUser(res.data.data.user))
        .catch(() => {
          setUser(null)
          setToken(null)
          localStorage.removeItem('agrismart_token')
        })
    } else {
      delete api.defaults.headers.common['Authorization']
    }
  }, [token])

  const register = async (payload) => {
    setLoading(true)
    try {
      const res = await api.post('/api/v1/auth/register', payload)
      const tok = res.data.data.token
      setToken(tok)
      localStorage.setItem('agrismart_token', tok)
      setUser(res.data.data.user)
      navigate('/dashboard')
    } catch (err) {
      throw err
    } finally {
      setLoading(false)
    }
  }

  const login = async ({ email, password }) => {
    setLoading(true)
    try {
      const res = await api.post('/api/v1/auth/login', { email, password })
      const tok = res.data.data.token
      setToken(tok)
      localStorage.setItem('agrismart_token', tok)
      setUser(res.data.data.user)
      navigate('/dashboard')
    } catch (err) {
      throw err
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('agrismart_token')
    navigate('/login')
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, register, login, logout, axiosInstance: api }}>
      {children}
    </AuthContext.Provider>
  )
}
