const express = require('express');
const {
  createOrder,
  getBuyerOrders,
  getFarmerOrders,
  getOrderById,
  updateOrderStatus,
  cancelOrder
} = require('../controllers/order');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// All routes are protected
router.use(protect);

// Buyer routes
router.post('/', authorize('Buyer'), createOrder);
router.get('/buyer', authorize('Buyer'), getBuyerOrders);

// Farmer routes
router.get('/farmer', authorize('Farmer'), getFarmerOrders);
router.put('/:id/status', authorize('Farmer'), updateOrderStatus);

// Shared routes (Buyer or Farmer)
router.get('/:id', getOrderById);
router.put('/:id/cancel', cancelOrder);

module.exports = router;
