const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const sendOTPEmail = require('../utils/sendOTPEmail'); // helper to send email

// Register Controller
exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Validate input
        if (!name || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Invalid email format" });
        }

        // Validate password strength
        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters long" });
        }

        // Check if user already exists
        const userExist = await User.findOne({ email });
        if (userExist) return res.status(400).json({ message: "User already exists" });

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Generate OTP and expiry
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes

        // Create new user with hashed password & OTP
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            otp,
            otpExpiry,
            isVerified: false
        });

        await newUser.save();

        // Send OTP via email
        try {
            await sendOTPEmail(email, otp);
            // console.log(`OTP sent to ${email}: ${otp}`);
        } catch (emailError) {
            console.error('Failed to send OTP email:', emailError);
            // Continue registration process even if email fails
            // This allows testing without email configuration
        }

        res.status(201).json({ 
            message: "Registration successful. Please verify your email via OTP.",
            // Include OTP in response for testing purposes in development environment
            ...(process.env.NODE_ENV === 'development' && { otp })
        });
    } catch (err) {
        console.error('Registration error:', err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

// Login Controller
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Get admin credentials from environment variables
        const adminEmail = process.env.ADMIN_EMAIL || 'admin@flyfitness.com';
        const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

        // Check if login is for admin - use strict comparison and trim inputs
        const trimmedEmail = email.trim().toLowerCase();
        const trimmedPassword = password.trim();
        const trimmedAdminEmail = adminEmail.trim().toLowerCase();
        
        if (trimmedEmail === trimmedAdminEmail && trimmedPassword === adminPassword) {
            // Create JWT token for admin
            const adminPayload = {
                userId: 'admin-id',
                email: adminEmail,
                role: 'admin'
            };

            const adminToken = jwt.sign(
                adminPayload,
                process.env.JWT_SECRET || 'fallback-secret-key',
                { expiresIn: '1d' }
            );

            // Return admin success response
            return res.status(200).json({
                token: adminToken,
                user: {
                    id: 'admin-id',
                    name: 'Admin',
                    email: adminEmail,
                    role: 'admin'
                }
            });
        }

        // Regular user login flow
        // Check if email exists
        const user = await User.findOne({ email });

        if (!user) return res.status(400).json({ message: "Invalid credentials" });

        // Check if email is verified
        if (!user.isVerified) return res.status(401).json({ message: "Please verify your email first." });

        // Compare hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        // Create JWT token
        const payload = {
            userId: user._id,
            email: user.email,
            role: user.role
        };

        const token = jwt.sign(
            payload,
            process.env.JWT_SECRET || 'fallback-secret-key',
            { expiresIn: '1d' }
        );

        // Return success response
        res.status(200).json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

// Verify OTP Controller
exports.verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;

        // Validate input
        if (!email || !otp) {
            return res.status(400).json({ message: "Email and OTP are required" });
        }

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check if OTP is valid and not expired
        if (user.otp !== otp) {
            return res.status(400).json({ message: "Invalid OTP" });
        }

        if (user.otpExpiry < Date.now()) {
            return res.status(400).json({ message: "OTP has expired" });
        }

        // Mark user as verified and clear OTP
        user.isVerified = true;
        user.otp = undefined;
        user.otpExpiry = undefined;
        await user.save();

        res.status(200).json({ message: "Email verified successfully" });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

// Forgot Password Controller
exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        // Validate input
        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(20).toString('hex');
        const resetTokenExpiry = Date.now() + 3600000; // 1 hour

        // Save token to user
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = resetTokenExpiry;
        await user.save();

        // In a real application, you would send an email with the reset link
        // For now, just return the token in the response
        res.status(200).json({
            message: "Password reset link sent to your email",
            resetToken // Include for testing purposes
        });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

// Reset Password Controller
exports.resetPassword = async (req, res) => {
    try {
        const { token, password } = req.body;

        // Validate input
        if (!token || !password) {
            return res.status(400).json({ message: "Token and password are required" });
        }

        // Find user by reset token
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ message: "Invalid or expired token" });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Update user password and clear reset token
        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        res.status(200).json({ message: "Password reset successful" });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};
