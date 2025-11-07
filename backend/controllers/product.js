const Product = require('../models/Product');
const User = require('../models/User');

/**
 * Create a new product
 * @route POST /api/v1/products
 * @access Private (Farmer only)
 */
const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      category,
      price,
      unit,
      quantity,
      image,
      location
    } = req.body;

    // Validate required fields
    if (!name || !description || !category || !price || !quantity || !location) {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide all required fields: name, description, category, price, quantity, and location'
      });
    }

    // Verify user is a Farmer
    if (req.user.role !== 'Farmer') {
      return res.status(403).json({
        status: 'error',
        message: 'Only farmers can create products'
      });
    }

    // Create product with farmer reference
    const product = await Product.create({
      farmer: req.user._id,
      name,
      description,
      category,
      price,
      unit,
      quantity,
      image,
      location: location || req.user.location
    });

    // Populate farmer details
    await product.populate('farmer', 'name email location phone');

    res.status(201).json({
      status: 'success',
      message: 'Product created successfully',
      data: {
        product
      }
    });
  } catch (error) {
    console.error('Create product error:', error);

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
      message: 'Server error while creating product'
    });
  }
};

/**
 * Get all products with optional filtering and search
 * @route GET /api/v1/products
 * @access Public
 */
const getAllProducts = async (req, res) => {
  try {
    const {
      category,
      minPrice,
      maxPrice,
      location,
      inStock,
      search,
      sort,
      page = 1,
      limit = 10
    } = req.query;

    // Build query
    const query = {};

    // Filter by category
    if (category) {
      query.category = category;
    }

    // Filter by price range
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Filter by location
    if (location) {
      query.location = new RegExp(location, 'i');
    }

    // Filter by stock status
    if (inStock !== undefined) {
      query.inStock = inStock === 'true';
      query.quantity = { $gt: 0 };
    }

    // Text search
    if (search) {
      query.$text = { $search: search };
    }

    // Sort options
    let sortOptions = { createdAt: -1 }; // Default: newest first
    if (sort === 'price_asc') sortOptions = { price: 1 };
    if (sort === 'price_desc') sortOptions = { price: -1 };
    if (sort === 'name') sortOptions = { name: 1 };

    // Pagination
    const skip = (Number(page) - 1) * Number(limit);

    // Execute query
    const products = await Product.find(query)
      .populate('farmer', 'name email location phone')
      .sort(sortOptions)
      .skip(skip)
      .limit(Number(limit));

    // Get total count for pagination
    const total = await Product.countDocuments(query);

    res.status(200).json({
      status: 'success',
      results: products.length,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      },
      data: {
        products
      }
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while fetching products'
    });
  }
};

/**
 * Get single product by ID
 * @route GET /api/v1/products/:id
 * @access Public
 */
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      'farmer',
      'name email location phone'
    );

    if (!product) {
      return res.status(404).json({
        status: 'error',
        message: 'Product not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        product
      }
    });
  } catch (error) {
    console.error('Get product error:', error);

    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        status: 'error',
        message: 'Invalid product ID'
      });
    }

    res.status(500).json({
      status: 'error',
      message: 'Server error while fetching product'
    });
  }
};

/**
 * Update product
 * @route PUT /api/v1/products/:id
 * @access Private (Product owner only)
 */
const updateProduct = async (req, res) => {
  try {
    let product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        status: 'error',
        message: 'Product not found'
      });
    }

    // Check if user is the product owner
    if (product.farmer.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        status: 'error',
        message: 'You can only update your own products'
      });
    }

    // Update product
    const {
      name,
      description,
      category,
      price,
      unit,
      quantity,
      image,
      location,
      inStock,
      featured
    } = req.body;

    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (category !== undefined) updateData.category = category;
    if (price !== undefined) updateData.price = price;
    if (unit !== undefined) updateData.unit = unit;
    if (quantity !== undefined) updateData.quantity = quantity;
    if (image !== undefined) updateData.image = image;
    if (location !== undefined) updateData.location = location;
    if (inStock !== undefined) updateData.inStock = inStock;
    if (featured !== undefined) updateData.featured = featured;

    product = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
        runValidators: true
      }
    ).populate('farmer', 'name email location phone');

    res.status(200).json({
      status: 'success',
      message: 'Product updated successfully',
      data: {
        product
      }
    });
  } catch (error) {
    console.error('Update product error:', error);

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
      message: 'Server error while updating product'
    });
  }
};

/**
 * Delete product
 * @route DELETE /api/v1/products/:id
 * @access Private (Product owner only)
 */
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        status: 'error',
        message: 'Product not found'
      });
    }

    // Check if user is the product owner
    if (product.farmer.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        status: 'error',
        message: 'You can only delete your own products'
      });
    }

    await Product.findByIdAndDelete(req.params.id);

    res.status(200).json({
      status: 'success',
      message: 'Product deleted successfully'
    });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while deleting product'
    });
  }
};

/**
 * Get products by current farmer
 * @route GET /api/v1/products/my-products
 * @access Private (Farmer only)
 */
const getMyProducts = async (req, res) => {
  try {
    if (req.user.role !== 'Farmer') {
      return res.status(403).json({
        status: 'error',
        message: 'Only farmers can access this route'
      });
    }

    const products = await Product.findByFarmer(req.user._id);

    res.status(200).json({
      status: 'success',
      results: products.length,
      data: {
        products
      }
    });
  } catch (error) {
    console.error('Get my products error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while fetching products'
    });
  }
};

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getMyProducts
};
