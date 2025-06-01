// controllers/pushNotificationController.js
const PushNotification = require('../models/PushNotification');
const User = require('../models/User');
const { uploadToCloudinary, deleteFromCloudinary } = require('../utils/cloudinaryUpload');
const logger = require('../utils/logger');
const webpush = require('web-push');

// Configure web push
const vapidKeys = {
    publicKey: process.env.VAPID_PUBLIC_KEY || 'BNbKwE3NUkGtPWeTDSu0w5yMtR9LHd9GVQzekEo-zCiwgNpux3eDTnxSLtgXxOXzQVfDHoCHWYbSrJIVcgd5QSo',
    privateKey: process.env.VAPID_PRIVATE_KEY || 'TVe_nJBa0YQbfLiOIf7LpRFMvLPp4xOoXm_z9rgdgDo'
};

webpush.setVapidDetails(
    'mailto:admin@flyfitness.com',
    vapidKeys.publicKey,
    vapidKeys.privateKey
);

// Get VAPID public key
exports.getVapidPublicKey = (req, res) => {
    try {
        res.json({ publicKey: vapidKeys.publicKey });
    } catch (err) {
        logger.error('Error getting VAPID public key:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Get all push notifications (admin)
exports.getAllNotifications = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        
        const notifications = await PushNotification.find()
            .sort({ sentAt: -1 })
            .skip(skip)
            .limit(limit);
            
        const total = await PushNotification.countDocuments();
        
        res.json({
            notifications,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            total
        });
    } catch (err) {
        logger.error('Error fetching push notifications:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Get a single push notification
exports.getNotification = async (req, res) => {
    try {
        const notification = await PushNotification.findById(req.params.id);
        
        if (!notification) {
            return res.status(404).json({ message: 'Push notification not found' });
        }
        
        res.json(notification);
    } catch (err) {
        logger.error('Error fetching push notification:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Send a push notification
exports.sendNotification = async (req, res) => {
    try {
        const { title, message, targetAudience, clickAction } = req.body;
        
        // Validate required fields
        if (!title || !message) {
            return res.status(400).json({ message: 'Title and message are required' });
        }
        
        // Create notification object
        const notificationData = {
            title,
            message,
            targetAudience: targetAudience || 'All Users',
            clickAction: clickAction || '',
            sentBy: req.userId === 'admin-id' ? 'Admin' : req.userId
        };
        
        // If there's a file uploaded, upload it to Cloudinary
        if (req.file) {
            try {
                // Upload to Cloudinary
                const cloudinaryResult = await uploadToCloudinary(req.file.path);
                
                // Add Cloudinary data to notification
                notificationData.imageUrl = cloudinaryResult.url;
                notificationData.cloudinaryId = cloudinaryResult.publicId;
            } catch (uploadError) {
                logger.error('Error uploading to Cloudinary:', uploadError);
                return res.status(500).json({ message: 'Error uploading image', error: uploadError.message });
            }
        }
        
        // Create and save the notification
        const notification = new PushNotification(notificationData);
        await notification.save();
        
        // Get users based on target audience
        let users = [];
        switch (targetAudience) {
            case 'Active Users':
                users = await User.find({ isVerified: true, suspended: false, pushSubscription: { $exists: true, $ne: null } });
                break;
            case 'Inactive Users':
                users = await User.find({ isVerified: false, suspended: false, pushSubscription: { $exists: true, $ne: null } });
                break;
            case 'Specific Users':
                if (req.body.targetUsers) {
                    const targetUserIds = typeof req.body.targetUsers === 'string' 
                        ? JSON.parse(req.body.targetUsers) 
                        : req.body.targetUsers;
                    users = await User.find({ 
                        _id: { $in: targetUserIds }, 
                        pushSubscription: { $exists: true, $ne: null } 
                    });
                }
                break;
            default: // 'All Users'
                users = await User.find({ suspended: false, pushSubscription: { $exists: true, $ne: null } });
        }
        
        // Send push notifications
        const notificationPayload = {
            title,
            message,
            image: notificationData.imageUrl,
            url: clickAction,
            timestamp: new Date().toISOString()
        };
        
        let sent = 0;
        const sendPromises = users.map(async (user) => {
            try {
                if (user.pushSubscription) {
                    await webpush.sendNotification(
                        user.pushSubscription,
                        JSON.stringify(notificationPayload)
                    );
                    sent++;
                }
            } catch (error) {
                logger.error(`Error sending push notification to user ${user._id}:`, error);
                // If subscription is invalid, remove it
                if (error.statusCode === 410) {
                    user.pushSubscription = null;
                    await user.save();
                }
            }
        });
        
        await Promise.all(sendPromises);
        
        // Update delivery stats
        notification.deliveryStats.sent = sent;
        await notification.save();
        
        res.status(201).json({
            message: `Push notification sent to ${sent} users`,
            notification
        });
    } catch (err) {
        logger.error('Error sending push notification:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Delete a push notification
exports.deleteNotification = async (req, res) => {
    try {
        const notification = await PushNotification.findById(req.params.id);
        
        if (!notification) {
            return res.status(404).json({ message: 'Push notification not found' });
        }
        
        // Delete image from Cloudinary if it exists
        if (notification.cloudinaryId) {
            try {
                await deleteFromCloudinary(notification.cloudinaryId, 'image');
            } catch (deleteError) {
                logger.error('Error deleting from Cloudinary:', deleteError);
                // Continue with notification deletion even if Cloudinary deletion fails
            }
        }
        
        // Delete the notification
        await PushNotification.findByIdAndDelete(req.params.id);
        
        res.json({ message: 'Push notification deleted successfully' });
    } catch (err) {
        logger.error('Error deleting push notification:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Subscribe to push notifications (for users)
exports.subscribe = async (req, res) => {
    try {
        const subscription = req.body;
        
        if (!subscription || !subscription.endpoint) {
            return res.status(400).json({ message: 'Valid subscription object is required' });
        }
        
        // If user is logged in, save subscription to their profile
        if (req.userId && req.userId !== 'admin-id') {
            const user = await User.findById(req.userId);
            
            if (user) {
                user.pushSubscription = subscription;
                await user.save();
            }
        }
        
        // Send a welcome notification
        try {
            const payload = JSON.stringify({
                title: 'Welcome to Fly Fitness Zone!',
                message: 'You have successfully subscribed to notifications.',
                timestamp: new Date().toISOString()
            });
            
            await webpush.sendNotification(subscription, payload);
        } catch (error) {
            logger.error('Error sending welcome notification:', error);
            // Continue even if welcome notification fails
        }
        
        res.status(201).json({ message: 'Subscription successful' });
    } catch (err) {
        logger.error('Error subscribing to push notifications:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Unsubscribe from push notifications
exports.unsubscribe = async (req, res) => {
    try {
        const { endpoint } = req.body;
        
        if (!endpoint) {
            return res.status(400).json({ message: 'Endpoint is required' });
        }
        
        // If user is logged in, remove subscription from their profile
        if (req.userId && req.userId !== 'admin-id') {
            const user = await User.findById(req.userId);
            
            if (user && user.pushSubscription && user.pushSubscription.endpoint === endpoint) {
                user.pushSubscription = null;
                await user.save();
            }
        }
        
        res.json({ message: 'Unsubscribed successfully' });
    } catch (err) {
        logger.error('Error unsubscribing from push notifications:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};