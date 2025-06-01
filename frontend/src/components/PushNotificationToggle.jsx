import React, { useState, useEffect } from 'react';
import { FaBell, FaBellSlash } from 'react-icons/fa';
import { 
  isPushNotificationSupported, 
  registerServiceWorker,
  requestNotificationPermission,
  subscribeToPushNotifications,
  unsubscribeFromPushNotifications,
  checkPushNotificationSubscription
} from '../services/pushNotificationService';

const PushNotificationToggle = () => {
  const [isSupported, setIsSupported] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initPushNotifications = async () => {
      try {
        // Check if push notifications are supported
        const supported = isPushNotificationSupported();
        setIsSupported(supported);

        if (supported) {
          // Register service worker
          await registerServiceWorker();
          
          // Check if already subscribed
          const subscribed = await checkPushNotificationSubscription();
          setIsSubscribed(subscribed);
        }
      } catch (error) {
        console.error('Error initializing push notifications:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initPushNotifications();
  }, []);

  const handleToggleSubscription = async () => {
    try {
      setIsLoading(true);

      if (isSubscribed) {
        // Unsubscribe
        const success = await unsubscribeFromPushNotifications();
        if (success) {
          setIsSubscribed(false);
        }
      } else {
        // Request permission and subscribe
        const permissionGranted = await requestNotificationPermission();
        
        if (permissionGranted) {
          const subscription = await subscribeToPushNotifications();
          setIsSubscribed(!!subscription);
        }
      }
    } catch (error) {
      console.error('Error toggling push notification subscription:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isSupported) {
    return null; // Don't show anything if push notifications are not supported
  }

  return (
    <button
      onClick={handleToggleSubscription}
      disabled={isLoading}
      className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
        isSubscribed 
          ? 'bg-green-100 text-green-800 hover:bg-green-200' 
          : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
      }`}
      title={isSubscribed ? 'Disable push notifications' : 'Enable push notifications'}
    >
      {isLoading ? (
        <div className="animate-spin h-4 w-4 border-2 border-gray-500 rounded-full border-t-transparent mr-2"></div>
      ) : isSubscribed ? (
        <FaBell className="mr-2" />
      ) : (
        <FaBellSlash className="mr-2" />
      )}
      {isSubscribed ? 'Notifications On' : 'Enable Notifications'}
    </button>
  );
};

export default PushNotificationToggle;