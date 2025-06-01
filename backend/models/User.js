// models/User.js

const mongoose = require('mongoose');

// Schema for tracking weight history
const weightHistorySchema = new mongoose.Schema({
    date: {
        type: Date,
        default: Date.now
    },
    weight: {
        type: Number,
        required: true
    }
});

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'],
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
    },
    otp: String,
    otpExpiry: Date,
    isVerified: {
        type: Boolean,
        default: false
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    // Editable profile fields
    joiningDate: {
        type: Date,
        default: Date.now
    },
    feesDueDate: {
        type: Date,
    },
    weight: {
        type: Number,
        min: [0, 'Weight must be positive'],
    },
    weightHistory: [weightHistorySchema],
    height: {
        type: Number,
    },
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Other'],
    },
    dob: {
        type: Date,
    },
    contactNumber: {
        type: String,
        match: [/^[0-9]{10}$/, 'Please enter a valid 10-digit phone number'],
    },
    emergencyContactName: {
        type: String,
    },
    emergencyContactPhone: {
        type: String,
    },
    activityLevel: {
        type: String,
        enum: ['Beginner', 'Intermediate', 'Advanced'],
    },
    preferredWorkoutTime: {
        type: String,
        enum: ['Morning', 'Evening', 'Any'],
    },
    purpose: {
        type: String,
    },
    fitnessGoal: {
        type: String,
    },
    shortTermGoal: {
        type: String,
    },
    healthIssues: {
        type: String,
    },
    trainerPreference: {
        type: String,
        enum: ['Male', 'Female', 'No Preference'],
        default: 'No Preference'
    },
    profileImage: {
        type: String
    },
    // Cloudinary fields for profile image
    cloudinaryId: {
        type: String
    },
    // Account status
    suspended: {
        type: Boolean,
        default: false
    },
    suspensionReason: {
        type: String
    },
    suspendedAt: {
        type: Date
    },
    // Push notification subscription
    pushSubscription: {
        type: Object
    }
}, {
    timestamps: true
});


module.exports = mongoose.model('User', UserSchema);
