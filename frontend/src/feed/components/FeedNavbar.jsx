import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FaHome,
  FaUser,
  FaCog,
  FaSignOutAlt,
  FaBell,
  FaSearch,
  FaDumbbell,
  FaCalendarAlt,
  FaChartLine,
  FaTrash,
  FaCheck
} from 'react-icons/fa';
import { getImageUrl } from '../../config';
import { useNotifications } from '../../context/NotificationContext';

const FeedNavbar = ({ user }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const navigate = useNavigate();

  const { 
    notifications, 
    unreadCount, 
    markAsRead, 
    markAllAsRead, 
    deleteNotification,
    formatNotificationTime,
    refreshNotifications
  } = useNotifications();

  // Refresh notifications when component mounts
  useEffect(() => {
    refreshNotifications();
  }, [refreshNotifications]);

  const dropdownRef = useRef(null);
  const notificationsRef = useRef(null);
  const mobileMenuRef = useRef(null);

  // Handle clicks outside of dropdowns to close them
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Close profile dropdown if clicked outside
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }

      // Close notifications dropdown if clicked outside
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setShowNotifications(false);
      }

      // Close mobile menu if clicked outside
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target) &&
        !event.target.closest('button[aria-label="Toggle mobile menu"]')) {
        setShowMobileMenu(false);
      }
    };

    // Add event listener
    document.addEventListener('mousedown', handleClickOutside);

    // Clean up
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    navigate('/login');
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
    if (showNotifications) setShowNotifications(false);
  };

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
    if (showDropdown) setShowDropdown(false);
  };

  const handleNotificationClick = (notification) => {
    // Mark as read
    if (!notification.read) {
      markAsRead(notification._id);
    }

    // Navigate to the related post if available
    if (notification.relatedPost) {
      // This would navigate to a specific post view if implemented
      // navigate(`/post/${notification.relatedPost._id}`);
      
      // For now, just navigate to feed and close the dropdown
      setShowNotifications(false);
      navigate('/feed');
    }
  };

  // Get notification icon based on type
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'like':
        return <span className="text-red-500 mr-2">❤️</span>;
      case 'comment':
        return <span className="text-blue-500 mr-2">💬</span>;
      case 'follow':
        return <span className="text-green-500 mr-2">👤</span>;
      case 'achievement':
        return <span className="text-yellow-500 mr-2">🏆</span>;
      default:
        return <span className="text-gray-500 mr-2">📢</span>;
    }
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo and brand - links to landing page */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <img
                src="/logo192.png"
                alt="Fly Fitness Zone"
                className="h-8 w-auto mr-2"
              />
              <span className="text-orange-500 font-bold text-xl">Fly Fitness Zone</span>
            </Link>
          </div>

          {/* Search bar - hidden on mobile */}
          <div className="hidden md:flex items-center flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search..."
                className="w-full bg-gray-100 rounded-full py-2 px-4 pl-10 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
            </div>
          </div>

          {/* Navigation and profile - hidden on mobile */}
          <div className="hidden md:flex items-center">
            <Link to="/feed" className="text-gray-700 hover:text-orange-500 px-3 py-2" title="Go to Home Page">
              <FaHome className="text-xl" />
            </Link>

            {/* Notifications */}
            <div className="relative" ref={notificationsRef}>
              <button
                onClick={toggleNotifications}
                className="text-gray-700 hover:text-orange-500 px-3 py-2 relative"
              >
                <FaBell className="text-xl" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notifications dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg z-20">
                  <div className="p-3 border-b flex justify-between items-center">
                    <h3 className="font-semibold">Notifications</h3>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllAsRead}
                        className="text-xs text-orange-500 hover:text-orange-700 flex items-center"
                      >
                        <FaCheck className="mr-1" />
                        Mark all as read
                      </button>
                    )}
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications && notifications.length > 0 ? (
                      notifications.map(notification => (
                        <div
                          key={notification._id}
                          className={`p-3 border-b hover:bg-gray-50 ${!notification.read ? 'bg-orange-50' : ''}`}
                        >
                          <div className="flex justify-between">
                            <div 
                              className="flex-1 cursor-pointer" 
                              onClick={() => handleNotificationClick(notification)}
                            >
                              <div className="flex items-start">
                                {getNotificationIcon(notification.type)}
                                <div>
                                  <p className="text-sm">{notification.content}</p>
                                  <p className="text-xs text-gray-500 mt-1">
                                    {formatNotificationTime(notification.createdAt)}
                                  </p>
                                </div>
                              </div>
                            </div>
                            <button 
                              onClick={() => deleteNotification(notification._id)}
                              className="text-gray-400 hover:text-red-500 ml-2"
                              title="Delete notification"
                            >
                              <FaTrash size={12} />
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-3 text-center text-gray-500">
                        No notifications
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Profile dropdown */}
            <div className="relative ml-3" ref={dropdownRef}>
              <button
                onClick={toggleDropdown}
                className="flex items-center"
              >
                <div className="h-8 w-8 rounded-full overflow-hidden border-2 border-orange-300">
                  {user?.profileImage ? (
                    <img
                      src={getImageUrl(user.profileImage)}
                      alt={user.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full bg-orange-200 flex items-center justify-center">
                      <span className="text-orange-500 font-semibold">
                        {user?.name?.charAt(0) || 'U'}
                      </span>
                    </div>
                  )}
                </div>
              </button>

              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-20">
                  <div className="py-1">
                    <Link
                      to="/UserDashboard"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <FaUser className="inline mr-2" />
                      Dashboard
                    </Link>
                    <Link
                      to="/UserSettings"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <FaCog className="inline mr-2" />
                      Settings
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <FaSignOutAlt className="inline mr-2" />
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="text-gray-500 hover:text-orange-500 focus:outline-none"
              aria-label="Toggle mobile menu"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {showMobileMenu ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {showMobileMenu && (
        <div className="md:hidden bg-white border-t" ref={mobileMenuRef}>
          <div className="px-2 pt-2 pb-3 space-y-1">
            {/* User profile section */}
            <div className="flex items-center px-3 py-2 border-b border-gray-200 mb-2">
              <Link 
                to="/UserDashboard" 
                className="flex items-center w-full"
                onClick={() => setShowMobileMenu(false)}
              >
                <div className="h-10 w-10 rounded-full overflow-hidden border-2 border-orange-300 mr-3">
                  {user?.profileImage ? (
                    <img
                      src={getImageUrl(user.profileImage)}
                      alt={user.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full bg-orange-200 flex items-center justify-center">
                      <span className="text-orange-500 font-semibold">
                        {user?.name?.charAt(0) || 'U'}
                      </span>
                    </div>
                  )}
                </div>
                <div>
                  <p className="font-medium text-gray-800">{user?.name}</p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>
              </Link>
            </div>

            {/* Search bar */}
            <div className="px-3 py-2">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full bg-gray-100 rounded-full py-2 px-4 pl-10 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <FaSearch className="absolute left-3 top-3 text-gray-400" />
              </div>
            </div>

            {/* Additional links and actions */}
            <div className="border-t border-gray-200 pt-2 mt-2">
              <Link
                to="/feed"
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-orange-500 hover:bg-gray-50 rounded-md"
                onClick={() => setShowMobileMenu(false)}
              >
                <FaHome className="inline mr-2" />
                Home Page
              </Link>

              <Link
                to="/UserSettings"
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-orange-500 hover:bg-gray-50 rounded-md"
                onClick={() => setShowMobileMenu(false)}
              >
                <FaCog className="inline mr-2" />
                Settings
              </Link>

              <button
                onClick={() => {
                  setShowMobileMenu(false);
                  handleLogout();
                }}
                className="block w-full text-left px-3 py-2 text-base font-medium text-gray-700 hover:text-orange-500 hover:bg-gray-50 rounded-md"
              >
                <FaSignOutAlt className="inline mr-2" />
                Sign out
              </button>
            </div>

            {/* Navigation links - matching sidebar options */}
            <div className="border-t border-gray-200 pt-2 mt-2">
              <Link
                to="/workouts"
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-orange-500 hover:bg-gray-50 rounded-md"
                onClick={() => setShowMobileMenu(false)}
              >
                <FaDumbbell className="inline mr-2" />
                Workouts
              </Link>

              <Link
                to="/schedule"
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-orange-500 hover:bg-gray-50 rounded-md"
                onClick={() => setShowMobileMenu(false)}
              >
                <FaCalendarAlt className="inline mr-2" />
                Schedule
              </Link>

              <Link
                to="/progress"
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-orange-500 hover:bg-gray-50 rounded-md"
                onClick={() => setShowMobileMenu(false)}
              >
                <FaChartLine className="inline mr-2" />
                Progress
              </Link>
            </div>

            {/* Notifications section */}
            <div className="border-t border-gray-200 pt-2 mt-2">
              <div className="px-3 py-2">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium text-gray-800">Notifications</h3>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="text-xs text-orange-500 hover:text-orange-700 flex items-center"
                    >
                      <FaCheck className="mr-1" />
                      Mark all as read
                    </button>
                  )}
                </div>
                
                {notifications && notifications.length > 0 ? (
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {notifications.map(notification => (
                      <div
                        key={notification._id}
                        className={`p-2 rounded-md text-sm ${!notification.read ? 'bg-orange-50' : 'bg-gray-50'}`}
                      >
                        <div className="flex justify-between">
                          <div 
                            className="flex-1" 
                            onClick={() => {
                              handleNotificationClick(notification);
                              setShowMobileMenu(false);
                            }}
                          >
                            <div className="flex items-start">
                              {getNotificationIcon(notification.type)}
                              <div>
                                <p>{notification.content}</p>
                                <p className="text-xs text-gray-500 mt-1">
                                  {formatNotificationTime(notification.createdAt)}
                                </p>
                              </div>
                            </div>
                          </div>
                          <button 
                            onClick={() => deleteNotification(notification._id)}
                            className="text-gray-400 hover:text-red-500 ml-2"
                          >
                            <FaTrash size={12} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No notifications</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default FeedNavbar;