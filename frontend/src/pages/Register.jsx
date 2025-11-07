import React, { useState, useContext } from 'react'
import { AuthContext } from '../context/AuthContext'

export default function Register() {
  const { register, loading } = useContext(AuthContext)
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'Buyer', location: '', phone: '' })
  const [error, setError] = useState(null)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    // Basic client-side validation
    if (!form.name || !form.email || !form.password || !form.role || !form.location) {
      setError('Please fill out all required fields')
      return
    }

    try {
      await register(form)
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed')
    }
  }

  return (
    <div className="max-w-lg mx-auto mt-8">
      <h1 className="text-2xl font-semibold mb-4">Register</h1>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow">
        {error && <div role="alert" className="mb-4 text-red-600">{error}</div>}

        <label className="block mb-2">
          <span className="text-sm">Full name</span>
          <input name="name" value={form.name} onChange={handleChange} required className="mt-1 block w-full rounded border-gray-300 p-2" />
        </label>

        <label className="block mb-2">
          <span className="text-sm">Email</span>
          <input type="email" name="email" value={form.email} onChange={handleChange} required className="mt-1 block w-full rounded border-gray-300 p-2" />
        </label>

        <label className="block mb-2">
          <span className="text-sm">Password</span>
          <input type="password" name="password" value={form.password} onChange={handleChange} required minLength="6" className="mt-1 block w-full rounded border-gray-300 p-2" />
        </label>

        <label className="block mb-2">
          <span className="text-sm">Role</span>
          <select name="role" value={form.role} onChange={handleChange} className="mt-1 block w-full rounded border-gray-300 p-2">
            <option value="Buyer">Buyer</option>
            <option value="Farmer">Farmer</option>
          </select>
        </label>

        <label className="block mb-2">
          <span className="text-sm">Location</span>
          <input name="location" value={form.location} onChange={handleChange} required className="mt-1 block w-full rounded border-gray-300 p-2" />
        </label>

        <label className="block mb-2">
          <span className="text-sm">Phone (optional)</span>
          <input name="phone" value={form.phone} onChange={handleChange} className="mt-1 block w-full rounded border-gray-300 p-2" />
        </label>

        <button type="submit" disabled={loading} className="mt-4 w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">
          {loading ? 'Registering…' : 'Register'}
        </button>
      </form>
    </div>
  )
}
