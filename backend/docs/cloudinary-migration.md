# Cloudinary Migration Guide

This document explains the migration from local file storage to Cloudinary for media uploads in the Fly Fitness Zone application.

## Overview

The application has been updated to use Cloudinary for storing media files (images and videos) instead of storing them locally in the `/uploads` directory. This provides several benefits:

- Better scalability and reliability
- Automatic CDN distribution for faster loading
- Reduced server storage requirements
- Automatic media optimization
- Easier management of media assets

## How It Works

### Media Upload Process

1. When a user uploads an image or video in a post:
   - The file is temporarily stored on the server using Multer
   - The file is then uploaded to Cloudinary
   - The Cloudinary URL and public ID are saved in the database
   - The temporary file is deleted

2. The Post schema has been updated with a new field:
   - `cloudinaryId`: Stores the Cloudinary public ID for deletion

3. When a post is deleted:
   - The associated media is deleted from Cloudinary using the public ID

### Automatic Cleanup

Posts automatically expire after 36 hours using MongoDB's TTL index. To ensure Cloudinary resources are also cleaned up:

1. A scheduled job runs every hour to clean up expired Cloudinary resources
2. The job is managed by `node-cron` and configured in `utils/cleanupJob.js`
3. A new collection `ExpiredMedia` tracks Cloudinary resources that need to be deleted

## Migration Process

To migrate existing media from local storage to Cloudinary:

1. Run the migration script:
   ```bash
   npm run migrate
   ```

2. The script will:
   - Find all posts with local media (path starting with `/uploads/`)
   - Upload each file to Cloudinary
   - Update the post with the Cloudinary URL and public ID
   - Delete the local file after successful upload

## Configuration

The Cloudinary configuration is stored in environment variables:

```
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## Troubleshooting

If you encounter issues with the migration:

1. Check the Cloudinary credentials in your `.env` file
2. Ensure the local files exist in the `/uploads` directory
3. Check the MongoDB connection
4. Review the error logs for specific issues

## Rollback

If you need to rollback to local storage:

1. Revert the code changes
2. Run a reverse migration script (not provided)
3. Ensure the `/uploads` directory exists and has proper permissions