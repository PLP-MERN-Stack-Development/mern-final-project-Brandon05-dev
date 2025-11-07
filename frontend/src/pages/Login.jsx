import React, { useState, useContext } from 'react'
import { AuthContext } from '../context/AuthContext'

export default function Login() {
  const { login, loading } = useContext(AuthContext)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    if (!email || !password) {
      setError('Please fill out both email and password')
      return
    }

    try {
      await login({ email, password })
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed')
    }
  }

  return (
    <div className="max-w-md mx-auto mt-12">
      <h1 className="text-2xl font-semibold mb-4">Login</h1>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow">
        {error && <div role="alert" className="mb-4 text-red-600">{error}</div>}

        <label className="block mb-2">
          <span className="text-sm">Email</span>
          <input
            type="email"
            name="email"
            aria-label="Email"
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:ring focus:ring-green-200 p-2"
          />
        </label>

        <label className="block mb-2">
          <span className="text-sm">Password</span>
          <input
            type="password"
            name="password"
            aria-label="Password"
            required
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:ring focus:ring-green-200 p-2"
          />
        </label>

        <button
          type="submit"
          disabled={loading}
          className="mt-4 w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 focus:outline-none"
        >
          {loading ? 'Logging in…' : 'Login'}
        </button>
      </form>
    </div>
  )
}
