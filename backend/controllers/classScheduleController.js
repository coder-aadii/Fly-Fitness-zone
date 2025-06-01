// controllers/classScheduleController.js
const ClassSchedule = require('../models/ClassSchedule');
const Trainer = require('../models/Trainer');
const logger = require('../utils/logger');

// Get all class schedules
exports.getAllClasses = async (req, res) => {
    try {
        const classes = await ClassSchedule.find()
            .sort({ startTime: 1 })
            .populate('trainer', 'name specialty profileImage');
            
        res.json(classes);
    } catch (err) {
        logger.error('Error fetching class schedules:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Get a single class schedule
exports.getClass = async (req, res) => {
    try {
        const classSchedule = await ClassSchedule.findById(req.params.id)
            .populate('trainer', 'name specialty profileImage');
            
        if (!classSchedule) {
            return res.status(404).json({ message: 'Class schedule not found' });
        }
        
        res.json(classSchedule);
    } catch (err) {
        logger.error('Error fetching class schedule:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Create a new class schedule
exports.createClass = async (req, res) => {
    try {
        const { 
            className, 
            description, 
            trainer, 
            startTime, 
            endTime, 
            daysOfWeek, 
            location, 
            capacity, 
            level 
        } = req.body;
        
        // Validate required fields
        if (!className || !trainer || !startTime || !endTime || !daysOfWeek || !location) {
            return res.status(400).json({ 
                message: 'Class name, trainer, start time, end time, days of week, and location are required' 
            });
        }
        
        // Check if trainer exists
        const trainerExists = await Trainer.findById(trainer);
        if (!trainerExists) {
            return res.status(400).json({ message: 'Trainer not found' });
        }
        
        // Parse days of week
        let parsedDaysOfWeek;
        try {
            parsedDaysOfWeek = typeof daysOfWeek === 'string' ? JSON.parse(daysOfWeek) : daysOfWeek;
        } catch (error) {
            return res.status(400).json({ message: 'Invalid days of week format' });
        }
        
        // Create class schedule object
        const classData = {
            className,
            description,
            trainer,
            startTime: new Date(startTime),
            endTime: new Date(endTime),
            daysOfWeek: parsedDaysOfWeek,
            location,
            capacity: capacity ? parseInt(capacity) : 20,
            level: level || 'All Levels'
        };
        
        // Create and save the class schedule
        const classSchedule = new ClassSchedule(classData);
        await classSchedule.save();
        
        // Populate trainer details before sending response
        await classSchedule.populate('trainer', 'name specialty profileImage');
        
        res.status(201).json(classSchedule);
    } catch (err) {
        logger.error('Error creating class schedule:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Update a class schedule
exports.updateClass = async (req, res) => {
    try {
        const { 
            className, 
            description, 
            trainer, 
            startTime, 
            endTime, 
            daysOfWeek, 
            location, 
            capacity, 
            level,
            active
        } = req.body;
        
        // Find the class schedule
        const classSchedule = await ClassSchedule.findById(req.params.id);
        
        if (!classSchedule) {
            return res.status(404).json({ message: 'Class schedule not found' });
        }
        
        // Update class schedule fields
        if (className) classSchedule.className = className;
        if (description) classSchedule.description = description;
        
        // If trainer is being updated, check if the new trainer exists
        if (trainer && trainer !== classSchedule.trainer.toString()) {
            const trainerExists = await Trainer.findById(trainer);
            if (!trainerExists) {
                return res.status(400).json({ message: 'Trainer not found' });
            }
            classSchedule.trainer = trainer;
        }
        
        if (startTime) classSchedule.startTime = new Date(startTime);
        if (endTime) classSchedule.endTime = new Date(endTime);
        
        // Parse days of week if provided
        if (daysOfWeek) {
            try {
                classSchedule.daysOfWeek = typeof daysOfWeek === 'string' ? JSON.parse(daysOfWeek) : daysOfWeek;
            } catch (error) {
                return res.status(400).json({ message: 'Invalid days of week format' });
            }
        }
        
        if (location) classSchedule.location = location;
        if (capacity) classSchedule.capacity = parseInt(capacity);
        if (level) classSchedule.level = level;
        if (active !== undefined) classSchedule.active = active === 'true' || active === true;
        
        // Save the updated class schedule
        await classSchedule.save();
        
        // Populate trainer details before sending response
        await classSchedule.populate('trainer', 'name specialty profileImage');
        
        res.json(classSchedule);
    } catch (err) {
        logger.error('Error updating class schedule:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Delete a class schedule
exports.deleteClass = async (req, res) => {
    try {
        const classSchedule = await ClassSchedule.findById(req.params.id);
        
        if (!classSchedule) {
            return res.status(404).json({ message: 'Class schedule not found' });
        }
        
        // Delete the class schedule
        await ClassSchedule.findByIdAndDelete(req.params.id);
        
        res.json({ message: 'Class schedule deleted successfully' });
    } catch (err) {
        logger.error('Error deleting class schedule:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};