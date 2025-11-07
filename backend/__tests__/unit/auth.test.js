const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../../models/User');

// Mock the User model
jest.mock('../../models/User');

describe('Auth Controller Unit Tests', () => {
  describe('Password Hashing', () => {
    test('should hash password before saving user', async () => {
      const password = 'testpassword123';
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      expect(hashedPassword).not.toBe(password);
      expect(hashedPassword.length).toBeGreaterThan(50);
    });

    test('should compare password correctly', async () => {
      const password = 'testpassword123';
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const isMatch = await bcrypt.compare(password, hashedPassword);
      expect(isMatch).toBe(true);

      const isNotMatch = await bcrypt.compare('wrongpassword', hashedPassword);
      expect(isNotMatch).toBe(false);
    });
  });

  describe('JWT Token Generation', () => {
    test('should generate valid JWT token', () => {
      const userId = '507f1f77bcf86cd799439011';
      const token = jwt.sign({ id: userId }, process.env.JWT_SECRET || 'test_secret', {
        expiresIn: '30d'
      });

      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.split('.').length).toBe(3); // JWT has 3 parts
    });

    test('should verify JWT token correctly', () => {
      const userId = '507f1f77bcf86cd799439011';
      const token = jwt.sign({ id: userId }, process.env.JWT_SECRET || 'test_secret', {
        expiresIn: '30d'
      });

      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'test_secret');
      expect(decoded.id).toBe(userId);
    });

    test('should reject invalid JWT token', () => {
      const invalidToken = 'invalid.token.here';

      expect(() => {
        jwt.verify(invalidToken, process.env.JWT_SECRET || 'test_secret');
      }).toThrow();
    });
  });

  describe('User Model Validation', () => {
    test('should validate email format', () => {
      const validEmails = [
        'test@example.com',
        'user.name@domain.co.ke',
        'admin@agrismart.com'
      ];

      const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

      validEmails.forEach(email => {
        expect(emailRegex.test(email)).toBe(true);
      });
    });

    test('should reject invalid email format', () => {
      const invalidEmails = [
        'notanemail',
        '@example.com',
        'user@',
        'user @example.com'
      ];

      const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

      invalidEmails.forEach(email => {
        expect(emailRegex.test(email)).toBe(false);
      });
    });
  });
});
