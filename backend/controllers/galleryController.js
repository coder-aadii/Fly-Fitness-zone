// controllers/galleryController.js
const Gallery = require('../models/Gallery');
const { uploadToCloudinary, deleteFromCloudinary } = require('../utils/cloudinaryUpload');
const logger = require('../utils/logger');

// Get all gallery images
exports.getAllImages = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 12;
        const skip = (page - 1) * limit;
        const tag = req.query.tag;
        
        // Build query based on tag filter
        const query = tag ? { tags: tag } : {};
        
        const images = await Gallery.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);
            
        const total = await Gallery.countDocuments(query);
        
        // Get all unique tags for filtering
        const allTags = await Gallery.distinct('tags');
        
        res.json({
            images,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            total,
            tags: allTags
        });
    } catch (err) {
        logger.error('Error fetching gallery images:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Get a single gallery image
exports.getImage = async (req, res) => {
    try {
        const image = await Gallery.findById(req.params.id);
        
        if (!image) {
            return res.status(404).json({ message: 'Gallery image not found' });
        }
        
        res.json(image);
    } catch (err) {
        logger.error('Error fetching gallery image:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Upload a new gallery image
exports.uploadImage = async (req, res) => {
    try {
        const { title, description, tags, featured } = req.body;
        
        // Validate required fields
        if (!title) {
            return res.status(400).json({ message: 'Title is required' });
        }
        
        // Validate file
        if (!req.file) {
            return res.status(400).json({ message: 'Image file is required' });
        }
        
        // Upload to Cloudinary
        const cloudinaryResult = await uploadToCloudinary(req.file.path);
        
        // Parse tags
        let parsedTags = [];
        if (tags) {
            try {
                parsedTags = typeof tags === 'string' ? JSON.parse(tags) : tags;
            } catch (error) {
                parsedTags = tags.split(',').map(tag => tag.trim());
            }
        }
        
        // Create gallery image object
        const galleryData = {
            title,
            description,
            imageUrl: cloudinaryResult.url,
            cloudinaryId: cloudinaryResult.publicId,
            tags: parsedTags,
            featured: featured === 'true' || featured === true,
            uploadedBy: req.userId === 'admin-id' ? 'Admin' : req.userId
        };
        
        // Create and save the gallery image
        const galleryImage = new Gallery(galleryData);
        await galleryImage.save();
        
        res.status(201).json(galleryImage);
    } catch (err) {
        logger.error('Error uploading gallery image:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Update a gallery image
exports.updateImage = async (req, res) => {
    try {
        const { title, description, tags, featured } = req.body;
        
        // Find the gallery image
        const galleryImage = await Gallery.findById(req.params.id);
        
        if (!galleryImage) {
            return res.status(404).json({ message: 'Gallery image not found' });
        }
        
        // Update gallery image fields
        if (title) galleryImage.title = title;
        if (description) galleryImage.description = description;
        
        // Parse tags if provided
        if (tags) {
            try {
                galleryImage.tags = typeof tags === 'string' ? JSON.parse(tags) : tags;
            } catch (error) {
                galleryImage.tags = tags.split(',').map(tag => tag.trim());
            }
        }
        
        if (featured !== undefined) {
            galleryImage.featured = featured === 'true' || featured === true;
        }
        
        // If there's a file uploaded, update the image
        if (req.file) {
            try {
                // Delete old image from Cloudinary
                await deleteFromCloudinary(galleryImage.cloudinaryId, 'image');
                
                // Upload new image to Cloudinary
                const cloudinaryResult = await uploadToCloudinary(req.file.path);
                
                // Update Cloudinary data
                galleryImage.imageUrl = cloudinaryResult.url;
                galleryImage.cloudinaryId = cloudinaryResult.publicId;
            } catch (uploadError) {
                logger.error('Error updating gallery image on Cloudinary:', uploadError);
                return res.status(500).json({ message: 'Error updating gallery image', error: uploadError.message });
            }
        }
        
        // Save the updated gallery image
        await galleryImage.save();
        
        res.json(galleryImage);
    } catch (err) {
        logger.error('Error updating gallery image:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Delete a gallery image
exports.deleteImage = async (req, res) => {
    try {
        const galleryImage = await Gallery.findById(req.params.id);
        
        if (!galleryImage) {
            return res.status(404).json({ message: 'Gallery image not found' });
        }
        
        // Delete image from Cloudinary
        try {
            await deleteFromCloudinary(galleryImage.cloudinaryId, 'image');
        } catch (deleteError) {
            logger.error('Error deleting from Cloudinary:', deleteError);
            // Continue with gallery image deletion even if Cloudinary deletion fails
        }
        
        // Delete the gallery image
        await Gallery.findByIdAndDelete(req.params.id);
        
        res.json({ message: 'Gallery image deleted successfully' });
    } catch (err) {
        logger.error('Error deleting gallery image:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};