// controllers/postController.js
const Post = require('../models/Post');
const User = require('../models/User');
const fs = require('fs');
const path = require('path');
const { uploadToCloudinary, deleteFromCloudinary } = require('../utils/cloudinaryUpload');
const { createNotification } = require('./notificationController');
const { trackNotificationEngagement } = require('../utils/motivationalNotifications');
const webpush = require('web-push');
const logger = require('../utils/logger');

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

// Helper function to send push notification
const sendPushNotification = async (recipient, title, message, url = null, imageUrl = null) => {
    try {
        if (!recipient.pushSubscription) {
            return false;
        }

        const payload = JSON.stringify({
            title,
            message,
            url,
            image: imageUrl,
            timestamp: new Date().toISOString()
        });

        await webpush.sendNotification(recipient.pushSubscription, payload);
        return true;
    } catch (error) {
        logger.error(`Error sending push notification to user ${recipient._id}:`, error);
        
        // If subscription is invalid, remove it
        if (error.statusCode === 410) {
            recipient.pushSubscription = null;
            await recipient.save();
        }
        return false;
    }
};

// Get all posts (with pagination)
exports.getPosts = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // Find posts, sort by newest first, populate user details
        const posts = await Post.find()
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate('user', 'name profileImage')
            .populate('comments.user', 'name profileImage');

        // Get total count for pagination
        const total = await Post.countDocuments();

        res.json({
            posts,
            totalPages: Math.ceil(total / limit),
            currentPage: page
        });
    } catch (err) {
        console.error('Error fetching posts:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Create a new post
exports.createPost = async (req, res) => {
    try {
        const { content } = req.body;
        const userId = req.userId;

        // Check if there's content or media
        if (!content && !req.file) {
            return res.status(400).json({ message: 'Post must have content or media' });
        }

        // Create post object
        const postData = {
            user: userId,
            content: content || ''
        };

        // If there's a file uploaded, upload it to Cloudinary
        if (req.file) {
            try {
                // Upload to Cloudinary
                const cloudinaryResult = await uploadToCloudinary(req.file.path);
                
                // Add Cloudinary data to post
                postData.media = cloudinaryResult.url;
                postData.cloudinaryId = cloudinaryResult.publicId;
                postData.mediaType = cloudinaryResult.resourceType === 'image' ? 'image' : 'video';
            } catch (uploadError) {
                console.error('Error uploading to Cloudinary:', uploadError);
                return res.status(500).json({ message: 'Error uploading media', error: uploadError.message });
            }
        }

        // Create and save the post
        const post = new Post(postData);
        await post.save();

        // Track if this post was created after receiving a motivational notification
        await trackNotificationEngagement(userId, post.createdAt);

        // Populate user details before sending response
        await post.populate('user', 'name profileImage');

        // Send notifications to all users about the new post
        try {
            // Get the user who created the post
            const postCreator = await User.findById(userId, 'name profileImage');
            
            // Get all users except the creator
            const users = await User.find({ 
                _id: { $ne: userId },
                suspended: false,
                pushSubscription: { $exists: true, $ne: null }
            });
            
            // Create notification content
            const notificationTitle = `New post from ${postCreator.name}`;
            let notificationContent = content ? 
                `${content.substring(0, 50)}${content.length > 50 ? '...' : ''}` : 
                'Shared a new post';
                
            if (postData.mediaType === 'image') {
                notificationContent += ' with an image';
            } else if (postData.mediaType === 'video') {
                notificationContent += ' with a video';
            }
            
            // Create in-app notifications for all users
            const notificationPromises = users.map(async (user) => {
                try {
                    // Create in-app notification
                    await createNotification(
                        user._id,  // recipient
                        userId,    // sender (post creator)
                        'post',    // notification type
                        `${postCreator.name} shared a new post`,
                        post._id   // related post
                    );
                    
                    // Send push notification if user has subscription
                    if (user.pushSubscription) {
                        await sendPushNotification(
                            user,
                            notificationTitle,
                            notificationContent,
                            `/feed`,  // URL to redirect to
                            postData.media  // Image URL if available
                        );
                    }
                } catch (notifError) {
                    console.error(`Error sending notification to user ${user._id}:`, notifError);
                    // Continue with other notifications even if one fails
                }
            });
            
            // Wait for all notifications to be processed
            await Promise.all(notificationPromises);
            
        } catch (notifError) {
            console.error('Error sending post notifications:', notifError);
            // Continue even if notifications fail
        }

        res.status(201).json(post);
    } catch (err) {
        console.error('Error creating post:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Like or unlike a post
exports.likePost = async (req, res) => {
    try {
        const postId = req.params.id;
        const userId = req.userId;

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Check if user already liked the post
        const alreadyLiked = post.likes.includes(userId);

        if (alreadyLiked) {
            // Unlike the post
            post.likes = post.likes.filter(id => id.toString() !== userId);
        } else {
            // Like the post
            post.likes.push(userId);
            
            // Create notification if the post owner is not the same as the liker
            if (post.user.toString() !== userId) {
                // Get user name for notification content
                const user = await User.findById(userId, 'name');
                const postOwner = await User.findById(post.user);
                const notificationContent = `${user.name} liked your post`;
                
                try {
                    // Create in-app notification
                    await createNotification(
                        post.user, // recipient (post owner)
                        userId,    // sender (user who liked)
                        'like',    // notification type
                        notificationContent,
                        postId     // related post
                    );
                    
                    // Send push notification if post owner has subscription
                    if (postOwner && postOwner.pushSubscription) {
                        await sendPushNotification(
                            postOwner,
                            'New Like',
                            notificationContent,
                            `/feed`,  // URL to redirect to
                            null      // No image for like notifications
                        );
                    }
                } catch (notifError) {
                    console.error('Error creating like notification:', notifError);
                    // Continue even if notification creation fails
                }
            }
        }

        await post.save();
        res.json({ likes: post.likes, liked: !alreadyLiked });
    } catch (err) {
        console.error('Error liking post:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Add a comment to a post
exports.addComment = async (req, res) => {
    try {
        const { text } = req.body;
        const postId = req.params.id;
        const userId = req.userId;

        if (!text) {
            return res.status(400).json({ message: 'Comment text is required' });
        }

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Create new comment
        const newComment = {
            user: userId,
            text,
            createdAt: new Date()
        };

        // Add comment to post
        post.comments.push(newComment);
        await post.save();

        // Get the newly added comment (last one in the array)
        const addedComment = post.comments[post.comments.length - 1];

        // Populate user details for the comment
        await Post.populate(post, {
            path: 'comments.user',
            select: 'name profileImage',
            match: { _id: userId }
        });

        // Find the populated comment
        const populatedComment = post.comments.find(
            comment => comment._id.toString() === addedComment._id.toString()
        );

        // Create notification if the post owner is not the same as the commenter
        if (post.user.toString() !== userId) {
            // Get user name for notification content
            const user = await User.findById(userId, 'name');
            const postOwner = await User.findById(post.user);
            const notificationContent = `${user.name} commented on your post: "${text.substring(0, 30)}${text.length > 30 ? '...' : ''}"`;
            
            try {
                // Create in-app notification
                await createNotification(
                    post.user, // recipient (post owner)
                    userId,    // sender (user who commented)
                    'comment', // notification type
                    notificationContent,
                    postId     // related post
                );
                
                // Send push notification if post owner has subscription
                if (postOwner && postOwner.pushSubscription) {
                    await sendPushNotification(
                        postOwner,
                        'New Comment',
                        notificationContent,
                        `/feed`,  // URL to redirect to
                        null      // No image for comment notifications
                    );
                }
            } catch (notifError) {
                console.error('Error creating comment notification:', notifError);
                // Continue even if notification creation fails
            }
        }

        res.status(201).json(populatedComment);
    } catch (err) {
        console.error('Error adding comment:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Delete a post
exports.deletePost = async (req, res) => {
    try {
        const postId = req.params.id;
        const userId = req.userId;

        // Find the post
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Check if user is the owner of the post
        if (post.user.toString() !== userId) {
            return res.status(403).json({ message: 'Not authorized to delete this post' });
        }

        // If post has media on Cloudinary, delete it
        if (post.cloudinaryId) {
            try {
                const resourceType = post.mediaType === 'video' ? 'video' : 'image';
                await deleteFromCloudinary(post.cloudinaryId, resourceType);
            } catch (deleteError) {
                console.error('Error deleting from Cloudinary:', deleteError);
                // Continue with post deletion even if Cloudinary deletion fails
            }
        }
        // For backward compatibility - if there's a local file, delete it
        else if (post.media && post.media.startsWith('/uploads/')) {
            const mediaPath = path.join(__dirname, '..', post.media.replace(/^\//, ''));
            if (fs.existsSync(mediaPath)) {
                fs.unlinkSync(mediaPath);
            }
        }

        // Delete the post
        await Post.findByIdAndDelete(postId);
        res.json({ message: 'Post deleted successfully' });
    } catch (err) {
        console.error('Error deleting post:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Delete a comment
exports.deleteComment = async (req, res) => {
    try {
        const { postId, commentId } = req.params;
        const userId = req.userId;

        // Find the post
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Find the comment
        const comment = post.comments.id(commentId);
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        // Check if user is authorized to delete the comment (comment owner or post owner)
        if (comment.user.toString() !== userId && post.user.toString() !== userId) {
            return res.status(403).json({ message: 'Not authorized to delete this comment' });
        }

        // Remove the comment using pull operator
        post.comments.pull(commentId);
        await post.save();

        res.json({ message: 'Comment deleted successfully' });
    } catch (err) {
        console.error('Error deleting comment:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Get posts by a specific user
exports.getUserPosts = async (req, res) => {
    try {
        const userId = req.params.userId || req.userId;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // Find posts by user, sort by newest first
        const posts = await Post.find({ user: userId })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate('user', 'name profileImage')
            .populate('comments.user', 'name profileImage');

        // Get total count for pagination
        const total = await Post.countDocuments({ user: userId });

        res.json({
            posts,
            totalPages: Math.ceil(total / limit),
            currentPage: page
        });
    } catch (err) {
        console.error('Error fetching user posts:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};