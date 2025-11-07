const request = require('supertest');
const mongoose = require('mongoose');
const { app, server } = require('../../server');
const User = require('../../models/User');
const Product = require('../../models/Product');

describe('Product API Integration Tests', () => {
  let farmerToken;
  let buyerToken;
  let farmerId;
  let productId;

  beforeAll(async () => {
    // Connect to test database
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/agrismart_test');
    }
  });

  afterAll(async () => {
    // Clean up
    await User.deleteMany({});
    await Product.deleteMany({});
    await mongoose.connection.close();
    server.close();
  });

  beforeEach(async () => {
    // Clear collections
    await User.deleteMany({});
    await Product.deleteMany({});

    // Create farmer
    const farmerRes = await request(app)
      .post('/api/v1/auth/register')
      .send({
        name: 'Test Farmer',
        email: 'farmer@test.com',
        password: 'test123',
        role: 'Farmer',
        location: 'Nairobi'
      });
    
    farmerToken = farmerRes.body.data.token;
    farmerId = farmerRes.body.data.user.id;

    // Create buyer
    const buyerRes = await request(app)
      .post('/api/v1/auth/register')
      .send({
        name: 'Test Buyer',
        email: 'buyer@test.com',
        password: 'test123',
        role: 'Buyer',
        location: 'Mombasa'
      });
    
    buyerToken = buyerRes.body.data.token;
  });

  describe('POST /api/v1/products', () => {
    test('should allow farmer to create product', async () => {
      const res = await request(app)
        .post('/api/v1/products')
        .set('Authorization', `Bearer ${farmerToken}`)
        .send({
          name: 'Fresh Tomatoes',
          description: 'Organic tomatoes from my farm',
          category: 'Vegetables',
          price: 100,
          unit: 'kg',
          quantity: 50,
          location: 'Nairobi'
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.status).toBe('success');
      expect(res.body.data.product.name).toBe('Fresh Tomatoes');
      expect(res.body.data.product.farmer._id).toBe(farmerId);

      productId = res.body.data.product._id;
    });

    test('should reject buyer from creating product', async () => {
      const res = await request(app)
        .post('/api/v1/products')
        .set('Authorization', `Bearer ${buyerToken}`)
        .send({
          name: 'Test Product',
          description: 'Should fail',
          category: 'Grains',
          price: 100,
          unit: 'kg',
          quantity: 50,
          location: 'Mombasa'
        });

      expect(res.statusCode).toBe(403);
      expect(res.body.status).toBe('error');
    });

    test('should reject unauthenticated request', async () => {
      const res = await request(app)
        .post('/api/v1/products')
        .send({
          name: 'Test Product',
          description: 'Should fail',
          category: 'Grains',
          price: 100,
          unit: 'kg',
          quantity: 50,
          location: 'Nairobi'
        });

      expect(res.statusCode).toBe(401);
    });
  });

  describe('GET /api/v1/products', () => {
    beforeEach(async () => {
      // Create test product
      await request(app)
        .post('/api/v1/products')
        .set('Authorization', `Bearer ${farmerToken}`)
        .send({
          name: 'Maize',
          description: 'Fresh maize',
          category: 'Grains',
          price: 45,
          unit: 'kg',
          quantity: 100,
          location: 'Nakuru'
        });
    });

    test('should get all products without authentication', async () => {
      const res = await request(app).get('/api/v1/products');

      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe('success');
      expect(res.body.results).toBeGreaterThan(0);
    });

    test('should filter products by category', async () => {
      const res = await request(app).get('/api/v1/products?category=Grains');

      expect(res.statusCode).toBe(200);
      expect(res.body.results).toBeGreaterThan(0);
      expect(res.body.data.products[0].category).toBe('Grains');
    });

    test('should filter products by price range', async () => {
      const res = await request(app).get('/api/v1/products?minPrice=40&maxPrice=50');

      expect(res.statusCode).toBe(200);
      expect(res.body.data.products.every(p => p.price >= 40 && p.price <= 50)).toBe(true);
    });
  });

  describe('PUT /api/v1/products/:id', () => {
    beforeEach(async () => {
      // Create test product
      const res = await request(app)
        .post('/api/v1/products')
        .set('Authorization', `Bearer ${farmerToken}`)
        .send({
          name: 'Carrots',
          description: 'Fresh carrots',
          category: 'Vegetables',
          price: 80,
          unit: 'kg',
          quantity: 50,
          location: 'Nairobi'
        });
      
      productId = res.body.data.product._id;
    });

    test('should allow farmer to update own product', async () => {
      const res = await request(app)
        .put(`/api/v1/products/${productId}`)
        .set('Authorization', `Bearer ${farmerToken}`)
        .send({
          price: 90,
          quantity: 60
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe('success');
      expect(res.body.data.product.price).toBe(90);
      expect(res.body.data.product.quantity).toBe(60);
    });

    test('should reject buyer from updating product', async () => {
      const res = await request(app)
        .put(`/api/v1/products/${productId}`)
        .set('Authorization', `Bearer ${buyerToken}`)
        .send({
          price: 50
        });

      expect(res.statusCode).toBe(403);
    });
  });

  describe('DELETE /api/v1/products/:id', () => {
    beforeEach(async () => {
      // Create test product
      const res = await request(app)
        .post('/api/v1/products')
        .set('Authorization', `Bearer ${farmerToken}`)
        .send({
          name: 'To Delete',
          description: 'Will be deleted',
          category: 'Other',
          price: 10,
          unit: 'piece',
          quantity: 1,
          location: 'Test'
        });
      
      productId = res.body.data.product._id;
    });

    test('should allow farmer to delete own product', async () => {
      const res = await request(app)
        .delete(`/api/v1/products/${productId}`)
        .set('Authorization', `Bearer ${farmerToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe('success');

      // Verify product is deleted
      const getRes = await request(app).get(`/api/v1/products/${productId}`);
      expect(getRes.statusCode).toBe(404);
    });

    test('should reject buyer from deleting product', async () => {
      const res = await request(app)
        .delete(`/api/v1/products/${productId}`)
        .set('Authorization', `Bearer ${buyerToken}`);

      expect(res.statusCode).toBe(403);
    });
  });
});
