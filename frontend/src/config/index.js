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