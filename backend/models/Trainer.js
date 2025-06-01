// models/Trainer.js
const mongoose = require('mongoose');

const TrainerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    specialty: {
        type: String,
        required: true,
        trim: true
    },
    bio: {
        type: String,
        required: true,
        trim: true
    },
    profileImage: {
        type: String
    },
    cloudinaryId: {
        type: String
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address']
    },
    phone: {
        type: String,
        trim: true
    },
    experience: {
        type: Number,
        min: 0
    },
    certifications: [{
        type: String,
        trim: true
    }],
    socialMedia: {
        instagram: String,
        facebook: String,
        twitter: String,
        linkedin: String
    },
    active: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Trainer', TrainerSchema);