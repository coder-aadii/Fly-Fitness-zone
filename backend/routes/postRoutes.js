// routes/postRoutes.js
const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const auth = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer for temporary file storage before Cloudinary upload
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

// Get all posts (with pagination)
// GET /api/posts
router.get('/', auth, postController.getPosts);

// Create a new post
// POST /api/posts
router.post('/', auth, upload.single('media'), postController.createPost);

// Like or unlike a post
// POST /api/posts/:id/like
router.post('/:id/like', auth, postController.likePost);

// Add a comment to a post
// POST /api/posts/:id/comment
router.post('/:id/comment', auth, postController.addComment);

// Delete a post
// DELETE /api/posts/:id
router.delete('/:id', auth, postController.deletePost);

// Get posts by a specific user
// GET /api/posts/user/:userId
router.get('/user/:userId', auth, postController.getUserPosts);

// Get current user's posts
// GET /api/posts/user
router.get('/user', auth, postController.getUserPosts);

module.exports = router;