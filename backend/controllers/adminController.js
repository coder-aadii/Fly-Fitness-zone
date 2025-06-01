// controllers/adminController.js
const User = require('../models/User');
const Post = require('../models/Post');
const Trainer = require('../models/Trainer');
const ClassSchedule = require('../models/ClassSchedule');
const Gallery = require('../models/Gallery');
const Testimonial = require('../models/Testimonial');
const Contact = require('../models/Contact');
const PushNotification = require('../models/PushNotification');
const { deleteFromCloudinary } = require('../utils/cloudinaryUpload');
const logger = require('../utils/logger');

// Get admin profile
exports.getAdminProfile = async (req, res) => {
    try {
        // Special handling for the admin user which doesn't exist in the database
        if (req.userId === 'admin-id') {
            return res.json({
                _id: 'admin-id',
                name: 'Admin',
                email: process.env.ADMIN_EMAIL || 'admin@flyfitness.com',
                role: 'admin'
            });
        }
        
        // For regular admin users from the database
        const admin = await User.findById(req.userId).select('-password');
        
        if (!admin) {
            return res.status(404).json({ message: 'Admin not found' });
        }
        
        res.json(admin);
    } catch (err) {
        logger.error('Error fetching admin profile:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Get all users
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find({ role: 'user' }).select('-password');
        
        // If no users exist yet, return an empty array
        if (users.length === 0) {
            return res.json([]);
        }
        
        // Transform user data to match expected format in frontend
        const formattedUsers = users.map(user => ({
            id: user._id,
            name: user.name,
            email: user.email,
            status: user.suspended ? 'Suspended' : (user.isVerified ? 'Active' : 'Pending'),
            joiningDate: user.joiningDate || user.createdAt,
            profileComplete: Boolean(user.weight && user.height && user.gender),
            suspended: user.suspended,
            suspensionReason: user.suspensionReason
        }));
        
        res.json(formattedUsers);
    } catch (err) {
        logger.error('Error fetching users:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Get admin dashboard stats
exports.getAdminStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments({ role: 'user' });
        const verifiedUsers = await User.countDocuments({ role: 'user', isVerified: true });
        const unverifiedUsers = await User.countDocuments({ role: 'user', isVerified: false });
        const suspendedUsers = await User.countDocuments({ role: 'user', suspended: true });
        
        const totalPosts = await Post.countDocuments();
        const activePosts = await Post.countDocuments({ expiresAt: { $gt: new Date() } });
        const featuredPosts = await Post.countDocuments({ featured: true });
        
        const totalTrainers = await Trainer.countDocuments();
        const totalClasses = await ClassSchedule.countDocuments();
        const totalGalleryImages = await Gallery.countDocuments();
        const totalTestimonials = await Testimonial.countDocuments();
        const pendingTestimonials = await Testimonial.countDocuments({ approved: false });
        const totalContacts = await Contact.countDocuments();
        const unresolvedContacts = await Contact.countDocuments({ resolved: false });
        const totalNotifications = await PushNotification.countDocuments();
        
        res.json({
            totalUsers,
            activeUsers: verifiedUsers,
            pendingUsers: unverifiedUsers,
            suspendedUsers,
            totalPosts,
            activePosts,
            expiredPosts: totalPosts - activePosts,
            featuredPosts,
            totalTrainers,
            totalClasses,
            totalGalleryImages,
            totalTestimonials,
            pendingTestimonials,
            totalContacts,
            unresolvedContacts,
            totalNotifications,
            pendingPayments: 0, // Mock data
            totalRevenue: 0, // Mock data
            newUsersLast30Days: Math.floor(totalUsers * 0.3), // Mock data
            pendingVerification: unverifiedUsers,
            usersWithCompleteProfile: Math.floor(verifiedUsers * 0.7) // Mock data
        });
    } catch (err) {
        logger.error('Error fetching admin stats:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Post Management
// Get all posts for admin
exports.getAllPosts = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        
        const posts = await Post.find()
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate('user', 'name email profileImage')
            .populate('comments.user', 'name profileImage');
            
        const total = await Post.countDocuments();
        
        res.json({
            posts,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            total
        });
    } catch (err) {
        logger.error('Error fetching posts for admin:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Toggle featured status of a post
exports.toggleFeaturedPost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        
        post.featured = !post.featured;
        await post.save();
        
        res.json({ 
            message: `Post ${post.featured ? 'marked as featured' : 'unmarked as featured'}`,
            featured: post.featured
        });
    } catch (err) {
        logger.error('Error toggling featured post:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Delete a post (admin version)
exports.deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        
        // If post has media on Cloudinary, delete it
        if (post.cloudinaryId) {
            try {
                const resourceType = post.mediaType === 'video' ? 'video' : 'image';
                await deleteFromCloudinary(post.cloudinaryId, resourceType);
            } catch (deleteError) {
                logger.error('Error deleting from Cloudinary:', deleteError);
                // Continue with post deletion even if Cloudinary deletion fails
            }
        }
        
        await Post.findByIdAndDelete(req.params.id);
        res.json({ message: 'Post deleted successfully' });
    } catch (err) {
        logger.error('Error deleting post:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// User Management
// Suspend a user
exports.suspendUser = async (req, res) => {
    try {
        const { reason } = req.body;
        
        if (!reason) {
            return res.status(400).json({ message: 'Suspension reason is required' });
        }
        
        const user = await User.findById(req.params.id);
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        user.suspended = true;
        user.suspensionReason = reason;
        user.suspendedAt = new Date();
        
        await user.save();
        
        res.json({ message: 'User suspended successfully' });
    } catch (err) {
        logger.error('Error suspending user:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Unsuspend a user
exports.unsuspendUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        user.suspended = false;
        user.suspensionReason = undefined;
        user.suspendedAt = undefined;
        
        await user.save();
        
        res.json({ message: 'User unsuspended successfully' });
    } catch (err) {
        logger.error('Error unsuspending user:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Delete a user
exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        // Delete user's posts
        const posts = await Post.find({ user: user._id });
        
        // Delete Cloudinary resources for each post
        for (const post of posts) {
            if (post.cloudinaryId) {
                try {
                    const resourceType = post.mediaType === 'video' ? 'video' : 'image';
                    await deleteFromCloudinary(post.cloudinaryId, resourceType);
                } catch (deleteError) {
                    logger.error('Error deleting post media from Cloudinary:', deleteError);
                    // Continue with deletion even if Cloudinary deletion fails
                }
            }
        }
        
        // Delete user's profile image from Cloudinary
        if (user.cloudinaryId) {
            try {
                await deleteFromCloudinary(user.cloudinaryId, 'image');
            } catch (deleteError) {
                logger.error('Error deleting profile image from Cloudinary:', deleteError);
                // Continue with deletion even if Cloudinary deletion fails
            }
        }
        
        // Delete all user's posts
        await Post.deleteMany({ user: user._id });
        
        // Delete user's testimonials
        await Testimonial.deleteMany({ user: user._id });
        
        // Delete the user
        await User.findByIdAndDelete(req.params.id);
        
        res.json({ message: 'User and all associated data deleted successfully' });
    } catch (err) {
        logger.error('Error deleting user:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};