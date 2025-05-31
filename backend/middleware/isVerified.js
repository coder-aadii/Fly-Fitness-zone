const User = require('../models/User');

module.exports = async (req, res, next) => {
    try {
        // Ensure req.userId is present from auth middleware
        if (!req.userId) {
            return res.status(401).json({ message: 'Authorization denied' });
        }

        // Find user by ID
        const user = await User.findById(req.userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if user is verified
        if (!user.isVerified) {
            return res.status(403).json({ message: 'Email not verified. Access denied.' });
        }

        // User is verified, proceed
        next();
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
