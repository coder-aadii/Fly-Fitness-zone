// routes/pushNotificationRoutes.js
const express = require('express');
const router = express.Router();
const pushNotificationController = require('../controllers/pushNotificationController');
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

// Public routes with optional authentication
router.get('/vapid-public-key', pushNotificationController.getVapidPublicKey);
router.post('/subscribe', auth, pushNotificationController.subscribe);
router.post('/unsubscribe', auth, pushNotificationController.unsubscribe);

// Admin routes
router.get('/', adminAuth, pushNotificationController.getAllNotifications);
router.get('/:id', adminAuth, pushNotificationController.getNotification);
router.post('/send', adminAuth, upload.single('image'), pushNotificationController.sendNotification);
router.delete('/:id', adminAuth, pushNotificationController.deleteNotification);

module.exports = router;