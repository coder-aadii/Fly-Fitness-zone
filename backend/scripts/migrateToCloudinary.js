// scripts/migrateToCloudinary.js
require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const Post = require('../models/Post');
const { uploadToCloudinary } = require('../utils/cloudinaryUpload');

/**
 * Migrates existing media from local storage to Cloudinary
 */
async function migrateToCloudinary() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Find all posts with local media
    const posts = await Post.find({
      media: { $regex: '^/uploads/' },
      cloudinaryId: { $exists: false }
    });

    console.log(`Found ${posts.length} posts with local media to migrate`);

    // Process each post
    for (const post of posts) {
      try {
        const localPath = path.join(__dirname, '..', post.media.replace(/^\//, ''));
        
        // Check if the file exists
        if (!fs.existsSync(localPath)) {
          console.log(`File not found for post ${post._id}: ${localPath}`);
          continue;
        }

        console.log(`Migrating media for post ${post._id}: ${localPath}`);

        // Upload to Cloudinary
        const cloudinaryResult = await uploadToCloudinary(localPath);

        // Update post with Cloudinary data
        post.media = cloudinaryResult.url;
        post.cloudinaryId = cloudinaryResult.publicId;
        
        // Save the updated post
        await post.save();
        console.log(`Successfully migrated post ${post._id}`);
      } catch (error) {
        console.error(`Error migrating post ${post._id}:`, error);
      }
    }

    console.log('Migration completed');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

migrateToCloudinary();