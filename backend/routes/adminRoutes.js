// routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const adminAuth = require('../middleware/adminAuth');

// Get admin profile
// GET /api/admin/profile
router.get('/profile', adminAuth, async (req, res) => {
    try {
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
        res.json(users);
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
        
        res.json({
            totalUsers,
            verifiedUsers,
            unverifiedUsers
        });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

module.exports = router;