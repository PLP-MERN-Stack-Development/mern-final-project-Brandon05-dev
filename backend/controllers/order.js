const Order = require('../models/Order');
const Product = require('../models/Product');

/**
 * Create a new order
 * @route POST /api/v1/orders
 * @access Private (Buyer only)
 */
const createOrder = async (req, res) => {
  try {
    const { productId, quantity, deliveryAddress, paymentMethod, notes } = req.body;

    // Validate required fields
    if (!productId || !quantity || !deliveryAddress) {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide productId, quantity, and deliveryAddress'
      });
    }

    // Verify user is a Buyer
    if (req.user.role !== 'Buyer') {
      return res.status(403).json({
        status: 'error',
        message: 'Only buyers can create orders'
      });
    }

    // Find product
    const product = await Product.findById(productId).populate('farmer');

    if (!product) {
      return res.status(404).json({
        status: 'error',
        message: 'Product not found'
      });
    }

    // Check product availability
    if (!product.inStock || product.quantity < quantity) {
      return res.status(400).json({
        status: 'error',
        message: 'Insufficient product quantity available'
      });
    }

    // Calculate total price
    const totalPrice = product.price * quantity;

    // Create order
    const order = await Order.create({
      buyer: req.user._id,
      product: productId,
      farmer: product.farmer._id,
      quantity,
      totalPrice,
      deliveryAddress,
      paymentMethod: paymentMethod || 'cash',
      notes
    });

    // Update product quantity
    product.quantity -= quantity;
    if (product.quantity === 0) {
      product.inStock = false;
    }
    await product.save();

    // Populate order details
    await order.populate([
      { path: 'buyer', select: 'name email phone location' },
      { path: 'product', select: 'name price unit image' },
      { path: 'farmer', select: 'name email phone location' }
    ]);

    // Emit real-time event to farmer
    const io = req.app.get('io');
    io.emit('newOrder', {
      farmerId: product.farmer._id.toString(),
      order: {
        id: order._id,
        buyerName: order.buyer.name,
        productName: order.product.name,
        quantity: order.quantity,
        totalPrice: order.totalPrice,
        status: order.status
      }
    });

    res.status(201).json({
      status: 'success',
      message: 'Order created successfully',
      data: {
        order
      }
    });
  } catch (error) {
    console.error('Create order error:', error);

    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors: messages
      });
    }

    res.status(500).json({
      status: 'error',
      message: 'Server error while creating order'
    });
  }
};

/**
 * Get all orders for current buyer
 * @route GET /api/v1/orders/buyer
 * @access Private (Buyer only)
 */
const getBuyerOrders = async (req, res) => {
  try {
    if (req.user.role !== 'Buyer') {
      return res.status(403).json({
        status: 'error',
        message: 'Only buyers can access this route'
      });
    }

    const { status } = req.query;
    const query = { buyer: req.user._id };
    
    if (status) {
      query.status = status;
    }

    const orders = await Order.find(query)
      .populate('farmer', 'name email phone location')
      .populate('product', 'name price unit image')
      .sort({ createdAt: -1 });

    res.status(200).json({
      status: 'success',
      results: orders.length,
      data: {
        orders
      }
    });
  } catch (error) {
    console.error('Get buyer orders error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while fetching orders'
    });
  }
};

/**
 * Get all orders for current farmer
 * @route GET /api/v1/orders/farmer
 * @access Private (Farmer only)
 */
const getFarmerOrders = async (req, res) => {
  try {
    if (req.user.role !== 'Farmer') {
      return res.status(403).json({
        status: 'error',
        message: 'Only farmers can access this route'
      });
    }

    const { status } = req.query;
    const query = { farmer: req.user._id };
    
    if (status) {
      query.status = status;
    }

    const orders = await Order.find(query)
      .populate('buyer', 'name email phone location')
      .populate('product', 'name price unit image')
      .sort({ createdAt: -1 });

    res.status(200).json({
      status: 'success',
      results: orders.length,
      data: {
        orders
      }
    });
  } catch (error) {
    console.error('Get farmer orders error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while fetching orders'
    });
  }
};

/**
 * Get single order by ID
 * @route GET /api/v1/orders/:id
 * @access Private (Order participants only)
 */
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('buyer', 'name email phone location')
      .populate('farmer', 'name email phone location')
      .populate('product', 'name price unit image description');

    if (!order) {
      return res.status(404).json({
        status: 'error',
        message: 'Order not found'
      });
    }

    // Check if user is authorized to view this order
    if (
      order.buyer._id.toString() !== req.user._id.toString() &&
      order.farmer._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        status: 'error',
        message: 'You are not authorized to view this order'
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        order
      }
    });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while fetching order'
    });
  }
};

/**
 * Update order status
 * @route PUT /api/v1/orders/:id/status
 * @access Private (Farmer only)
 */
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide status'
      });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        status: 'error',
        message: 'Order not found'
      });
    }

    // Check if user is the farmer for this order
    if (order.farmer.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        status: 'error',
        message: 'Only the farmer can update order status'
      });
    }

    // Update status
    const oldStatus = order.status;
    order.status = status;
    await order.save();

    // Populate for response
    await order.populate([
      { path: 'buyer', select: 'name email phone location' },
      { path: 'product', select: 'name price unit image' },
      { path: 'farmer', select: 'name email phone location' }
    ]);

    // Emit real-time event to buyer
    const io = req.app.get('io');
    io.emit('orderStatusUpdated', {
      buyerId: order.buyer._id.toString(),
      order: {
        id: order._id,
        productName: order.product.name,
        oldStatus,
        newStatus: status,
        totalPrice: order.totalPrice
      }
    });

    res.status(200).json({
      status: 'success',
      message: 'Order status updated successfully',
      data: {
        order
      }
    });
  } catch (error) {
    console.error('Update order status error:', error);

    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors: messages
      });
    }

    res.status(500).json({
      status: 'error',
      message: 'Server error while updating order status'
    });
  }
};

/**
 * Cancel order
 * @route PUT /api/v1/orders/:id/cancel
 * @access Private (Buyer or Farmer)
 */
const cancelOrder = async (req, res) => {
  try {
    const { reason } = req.body;

    const order = await Order.findById(req.params.id).populate('product');

    if (!order) {
      return res.status(404).json({
        status: 'error',
        message: 'Order not found'
      });
    }

    // Check if user is authorized to cancel
    const isBuyer = order.buyer.toString() === req.user._id.toString();
    const isFarmer = order.farmer.toString() === req.user._id.toString();

    if (!isBuyer && !isFarmer) {
      return res.status(403).json({
        status: 'error',
        message: 'You are not authorized to cancel this order'
      });
    }

    // Cannot cancel if already delivered
    if (order.status === 'delivered') {
      return res.status(400).json({
        status: 'error',
        message: 'Cannot cancel delivered orders'
      });
    }

    // Restore product quantity
    const product = await Product.findById(order.product._id);
    if (product) {
      product.quantity += order.quantity;
      product.inStock = true;
      await product.save();
    }

    // Update order
    order.status = 'cancelled';
    order.cancelledBy = req.user._id;
    order.cancelReason = reason;
    await order.save();

    await order.populate([
      { path: 'buyer', select: 'name email phone location' },
      { path: 'farmer', select: 'name email phone location' }
    ]);

    // Emit real-time event
    const io = req.app.get('io');
    const notifyId = isBuyer ? order.farmer._id.toString() : order.buyer._id.toString();
    io.emit('orderCancelled', {
      userId: notifyId,
      order: {
        id: order._id,
        cancelledBy: req.user.role,
        reason
      }
    });

    res.status(200).json({
      status: 'success',
      message: 'Order cancelled successfully',
      data: {
        order
      }
    });
  } catch (error) {
    console.error('Cancel order error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while cancelling order'
    });
  }
};

module.exports = {
  createOrder,
  getBuyerOrders,
  getFarmerOrders,
  getOrderById,
  updateOrderStatus,
  cancelOrder
};
