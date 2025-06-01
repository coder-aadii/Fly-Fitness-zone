// routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const adminAuth = require('../middleware/adminAuth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer for temporary file storage
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        const tempDir = path.join(__dirname, '../temp');
        // Create directory if it doesn't exist
        if (!fs.existsSync(tempDir)) {
            fs.mkdirSync(tempDir, { recursive: true });
        }
        cb(null, tempDir);
    },
    filename: function(req, file, cb) {
        // Create unique filename with original extension
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, 'temp-' + uniqueSuffix + ext);
    }
});

// File filter to only allow image and video files
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
        cb(null, true);
    } else {
        cb(new Error('Only image and video files are allowed!'), false);
    }
};

const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit
    }
});

// Admin Profile
router.get('/profile', adminAuth, adminController.getAdminProfile);

// User Management
router.get('/users', adminAuth, adminController.getAllUsers);
router.put('/users/:id/suspend', adminAuth, adminController.suspendUser);
router.put('/users/:id/unsuspend', adminAuth, adminController.unsuspendUser);
router.delete('/users/:id', adminAuth, adminController.deleteUser);

// Dashboard Stats
router.get('/stats', adminAuth, adminController.getAdminStats);

// Post Management
router.get('/posts', adminAuth, adminController.getAllPosts);
router.put('/posts/:id/feature', adminAuth, adminController.toggleFeaturedPost);
router.delete('/posts/:id', adminAuth, adminController.deletePost);

module.exports = router;