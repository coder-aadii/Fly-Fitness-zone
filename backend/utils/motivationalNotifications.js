// utils/motivationalNotifications.js
const cron = require('node-cron');
const User = require('../models/User');
const MotivationalMessage = require('../models/MotivationalMessage');
const Notification = require('../models/Notification');
const webpush = require('web-push');
const logger = require('./logger');
const { createNotification } = require('../controllers/notificationController');

// Configure web push
const vapidKeys = {
    publicKey: process.env.VAPID_PUBLIC_KEY || 'BNbKwE3NUkGtPWeTDSu0w5yMtR9LHd9GVQzekEo-zCiwgNpux3eDTnxSLtgXxOXzQVfDHoCHWYbSrJIVcgd5QSo',
    privateKey: process.env.VAPID_PRIVATE_KEY || 'TVe_nJBa0YQbfLiOIf7LpRFMvLPp4xOoXm_z9rgdgDo'
};

webpush.setVapidDetails(
    'mailto:admin@flyfitness.com',
    vapidKeys.publicKey,
    vapidKeys.privateKey
);

// Morning motivational messages focused on encouraging posts
const morningMotivations = [
    "Rise and grind! 💪 Take a quick pic of your morning workout and inspire others!",
    "Good morning fitness fam! 🌞 Share your workout plans today and motivate the community!",
    "Morning fitness check-in: 🏋️‍♀️ Post your goals for today and let's hold each other accountable!",
    "Early bird gets the gains! 🔥 Post a selfie from your morning workout and show your dedication!",
    "Breakfast of champions? 🥗 Share your healthy morning meal and inspire healthy eating habits!",
    "Morning stretches make for a great day! 🧘‍♂️ Post a quick video of your routine to help others!",
    "Start your day strong! 💯 Share your morning fitness activity and boost community engagement!",
    "Morning motivation: ⚡ Post what gets you moving today and inspire someone who's struggling!",
    "Fitness starts with the first step. 👟 Share your morning activity - your post could motivate someone today!",
    "New day, new goals! 📈 Post an update on your fitness journey and connect with others on the same path!",
    "Morning check-in: Post your workout plan and find workout buddies in the community! 👯‍♂️",
    "Capture your morning fitness moment! 📸 Your post might be exactly what someone needs to see today!",
    "Morning fitness challenge: Post your workout and tag a friend to join you! 🏆",
    "Start a streak! 🔄 Post your morning workout today and commit to sharing daily progress!",
    "Your morning fitness routine matters! 🌈 Share it and inspire the community!"
];

// Evening motivational messages focused on encouraging posts
const eveningMotivations = [
    "How was your fitness journey today? 🌟 Share your achievements with a post and celebrate your progress!",
    "Evening workout check-in: 💪 Post about how you crushed your goals today and inspire others!",
    "Share your post-workout glow! ✨ Your dedication deserves to be showcased in a post!",
    "Reflect on your fitness progress today. 👣 Post about your journey - every step counts and inspires!",
    "Evening fitness inspiration: 🏆 Post what you accomplished today and motivate someone for tomorrow!",
    "Wind down with some evening stretches! 🧘‍♀️ Share your routine in a post to help others relax too!",
    "Day's almost over - 🎯 Post about hitting your fitness targets and celebrate with the community!",
    "Your evening fitness routine inspires others. 🌙 Share it in a post and build our supportive community!",
    "Celebrate today's fitness wins! 🎉 Big or small, post about them and inspire others on their journey!",
    "Before bed fitness check: 😊 Post what made you proud today and end the day on a positive note!",
    "Evening reflection: Post your fitness highlight of the day! 💭",
    "Share your evening workout results! 📊 Your progress post could motivate someone tomorrow morning!",
    "Post your fitness victory of the day! 🏅 Let's celebrate together!",
    "Evening challenge: Post your cooldown routine and tag someone who needs to see it! 🧊",
    "End your day with a fitness post! 🌃 Connect with others and build your fitness community!"
];

/**
 * Send motivational push notification to all users
 * @param {boolean} isMorning Whether it's a morning notification
 */
const sendMotivationalNotifications = async (isMorning) => {
    try {
        logger.info(`Sending ${isMorning ? 'morning' : 'evening'} motivational notifications`);
        
        // Get all active users with push subscriptions
        const users = await User.find({ 
            suspended: false, 
            isVerified: true,
            pushSubscription: { $exists: true, $ne: null } 
        });
        
        if (users.length === 0) {
            logger.info('No users with push subscriptions found');
            return;
        }
        
        logger.info(`Found ${users.length} users with push subscriptions`);
        
        // Try to get custom messages from database first
        let message;
        try {
            const messageType = isMorning ? 'morning' : 'evening';
            const customMessages = await MotivationalMessage.find({ 
                type: messageType,
                isActive: true
            });
            
            if (customMessages && customMessages.length > 0) {
                // Select a random message from custom messages
                const randomIndex = Math.floor(Math.random() * customMessages.length);
                message = customMessages[randomIndex].message;
                logger.info(`Using custom ${messageType} message: ${message}`);
            } else {
                // Fall back to default messages if no custom messages found
                const defaultMessages = isMorning ? morningMotivations : eveningMotivations;
                const randomIndex = Math.floor(Math.random() * defaultMessages.length);
                message = defaultMessages[randomIndex];
                logger.info(`Using default ${messageType} message: ${message}`);
            }
        } catch (error) {
            // If there's an error getting custom messages, fall back to defaults
            logger.error('Error fetching custom motivational messages:', error);
            const defaultMessages = isMorning ? morningMotivations : eveningMotivations;
            const randomIndex = Math.floor(Math.random() * defaultMessages.length);
            message = defaultMessages[randomIndex];
        }
        
        // Title for the notification - more engaging and action-oriented
        const title = isMorning 
            ? "📸 Share Your Morning Fitness Journey!" 
            : "🏆 Showcase Today's Fitness Achievements!";
        
        // Send notifications to all users
        let successCount = 0;
        
        for (const user of users) {
            try {
                // Create in-app notification
                await createNotification(
                    user._id,           // recipient
                    'admin-id',         // sender (system)
                    'system',           // notification type
                    message,            // content
                    null                // no related post
                );
                
                // Send push notification
                if (user.pushSubscription) {
                    const payload = JSON.stringify({
                        title,
                        message,
                        url: '/feed',  // Redirect to feed page
                        timestamp: new Date().toISOString(),
                        action: 'Create a post now!', // Clear call-to-action
                        badge: isMorning ? '🌅' : '🌇' // Visual indicator for time of day
                    });
                    
                    await webpush.sendNotification(user.pushSubscription, payload);
                    successCount++;
                }
            } catch (error) {
                logger.error(`Error sending motivational notification to user ${user._id}:`, error);
                
                // If subscription is invalid, remove it
                if (error.statusCode === 410) {
                    user.pushSubscription = null;
                    await user.save();
                }
            }
        }
        
        logger.info(`Successfully sent ${successCount} motivational push notifications`);
    } catch (error) {
        logger.error('Error sending motivational notifications:', error);
    }
};

/**
 * Track user engagement after receiving a notification
 * This function can be called from the post creation endpoint
 * @param {string} userId - The ID of the user who created a post
 * @param {Date} postCreatedAt - When the post was created
 */
const trackNotificationEngagement = async (userId, postCreatedAt) => {
    try {
        // Check if the post was created within 30 minutes of receiving a notification
        const thirtyMinutesAgo = new Date(postCreatedAt.getTime() - 30 * 60 * 1000);
        
        // Find notifications sent to this user in the last 30 minutes
        const recentNotifications = await Notification.find({
            recipient: userId,
            createdAt: { $gte: thirtyMinutesAgo, $lte: postCreatedAt },
            type: 'system'
        });
        
        if (recentNotifications.length > 0) {
            logger.info(`User ${userId} created a post after receiving a motivational notification`);
            
            // Here you could update analytics or engagement metrics
            // This is a placeholder for future analytics implementation
        }
    } catch (error) {
        logger.error('Error tracking notification engagement:', error);
    }
};

/**
 * Schedule motivational notifications
 */
const scheduleMotivationalNotifications = () => {
    // Morning notification at 8:00 AM every day
    cron.schedule('0 8 * * *', async () => {
        await sendMotivationalNotifications(true);
    });
    
    // Evening notification at 6:00 PM every day
    cron.schedule('0 18 * * *', async () => {
        await sendMotivationalNotifications(false);
    });
    
    logger.info('Motivational notification jobs scheduled');
};

module.exports = {
    scheduleMotivationalNotifications,
    trackNotificationEngagement
};