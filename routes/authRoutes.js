// ======================================================
// Authentication Routes
// ======================================================
// Routes for user authentication and authorization
// ======================================================

const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const authController = require('../controllers/authController');
const { verifyToken, verifyRole } = require('../middleware/authMiddleware');

// ======================================================
// Rate Limiting for Security
// ======================================================

// Strict rate limit for registration (prevent spam)
const registerLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 3, // Max 3 registration attempts per IP
  message: {
    success: false,
    message: 'Too many registration attempts. Please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Strict rate limit for login (prevent brute force)
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Max 10 login attempts per IP
  message: {
    success: false,
    message: 'Too many login attempts. Please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limit for OTP operations
const otpLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 5, // Max 5 OTP requests
  message: {
    success: false,
    message: 'Too many OTP requests. Please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limit for password reset
const resetLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 3, // Max 3 reset requests
  message: {
    success: false,
    message: 'Too many password reset requests. Please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// ======================================================
// Public Routes (No Authentication Required)
// ======================================================

// User registration
router.post('/register', registerLimiter, authController.register);

// OTP verification
router.post('/verify-otp', otpLimiter, authController.verifyOTP);

// Resend OTP
router.post('/resend-otp', otpLimiter, authController.resendOTP);

// User login
router.post('/login', loginLimiter, authController.login);

// Forgot password (request reset)
router.post('/forgot-password', resetLimiter, authController.forgotPassword);

// Reset password (with token)
router.post('/reset-password', resetLimiter, authController.resetPassword);

// ======================================================
// Protected Routes (Authentication Required)
// ======================================================

// Get current user profile
router.get('/me', verifyToken, authController.getCurrentUser);

// Logout
router.post('/logout', verifyToken, authController.logout);

// ======================================================
// Admin Routes (Admin Only)
// ======================================================

// Get all users
router.get('/users', verifyToken, verifyRole(['admin']), authController.getAllUsers);

// Update user role
router.put('/users/:userId/role', verifyToken, verifyRole(['admin']), authController.updateUserRole);

// ======================================================
// Health Check
// ======================================================

router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Auth service is running',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
