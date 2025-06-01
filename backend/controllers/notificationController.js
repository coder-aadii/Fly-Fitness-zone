// controllers/notificationController.js
const Notification = require('../models/Notification');
const User = require('../models/User');
const logger = require('../utils/logger');

/**
 * Get all notifications for the authenticated user
 */
exports.getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ recipient: req.userId })
            .sort({ createdAt: -1 })
            .populate('sender', 'name profileImage')
            .populate('relatedPost', 'content')
            .limit(50);

        return res.json({ notifications });
    } catch (error) {
        logger.error('Error fetching notifications:', error);
        return res.status(500).json({ message: 'Server error' });
    }
};

/**
 * Mark a notification as read
 */
exports.markAsRead = async (req, res) => {
    try {
        const notification = await Notification.findOne({
            _id: req.params.id,
            recipient: req.userId
        });

        if (!notification) {
            return res.status(404).json({ message: 'Notification not found' });
        }

        notification.read = true;
        await notification.save();

        return res.json({ message: 'Notification marked as read' });
    } catch (error) {
        logger.error('Error marking notification as read:', error);
        return res.status(500).json({ message: 'Server error' });
    }
};

/**
 * Mark all notifications as read
 */
exports.markAllAsRead = async (req, res) => {
    try {
        await Notification.updateMany(
            { recipient: req.userId, read: false },
            { $set: { read: true } }
        );

        return res.json({ message: 'All notifications marked as read' });
    } catch (error) {
        logger.error('Error marking all notifications as read:', error);
        return res.status(500).json({ message: 'Server error' });
    }
};

/**
 * Delete a notification
 */
exports.deleteNotification = async (req, res) => {
    try {
        const notification = await Notification.findOne({
            _id: req.params.id,
            recipient: req.userId
        });

        if (!notification) {
            return res.status(404).json({ message: 'Notification not found' });
        }

        await Notification.deleteOne({ _id: notification._id });

        return res.json({ message: 'Notification deleted' });
    } catch (error) {
        logger.error('Error deleting notification:', error);
        return res.status(500).json({ message: 'Server error' });
    }
};

/**
 * Create a notification (internal function, not exposed as API)
 */
exports.createNotification = async (recipientId, senderId, type, content, relatedPostId = null) => {
    try {
        console.log('Creating notification:', {
            recipient: recipientId,
            sender: senderId,
            type,
            content,
            relatedPost: relatedPostId
        });

        const notification = new Notification({
            recipient: recipientId,
            sender: senderId,
            type,
            content,
            relatedPost: relatedPostId
        });

        const savedNotification = await notification.save();
        console.log('Notification created successfully:', savedNotification);
        return savedNotification;
    } catch (error) {
        console.error('Error creating notification:', error);
        logger.error('Error creating notification:', error);
        throw error;
    }
};

/**
 * Get unread notification count
 */
exports.getUnreadCount = async (req, res) => {
    try {
        const count = await Notification.countDocuments({
            recipient: req.userId,
            read: false
        });

        return res.json({ count });
    } catch (error) {
        logger.error('Error getting unread notification count:', error);
        return res.status(500).json({ message: 'Server error' });
    }
};