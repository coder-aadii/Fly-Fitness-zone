// Run this with: node tests/test-auth.js <email> <password>
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import your User model - adjust the path as needed
const User = require('../models/User');

async function testAuthentication() {
  try {
    // Get email and password from command line arguments
    const email = process.argv[2];
    const password = process.argv[3];
    
    if (!email || !password) {
      console.error('Usage: node tests/test-auth.js <email> <password>');
      process.exit(1);
    }
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/your-database');
    console.log('Connected to MongoDB');
    
    // Find the user
    const user = await User.findOne({ email });
    
    if (!user) {
      console.log('User not found with email:', email);
      process.exit(1);
    }
    
    console.log('User found:');
    console.log('- ID:', user._id);
    console.log('- Email:', user.email);
    console.log('- Password hash:', user.password.substring(0, 15) + '...');
    
    // Test password comparison
    const isMatch = await bcrypt.compare(password, user.password);
    console.log('\nPassword comparison result:', isMatch);
    
    if (isMatch) {
      console.log('Authentication successful!');
    } else {
      console.log('Authentication failed - password does not match');
      
      // For debugging only - create a new hash with the provided password
      const salt = await bcrypt.genSalt(10);
      const newHash = await bcrypt.hash(password, salt);
      console.log('\nFor reference, hashing the provided password gives:');
      console.log(newHash);
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

testAuthentication();