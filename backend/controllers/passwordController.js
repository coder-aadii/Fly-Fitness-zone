const User = require('../models/User');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const config = require('../config');

// Create a transporter for sending emails
let transporter;
try {
  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: config.EMAIL_USER,
      pass: config.EMAIL_PASSWORD
    }
  });
} catch (error) {
  console.error('Email configuration error:', error);
}

// Function to send password reset email
const sendPasswordResetEmail = async (email, resetUrl) => {
  // Only attempt to send email if transporter is configured
  if (transporter) {
    try {
      await transporter.sendMail({
        from: `"Fly Fitness Zone" <${process.env.EMAIL_USER || 'noreply@flyfitness.com'}>`,
        to: email,
        subject: 'Password Reset - Fly Fitness Zone',
        html: `
          <h1>Password Reset Request</h1>
          <p>You requested a password reset for your Fly Fitness Zone account.</p>
          <p>Please click the link below to reset your password:</p>
          <a href="${resetUrl}" style="display: inline-block; padding: 10px 20px; background-color: #f97316; color: white; text-decoration: none; border-radius: 5px;">Reset Password</a>
          <p>This link will expire in 1 hour.</p>
          <p>If you didn't request this, please ignore this email and your password will remain unchanged.</p>
        `
      });
      return true;
    } catch (error) {
      console.error('Error sending email:', error);
      return false;
    }
  }
  return false;
}

// Generate a random token
const generateToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

// Forgot password controller
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found with this email' });
    }

    // Generate reset token
    const resetToken = generateToken();

    // Set token expiration (1 hour from now)
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour in milliseconds

    await user.save();

    // Create the reset URL
    const resetUrl = `${config.FRONTEND_URL}/reset-password?token=${resetToken}`;

    // Log the reset URL for development purposes
    // console.log('Password reset link:', resetUrl);

    // Try to send the email
    const emailSent = await sendPasswordResetEmail(user.email, resetUrl);

    res.json({
      message: 'Password reset link has been sent to your email',
      // In development or if email sending fails, return the token for testing
      resetUrl: (process.env.NODE_ENV === 'development' || !emailSent) ? resetUrl : undefined
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Reset password controller
exports.resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;

    // Find user by reset token and check if token is still valid
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Password reset token is invalid or has expired' });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Update user's password and clear reset token fields
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.json({ message: 'Password has been reset successfully' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};