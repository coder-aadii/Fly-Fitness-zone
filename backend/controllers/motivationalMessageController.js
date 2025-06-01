// controllers/motivationalMessageController.js
const MotivationalMessage = require('../models/MotivationalMessage');
const logger = require('../utils/logger');

// Get all motivational messages
exports.getAllMessages = async (req, res) => {
    try {
        const { type } = req.query;
        
        // Filter by type if provided
        const filter = type ? { type } : {};
        
        const messages = await MotivationalMessage.find(filter)
            .sort({ createdAt: -1 });
            
        res.json(messages);
    } catch (err) {
        logger.error('Error fetching motivational messages:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Create a new motivational message
exports.createMessage = async (req, res) => {
    try {
        const { message, type } = req.body;
        
        // Validate required fields
        if (!message || !type) {
            return res.status(400).json({ message: 'Message and type are required' });
        }
        
        // Create message object
        const messageData = {
            message,
            type,
            createdBy: req.userId === 'admin-id' ? 'Admin' : req.userId
        };
        
        // Create and save the message
        const motivationalMessage = new MotivationalMessage(messageData);
        await motivationalMessage.save();
        
        res.status(201).json(motivationalMessage);
    } catch (err) {
        logger.error('Error creating motivational message:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Update a motivational message
exports.updateMessage = async (req, res) => {
    try {
        const { message, type, isActive } = req.body;
        
        // Find the message
        const motivationalMessage = await MotivationalMessage.findById(req.params.id);
        
        if (!motivationalMessage) {
            return res.status(404).json({ message: 'Motivational message not found' });
        }
        
        // Update fields
        if (message) motivationalMessage.message = message;
        if (type) motivationalMessage.type = type;
        if (isActive !== undefined) motivationalMessage.isActive = isActive;
        
        // Save the updated message
        await motivationalMessage.save();
        
        res.json(motivationalMessage);
    } catch (err) {
        logger.error('Error updating motivational message:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Delete a motivational message
exports.deleteMessage = async (req, res) => {
    try {
        const motivationalMessage = await MotivationalMessage.findById(req.params.id);
        
        if (!motivationalMessage) {
            return res.status(404).json({ message: 'Motivational message not found' });
        }
        
        // Delete the message
        await MotivationalMessage.findByIdAndDelete(req.params.id);
        
        res.json({ message: 'Motivational message deleted successfully' });
    } catch (err) {
        logger.error('Error deleting motivational message:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};