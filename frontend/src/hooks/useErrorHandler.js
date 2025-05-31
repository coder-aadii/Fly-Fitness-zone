import { useNavigate, useLocation } from 'react-router-dom';
import { handleApiError, redirectToErrorPage, isSessionExpired, checkAuth } from '../utils/errorHandler';

/**
 * Custom hook for handling errors and redirecting to appropriate error pages
 */
const useErrorHandler = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  /**
   * Handles API errors
   * @param {Error} error - The error object
   */
  const handleError = (error) => {
    handleApiError(error, navigate, currentPath);
  };

  /**
   * Redirects to an error page
   * @param {string} errorType - Type of error (unauthorized, server, etc.)
   */
  const redirectToError = (errorType) => {
    redirectToErrorPage(errorType, navigate, currentPath);
  };

  /**
   * Checks if user is authenticated
   * @returns {boolean} - Whether the user is authenticated
   */
  const checkAuthentication = () => {
    return checkAuth(navigate, currentPath);
  };

  /**
   * Checks if session is expired and redirects if needed
   * @returns {boolean} - Whether the session is valid
   */
  const checkSession = () => {
    if (isSessionExpired()) {
      navigate('/session-expired', { state: { from: currentPath } });
      return false;
    }
    return true;
  };

  return {
    handleError,
    redirectToError,
    checkAuthentication,
    checkSession
  };
};

export default useErrorHandler;