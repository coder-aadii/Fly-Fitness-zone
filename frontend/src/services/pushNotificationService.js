// services/pushNotificationService.js
import { ENDPOINTS } from '../config';

// Check if the browser supports push notifications
export const isPushNotificationSupported = () => {
  return 'serviceWorker' in navigator && 'PushManager' in window;
};

// Register the service worker
export const registerServiceWorker = async () => {
  if (!isPushNotificationSupported()) {
    console.warn('Push notifications are not supported in this browser');
    return null;
  }

  try {
    const registration = await navigator.serviceWorker.register('/push-notification-sw.js');
    console.log('Service Worker registered successfully:', registration);
    return registration;
  } catch (error) {
    console.error('Service Worker registration failed:', error);
    return null;
  }
};

// Request permission for push notifications
export const requestNotificationPermission = async () => {
  if (!isPushNotificationSupported()) {
    return false;
  }

  try {
    // Check if permission is already granted
    if (Notification.permission === 'granted') {
      return true;
    }
    
    // If permission is denied, we can't request it again
    if (Notification.permission === 'denied') {
      console.log('Notification permission was previously denied');
      return false;
    }
    
    // Request permission
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  } catch (error) {
    console.error('Error requesting notification permission:', error);
    return false;
  }
};

// Get the VAPID public key from the server
export const getVapidPublicKey = async () => {
  try {
    const response = await fetch(ENDPOINTS.PUSH_NOTIFICATION_VAPID_KEY);
    if (!response.ok) {
      throw new Error('Failed to get VAPID public key');
    }
    const data = await response.json();
    return data.publicKey;
  } catch (error) {
    console.error('Error getting VAPID public key:', error);
    // Fallback to the default key (should match the one in the backend)
    return 'BNbKwE3NUkGtPWeTDSu0w5yMtR9LHd9GVQzekEo-zCiwgNpux3eDTnxSLtgXxOXzQVfDHoCHWYbSrJIVcgd5QSo';
  }
};

// Convert a base64 string to Uint8Array
const urlBase64ToUint8Array = (base64String) => {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
};

// Subscribe to push notifications
export const subscribeToPushNotifications = async () => {
  if (!isPushNotificationSupported()) {
    return null;
  }

  try {
    // Register service worker if not already registered
    const registration = await navigator.serviceWorker.ready;
    
    // Check if already subscribed
    const existingSubscription = await registration.pushManager.getSubscription();
    if (existingSubscription) {
      console.log('User is already subscribed to push notifications');
      return existingSubscription;
    }
    
    // Get the VAPID public key
    const vapidPublicKey = await getVapidPublicKey();
    
    // Subscribe to push notifications
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(vapidPublicKey)
    });
    
    // Send the subscription to the server
    const token = localStorage.getItem('token');
    if (!token) {
      console.log('No token found, skipping server subscription');
      return subscription;
    }
    
    const response = await fetch(ENDPOINTS.PUSH_NOTIFICATION_SUBSCRIBE, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(subscription)
    });
    
    if (!response.ok) {
      throw new Error('Failed to subscribe to push notifications');
    }
    
    console.log('Successfully subscribed to push notifications');
    return subscription;
  } catch (error) {
    console.error('Error subscribing to push notifications:', error);
    return null;
  }
};

// Unsubscribe from push notifications
export const unsubscribeFromPushNotifications = async () => {
  if (!isPushNotificationSupported()) {
    return false;
  }

  try {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();
    
    if (!subscription) {
      return true; // Already unsubscribed
    }
    
    // Unsubscribe from push manager
    const unsubscribed = await subscription.unsubscribe();
    
    if (unsubscribed) {
      // Notify the server
      const token = localStorage.getItem('token');
      const response = await fetch(ENDPOINTS.PUSH_NOTIFICATION_UNSUBSCRIBE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ endpoint: subscription.endpoint })
      });
      
      if (!response.ok) {
        console.warn('Failed to notify server about unsubscription');
      }
    }
    
    return unsubscribed;
  } catch (error) {
    console.error('Error unsubscribing from push notifications:', error);
    return false;
  }
};

// Check if the user is subscribed to push notifications
export const checkPushNotificationSubscription = async () => {
  if (!isPushNotificationSupported()) {
    return false;
  }

  try {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();
    return !!subscription;
  } catch (error) {
    console.error('Error checking push notification subscription:', error);
    return false;
  }
};