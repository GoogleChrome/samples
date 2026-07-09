self.addEventListener("install", function(e) {
  console.log("[ServiceWorker] Install");
  self.skipWaiting();
});

self.addEventListener("activate", function(e) {
  console.log("[ServiceWorker] Activate");
  return self.clients.claim();
});

self.addEventListener("fetch", function(e) {
  console.log("[Service Worker] Fetch", e.request.url);
  e.respondWith(fetch(e.request));
});

function displaySwNotification(useBadge) {
  var options = {
    body: "A notification body",
    icon:
      "house.png",
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    }
  };

  if (useBadge) {
    options.badge =
      "fugu-128.png";
  }

  self.registration.showNotification("Text from service worker", options);
}

self.addEventListener("message", event => {
  if (event.data.type === "show_notification") {
    displaySwNotification(event.data.useBadge);
  }

  if (event.data.type === "close_all") {
    // close all notifications
    self.registration.getNotifications().then(function(notifications) {
      notifications.forEach(function(notification) {
        notification.close();
      });
    });
  }
});

self.addEventListener("notificationclick", function(e) {
  var notification = e.notification;
  var primaryKey = notification.data.primaryKey;
  var action = e.action;

  if (action === "close") {
    notification.close();
  } else {
    console.log("[ServiceWorker] Clicked notification: " + primaryKey);
    notification.close();
  }
});

self.addEventListener("notificationclose", function(e) {
  var notification = e.notification;
  var primaryKey = notification.data.primaryKey;

  console.log("[ServiceWorker] Closed notification: " + primaryKey);
});
