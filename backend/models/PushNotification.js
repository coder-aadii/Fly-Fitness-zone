// models/PushNotification.js
const mongoose = require('mongoose');

const PushNotificationSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    message: {
        type: String,
        required: true,
        trim: true
    },
    imageUrl: {
        type: String
    },
    cloudinaryId: {
        type: String
    },
    sentAt: {
        type: Date,
        default: Date.now
    },
    sentBy: {
        type: String,
        default: 'Admin'
    },
    targetAudience: {
        type: String,
        enum: ['All Users', 'Active Users', 'Inactive Users', 'Specific Users'],
        default: 'All Users'
    },
    targetUsers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    clickAction: {
        type: String,
        default: ''
    },
    deliveryStats: {
        sent: {
            type: Number,
            default: 0
        },
        delivered: {
            type: Number,
            default: 0
        },
        clicked: {
            type: Number,
            default: 0
        }
    }
});

module.exports = mongoose.model('PushNotification', PushNotificationSchema);