'use strict';

importScripts('./subscription-controller.js');

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
  event.waitUntil(
    self.registration.pushManager.subscribe()
      .then(function(subscription) {
        // TODO: Send new subscriptionId and endpoint to 
        // your server so that you can send a push message 
        // at a later date sendSubscriptionToServer is 
        // defined in subscription-controller.js
        return sendSubscriptionToServer(subscription);
      })
      .catch(function(error) {
        // Check whether we're still registered.
        self.registration.pushManager.getSubscription()
          .then(function(subscription) {
            if (subscription === null) {
              throw new Error("No subscription");
            }
          })
          .catch(function(err) {
            console.warn('Unable to re-subscribe user to push notifications');
            // TODO: Remove any previous subscription details from 
            // your server since the user won't receive any of the 
            // push messages. Since the PushSubscription has been 
            // deleted, you need to have stored a copy of 
            // subscriptionId or some other identifier in a cookie 
            // or similar.
          });
      })
    );
});

self.addEventListener('notificationclick', function(event) {
  console.log('On notification click: ', event.notification.tag);
  event.waitUntil(clients.openWindow('./'));
});
