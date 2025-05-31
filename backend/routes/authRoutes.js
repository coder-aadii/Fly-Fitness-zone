const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');
const { verifyOTP } = require('../controllers/verifyController');
const { forgotPassword, resetPassword } = require('../controllers/passwordController');

// Registration and login routes
router.post('/register', register);
router.post('/login', login);

// OTP verification route
router.post('/verify-otp', verifyOTP);

// Password reset routes
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

module.exports = router;
