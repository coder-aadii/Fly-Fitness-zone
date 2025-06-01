// routes/contactRoutes.js
const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');
const adminAuth = require('../middleware/adminAuth');

// Public routes (accessible to all)
router.post('/', contactController.submitMessage);

// Admin routes
router.get('/', adminAuth, contactController.getAllMessages);
router.get('/:id', adminAuth, contactController.getMessage);
router.put('/:id/toggle-resolved', adminAuth, contactController.toggleResolved);
router.delete('/:id', adminAuth, contactController.deleteMessage);

module.exports = router;