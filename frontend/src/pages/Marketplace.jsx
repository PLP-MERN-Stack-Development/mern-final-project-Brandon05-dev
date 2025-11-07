import React, { useState, useEffect, useContext } from 'react'
import { AuthContext } from '../context/AuthContext'

export default function Marketplace() {
  const { axiosInstance, user } = useContext(AuthContext)
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [orderForm, setOrderForm] = useState({
    quantity: '',
    deliveryAddress: ''
  })

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const response = await axiosInstance.get('/api/v1/products')
      setProducts(response.data.data)
      setError('')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load products')
    } finally {
      setLoading(false)
    }
  }

  const handleOrderClick = (product) => {
    if (!user) {
      alert('Please login to place an order')
      return
    }
    if (user.role !== 'Buyer') {
      alert('Only buyers can place orders')
      return
    }
    setSelectedProduct(product)
    setOrderForm({
      quantity: '',
      deliveryAddress: user.location || ''
    })
  }

  const handleOrderSubmit = async (e) => {
    e.preventDefault()
    setError('')

    try {
      await axiosInstance.post('/api/v1/orders', {
        product: selectedProduct._id,
        quantity: parseFloat(orderForm.quantity),
        deliveryAddress: orderForm.deliveryAddress
      })
      
      alert('Order placed successfully!')
      setSelectedProduct(null)
      setOrderForm({ quantity: '', deliveryAddress: '' })
      await fetchProducts()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place order')
    }
  }

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading marketplace...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Marketplace</h1>
        <p className="text-gray-600 mt-2">Browse fresh products from local farmers</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-300 text-red-800 px-4 py-3 rounded" role="alert">
          {error}
        </div>
      )}

      {products.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No products available at the moment.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map(product => (
            <div key={product._id} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition">
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-xl font-semibold text-gray-900">{product.name}</h3>
                <span className={`px-2 py-1 text-xs rounded ${
                  product.inStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {product.inStock ? 'Available' : 'Out of Stock'}
                </span>
              </div>

              <p className="text-gray-600 mb-4 text-sm">{product.description}</p>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-700">Category:</span>
                  <span className="font-medium text-gray-900">{product.category}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-700">Available:</span>
                  <span className="font-medium text-gray-900">{product.quantity} {product.unit}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-700">Price:</span>
                  <span className="font-semibold text-green-600 text-lg">
                    ${product.pricePerUnit}/{product.unit}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-700">Location:</span>
                  <span className="font-medium text-gray-900">{product.location}</span>
                </div>
                {product.farmer && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-700">Farmer:</span>
                    <span className="font-medium text-gray-900">{product.farmer.name}</span>
                  </div>
                )}
                {product.harvestDate && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-700">Harvested:</span>
                    <span className="font-medium text-gray-900">
                      {new Date(product.harvestDate).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>

              {product.inStock && user?.role === 'Buyer' && (
                <button
                  onClick={() => handleOrderClick(product)}
                  className="w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
                >
                  Place Order
                </button>
              )}
              
              {!user && product.inStock && (
                <button
                  onClick={() => handleOrderClick(product)}
                  className="w-full bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 transition"
                >
                  Login to Order
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Order Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold mb-4">Place Order</h2>
            <div className="mb-4 p-4 bg-gray-50 rounded">
              <h3 className="font-semibold text-gray-900">{selectedProduct.name}</h3>
              <p className="text-sm text-gray-600">
                ${selectedProduct.pricePerUnit}/{selectedProduct.unit}
              </p>
              <p className="text-sm text-gray-600">
                Available: {selectedProduct.quantity} {selectedProduct.unit}
              </p>
            </div>

            <form onSubmit={handleOrderSubmit} className="space-y-4">
              <div>
                <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
                  Quantity ({selectedProduct.unit}) *
                </label>
                <input
                  type="number"
                  id="quantity"
                  value={orderForm.quantity}
                  onChange={(e) => setOrderForm({ ...orderForm, quantity: e.target.value })}
                  required
                  min="0.01"
                  max={selectedProduct.quantity}
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label htmlFor="deliveryAddress" className="block text-sm font-medium text-gray-700 mb-1">
                  Delivery Address *
                </label>
                <textarea
                  id="deliveryAddress"
                  value={orderForm.deliveryAddress}
                  onChange={(e) => setOrderForm({ ...orderForm, deliveryAddress: e.target.value })}
                  required
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Enter delivery address"
                />
              </div>

              <div className="p-4 bg-blue-50 rounded">
                <p className="text-sm font-semibold text-gray-900">
                  Total: ${(orderForm.quantity * selectedProduct.pricePerUnit || 0).toFixed(2)}
                </p>
              </div>

              <div className="flex space-x-3">
                <button
                  type="submit"
                  className="flex-1 bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition"
                >
                  Confirm Order
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedProduct(null)}
                  className="flex-1 bg-gray-300 text-gray-700 px-6 py-2 rounded hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
