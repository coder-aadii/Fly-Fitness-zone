// scripts/migrateProfilesToCloudinary.js
require('dotenv').config();
const User = require('../models/User');
const path = require('path');
const fs = require('fs');
const { uploadToCloudinary } = require('../utils/cloudinaryUpload');
const mongoose = require('mongoose');
const logger = require('../utils/logger');

/**
 * Migrates existing profile images from local storage to Cloudinary
 */
async function migrateProfilesToCloudinary() {
  try {
    // Connect to MongoDB if not already connected
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGO_URI);
      logger.info('MongoDB Connected for profile migration');
    }

    // Find all users with local profile images but no cloudinaryId
    const users = await User.find({
      profileImage: { $regex: '^/uploads/' },
      cloudinaryId: { $exists: false }
    });

    logger.info(`Found ${users.length} users with local profile images to migrate`);

    for (const user of users) {
      try {
        // Get the local file path
        const localPath = path.join(__dirname, '..', user.profileImage.replace(/^\//, ''));
        
        // Check if the file exists
        if (!fs.existsSync(localPath)) {
          logger.warn(`Profile image not found for user ${user._id}: ${localPath}`);
          continue;
        }

        logger.info(`Migrating profile image for user ${user._id}: ${localPath}`);

        // Upload to Cloudinary
        const cloudinaryResult = await uploadToCloudinary(localPath, 'profiles');

        // Update user with Cloudinary data
        user.profileImage = cloudinaryResult.url;
        user.cloudinaryId = cloudinaryResult.publicId;

        await user.save();
        
        logger.info(`Successfully migrated profile image for user ${user._id}`);
      } catch (error) {
        logger.error(`Error migrating profile image for user ${user._id}:`, error);
      }
    }

    logger.info('Profile image migration completed');
    
    // Disconnect from MongoDB if we connected in this script
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
      logger.info('MongoDB Disconnected');
    }
  } catch (error) {
    logger.error('Error in profile migration script:', error);
    process.exit(1);
  }
}

// Run the migration
migrateProfilesToCloudinary();