// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Register a new user
// POST /api/auth/register
router.post('/register', authController.register);

// Login user
// POST /api/auth/login
router.post('/login', authController.login);

// Verify OTP
// POST /api/auth/verify-otp
router.post('/verify-otp', authController.verifyOTP);

// Forgot password
// POST /api/auth/forgot-password
router.post('/forgot-password', authController.forgotPassword);

// Reset password
// POST /api/auth/reset-password
router.post('/reset-password', authController.resetPassword);

module.exports = router;