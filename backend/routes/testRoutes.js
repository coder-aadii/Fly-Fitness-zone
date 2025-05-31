const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// Test route to create a test user and verify login
router.post('/create-test-user', async (req, res) => {
  try {
    const testEmail = 'test@example.com';
    const testPassword = 'Test123!';
    
    // Delete any existing test user
    await User.deleteOne({ email: testEmail });
    
    // Create a new test user with known credentials
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(testPassword, salt);
    
    const newUser = new User({
      name: 'Test User',
      email: testEmail,
      password: hashedPassword
    });
    
    await newUser.save();
    
    // Now try to verify the password
    const savedUser = await User.findOne({ email: testEmail });
    const passwordMatches = await bcrypt.compare(testPassword, savedUser.password);
    
    res.json({
      success: true,
      user: {
        email: testEmail,
        passwordLength: testPassword.length,
        hashedPasswordLength: hashedPassword.length
      },
      verification: {
        userFound: !!savedUser,
        passwordMatches
      }
    });
    
  } catch (error) {
    console.error('Test user creation error:', error);
    res.status(500).json({ message: 'Error creating test user', error: error.message });
  }
});

module.exports = router;