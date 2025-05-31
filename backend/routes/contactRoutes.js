// routes/contactRoutes.js
const express = require('express');
const router = express.Router();
const sendContactEmail = require('../utils/sendContactEmail');

// Send contact form email
// POST /api/contact
router.post('/', async (req, res) => {
    try {
        const { name, email, phone, message } = req.body;
        
        if (!name || !email || !message) {
            return res.status(400).json({ 
                success: false,
                message: 'Name, email, and message are required' 
            });
        }
        
        // Send email
        await sendContactEmail(name, email, phone, message);
        
        res.json({ 
            success: true,
            message: 'Your message has been sent successfully' 
        });
    } catch (err) {
        console.error('Contact form error:', err);
        res.status(500).json({ 
            success: false,
            message: 'Failed to send message. Please try again later.' 
        });
    }
});

module.exports = router;