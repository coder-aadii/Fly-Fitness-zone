/**
 * Utility functions for handling errors and redirecting to appropriate error pages
 */

/**
 * Checks if user is authenticated
 * @param {Function} navigate - React Router's navigate function
 * @param {string} currentPath - Current path (optional)
 * @returns {boolean} - Whether the user is authenticated
 */
export const checkAuth = (navigate, currentPath = null) => {
  // Create state object with current path if provided
  const state = currentPath ? { from: currentPath } : undefined;
  
  const token = localStorage.getItem('token');
  if (!token) {
    navigate('/unauthorized', { state });
    return false;
  }
  
  // Check if token is expired
  if (isSessionExpired()) {
    navigate('/session-expired', { state });
    return false;
  }
  
  return true;
};

/**
 * Handles API errors and redirects to appropriate error pages
 * @param {Error} error - The error object
 * @param {Function} navigate - React Router's navigate function
 * @param {string} currentPath - Current path (optional)
 */
export const handleApiError = (error, navigate, currentPath = null) => {
  // Create state object with current path if provided
  const state = currentPath ? { from: currentPath } : undefined;
  
  if (!error.response) {
    // Network error or server not responding
    navigate('/server-error', { state });
    return;
  }

  const { status } = error.response;

  switch (status) {
    case 401:
      // Unauthorized - user not logged in
      navigate('/unauthorized', { state });
      break;
    case 403:
      // Forbidden - user doesn't have permission
      navigate('/unauthorized', { state });
      break;
    case 404:
      // Not found
      navigate('/not-found', { state });
      break;
    case 500:
    case 502:
    case 503:
    case 504:
      // Server errors
      navigate('/server-error', { state });
      break;
    default:
      // Other errors
      navigate('/not-found', { state });
  }
};

/**
 * Redirects to the appropriate error page based on error type
 * @param {string} errorType - Type of error
 * @param {Function} navigate - React Router's navigate function
 * @param {string} currentPath - Current path (optional)
 */
export const redirectToErrorPage = (errorType, navigate, currentPath = null) => {
  // Create state object with current path if provided
  const state = currentPath ? { from: currentPath } : undefined;
  
  switch (errorType) {
    case 'unauthorized':
      navigate('/unauthorized', { state });
      break;
    case 'server':
      navigate('/server-error', { state });
      break;
    case 'maintenance':
      navigate('/maintenance', { state });
      break;
    case 'expired':
      navigate('/session-expired', { state });
      break;
    default:
      navigate('/not-found', { state });
  }
};

/**
 * Checks if a user's session has expired
 * @returns {boolean} - Whether the session has expired
 */
export const isSessionExpired = () => {
  const token = localStorage.getItem('token');
  if (!token) return true;
  
  try {
    // Parse the JWT token to get expiration
    const payload = JSON.parse(atob(token.split('.')[1]));
    const expiry = payload.exp * 1000; // Convert to milliseconds
    
    return Date.now() > expiry;
  } catch (error) {
    // If token is invalid, consider session expired
    return true;
  }
};

/**
 * Creates a custom error with a specific type
 * @param {string} message - Error message
 * @param {string} type - Error type (unauthorized, server, etc.)
 * @returns {Error} - Custom error object
 */
export const createCustomError = (message, type) => {
  const error = new Error(message);
  error.type = type;
  return error;
};