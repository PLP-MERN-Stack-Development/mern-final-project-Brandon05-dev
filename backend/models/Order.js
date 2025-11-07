const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Order must have a buyer']
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: [true, 'Order must have a product']
    },
    farmer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Order must have a farmer']
    },
    quantity: {
      type: Number,
      required: [true, 'Order quantity is required'],
      min: [1, 'Quantity must be at least 1']
    },
    totalPrice: {
      type: Number,
      required: [true, 'Total price is required'],
      min: [0, 'Total price cannot be negative']
    },
    status: {
      type: String,
      enum: {
        values: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
        message: 'Invalid order status'
      },
      default: 'pending'
    },
    deliveryAddress: {
      type: String,
      required: [true, 'Delivery address is required'],
      trim: true
    },
    paymentStatus: {
      type: String,
      enum: {
        values: ['pending', 'paid', 'failed', 'refunded'],
        message: 'Invalid payment status'
      },
      default: 'pending'
    },
    paymentMethod: {
      type: String,
      enum: ['cash', 'mpesa', 'bank_transfer', 'card'],
      default: 'cash'
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [500, 'Notes cannot exceed 500 characters']
    },
    cancelledBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    cancelReason: {
      type: String,
      trim: true
    },
    deliveredAt: {
      type: Date
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Indexes for faster queries
orderSchema.index({ buyer: 1, createdAt: -1 });
orderSchema.index({ farmer: 1, status: 1, createdAt: -1 });
orderSchema.index({ product: 1 });
orderSchema.index({ status: 1 });

// Virtual for order age
orderSchema.virtual('orderAge').get(function() {
  return Math.floor((Date.now() - this.createdAt) / (1000 * 60 * 60 * 24)); // days
});

// Middleware to update deliveredAt when status changes to delivered
orderSchema.pre('save', function(next) {
  if (this.isModified('status') && this.status === 'delivered' && !this.deliveredAt) {
    this.deliveredAt = Date.now();
  }
  next();
});

// Static method to get pending orders for a farmer
orderSchema.statics.findPendingByFarmer = function(farmerId) {
  return this.find({ farmer: farmerId, status: 'pending' })
    .populate('buyer', 'name email phone location')
    .populate('product', 'name price unit')
    .sort({ createdAt: -1 });
};

// Static method to get all orders for a farmer
orderSchema.statics.findByFarmer = function(farmerId) {
  return this.find({ farmer: farmerId })
    .populate('buyer', 'name email phone location')
    .populate('product', 'name price unit image')
    .sort({ createdAt: -1 });
};

// Static method to get orders for a buyer
orderSchema.statics.findByBuyer = function(buyerId) {
  return this.find({ buyer: buyerId })
    .populate('farmer', 'name email phone location')
    .populate('product', 'name price unit image')
    .sort({ createdAt: -1 });
};

module.exports = mongoose.model('Order', orderSchema);
