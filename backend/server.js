// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');
const contactRoutes = require('./routes/contactRoutes');
const postRoutes = require('./routes/postRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const { scheduleCleanupJob } = require('./utils/cleanupJob');
const logger = require('./utils/logger');

// Load environment variables
dotenv.config();

// Set NODE_ENV to 'development' if not set
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = 'development';
}

logger.info(`Server starting in ${process.env.NODE_ENV} mode`);

const app = express();

// Configure CORS
app.use(cors({
    origin: function(origin, callback) {
        // Allow requests with no origin (like mobile apps, curl requests)
        if(!origin) return callback(null, true);
        
        // Check if the origin is allowed
        const allowedOrigins = [
            'http://localhost:3000',
            'https://flyfitnesszone.netlify.app',
            process.env.CORS_ORIGIN
        ].filter(Boolean); // Remove any undefined/null values
        
        if(allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV === 'development') {
            callback(null, true);
        } else {
            logger.warn(`Origin ${origin} not allowed by CORS`);
            callback(null, true); // Allow all origins in development
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Serve static files from the uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health check endpoint for monitoring
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', environment: process.env.NODE_ENV });
});

// Debug endpoint to check API configuration
app.get('/api/debug', (req, res) => {
    res.status(200).json({
        status: 'ok',
        environment: process.env.NODE_ENV,
        cors: {
            origin: process.env.CORS_ORIGIN || 'http://localhost:3000 (default)',
        },
        endpoints: {
            auth: ['/register', '/login', '/verify-otp', '/forgot-password', '/reset-password'],
            health: '/health'
        }
    });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/notifications', notificationRoutes);

mongoose.connect(process.env.MONGO_URI).then(() => {
    logger.info("MongoDB Connected");
    
    // Schedule the Cloudinary cleanup job
    scheduleCleanupJob();
    
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => logger.info(`Server running on port ${PORT}`));
}).catch(err => logger.error('MongoDB connection error:', err));
