// routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const adminAuth = require('../middleware/adminAuth');

// Get admin profile
// GET /api/admin/profile
router.get('/profile', adminAuth, async (req, res) => {
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
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// Get all users
// GET /api/admin/users
router.get('/users', adminAuth, async (req, res) => {
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
            status: user.isVerified ? 'Active' : 'Pending',
            joiningDate: user.joiningDate || user.createdAt,
            profileComplete: Boolean(user.weight && user.height && user.gender)
        }));
        
        res.json(formattedUsers);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// Get admin dashboard stats
// GET /api/admin/stats
router.get('/stats', adminAuth, async (req, res) => {
    try {
        const totalUsers = await User.countDocuments({ role: 'user' });
        const verifiedUsers = await User.countDocuments({ role: 'user', isVerified: true });
        const unverifiedUsers = await User.countDocuments({ role: 'user', isVerified: false });
        
        // Return mock stats if no users exist yet
        if (totalUsers === 0) {
            return res.json({
                totalUsers: 0,
                activeUsers: 0,
                pendingPayments: 0,
                totalRevenue: 0,
                newUsersLast30Days: 0,
                pendingVerification: 0,
                usersWithCompleteProfile: 0
            });
        }
        
        res.json({
            totalUsers,
            activeUsers: verifiedUsers,
            pendingPayments: 0, // Mock data
            totalRevenue: 0, // Mock data
            newUsersLast30Days: totalUsers, // Assuming all users are new
            pendingVerification: unverifiedUsers,
            usersWithCompleteProfile: Math.floor(verifiedUsers * 0.7) // Mock data
        });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

module.exports = router;