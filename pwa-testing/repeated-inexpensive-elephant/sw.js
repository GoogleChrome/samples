const scriptStartTime = new Date();
var keepGoing = true;

self.addEventListener("install", function (e) {
  console.log("[ServiceWorker] Install");
  self.skipWaiting();
});

self.addEventListener("activate", function (e) {
  console.log("[ServiceWorker] Activate");
  return self.clients.claim();
});

self.addEventListener("fetch", function (e) {
  console.log("[Service Worker] Fetch", e.request.url);
  e.respondWith(fetch(e.request));
});

function displaySwNotification(useBadge) {
  var options = {
    body: "A notification body",
    icon: "fugu-512.png",
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1,
    },
  };

  if (useBadge) {
    options.badge =
      "fugu-128.png";
  }

  self.registration.showNotification("Text from service worker", options);
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function stayAlive() {
  const startTime = new Date();
  while (keepGoing) {
    const delta = new Date() - startTime;
    console.log(
      "[ServiceWorker] Stay alive started: " +
        startTime.toLocaleString() +
        ". Delta: " +
        Math.round(delta / 1000) +
        "s. Script started: " +
        scriptStartTime.toLocaleString()
    );
    await sleep(5000);
  }
}

self.addEventListener("sync", (event) => {
  if (event.tag == "send-message") {
    console.log(
      "[ServiceWorker]: sync event received at " + new Date().toLocaleString()
    );
    event.waitUntil(stayAlive());
  }
});

self.addEventListener("message", (event) => {
  if (event.data) {
    console.log("[Service Worker] Message JSON ", JSON.stringify(event.data));
  }

  if (event.data.type === "show_notification") {
    displaySwNotification(event.data.useBadge);
  }

  if (event.data.type === "close_all") {
    // close all notifications
    self.registration.getNotifications().then(function (notifications) {
      notifications.forEach(function (notification) {
        notification.close();
      });
    });
  }

  // Control background stuff.
  if (event.data.type === "start_bg") {
    keepGoing = true;
    event.waitUntil(stayAlive());
  }
  if (event.data.type === "stop_bg") {
    keepGoing = false;
  }
  if (event.data.type === "enable_bg") {
    keepGoing = true;
  }
});

self.addEventListener("notificationclick", function (e) {
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

self.addEventListener("notificationclose", function (e) {
  var notification = e.notification;
  var primaryKey = notification.data.primaryKey;

  console.log("[ServiceWorker] Closed notification: " + primaryKey);
});
