// routes/testimonialRoutes.js
const express = require('express');
const router = express.Router();
const testimonialController = require('../controllers/testimonialController');
const adminAuth = require('../middleware/adminAuth');
const auth = require('../middleware/auth');
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
        fileSize: 2 * 1024 * 1024 // 2MB limit
    }
});

// Public routes (accessible to all)
router.get('/approved', testimonialController.getApprovedTestimonials);

// User routes (requires authentication)
router.post('/', auth, upload.single('image'), testimonialController.submitTestimonial);

// Admin routes
router.get('/', adminAuth, testimonialController.getAllTestimonials);
router.get('/:id', adminAuth, testimonialController.getTestimonial);
router.put('/:id', adminAuth, upload.single('image'), testimonialController.moderateTestimonial);
router.delete('/:id', adminAuth, testimonialController.deleteTestimonial);

module.exports = router;