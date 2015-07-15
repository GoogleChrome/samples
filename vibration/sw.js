self.addEventListener('install', function() {
  self.skipWaiting();
});

self.addEventListener('notificationclick', function(event) {
  // Close the notification when it is clicked
  event.notification.close();
});
