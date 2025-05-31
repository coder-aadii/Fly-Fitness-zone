// utils/cloudinaryUpload.js
const cloudinary = require('../config/cloudinary');
const fs = require('fs');
const logger = require('./logger');

/**
 * Uploads a file to Cloudinary
 * @param {string} filePath - Path to the file to upload
 * @param {string} folder - Cloudinary folder to upload to
 * @returns {Promise<Object>} - Cloudinary upload result
 */
const uploadToCloudinary = async (filePath, folder = 'posts') => {
  try {
    // Upload the file to Cloudinary
    const result = await cloudinary.uploader.upload(filePath, {
      folder: folder,
      resource_type: 'auto', // Automatically detect if it's an image or video
    });

    // Delete the local file after successful upload
    fs.unlinkSync(filePath);
    
    return {
      url: result.secure_url,
      publicId: result.public_id,
      resourceType: result.resource_type
    };
  } catch (error) {
    // If there's an error, delete the local file
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    throw error;
  }
};

/**
 * Deletes a file from Cloudinary
 * @param {string} publicId - Cloudinary public ID of the file to delete
 * @param {string} resourceType - Resource type (image or video)
 * @returns {Promise<Object>} - Cloudinary deletion result
 */
const deleteFromCloudinary = async (publicId, resourceType = 'image') => {
  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType
    });
    return result;
  } catch (error) {
    logger.error(`Error deleting file from Cloudinary: ${error.message}`);
    throw error;
  }
};

module.exports = {
  uploadToCloudinary,
  deleteFromCloudinary
};