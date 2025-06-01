/**
 * Application configuration
 * 
 * This file centralizes all configuration variables used throughout the application.
 * It reads from environment variables and provides fallbacks for development.
 */

// API URL - used for all API requests
export const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Frontend URL - used for redirects and absolute URLs
export const FRONTEND_URL = process.env.REACT_APP_URL || 'http://localhost:3000';

// API endpoints
export const ENDPOINTS = {
    // Auth endpoints
    LOGIN: `${API_URL}/api/auth/login`,
    REGISTER: `${API_URL}/api/auth/register`,
    VERIFY_OTP: `${API_URL}/api/auth/verify-otp`,
    FORGOT_PASSWORD: `${API_URL}/api/auth/forgot-password`,
    RESET_PASSWORD: `${API_URL}/api/auth/reset-password`,
    
    // User endpoints
    USER_PROFILE: `${API_URL}/api/users/profile`,
    CHANGE_PASSWORD: `${API_URL}/api/users/change-password`,
    CHANGE_EMAIL: `${API_URL}/api/users/change-email`,
    PROFILE_IMAGE: `${API_URL}/api/users/profile-image`,
    
    // Admin endpoints
    ADMIN_PROFILE: `${API_URL}/api/admin/profile`,
    ADMIN_USERS: `${API_URL}/api/admin/users`,
    ADMIN_STATS: `${API_URL}/api/admin/stats`,
    
    // Trainer endpoints
    ADMIN_TRAINERS: `${API_URL}/api/trainers`,
    ADMIN_TRAINER_DETAIL: (id) => `${API_URL}/api/trainers/${id}`,
    
    // Class Schedule endpoints
    ADMIN_CLASSES: `${API_URL}/api/classes`,
    ADMIN_CLASS_DETAIL: (id) => `${API_URL}/api/classes/${id}`,
    
    // Gallery endpoints
    ADMIN_GALLERY: `${API_URL}/api/gallery`,
    ADMIN_GALLERY_UPLOAD: `${API_URL}/api/gallery/upload`,
    
    // Testimonial endpoints
    ADMIN_TESTIMONIALS: `${API_URL}/api/testimonials`,
    
    // Push Notification endpoints
    PUSH_NOTIFICATION_VAPID_KEY: `${API_URL}/api/push-notifications/vapid-public-key`,
    PUSH_NOTIFICATION_SUBSCRIBE: `${API_URL}/api/push-notifications/subscribe`,
    PUSH_NOTIFICATION_UNSUBSCRIBE: `${API_URL}/api/push-notifications/unsubscribe`,
    ADMIN_NOTIFICATIONS: `${API_URL}/api/push-notifications`,
    ADMIN_NOTIFICATION_DETAIL: (id) => `${API_URL}/api/push-notifications/${id}`,
    ADMIN_SEND_NOTIFICATION: `${API_URL}/api/push-notifications/send`,
    
    // Feed endpoints
    FEED_POSTS: `${API_URL}/api/posts`,
    CREATE_POST: `${API_URL}/api/posts`,
    LIKE_POST: (postId) => `${API_URL}/api/posts/${postId}/like`,
    COMMENT_POST: (postId) => `${API_URL}/api/posts/${postId}/comment`,
    DELETE_POST: (postId) => `${API_URL}/api/posts/${postId}`,
    DELETE_COMMENT: (postId, commentId) => `${API_URL}/api/posts/${postId}/comment/${commentId}`,
    USER_POSTS: (userId) => `${API_URL}/api/posts/user/${userId || ''}`,
    
    // Notification endpoints
    NOTIFICATIONS: `${API_URL}/api/notifications`,
    NOTIFICATION_UNREAD_COUNT: `${API_URL}/api/notifications/unread-count`,
    MARK_NOTIFICATION_READ: (notificationId) => `${API_URL}/api/notifications/${notificationId}/read`,
    MARK_ALL_NOTIFICATIONS_READ: `${API_URL}/api/notifications/mark-all-read`,
    DELETE_NOTIFICATION: (notificationId) => `${API_URL}/api/notifications/${notificationId}`,
};

// Image URL helper
export const getImageUrl = (path) => {
    if (!path) return null;
    
    // If the path already includes the API_URL, return it as is
    if (path.startsWith('http')) {
        return path;
    }
    
    // Otherwise, prepend the API_URL
    return `${API_URL}${path}`;
};

// Create a config object before exporting it
const config = {
    API_URL,
    FRONTEND_URL,
    ENDPOINTS,
    getImageUrl
};

export default config;