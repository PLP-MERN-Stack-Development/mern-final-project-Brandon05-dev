import React, { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import FarmerProducts from '../components/FarmerProducts'
import FarmerOrders from '../components/FarmerOrders'
import BuyerOrders from '../components/BuyerOrders'

export default function Dashboard() {
  const { user } = useContext(AuthContext)

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h1 className="text-3xl font-bold mb-2">
          {user?.role === 'Farmer' ? 'Farmer Dashboard' : 'Buyer Dashboard'}
        </h1>
        <p className="text-gray-600">
          Welcome back, <span className="font-semibold">{user?.name}</span>!
        </p>
      </div>

      {user?.role === 'Farmer' ? (
        <div className="space-y-8">
          <div className="bg-white rounded-lg shadow p-6">
            <FarmerProducts />
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <FarmerOrders />
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow p-6">
          <BuyerOrders />
        </div>
      )}
    </div>
  )
}
