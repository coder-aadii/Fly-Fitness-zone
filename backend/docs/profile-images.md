# Profile Image Storage with Cloudinary

This document explains how profile images are stored in the Fly Fitness Zone application.

## Overview

Profile images are permanently stored in Cloudinary, a cloud-based image and video management service. This ensures that:

1. Profile images are always available, even if the backend server is restarted or deployed to a new environment
2. Images are served from a global CDN for fast loading
3. Images are securely stored and backed up
4. Profile images remain available until explicitly changed by the user

## Implementation Details

### User Model

The User model has been updated to include Cloudinary-specific fields:

- `profileImage`: The URL of the profile image (now a Cloudinary URL)
- `cloudinaryId`: The Cloudinary public ID used for deleting or transforming the image

### Upload Process

When a user uploads a profile image:

1. The image is temporarily stored on the server using Multer
2. The image is then uploaded to Cloudinary in the 'profiles' folder
3. The Cloudinary URL and public ID are saved to the user's document
4. The temporary file is deleted from the server

### Deletion Process

When a user changes their profile image:

1. The old image is deleted from Cloudinary using the stored public ID
2. The new image is uploaded following the process above

### Migration

A migration script (`scripts/migrateProfilesToCloudinary.js`) has been created to move existing profile images from local storage to Cloudinary. To run the migration:

```bash
npm run migrate-profiles
```

## Differences from Post Images

Unlike post images, which are automatically deleted after 36 hours:

1. Profile images do not have an expiration time
2. Profile images are not tracked in the ExpiredMedia collection
3. Profile images are stored in a separate 'profiles' folder in Cloudinary

## Benefits

- **Reliability**: Profile images are always available, regardless of server status
- **Performance**: Images are served from Cloudinary's global CDN
- **Persistence**: Images remain until explicitly changed by the user
- **Scalability**: No local storage limitations for profile images

## Technical Implementation

The implementation uses the same Cloudinary configuration and utilities as post images, but with different storage settings to ensure permanence.