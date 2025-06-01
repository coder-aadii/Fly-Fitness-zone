import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { ENDPOINTS } from '../config';
import { useAuth } from './AuthContext';

// Create the notification context
const NotificationContext = createContext();

// Custom hook to use the notification context
export const useNotifications = () => {
  return useContext(NotificationContext);
};

// Provider component
export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isLoggedIn } = useAuth();

  // Refresh the full notifications list
  const refreshNotifications = useCallback(async () => {
    if (!isLoggedIn) return;
    
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(ENDPOINTS.NOTIFICATIONS, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch notifications');
      }

      const data = await response.json();
      console.log('Fetched notifications:', data);
      setNotifications(data.notifications || []);
      
      // Count unread notifications
      const unread = data.notifications.filter(notif => !notif.read).length;
      setUnreadCount(unread);
    } catch (err) {
      console.error('Error refreshing notifications:', err);
    }
  }, [isLoggedIn]);

  // Fetch just the unread count (more efficient for polling)
  const fetchUnreadCount = useCallback(async () => {
    if (!isLoggedIn) return;
    
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(ENDPOINTS.NOTIFICATION_UNREAD_COUNT, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch unread count');
      }

      const data = await response.json();
      console.log('Unread count:', data);
      const newCount = data.count || 0;
      setUnreadCount(newCount);
      
      // If the count changed, refresh the full notifications list
      if (newCount > 0 && newCount !== unreadCount) {
        refreshNotifications();
      }
    } catch (err) {
      console.error('Error fetching unread count:', err);
    }
  }, [isLoggedIn, unreadCount, refreshNotifications]);

  // Fetch notifications when user is logged in
  useEffect(() => {
    if (!isLoggedIn) {
      setNotifications([]);
      setUnreadCount(0);
      setLoading(false);
      return;
    }

    const fetchInitialData = async () => {
      try {
        setLoading(true);
        await refreshNotifications();
        setError(null);
      } catch (err) {
        console.error('Error fetching initial notifications:', err);
        setError('Failed to load notifications');
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();

    // Set up polling for new notifications every 30 seconds
    const intervalId = setInterval(() => {
      fetchUnreadCount();
    }, 30000);

    return () => clearInterval(intervalId);
  }, [isLoggedIn, refreshNotifications, fetchUnreadCount]);

  // Mark a notification as read
  const markAsRead = async (notificationId) => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(ENDPOINTS.MARK_NOTIFICATION_READ(notificationId), {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to mark notification as read');
      }

      // Update local state
      setNotifications(prevNotifications => 
        prevNotifications.map(notif => 
          notif._id === notificationId ? { ...notif, read: true } : notif
        )
      );
      
      // Update unread count
      setUnreadCount(prevCount => Math.max(0, prevCount - 1));
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  };

  // Mark all notifications as read
  const markAllAsRead = async () => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(ENDPOINTS.MARK_ALL_NOTIFICATIONS_READ, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to mark all notifications as read');
      }

      // Update local state
      setNotifications(prevNotifications => 
        prevNotifications.map(notif => ({ ...notif, read: true }))
      );
      
      // Update unread count
      setUnreadCount(0);
    } catch (err) {
      console.error('Error marking all notifications as read:', err);
    }
  };

  // Delete a notification
  const deleteNotification = async (notificationId) => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(ENDPOINTS.DELETE_NOTIFICATION(notificationId), {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete notification');
      }

      // Update local state
      const updatedNotifications = notifications.filter(
        notif => notif._id !== notificationId
      );
      setNotifications(updatedNotifications);
      
      // Update unread count if needed
      const deletedNotification = notifications.find(notif => notif._id === notificationId);
      if (deletedNotification && !deletedNotification.read) {
        setUnreadCount(prevCount => Math.max(0, prevCount - 1));
      }
    } catch (err) {
      console.error('Error deleting notification:', err);
    }
  };

  // Format notification time
  const formatNotificationTime = (timestamp) => {
    if (!timestamp) return 'unknown time';
    
    const now = new Date();
    const notifTime = new Date(timestamp);
    const diffMs = now - notifTime;
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);

    if (diffSec < 60) {
      return 'just now';
    } else if (diffMin < 60) {
      return `${diffMin} minute${diffMin !== 1 ? 's' : ''} ago`;
    } else if (diffHour < 24) {
      return `${diffHour} hour${diffHour !== 1 ? 's' : ''} ago`;
    } else if (diffDay < 7) {
      return `${diffDay} day${diffDay !== 1 ? 's' : ''} ago`;
    } else {
      return notifTime.toLocaleDateString();
    }
  };

  // Context value
  const value = {
    notifications,
    unreadCount,
    loading,
    error,
    refreshNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    formatNotificationTime
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationContext;