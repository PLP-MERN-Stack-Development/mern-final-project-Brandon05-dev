import React, { useState, useEffect, useContext } from 'react'
import { AuthContext } from '../context/AuthContext'

export default function BuyerOrders() {
  const { axiosInstance } = useContext(AuthContext)
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchMyOrders()
  }, [])

  const fetchMyOrders = async () => {
    try {
      setLoading(true)
      const response = await axiosInstance.get('/api/v1/orders/buyer/my-orders')
      setOrders(response.data.data)
      setError('')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load orders')
    } finally {
      setLoading(false)
    }
  }

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return

    try {
      await axiosInstance.put(`/api/v1/orders/${orderId}/cancel`)
      await fetchMyOrders()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to cancel order')
    }
  }

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      processing: 'bg-purple-100 text-purple-800',
      shipped: 'bg-indigo-100 text-indigo-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading your orders...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">My Orders</h2>

      {error && (
        <div className="bg-red-50 border border-red-300 text-red-800 px-4 py-3 rounded" role="alert">
          {error}
        </div>
      )}

      {orders.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500">You haven't placed any orders yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <div key={order._id} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-gray-900">
                    Order #{order._id.slice(-8).toUpperCase()}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Placed on {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <span className={`px-3 py-1 text-sm font-medium rounded capitalize ${getStatusColor(order.status)}`}>
                  {order.status}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm font-medium text-gray-700">Product</p>
                  <p className="text-gray-900">
                    {order.product?.name || 'Product not available'}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Farmer</p>
                  <p className="text-gray-900">
                    {order.farmer?.name || 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Quantity</p>
                  <p className="text-gray-900">
                    {order.quantity} {order.product?.unit || 'units'}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Total Price</p>
                  <p className="text-gray-900 font-semibold">
                    ${order.totalPrice?.toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Delivery Address</p>
                  <p className="text-gray-900">{order.deliveryAddress}</p>
                </div>
                {order.deliveredAt && (
                  <div>
                    <p className="text-sm font-medium text-gray-700">Delivered On</p>
                    <p className="text-gray-900">
                      {new Date(order.deliveredAt).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>

              {order.status === 'pending' && (
                <button
                  onClick={() => handleCancelOrder(order._id)}
                  className="bg-red-600 text-white px-4 py-2 text-sm rounded hover:bg-red-700 transition"
                >
                  Cancel Order
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
