const express = require('express');
const router = express.Router();
const User = require('../models/User');
const adminAuth = require('../middleware/adminAuth');

// Get admin profile
// GET /api/admin/profile
router.get('/profile', adminAuth, async (req, res) => {
    try {
        // For the hardcoded admin, return a static profile
        const adminEmail = process.env.ADMIN_EMAIL || 'admin@flyfitness.com';
        
        res.json({
            id: 'admin-id',
            name: 'Admin',
            email: adminEmail,
            role: 'admin'
        });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// Get all users (admin only)
// GET /api/admin/users
router.get('/users', adminAuth, async (req, res) => {
    try {
        // Find all users and exclude sensitive information
        const users = await User.find().select('-password -otp -otpExpiry');
        
        // Format the response to include additional information
        const formattedUsers = users.map(user => ({
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            isVerified: user.isVerified,
            joiningDate: user.joiningDate || user.createdAt,
            status: user.isVerified ? 'Active' : 'Pending Verification',
            profileComplete: Boolean(user.weight && user.height && user.gender),
            lastUpdated: user.updatedAt
        }));
        
        res.json(formattedUsers);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// Get user statistics (admin only)
// GET /api/admin/stats
router.get('/stats', adminAuth, async (req, res) => {
    try {
        // Get real user statistics from the database
        const totalUsers = await User.countDocuments();
        const verifiedUsers = await User.countDocuments({ isVerified: true });
        const unverifiedUsers = totalUsers - verifiedUsers;
        const usersWithProfile = await User.countDocuments({ 
            $and: [
                { weight: { $exists: true, $ne: null } },
                { height: { $exists: true, $ne: null } },
                { gender: { $exists: true, $ne: null } }
            ]
        });
        
        // Get users registered in the last 30 days
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const newUsers = await User.countDocuments({ createdAt: { $gte: thirtyDaysAgo } });
        
        // For payment and revenue, we'll still use mock data
        // In a real app, you would calculate this from payment records
        const monthlyFee = 1000; // ₹1000 per month per user
        const estimatedRevenue = verifiedUsers * monthlyFee;
        
        // Calculate pending payments (mock data)
        // Assume 20% of active users have pending payments
        const pendingPayments = Math.floor(verifiedUsers * 0.2);
        
        const stats = {
            totalUsers,
            activeUsers: verifiedUsers,
            pendingVerification: unverifiedUsers,
            usersWithCompleteProfile: usersWithProfile,
            newUsersLast30Days: newUsers,
            pendingPayments,
            totalRevenue: estimatedRevenue
        };
        
        res.json(stats);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// Update user (admin only)
// PUT /api/admin/users/:id
router.put('/users/:id', adminAuth, async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        ).select('-password');
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// Delete user (admin only)
// DELETE /api/admin/users/:id
router.delete('/users/:id', adminAuth, async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        res.json({ message: 'User deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

module.exports = router;