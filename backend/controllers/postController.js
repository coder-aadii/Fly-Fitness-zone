// controllers/postController.js
const Post = require('../models/Post');
const User = require('../models/User');
const fs = require('fs');
const path = require('path');

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

        // If there's a file uploaded, add it to the post
        if (req.file) {
            postData.media = `/uploads/${req.file.filename}`;
            postData.mediaType = req.file.mimetype.startsWith('image/') ? 'image' : 'video';
        }

        // Create and save the post
        const post = new Post(postData);
        await post.save();

        // Populate user details before sending response
        await post.populate('user', 'name profileImage');

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

        // If post has media, delete the file
        if (post.media) {
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