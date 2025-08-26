self.addEventListener('install', function(e) {
  console.log('[ServiceWorker] Install');
  self.skipWaiting();
});

self.addEventListener('activate', function(e) {
  console.log('[ServiceWorker] Activate');
  return self.clients.claim();
});

self.addEventListener('fetch', function(e) {
  console.log('[Service Worker] Fetch', e.request.url);
  e.respondWith(fetch(e.request));
});

function displaySwNotification() {
  var options = {
    body: 'Do we Need Nuclear Energy?',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    }
  };    
  self.registration.showNotification('Kurzgesagt - In a Nutshell posted a new video', options);
}


self.addEventListener('message', event => { 
  if (event.data == `show_notification`) {
    displaySwNotification();
  }

  if (event.data == `close_all`) {
    // close all notifications
    self.registration.getNotifications().then(function(notifications) {
      notifications.forEach(function(notification) {
        notification.close();
      });
    });
  }  
});

self.addEventListener('notificationclick', function(e) {
  var notification = e.notification;
  var primaryKey = notification.data.primaryKey;
  var action = e.action;

  if (action === 'close') {
    notification.close();
  } else {
    console.log('[ServiceWorker] Clicked notification: ' + primaryKey);
    notification.close();
  }
});

self.addEventListener('notificationclose', function(e) {
  var notification = e.notification;
  var primaryKey = notification.data.primaryKey;

  console.log('[ServiceWorker] Closed notification: ' + primaryKey);
});

