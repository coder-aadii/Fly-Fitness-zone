// routes/classScheduleRoutes.js
const express = require('express');
const router = express.Router();
const classScheduleController = require('../controllers/classScheduleController');
const adminAuth = require('../middleware/adminAuth');
const auth = require('../middleware/auth');

// Public routes (accessible to all)
router.get('/', classScheduleController.getAllClasses);
router.get('/:id', classScheduleController.getClass);

// Admin-only routes
router.post('/', adminAuth, classScheduleController.createClass);
router.put('/:id', adminAuth, classScheduleController.updateClass);
router.delete('/:id', adminAuth, classScheduleController.deleteClass);

module.exports = router;