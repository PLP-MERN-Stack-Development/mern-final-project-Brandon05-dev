const request = require('supertest');
const mongoose = require('mongoose');
const { app, server } = require('../../server');
const User = require('../../models/User');
const Product = require('../../models/Product');
const Order = require('../../models/Order');

describe('Order API Integration Tests', () => {
  let farmerToken;
  let buyerToken;
  let farmerId;
  let buyerId;
  let productId;
  let orderId;

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
    await Order.deleteMany({});
    await mongoose.connection.close();
    server.close();
  });

  beforeEach(async () => {
    // Clear collections
    await User.deleteMany({});
    await Product.deleteMany({});
    await Order.deleteMany({});

    // Create farmer
    const farmerRes = await request(app)
      .post('/api/v1/auth/register')
      .send({
        name: 'Order Farmer',
        email: 'orderfarmer@test.com',
        password: 'test123',
        role: 'Farmer',
        location: 'Nakuru'
      });
    
    farmerToken = farmerRes.body.data.token;
    farmerId = farmerRes.body.data.user.id;

    // Create buyer
    const buyerRes = await request(app)
      .post('/api/v1/auth/register')
      .send({
        name: 'Order Buyer',
        email: 'orderbuyer@test.com',
        password: 'test123',
        role: 'Buyer',
        location: 'Nairobi'
      });
    
    buyerToken = buyerRes.body.data.token;
    buyerId = buyerRes.body.data.user.id;

    // Create product
    const productRes = await request(app)
      .post('/api/v1/products')
      .set('Authorization', `Bearer ${farmerToken}`)
      .send({
        name: 'Beans',
        description: 'Fresh beans',
        category: 'Legumes',
        price: 120,
        unit: 'kg',
        quantity: 100,
        location: 'Nakuru'
      });
    
    productId = productRes.body.data.product._id;
  });

  describe('POST /api/v1/orders', () => {
    test('should allow buyer to create order', async () => {
      const res = await request(app)
        .post('/api/v1/orders')
        .set('Authorization', `Bearer ${buyerToken}`)
        .send({
          productId,
          quantity: 10,
          deliveryAddress: '123 Main St, Nairobi',
          paymentMethod: 'mpesa'
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.status).toBe('success');
      expect(res.body.data.order.quantity).toBe(10);
      expect(res.body.data.order.totalPrice).toBe(1200); // 120 * 10
      expect(res.body.data.order.status).toBe('pending');

      orderId = res.body.data.order._id;
    });

    test('should reject farmer from creating order', async () => {
      const res = await request(app)
        .post('/api/v1/orders')
        .set('Authorization', `Bearer ${farmerToken}`)
        .send({
          productId,
          quantity: 10,
          deliveryAddress: '123 Main St',
          paymentMethod: 'cash'
        });

      expect(res.statusCode).toBe(403);
    });

    test('should reject order with insufficient quantity', async () => {
      const res = await request(app)
        .post('/api/v1/orders')
        .set('Authorization', `Bearer ${buyerToken}`)
        .send({
          productId,
          quantity: 200, // More than available
          deliveryAddress: '123 Main St, Nairobi',
          paymentMethod: 'cash'
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toContain('Insufficient');
    });
  });

  describe('GET /api/v1/orders/buyer', () => {
    beforeEach(async () => {
      // Create test order
      await request(app)
        .post('/api/v1/orders')
        .set('Authorization', `Bearer ${buyerToken}`)
        .send({
          productId,
          quantity: 5,
          deliveryAddress: '456 Test St, Nairobi',
          paymentMethod: 'cash'
        });
    });

    test('should allow buyer to view their orders', async () => {
      const res = await request(app)
        .get('/api/v1/orders/buyer')
        .set('Authorization', `Bearer ${buyerToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe('success');
      expect(res.body.results).toBeGreaterThan(0);
      expect(res.body.data.orders.length).toBeGreaterThan(0);
    });

    test('should reject farmer from accessing buyer orders', async () => {
      const res = await request(app)
        .get('/api/v1/orders/buyer')
        .set('Authorization', `Bearer ${farmerToken}`);

      expect(res.statusCode).toBe(403);
    });
  });

  describe('GET /api/v1/orders/farmer', () => {
    beforeEach(async () => {
      // Create test order
      await request(app)
        .post('/api/v1/orders')
        .set('Authorization', `Bearer ${buyerToken}`)
        .send({
          productId,
          quantity: 8,
          deliveryAddress: '789 Test Ave, Nairobi',
          paymentMethod: 'mpesa'
        });
    });

    test('should allow farmer to view their orders', async () => {
      const res = await request(app)
        .get('/api/v1/orders/farmer')
        .set('Authorization', `Bearer ${farmerToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe('success');
      expect(res.body.results).toBeGreaterThan(0);
      expect(res.body.data.orders.length).toBeGreaterThan(0);
    });
  });

  describe('PUT /api/v1/orders/:id/status', () => {
    beforeEach(async () => {
      // Create test order
      const orderRes = await request(app)
        .post('/api/v1/orders')
        .set('Authorization', `Bearer ${buyerToken}`)
        .send({
          productId,
          quantity: 5,
          deliveryAddress: 'Test Address',
          paymentMethod: 'cash'
        });
      
      orderId = orderRes.body.data.order._id;
    });

    test('should allow farmer to update order status', async () => {
      const res = await request(app)
        .put(`/api/v1/orders/${orderId}/status`)
        .set('Authorization', `Bearer ${farmerToken}`)
        .send({
          status: 'confirmed'
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe('success');
      expect(res.body.data.order.status).toBe('confirmed');
    });

    test('should reject buyer from updating order status', async () => {
      const res = await request(app)
        .put(`/api/v1/orders/${orderId}/status`)
        .set('Authorization', `Bearer ${buyerToken}`)
        .send({
          status: 'confirmed'
        });

      expect(res.statusCode).toBe(403);
    });
  });

  describe('PUT /api/v1/orders/:id/cancel', () => {
    beforeEach(async () => {
      // Create test order
      const orderRes = await request(app)
        .post('/api/v1/orders')
        .set('Authorization', `Bearer ${buyerToken}`)
        .send({
          productId,
          quantity: 3,
          deliveryAddress: 'Cancel Test Address',
          paymentMethod: 'cash'
        });
      
      orderId = orderRes.body.data.order._id;
    });

    test('should allow buyer to cancel their order', async () => {
      const res = await request(app)
        .put(`/api/v1/orders/${orderId}/cancel`)
        .set('Authorization', `Bearer ${buyerToken}`)
        .send({
          reason: 'Changed my mind'
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe('success');
      expect(res.body.data.order.status).toBe('cancelled');
      expect(res.body.data.order.cancelReason).toBe('Changed my mind');
    });

    test('should allow farmer to cancel order', async () => {
      const res = await request(app)
        .put(`/api/v1/orders/${orderId}/cancel`)
        .set('Authorization', `Bearer ${farmerToken}`)
        .send({
          reason: 'Out of stock'
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.data.order.status).toBe('cancelled');
    });
  });
});
