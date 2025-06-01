// controllers/testimonialController.js
const Testimonial = require('../models/Testimonial');
const { uploadToCloudinary, deleteFromCloudinary } = require('../utils/cloudinaryUpload');
const logger = require('../utils/logger');

// Get all testimonials (admin)
exports.getAllTestimonials = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const status = req.query.status; // 'approved', 'pending', 'all'
        
        // Build query based on status filter
        let query = {};
        if (status === 'approved') {
            query.approved = true;
        } else if (status === 'pending') {
            query.approved = false;
        }
        
        const testimonials = await Testimonial.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate('user', 'name email profileImage');
            
        const total = await Testimonial.countDocuments(query);
        
        res.json({
            testimonials,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            total
        });
    } catch (err) {
        logger.error('Error fetching testimonials:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Get approved testimonials (public)
exports.getApprovedTestimonials = async (req, res) => {
    try {
        const testimonials = await Testimonial.find({ approved: true })
            .sort({ featured: -1, createdAt: -1 })
            .limit(10);
            
        res.json(testimonials);
    } catch (err) {
        logger.error('Error fetching approved testimonials:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Get a single testimonial
exports.getTestimonial = async (req, res) => {
    try {
        const testimonial = await Testimonial.findById(req.params.id)
            .populate('user', 'name email profileImage');
            
        if (!testimonial) {
            return res.status(404).json({ message: 'Testimonial not found' });
        }
        
        res.json(testimonial);
    } catch (err) {
        logger.error('Error fetching testimonial:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Submit a testimonial (user)
exports.submitTestimonial = async (req, res) => {
    try {
        const { content, rating } = req.body;
        const userId = req.userId;
        
        // Validate required fields
        if (!content || !rating) {
            return res.status(400).json({ message: 'Content and rating are required' });
        }
        
        // Check if user has already submitted a testimonial
        const existingTestimonial = await Testimonial.findOne({ user: userId });
        
        if (existingTestimonial) {
            return res.status(400).json({ message: 'You have already submitted a testimonial' });
        }
        
        // Create testimonial object
        const testimonialData = {
            name: req.body.name || req.userName,
            content,
            rating: parseInt(rating),
            user: userId
        };
        
        // If there's a file uploaded, upload it to Cloudinary
        if (req.file) {
            try {
                // Upload to Cloudinary
                const cloudinaryResult = await uploadToCloudinary(req.file.path);
                
                // Add Cloudinary data to testimonial
                testimonialData.imageUrl = cloudinaryResult.url;
                testimonialData.cloudinaryId = cloudinaryResult.publicId;
            } catch (uploadError) {
                logger.error('Error uploading to Cloudinary:', uploadError);
                return res.status(500).json({ message: 'Error uploading image', error: uploadError.message });
            }
        }
        
        // Create and save the testimonial
        const testimonial = new Testimonial(testimonialData);
        await testimonial.save();
        
        res.status(201).json({
            message: 'Testimonial submitted successfully and pending approval',
            testimonial
        });
    } catch (err) {
        logger.error('Error submitting testimonial:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Approve or reject a testimonial (admin)
exports.moderateTestimonial = async (req, res) => {
    try {
        const { approved, content, name, rating, featured } = req.body;
        
        // Find the testimonial
        const testimonial = await Testimonial.findById(req.params.id);
        
        if (!testimonial) {
            return res.status(404).json({ message: 'Testimonial not found' });
        }
        
        // Update testimonial fields
        testimonial.approved = approved === 'true' || approved === true;
        
        if (content) testimonial.content = content;
        if (name) testimonial.name = name;
        if (rating) testimonial.rating = parseInt(rating);
        if (featured !== undefined) {
            testimonial.featured = featured === 'true' || featured === true;
        }
        
        // If there's a file uploaded, update the image
        if (req.file) {
            try {
                // Delete old image from Cloudinary if it exists
                if (testimonial.cloudinaryId) {
                    await deleteFromCloudinary(testimonial.cloudinaryId, 'image');
                }
                
                // Upload new image to Cloudinary
                const cloudinaryResult = await uploadToCloudinary(req.file.path);
                
                // Update Cloudinary data
                testimonial.imageUrl = cloudinaryResult.url;
                testimonial.cloudinaryId = cloudinaryResult.publicId;
            } catch (uploadError) {
                logger.error('Error updating testimonial image on Cloudinary:', uploadError);
                return res.status(500).json({ message: 'Error updating image', error: uploadError.message });
            }
        }
        
        // Save the updated testimonial
        await testimonial.save();
        
        res.json({
            message: `Testimonial ${testimonial.approved ? 'approved' : 'rejected'} successfully`,
            testimonial
        });
    } catch (err) {
        logger.error('Error moderating testimonial:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Delete a testimonial
exports.deleteTestimonial = async (req, res) => {
    try {
        const testimonial = await Testimonial.findById(req.params.id);
        
        if (!testimonial) {
            return res.status(404).json({ message: 'Testimonial not found' });
        }
        
        // Delete image from Cloudinary if it exists
        if (testimonial.cloudinaryId) {
            try {
                await deleteFromCloudinary(testimonial.cloudinaryId, 'image');
            } catch (deleteError) {
                logger.error('Error deleting from Cloudinary:', deleteError);
                // Continue with testimonial deletion even if Cloudinary deletion fails
            }
        }
        
        // Delete the testimonial
        await Testimonial.findByIdAndDelete(req.params.id);
        
        res.json({ message: 'Testimonial deleted successfully' });
    } catch (err) {
        logger.error('Error deleting testimonial:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};