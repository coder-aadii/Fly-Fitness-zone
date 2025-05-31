// models/Post.js
const mongoose = require('mongoose');

// Schema for comments
const CommentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    text: {
        type: String,
        required: true,
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Main Post schema
const PostSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    content: {
        type: String,
        trim: true
    },
    media: {
        type: String
    },
    mediaType: {
        type: String,
        enum: ['image', 'video', null]
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    comments: [CommentSchema],
    createdAt: {
        type: Date,
        default: Date.now
    },
    // Posts will automatically be deleted after 36 hours
    expiresAt: {
        type: Date,
        default: function() {
            const now = new Date();
            return new Date(now.getTime() + 36 * 60 * 60 * 1000); // 36 hours in milliseconds
        },
        index: { expires: 0 } // This will automatically delete documents when expiresAt is reached
    }
});

// Create indexes for efficient querying
PostSchema.index({ user: 1, createdAt: -1 });
PostSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Post', PostSchema);