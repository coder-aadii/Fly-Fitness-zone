// Backend configuration
require('dotenv').config();

module.exports = {
  // Server configuration
  PORT: process.env.PORT || 5000,
  
  // MongoDB configuration
  MONGO_URI: process.env.MONGO_URI || 'mongodb://localhost:27017/fly-fitness',
  
  // JWT configuration
  JWT_SECRET: process.env.JWT_SECRET || 'your-secret-key',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  
  // Email configuration (for password reset)
  EMAIL_USER: process.env.EMAIL_USER || 'your-email@gmail.com',
  EMAIL_PASSWORD: process.env.EMAIL_PASSWORD || 'your-email-password',
  
  // Frontend URL (for password reset links)
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000'
};