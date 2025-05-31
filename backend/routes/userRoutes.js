const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        const uploadDir = path.join(__dirname, '../uploads');
        // Create directory if it doesn't exist
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: function(req, file, cb) {
        // Create unique filename with original extension
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, 'profile-' + uniqueSuffix + ext);
    }
});

// File filter to only allow image files
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed!'), false);
    }
};

const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});

// Get user profile
// GET /api/users/profile
router.get('/profile', auth, async (req, res) => {
    try {
        const user = await User.findById(req.userId).select('-password');
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// Update user profile
// PUT /api/users/profile
router.put('/profile', auth, async (req, res) => {
    try {
        const {
            weight,
            height,
            gender,
            dob,
            purpose,
            fitnessGoal,
            shortTermGoal,
            healthIssues
        } = req.body;

        // Find user and update profile
        const user = await User.findById(req.userId);
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        // Update user fields
        if (weight) user.weight = weight;
        if (height) user.height = height;
        if (gender) user.gender = gender;
        if (dob) user.dob = dob;
        if (purpose) user.purpose = purpose;
        if (fitnessGoal) user.fitnessGoal = fitnessGoal;
        if (shortTermGoal) user.shortTermGoal = shortTermGoal;
        if (healthIssues) user.healthIssues = healthIssues;
        
        // If weight changed, add to weight history
        if (weight && (!user.weight || user.weight !== weight)) {
            if (!user.weightHistory) {
                user.weightHistory = [];
            }
            
            user.weightHistory.push({
                date: new Date(),
                weight: weight
            });
        }
        
        await user.save();
        
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// Upload profile image
// POST /api/users/profile-image
router.post('/profile-image', auth, upload.single('profileImage'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const user = await User.findById(req.userId);
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // If user already has a profile image, delete the old one
        if (user.profileImage) {
            const oldImagePath = path.join(__dirname, '..', user.profileImage.replace(/^\//, ''));
            if (fs.existsSync(oldImagePath)) {
                fs.unlinkSync(oldImagePath);
            }
        }

        // Set the new profile image path
        const imageUrl = `/uploads/${req.file.filename}`;
        user.profileImage = imageUrl;
        
        await user.save();
        
        res.json({ 
            message: 'Profile image uploaded successfully',
            profileImage: imageUrl
        });
    } catch (err) {
        console.error('Error uploading profile image:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// Change password
// POST /api/users/change-password
router.post('/change-password', auth, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        
        if (!currentPassword || !newPassword) {
            return res.status(400).json({ message: 'Current password and new password are required' });
        }
        
        const user = await User.findById(req.userId);
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        // Verify current password
        const bcrypt = require('bcryptjs');
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        
        if (!isMatch) {
            return res.status(400).json({ message: 'Current password is incorrect' });
        }
        
        // Hash new password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        
        await user.save();
        
        res.json({ message: 'Password updated successfully' });
    } catch (err) {
        console.error('Error changing password:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// Change email
// POST /api/users/change-email
router.post('/change-email', auth, async (req, res) => {
    try {
        const { newEmail, password } = req.body;
        
        if (!newEmail || !password) {
            return res.status(400).json({ message: 'New email and password are required' });
        }
        
        const user = await User.findById(req.userId);
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        // Verify password
        const bcrypt = require('bcryptjs');
        const isMatch = await bcrypt.compare(password, user.password);
        
        if (!isMatch) {
            return res.status(400).json({ message: 'Password is incorrect' });
        }
        
        // Check if email is already in use
        const existingUser = await User.findOne({ email: newEmail });
        if (existingUser) {
            return res.status(400).json({ message: 'Email is already in use' });
        }
        
        // In a real application, you would send a verification email here
        // For now, we'll just update the email directly
        user.email = newEmail;
        
        await user.save();
        
        res.json({ message: 'Email updated successfully' });
    } catch (err) {
        console.error('Error changing email:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

module.exports = router;