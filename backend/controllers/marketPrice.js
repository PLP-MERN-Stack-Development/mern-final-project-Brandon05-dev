const MarketPrice = require('../models/MarketPrice');

/**
 * Get all market prices
 * @route GET /api/v1/market-prices
 * @access Public
 */
const getAllMarketPrices = async (req, res) => {
  try {
    const { category, region, search } = req.query;

    const query = {};

    if (category) {
      query.category = category;
    }

    if (region) {
      query.region = new RegExp(region, 'i');
    }

    if (search) {
      query.cropName = new RegExp(search, 'i');
    }

    const prices = await MarketPrice.find(query).sort({ cropName: 1 });

    res.status(200).json({
      status: 'success',
      results: prices.length,
      data: {
        prices
      }
    });
  } catch (error) {
    console.error('Get market prices error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while fetching market prices'
    });
  }
};

/**
 * Get market price by crop name
 * @route GET /api/v1/market-prices/:cropName
 * @access Public
 */
const getMarketPriceByCrop = async (req, res) => {
  try {
    const price = await MarketPrice.findByCrop(req.params.cropName);

    if (!price) {
      return res.status(404).json({
        status: 'error',
        message: 'Market price not found for this crop'
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        price
      }
    });
  } catch (error) {
    console.error('Get market price error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while fetching market price'
    });
  }
};

/**
 * Create or update market price (Admin/Farmer)
 * @route POST /api/v1/market-prices
 * @access Private
 */
const createOrUpdateMarketPrice = async (req, res) => {
  try {
    const {
      cropName,
      category,
      averagePrice,
      unit,
      region,
      priceRange,
      source
    } = req.body;

    if (!cropName || !category || !averagePrice) {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide cropName, category, and averagePrice'
      });
    }

    // Check if price already exists
    let marketPrice = await MarketPrice.findOne({ cropName });

    if (marketPrice) {
      // Update existing
      marketPrice.category = category;
      marketPrice.averagePrice = averagePrice;
      if (unit) marketPrice.unit = unit;
      if (region) marketPrice.region = region;
      if (priceRange) marketPrice.priceRange = priceRange;
      if (source) marketPrice.source = source;

      await marketPrice.save();

      res.status(200).json({
        status: 'success',
        message: 'Market price updated successfully',
        data: {
          price: marketPrice
        }
      });
    } else {
      // Create new
      marketPrice = await MarketPrice.create({
        cropName,
        category,
        averagePrice,
        unit,
        region,
        priceRange,
        source
      });

      res.status(201).json({
        status: 'success',
        message: 'Market price created successfully',
        data: {
          price: marketPrice
        }
      });
    }
  } catch (error) {
    console.error('Create/Update market price error:', error);

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
      message: 'Server error while managing market price'
    });
  }
};

/**
 * Delete market price
 * @route DELETE /api/v1/market-prices/:id
 * @access Private
 */
const deleteMarketPrice = async (req, res) => {
  try {
    const price = await MarketPrice.findByIdAndDelete(req.params.id);

    if (!price) {
      return res.status(404).json({
        status: 'error',
        message: 'Market price not found'
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Market price deleted successfully'
    });
  } catch (error) {
    console.error('Delete market price error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while deleting market price'
    });
  }
};

module.exports = {
  getAllMarketPrices,
  getMarketPriceByCrop,
  createOrUpdateMarketPrice,
  deleteMarketPrice
};
