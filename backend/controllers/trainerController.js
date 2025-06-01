// controllers/trainerController.js
const Trainer = require('../models/Trainer');
const ClassSchedule = require('../models/ClassSchedule');
const { uploadToCloudinary, deleteFromCloudinary } = require('../utils/cloudinaryUpload');
const logger = require('../utils/logger');

// Get all trainers
exports.getAllTrainers = async (req, res) => {
    try {
        const trainers = await Trainer.find().sort({ name: 1 });
        res.json(trainers);
    } catch (err) {
        logger.error('Error fetching trainers:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Get a single trainer
exports.getTrainer = async (req, res) => {
    try {
        const trainer = await Trainer.findById(req.params.id);
        
        if (!trainer) {
            return res.status(404).json({ message: 'Trainer not found' });
        }
        
        res.json(trainer);
    } catch (err) {
        logger.error('Error fetching trainer:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Create a new trainer
exports.createTrainer = async (req, res) => {
    try {
        const { name, specialty, bio, email, phone, experience, certifications, socialMedia } = req.body;
        
        // Validate required fields
        if (!name || !specialty || !bio) {
            return res.status(400).json({ message: 'Name, specialty, and bio are required' });
        }
        
        // Create trainer object
        const trainerData = {
            name,
            specialty,
            bio,
            email,
            phone,
            experience: experience ? parseInt(experience) : undefined,
            certifications: certifications ? JSON.parse(certifications) : [],
            socialMedia: socialMedia ? JSON.parse(socialMedia) : {}
        };
        
        // If there's a file uploaded, upload it to Cloudinary
        if (req.file) {
            try {
                // Upload to Cloudinary
                const cloudinaryResult = await uploadToCloudinary(req.file.path);
                
                // Add Cloudinary data to trainer
                trainerData.profileImage = cloudinaryResult.url;
                trainerData.cloudinaryId = cloudinaryResult.publicId;
            } catch (uploadError) {
                logger.error('Error uploading to Cloudinary:', uploadError);
                return res.status(500).json({ message: 'Error uploading profile image', error: uploadError.message });
            }
        }
        
        // Create and save the trainer
        const trainer = new Trainer(trainerData);
        await trainer.save();
        
        res.status(201).json(trainer);
    } catch (err) {
        logger.error('Error creating trainer:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Update a trainer
exports.updateTrainer = async (req, res) => {
    try {
        const { name, specialty, bio, email, phone, experience, certifications, socialMedia, active } = req.body;
        
        // Find the trainer
        const trainer = await Trainer.findById(req.params.id);
        
        if (!trainer) {
            return res.status(404).json({ message: 'Trainer not found' });
        }
        
        // Update trainer fields
        if (name) trainer.name = name;
        if (specialty) trainer.specialty = specialty;
        if (bio) trainer.bio = bio;
        if (email) trainer.email = email;
        if (phone) trainer.phone = phone;
        if (experience) trainer.experience = parseInt(experience);
        if (certifications) trainer.certifications = JSON.parse(certifications);
        if (socialMedia) trainer.socialMedia = JSON.parse(socialMedia);
        if (active !== undefined) trainer.active = active === 'true' || active === true;
        
        // If there's a file uploaded, upload it to Cloudinary
        if (req.file) {
            try {
                // Delete old image from Cloudinary if it exists
                if (trainer.cloudinaryId) {
                    await deleteFromCloudinary(trainer.cloudinaryId, 'image');
                }
                
                // Upload new image to Cloudinary
                const cloudinaryResult = await uploadToCloudinary(req.file.path);
                
                // Update Cloudinary data
                trainer.profileImage = cloudinaryResult.url;
                trainer.cloudinaryId = cloudinaryResult.publicId;
            } catch (uploadError) {
                logger.error('Error updating profile image on Cloudinary:', uploadError);
                return res.status(500).json({ message: 'Error updating profile image', error: uploadError.message });
            }
        }
        
        // Save the updated trainer
        await trainer.save();
        
        res.json(trainer);
    } catch (err) {
        logger.error('Error updating trainer:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Delete a trainer
exports.deleteTrainer = async (req, res) => {
    try {
        const trainer = await Trainer.findById(req.params.id);
        
        if (!trainer) {
            return res.status(404).json({ message: 'Trainer not found' });
        }
        
        // Check if trainer is assigned to any classes
        const assignedClasses = await ClassSchedule.find({ trainer: trainer._id });
        
        if (assignedClasses.length > 0) {
            return res.status(400).json({ 
                message: 'Cannot delete trainer as they are assigned to classes',
                assignedClasses: assignedClasses.map(c => c.className)
            });
        }
        
        // Delete profile image from Cloudinary if it exists
        if (trainer.cloudinaryId) {
            try {
                await deleteFromCloudinary(trainer.cloudinaryId, 'image');
            } catch (deleteError) {
                logger.error('Error deleting from Cloudinary:', deleteError);
                // Continue with trainer deletion even if Cloudinary deletion fails
            }
        }
        
        // Delete the trainer
        await Trainer.findByIdAndDelete(req.params.id);
        
        res.json({ message: 'Trainer deleted successfully' });
    } catch (err) {
        logger.error('Error deleting trainer:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};