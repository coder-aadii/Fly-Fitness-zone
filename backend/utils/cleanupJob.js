// utils/cleanupJob.js
const cron = require('node-cron');
const mongoose = require('mongoose');
const cloudinary = require('../config/cloudinary');
const { deleteFromCloudinary } = require('./cloudinaryUpload');
const logger = require('./logger');

// Get Post model
let Post;
try {
  Post = mongoose.model('Post');
} catch (e) {
  // Model not registered yet, will be available when used
}

/**
 * Tracks Cloudinary resources that need to be deleted
 * This is used to keep track of resources that were in posts that were deleted by MongoDB TTL
 */
const ExpiredMedia = mongoose.model('ExpiredMedia', new mongoose.Schema({
  cloudinaryId: {
    type: String,
    required: true,
    unique: true
  },
  resourceType: {
    type: String,
    enum: ['image', 'video'],
    default: 'image'
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 86400 // Auto-delete after 24 hours (in case cleanup job fails)
  }
}));

/**
 * Schedules jobs to run periodically to clean up expired resources
 */
const scheduleCleanupJob = () => {
  // Run every hour at minute 0 to clean up Cloudinary resources
  cron.schedule('0 * * * *', async () => {
    logger.info('Running Cloudinary cleanup job:', new Date().toISOString());
    
    try {
      // Find all expired media records
      const expiredMedia = await ExpiredMedia.find({});
      
      if (expiredMedia.length === 0) {
        logger.info('No expired media to clean up');
        return;
      }
      
      logger.info(`Found ${expiredMedia.length} expired media resources to clean up`);
      
      // Delete each expired media from Cloudinary
      for (const media of expiredMedia) {
        try {
          await deleteFromCloudinary(media.cloudinaryId, media.resourceType);
          await ExpiredMedia.findByIdAndDelete(media._id);
          logger.info(`Deleted expired media: ${media.cloudinaryId}`);
        } catch (error) {
          logger.error(`Error deleting expired media ${media.cloudinaryId}:`, error.message);
          // Keep the record in the database to try again later
        }
      }
      
      logger.info('Cloudinary cleanup job completed');
    } catch (error) {
      logger.error('Error in Cloudinary cleanup job:', error);
    }
  });
  
  // Run every 6 hours to clean up expired posts (backup for MongoDB TTL index)
  cron.schedule('0 */6 * * *', async () => {
    logger.info('Running expired posts cleanup job:', new Date().toISOString());
    
    try {
      // Ensure Post model is available
      if (!Post) {
        try {
          Post = mongoose.model('Post');
        } catch (e) {
          logger.error('Post model not available for cleanup job');
          return;
        }
      }
      
      const now = new Date();
      
      // Find posts that have expired
      const expiredPosts = await Post.find({
        expiresAt: { $lt: now }
      });
      
      if (expiredPosts.length === 0) {
        logger.info('No expired posts to clean up');
        return;
      }
      
      logger.info(`Found ${expiredPosts.length} expired posts to clean up`);
      
      // Delete each expired post and its associated media
      for (const post of expiredPosts) {
        try {
          // If post has media on Cloudinary, track it for cleanup
          if (post.cloudinaryId) {
            const resourceType = post.mediaType === 'video' ? 'video' : 'image';
            await trackForCleanup(post.cloudinaryId, resourceType);
          }
          
          // Delete the post
          await Post.findByIdAndDelete(post._id);
          logger.info(`Deleted expired post: ${post._id}`);
        } catch (error) {
          logger.error(`Error deleting expired post ${post._id}:`, error.message);
          // Continue with other posts even if one fails
        }
      }
      
      logger.info('Expired posts cleanup job completed');
    } catch (error) {
      logger.error('Error in expired posts cleanup job:', error);
    }
  });
  
  logger.info('All cleanup jobs scheduled');
};

/**
 * Tracks a post's Cloudinary resource for cleanup when the post is deleted by MongoDB TTL
 * @param {string} cloudinaryId - Cloudinary public ID
 * @param {string} resourceType - Resource type (image or video)
 */
const trackForCleanup = async (cloudinaryId, resourceType = 'image') => {
  try {
    // Create a new expired media record
    await ExpiredMedia.create({
      cloudinaryId,
      resourceType
    });
    logger.info(`Tracking Cloudinary resource for cleanup: ${cloudinaryId}`);
  } catch (error) {
    // If it's a duplicate key error, the resource is already being tracked
    if (error.code !== 11000) {
      logger.error(`Error tracking Cloudinary resource for cleanup: ${cloudinaryId}`, error);
    }
  }
};

module.exports = {
  scheduleCleanupJob,
  trackForCleanup,
  ExpiredMedia
};