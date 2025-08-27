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

function displaySwNotification(useBadge, withActions) {
  var options = {
    body: "A notification body",
    icon:
      "fugu-512.png",
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
  };

  if (useBadge) {
    options.badge =
      "fugu-128.png";
  }
  if (withActions) {
    options.actions = [
      {
        action: 'Action1',
        title: 'Title1',
      },
      {
        action: 'openWindow',
        title: 'Open Window',
      },
    ];
  }

  self.registration.showNotification("Text from service worker", options);
}

self.addEventListener("message", event => {
  if (event.data.type === "show_notification") {
    displaySwNotification(event.data.useBadge, event.data.withActions);
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

function doLog(message) {
  console.log(message);
  clients.matchAll().then(c => {
    for (let client of c) {
      client.postMessage({'log': message});
    }
  });
}

self.addEventListener("notificationclick", function(e) {
  var notification = e.notification;
  var primaryKey = notification.data.primaryKey;
  var action = e.action;

  if (action === "close") {
    notification.close();
  } else {
    doLog("[ServiceWorker] Clicked notification: " + primaryKey + ' ' + action);
    // notification.close();
  }
  
  if (action == "openWindow") {
    clients.openWindow("/index.html");
  }
});

self.addEventListener("notificationclose", function(e) {
  var notification = e.notification;
  var primaryKey = notification.data.primaryKey;

  doLog("[ServiceWorker] Closed notification: " + primaryKey);
});
