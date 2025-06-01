// routes/notificationRoutes.js
const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const auth = require('../middleware/auth');

// Get all notifications for the authenticated user
router.get('/', auth, notificationController.getNotifications);

// Get unread notification count
router.get('/unread-count', auth, notificationController.getUnreadCount);

// Mark a notification as read
router.put('/:id/read', auth, notificationController.markAsRead);

// Mark all notifications as read
router.put('/mark-all-read', auth, notificationController.markAllAsRead);

// Delete a notification
router.delete('/:id', auth, notificationController.deleteNotification);

// Test endpoint to create a notification (for development only)
router.post('/test-create', auth, async (req, res) => {
    try {
        const { content, type = 'system' } = req.body;
        
        if (!content) {
            return res.status(400).json({ message: 'Content is required' });
        }
        
        const notification = await notificationController.createNotification(
            req.userId,  // recipient (current user)
            req.userId,  // sender (also current user for test)
            type,        // notification type
            content,     // content from request
            null         // no related post
        );
        
        res.status(201).json({ 
            message: 'Test notification created successfully', 
            notification 
        });
    } catch (error) {
        console.error('Error creating test notification:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;