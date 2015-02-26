'use strict';

function sendToServer() {
  // TODO: Implement ;)
}

self.addEventListener('push', function(event) {
  console.log('Received a push message', event);

  var title = 'Yay a message.';
  var body = 'We have received a push message.';
  var icon = '/images/icon-192x192.png';
  var tag = 'simple-push-demo-notification-tag';

  event.waitUntil(
    self.registration.showNotification(title, {
      body: body,
      icon: icon,
      tag: tag
    })
  );
});

self.addEventListener('pushsubscriptionchange', function(event) {
  if(Notification.permission !== 'granted') {
    // We need to ask the user to enable notifications

    // You may want to remove any previous subscription details
    // from your server since the user won't receive any of the
    // push messages
    return;
  } 
  event.waitUntil(self.registration.pushManager.subscribe().then(function(subscription) {
      // TODO: Send subscriptionId and endpoint to your server
      // so that you can send a push message at a later date
      return sendToServer(subscription);
    }).catch(function(error) {
      console.warn('Unable to subscribe user to push notifications');
    }));
});

self.addEventListener('notificationclick', function(event) {
  console.log('On notification click: ', event.notification.tag);
  event.waitUntil(clients.openWindow('/'));
});
