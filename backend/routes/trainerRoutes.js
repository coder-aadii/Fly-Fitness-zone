// routes/trainerRoutes.js
const express = require('express');
const router = express.Router();
const trainerController = require('../controllers/trainerController');
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
            try {
                fs.mkdirSync(tempDir, { recursive: true });
                console.log(`Created temp directory: ${tempDir}`);
            } catch (err) {
                console.error(`Error creating temp directory: ${err.message}`);
            }
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
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});

// Public routes (accessible to all)
router.get('/', trainerController.getAllTrainers);
router.get('/:id', trainerController.getTrainer);

// Admin-only routes
router.post('/', adminAuth, upload.single('profileImage'), trainerController.createTrainer);
router.put('/:id', adminAuth, upload.single('profileImage'), trainerController.updateTrainer);
router.delete('/:id', adminAuth, trainerController.deleteTrainer);

module.exports = router;