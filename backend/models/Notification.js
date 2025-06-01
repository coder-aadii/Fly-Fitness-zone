// models/Notification.js
const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
    recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    type: {
        type: String,
        enum: ['like', 'comment', 'follow', 'system', 'achievement'],
        required: true
    },
    content: {
        type: String,
        required: true
    },
    relatedPost: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'
    },
    read: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now,
        index: true
    },
    // Notifications will automatically be deleted after 30 days
    expiresAt: {
        type: Date,
        default: function() {
            const now = new Date();
            return new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days in milliseconds
        },
        index: { expires: 0 } // This will automatically delete documents when expiresAt is reached
    }
});

// Create indexes for efficient querying
NotificationSchema.index({ recipient: 1, read: 1, createdAt: -1 });

module.exports = mongoose.model('Notification', NotificationSchema);