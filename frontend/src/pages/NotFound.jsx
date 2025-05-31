import React, { useEffect, useState, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaHome, FaArrowLeft, FaExclamationTriangle, FaLock, FaTools, FaHourglassEnd, FaServer, FaQuestion, FaUserAlt, FaNewspaper } from 'react-icons/fa';

const NotFound = ({ type }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [errorType, setErrorType] = useState('general');
  const [countdown, setCountdown] = useState(15);
  const [showDetails, setShowDetails] = useState(false);
  const [redirectPath, setRedirectPath] = useState('/');
  const [actionText, setActionText] = useState('Return to homepage');
  const [actionIcon, setActionIcon] = useState(<FaHome className="mr-2" />);

  // Determine redirect path based on error type and authentication state
  const determineRedirectPath = useCallback((errorType, isLoggedIn) => {
    // If user is not authenticated, handle based on error type
    if (!isLoggedIn) {
      switch (errorType) {
        case 'unauthorized':
        case 'expired':
          return '/login';
        default:
          return '/';
      }
    }
    
    // If user is authenticated, determine based on referrer or error type
    const referrer = document.referrer;
    
    // Check if user was on feed page or dashboard
    if (referrer.includes('/feed')) {
      return '/feed';
    } else if (referrer.includes('/UserDashboard')) {
      return '/UserDashboard';
    } else if (location.state && location.state.from) {
      // If location state contains a 'from' path, use that
      return location.state.from;
    } else {
      // Default for authenticated users
      return '/feed';
    }
  }, [location.state]);

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('token');
    const isLoggedIn = !!token;

    // Determine error type based on props, URL params, or state
    const searchParams = new URLSearchParams(location.search);
    const typeFromUrl = searchParams.get('type');
    const finalType = type || typeFromUrl || 'general';
    setErrorType(finalType);

    // Determine the appropriate redirect path and action text based on authentication state and error type
    const path = determineRedirectPath(finalType, isLoggedIn);
    setRedirectPath(path);

    // Set action text and icon based on redirect path
    if (path === '/feed') {
      setActionText('Return to feed');
      setActionIcon(<FaNewspaper className="mr-2" />);
    } else if (path === '/login') {
      setActionText('Go to login');
      setActionIcon(<FaUserAlt className="mr-2" />);
    } else if (path === '/UserDashboard') {
      setActionText('Return to dashboard');
      setActionIcon(<FaUserAlt className="mr-2" />);
    } else {
      setActionText('Return to homepage');
      setActionIcon(<FaHome className="mr-2" />);
    }

    // Start countdown for auto-redirect
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate(path);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [location, navigate, type, determineRedirectPath]);

  // Error messages and actions based on error type
  const errorContent = {
    general: {
      title: 'Page Not Found',
      message: 'The page you are looking for doesn\'t exist or has been moved.',
      icon: <FaQuestion className="text-5xl mb-4 text-orange-500" />,
      details: 'The URL you entered may be incorrect or the page may have been removed. Please check the URL and try again.',
      color: 'orange'
    },
    unauthorized: {
      title: 'Access Denied',
      message: 'You don\'t have permission to access this page.',
      icon: <FaLock className="text-5xl mb-4 text-red-500" />,
      details: 'This area requires specific permissions or authentication. Please log in with appropriate credentials or contact support if you believe this is an error.',
      color: 'red'
    },
    server: {
      title: 'Server Error',
      message: 'Something went wrong on our end. We\'re working to fix the issue.',
      icon: <FaServer className="text-5xl mb-4 text-yellow-500" />,
      details: 'Our servers are experiencing technical difficulties. This is a temporary issue and our team has been notified. Please try again later.',
      color: 'yellow'
    },
    maintenance: {
      title: 'Under Maintenance',
      message: 'This section is currently under maintenance. Please check back later.',
      icon: <FaTools className="text-5xl mb-4 text-blue-500" />,
      details: 'We\'re making improvements to enhance your experience. This scheduled maintenance should be completed shortly. Thank you for your patience.',
      color: 'blue'
    },
    expired: {
      title: 'Session Expired',
      message: 'Your session has expired. Please log in again to continue.',
      icon: <FaHourglassEnd className="text-5xl mb-4 text-purple-500" />,
      details: 'For your security, sessions automatically expire after a period of inactivity. Please log in again to continue where you left off.',
      color: 'purple'
    }
  };

  const content = errorContent[errorType] || errorContent.general;
  
  // Dynamic color classes based on error type
  const getColorClasses = () => {
    const colorMap = {
      'orange': 'from-orange-500 to-orange-600',
      'red': 'from-red-500 to-red-600',
      'yellow': 'from-yellow-500 to-yellow-600',
      'blue': 'from-blue-500 to-blue-600',
      'purple': 'from-purple-500 to-purple-600'
    };
    
    return {
      header: `bg-gradient-to-r ${colorMap[content.color] || colorMap.orange}`,
      button: `bg-${content.color}-500 hover:bg-${content.color}-600`,
      text: `text-${content.color}-500`
    };
  };
  
  const colorClasses = getColorClasses();

  // Get redirect message based on path
  const getRedirectMessage = () => {
    if (redirectPath === '/feed') {
      return 'to feed page';
    } else if (redirectPath === '/UserDashboard') {
      return 'to dashboard';
    } else if (redirectPath === '/login') {
      return 'to login';
    } else {
      return 'to homepage';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex flex-col items-center justify-center px-4 py-12">
      <div className="max-w-2xl w-full bg-white rounded-xl shadow-2xl overflow-hidden transform transition-all duration-300 hover:shadow-3xl">
        <div className={`${colorClasses.header} p-6 text-white text-center`}>
          <h1 className="text-3xl font-bold flex items-center justify-center">
            <FaExclamationTriangle className="mr-3" />
            {content.title}
          </h1>
        </div>
        
        <div className="p-8 text-center">
          <div className="mb-8 relative group">
            <img 
              src="https://res.cloudinary.com/deoegf9on/image/upload/v1748689981/notFound_ok0tpl.gif" 
              alt="Not Found" 
              className="mx-auto h-64 object-contain rounded-lg shadow-md transition-all duration-300 group-hover:shadow-lg"
            />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              {content.icon}
            </div>
          </div>
          
          <p className="text-gray-700 mb-6 text-xl font-medium">{content.message}</p>
          
          <button 
            onClick={() => setShowDetails(!showDetails)}
            className={`${colorClasses.text} text-sm mb-6 underline hover:no-underline cursor-pointer`}
          >
            {showDetails ? 'Hide details' : 'Show details'}
          </button>
          
          {showDetails && (
            <div className="bg-gray-50 p-4 rounded-lg mb-6 text-left">
              <p className="text-gray-600">{content.details}</p>
              {errorType === 'server' && (
                <div className="mt-2 text-sm text-gray-500">
                  <p>Error Code: 500</p>
                  <p>Timestamp: {new Date().toLocaleString()}</p>
                </div>
              )}
            </div>
          )}
          
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-6">
            <Link 
              to={redirectPath}
              className={`${colorClasses.button} text-white py-3 px-8 rounded-lg flex items-center justify-center font-medium transition-all duration-300 transform hover:scale-105`}
            >
              {actionIcon}
              {actionText}
            </Link>
            
            <button 
              onClick={() => navigate(-1)} 
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 px-8 rounded-lg flex items-center justify-center font-medium transition-all duration-300 transform hover:scale-105"
            >
              <FaArrowLeft className="mr-2" />
              Go Back
            </button>
          </div>
          
          <p className="text-sm text-gray-500 animate-pulse">
            Redirecting {getRedirectMessage()} in {countdown} seconds...
          </p>
        </div>
      </div>
      
      <div className="mt-8 text-center text-gray-600">
        <p>If you believe this is an error, please contact our support team.</p>
        <Link to="/contact" className={`${colorClasses.text} hover:underline font-medium`}>
          Contact Support
        </Link>
      </div>
    </div>
  );
};

export default NotFound;