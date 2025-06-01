// models/Post.js
const mongoose = require('mongoose');
const { trackForCleanup } = require('../utils/cleanupJob');

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
    cloudinaryId: {
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
    featured: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    // Posts will automatically be deleted after 24 hours
    expiresAt: {
        type: Date,
        default: function() {
            const now = new Date();
            return new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24 hours in milliseconds
        },
        index: { expires: 0 } // This will automatically delete documents when expiresAt is reached
    }
});

// Create indexes for efficient querying
PostSchema.index({ user: 1, createdAt: -1 });
PostSchema.index({ createdAt: -1 });

// Pre-save hook to track Cloudinary resources for cleanup
PostSchema.pre('save', function(next) {
    // If this is a new post with a Cloudinary ID, track it for cleanup
    if (this.isNew && this.cloudinaryId) {
        const resourceType = this.mediaType === 'video' ? 'video' : 'image';
        trackForCleanup(this.cloudinaryId, resourceType)
            .catch(err => console.error('Error tracking Cloudinary resource:', err));
    }
    next();
});

module.exports = mongoose.model('Post', PostSchema);