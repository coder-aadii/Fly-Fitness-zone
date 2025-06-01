// push-notification-sw.js
self.addEventListener('push', function(event) {
  try {
    const data = event.data.json();
    
    const options = {
      body: data.message,
      icon: '/logo192.png',
      badge: '/logo192.png',
      data: {
        url: data.url || '/feed'
      }
    };

    // Add image if provided
    if (data.image) {
      options.image = data.image;
    }

    // Add actions if provided
    if (data.action) {
      options.actions = [
        {
          action: 'open',
          title: data.action
        }
      ];
    }

    // Add badge if provided
    if (data.badge) {
      options.badge = data.badge;
    }

    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  } catch (error) {
    console.error('Error showing notification:', error);
    
    // Fallback to a basic notification if parsing JSON fails
    event.waitUntil(
      self.registration.showNotification('New Notification', {
        body: 'You have a new notification from Fly Fitness Zone',
        icon: '/logo192.png',
        badge: '/logo192.png'
      })
    );
  }
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  
  // Get the URL to open from the notification data
  const urlToOpen = event.notification.data && event.notification.data.url 
    ? new URL(event.notification.data.url, self.location.origin).href
    : self.location.origin;

  // Open the URL in a new window/tab
  event.waitUntil(
    clients.matchAll({
      type: 'window',
      includeUncontrolled: true
    }).then(function(clientList) {
      // Check if there's already a window/tab open with the target URL
      for (let i = 0; i < clientList.length; i++) {
        const client = clientList[i];
        if (client.url === urlToOpen && 'focus' in client) {
          return client.focus();
        }
      }
      
      // If no window/tab is open with the URL, open a new one
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});