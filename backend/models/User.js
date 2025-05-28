// models/User.js

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

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
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
    },
    // Editable profile fields
    joiningDate: {
        type: Date,
    },
    feesDueDate: {
        type: Date,
    },
    weight: {
        type: Number,
    },
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
    purposeToJoin: {
        type: String,
    },
    fitnessGoal: {
        type: String,
    },
    shortTermGoal: {
        type: String,
    },
    trainerPreference: {
        type: String,
        enum: ['Male', 'Female', 'No Preference'],
        default: 'No Preference'
    }
}, {
    timestamps: true
});

// Hash password before saving
UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Compare password
UserSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
