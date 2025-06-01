// controllers/contactController.js
const Contact = require('../models/Contact');
const logger = require('../utils/logger');

// Get all contact messages (admin)
exports.getAllMessages = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const status = req.query.status; // 'resolved', 'unresolved', 'all'
        
        // Build query based on status filter
        let query = {};
        if (status === 'resolved') {
            query.resolved = true;
        } else if (status === 'unresolved') {
            query.resolved = false;
        }
        
        const messages = await Contact.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);
            
        const total = await Contact.countDocuments(query);
        
        res.json({
            messages,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            total
        });
    } catch (err) {
        logger.error('Error fetching contact messages:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Get a single contact message
exports.getMessage = async (req, res) => {
    try {
        const message = await Contact.findById(req.params.id);
        
        if (!message) {
            return res.status(404).json({ message: 'Contact message not found' });
        }
        
        res.json(message);
    } catch (err) {
        logger.error('Error fetching contact message:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Submit a contact message (public)
exports.submitMessage = async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;
        
        // Validate required fields
        if (!name || !email || !subject || !message) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        
        // Create contact message object
        const contactData = {
            name,
            email,
            subject,
            message
        };
        
        // Create and save the contact message
        const contactMessage = new Contact(contactData);
        await contactMessage.save();
        
        res.status(201).json({
            message: 'Your message has been sent successfully. We will get back to you soon.',
            contactMessage
        });
    } catch (err) {
        logger.error('Error submitting contact message:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Mark a message as resolved/unresolved (admin)
exports.toggleResolved = async (req, res) => {
    try {
        const message = await Contact.findById(req.params.id);
        
        if (!message) {
            return res.status(404).json({ message: 'Contact message not found' });
        }
        
        // Toggle resolved status
        message.resolved = !message.resolved;
        await message.save();
        
        res.json({
            message: `Message marked as ${message.resolved ? 'resolved' : 'unresolved'}`,
            resolved: message.resolved
        });
    } catch (err) {
        logger.error('Error toggling message resolved status:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Delete a contact message (admin)
exports.deleteMessage = async (req, res) => {
    try {
        const message = await Contact.findById(req.params.id);
        
        if (!message) {
            return res.status(404).json({ message: 'Contact message not found' });
        }
        
        // Delete the message
        await Contact.findByIdAndDelete(req.params.id);
        
        res.json({ message: 'Contact message deleted successfully' });
    } catch (err) {
        logger.error('Error deleting contact message:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};