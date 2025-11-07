const express = require('express');
const {
  getAllMarketPrices,
  getMarketPriceByCrop,
  createOrUpdateMarketPrice,
  deleteMarketPrice
} = require('../controllers/marketPrice');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.get('/', getAllMarketPrices);
router.get('/:cropName', getMarketPriceByCrop);

// Protected routes
router.post('/', protect, createOrUpdateMarketPrice);
router.delete('/:id', protect, deleteMarketPrice);

module.exports = router;
