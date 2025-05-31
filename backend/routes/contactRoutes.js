const express = require('express');
const router = express.Router();
const sendContactEmail = require('../utils/sendContactEmail');

// Handle contact form submissions
// POST /api/contact
router.post('/', async (req, res) => {
    try {
        const { name, email, phone, message } = req.body;
        
        // Validate input
        if (!name || !email || !message) {
            return res.status(400).json({ 
                success: false,
                message: "Name, email, and message are required" 
            });
        }
        
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ 
                success: false,
                message: "Invalid email format" 
            });
        }
        
        // Send the contact emails
        await sendContactEmail({ name, email, phone, message });
        
        // Return success response
        res.status(200).json({ 
            success: true,
            message: "Your message has been sent successfully. We'll get back to you soon!" 
        });
    } catch (err) {
        console.error('Contact form submission error:', err);
        res.status(500).json({ 
            success: false,
            message: "Failed to send your message. Please try again later.",
            error: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
    }
});

module.exports = router;