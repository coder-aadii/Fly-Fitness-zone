// config/cloudinary.js
const cloudinary = require('cloudinary').v2;
const dotenv = require('dotenv');
const logger = require('../utils/logger');

// Load environment variables
dotenv.config();

// Configure Cloudinary
// We can use either individual credentials or the CLOUDINARY_URL
// If CLOUDINARY_URL is present, it takes precedence
if (process.env.CLOUDINARY_URL) {
  // The CLOUDINARY_URL will automatically configure all necessary settings
  cloudinary.config({
    secure: true
  });
  logger.info('Cloudinary configured using CLOUDINARY_URL');
} else {
  // Fallback to individual credentials
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true
  });
  logger.info('Cloudinary configured using individual credentials');
}

module.exports = cloudinary;