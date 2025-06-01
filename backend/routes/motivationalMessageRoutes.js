// routes/motivationalMessageRoutes.js
const express = require('express');
const router = express.Router();
const motivationalMessageController = require('../controllers/motivationalMessageController');
const adminAuth = require('../middleware/adminAuth');

// Admin-only routes
router.get('/', adminAuth, motivationalMessageController.getAllMessages);
router.post('/', adminAuth, motivationalMessageController.createMessage);
router.put('/:id', adminAuth, motivationalMessageController.updateMessage);
router.delete('/:id', adminAuth, motivationalMessageController.deleteMessage);

module.exports = router;