const mongoose = require('mongoose');

const marketPriceSchema = new mongoose.Schema(
  {
    cropName: {
      type: String,
      required: [true, 'Crop name is required'],
      trim: true,
      unique: true
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
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
    averagePrice: {
      type: Number,
      required: [true, 'Average price is required'],
      min: [0, 'Average price cannot be negative']
    },
    unit: {
      type: String,
      required: [true, 'Unit is required'],
      enum: {
        values: ['kg', 'g', 'lb', 'piece', 'dozen', 'liter', 'bag', 'crate'],
        message: 'Please select a valid unit'
      },
      default: 'kg'
    },
    region: {
      type: String,
      required: [true, 'Region is required'],
      trim: true,
      default: 'National'
    },
    priceRange: {
      min: {
        type: Number,
        required: true,
        default: 0
      },
      max: {
        type: Number,
        required: true,
        default: 0
      }
    },
    lastUpdated: {
      type: Date,
      default: Date.now
    },
    source: {
      type: String,
      default: 'Market Survey',
      trim: true
    }
  },
  {
    timestamps: true
  }
);

// Index for faster queries
marketPriceSchema.index({ cropName: 1, region: 1 });
marketPriceSchema.index({ category: 1 });

// Update lastUpdated on save
marketPriceSchema.pre('save', function(next) {
  this.lastUpdated = Date.now();
  next();
});

// Static method to find by crop name
marketPriceSchema.statics.findByCrop = function(cropName) {
  return this.findOne({ 
    cropName: new RegExp(cropName, 'i') 
  });
};

// Static method to find by category
marketPriceSchema.statics.findByCategory = function(category) {
  return this.find({ category }).sort({ cropName: 1 });
};

module.exports = mongoose.model('MarketPrice', marketPriceSchema);
