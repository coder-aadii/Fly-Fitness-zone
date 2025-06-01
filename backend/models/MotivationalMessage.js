// models/MotivationalMessage.js
const mongoose = require('mongoose');

const MotivationalMessageSchema = new mongoose.Schema({
    message: {
        type: String,
        required: true,
        trim: true
    },
    type: {
        type: String,
        enum: ['morning', 'evening'],
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    createdBy: {
        type: String,
        default: 'Admin'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('MotivationalMessage', MotivationalMessageSchema);