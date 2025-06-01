// services/autoPushNotificationService.js
import { 
  isPushNotificationSupported, 
  registerServiceWorker,
  requestNotificationPermission,
  subscribeToPushNotifications
} from './pushNotificationService';

/**
 * Automatically subscribes the user to push notifications
 * This should be called when a user logs in
 */
export const autoSubscribeToPushNotifications = async () => {
  try {
    // Check if push notifications are supported
    if (!isPushNotificationSupported()) {
      console.log('Push notifications are not supported in this browser');
      return false;
    }

    // Register service worker
    const registration = await registerServiceWorker();
    if (!registration) {
      console.log('Failed to register service worker');
      return false;
    }

    // Request permission
    const permissionGranted = await requestNotificationPermission();
    if (!permissionGranted) {
      console.log('Notification permission denied');
      return false;
    }

    // Subscribe to push notifications
    const subscription = await subscribeToPushNotifications();
    return !!subscription;
  } catch (error) {
    console.error('Error auto-subscribing to push notifications:', error);
    return false;
  }
};