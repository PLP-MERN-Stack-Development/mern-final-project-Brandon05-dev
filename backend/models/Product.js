const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    farmer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Product must belong to a farmer']
    },
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      minlength: [2, 'Product name must be at least 2 characters'],
      maxlength: [100, 'Product name cannot exceed 100 characters']
    },
    description: {
      type: String,
      required: [true, 'Product description is required'],
      trim: true,
      minlength: [10, 'Description must be at least 10 characters'],
      maxlength: [1000, 'Description cannot exceed 1000 characters']
    },
    category: {
      type: String,
      required: [true, 'Product category is required'],
      enum: {
        values: [
          'Vegetables',
          'Fruits',
          'Grains',
          'Legumes',
          'Dairy',
          'Poultry',
          'Livestock',
          'Other'
        ],
        message: 'Please select a valid category'
      }
    },
    price: {
      type: Number,
      required: [true, 'Product price is required'],
      min: [0, 'Price cannot be negative'],
      validate: {
        validator: function(value) {
          return value > 0;
        },
        message: 'Price must be greater than 0'
      }
    },
    unit: {
      type: String,
      required: [true, 'Product unit is required'],
      enum: {
        values: ['kg', 'g', 'lb', 'piece', 'dozen', 'liter', 'bag', 'crate'],
        message: 'Please select a valid unit'
      },
      default: 'kg'
    },
    quantity: {
      type: Number,
      required: [true, 'Product quantity is required'],
      min: [0, 'Quantity cannot be negative'],
      default: 0
    },
    image: {
      type: String,
      default: 'https://via.placeholder.com/400x300?text=Product+Image'
    },
    location: {
      type: String,
      required: [true, 'Product location is required'],
      trim: true
    },
    inStock: {
      type: Boolean,
      default: true
    },
    featured: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Index for faster queries
productSchema.index({ farmer: 1, createdAt: -1 });
productSchema.index({ category: 1, inStock: 1 });
productSchema.index({ name: 'text', description: 'text' });

// Virtual field to check if product is available
productSchema.virtual('isAvailable').get(function() {
  return this.inStock && this.quantity > 0;
});

// Middleware to update inStock status based on quantity
productSchema.pre('save', function(next) {
  if (this.quantity === 0) {
    this.inStock = false;
  }
  next();
});

// Static method to get products by farmer
productSchema.statics.findByFarmer = function(farmerId) {
  return this.find({ farmer: farmerId }).sort({ createdAt: -1 });
};

// Static method to get available products
productSchema.statics.findAvailable = function() {
  return this.find({ inStock: true, quantity: { $gt: 0 } }).sort({ createdAt: -1 });
};

module.exports = mongoose.model('Product', productSchema);
