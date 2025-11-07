import React, { createContext, useContext, useEffect, useState } from 'react'
import { io } from 'socket.io-client'
import { AuthContext } from './AuthContext'

export const SocketContext = createContext()

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'

export const SocketProvider = ({ children }) => {
  const { user, token } = useContext(AuthContext)
  const [socket, setSocket] = useState(null)
  const [notifications, setNotifications] = useState([])
  const [connected, setConnected] = useState(false)

  useEffect(() => {
    // Only connect if user is authenticated
    if (user && token) {
      const newSocket = io(BACKEND_URL, {
        auth: { token }
      })

      newSocket.on('connect', () => {
        console.log('✅ Socket.io connected')
        setConnected(true)
      })

      newSocket.on('disconnect', () => {
        console.log('❌ Socket.io disconnected')
        setConnected(false)
      })

      // Listen for new orders (Farmers only)
      newSocket.on('newOrder', (data) => {
        console.log('🔔 New order received:', data)
        addNotification({
          type: 'newOrder',
          message: `New order from ${data.buyer.name} for ${data.product.name}`,
          data,
          timestamp: new Date()
        })
      })

      // Listen for order status updates (Buyers)
      newSocket.on('orderStatusUpdated', (data) => {
        console.log('🔔 Order status updated:', data)
        addNotification({
          type: 'orderStatusUpdated',
          message: `Order #${data.orderId.slice(-8)} status changed to ${data.status}`,
          data,
          timestamp: new Date()
        })
      })

      // Listen for order cancellations
      newSocket.on('orderCancelled', (data) => {
        console.log('🔔 Order cancelled:', data)
        addNotification({
          type: 'orderCancelled',
          message: `Order #${data.orderId.slice(-8)} has been cancelled`,
          data,
          timestamp: new Date()
        })
      })

      setSocket(newSocket)

      // Cleanup on unmount or user change
      return () => {
        newSocket.close()
        setSocket(null)
        setConnected(false)
      }
    }
  }, [user, token])

  const addNotification = (notification) => {
    setNotifications(prev => [notification, ...prev].slice(0, 10)) // Keep last 10 notifications
  }

  const clearNotifications = () => {
    setNotifications([])
  }

  const dismissNotification = (index) => {
    setNotifications(prev => prev.filter((_, i) => i !== index))
  }

  return (
    <SocketContext.Provider
      value={{
        socket,
        connected,
        notifications,
        clearNotifications,
        dismissNotification
      }}
    >
      {children}
    </SocketContext.Provider>
  )
}
