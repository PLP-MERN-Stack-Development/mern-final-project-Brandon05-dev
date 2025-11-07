const express = require('express');
const {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getMyProducts
} = require('../controllers/product');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Protected routes - Farmer only (must come before :id routes)
router.post('/', protect, authorize('Farmer'), createProduct);
router.get('/farmer/my-products', protect, authorize('Farmer'), getMyProducts);

// Public routes
router.get('/', getAllProducts);
router.get('/:id', getProductById);

// Protected routes - Farmer only (for specific product)
router.put('/:id', protect, authorize('Farmer'), updateProduct);
router.delete('/:id', protect, authorize('Farmer'), deleteProduct);

module.exports = router;
