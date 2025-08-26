const notificationShow = document.getElementById("notificationShow");
const notificationClear = document.getElementById("notificationClear");

const swNotificationShow = document.getElementById("swNotificationShow");
const swNotificationClear = document.getElementById("swNotificationClear");

const swUseBadge = document.getElementById("swUseBadge");

const btnBgSync = document.getElementById("btnBgSync");
const btnBgTaskStart = document.getElementById("btnBgTaskStart");
const btnBgTaskStop = document.getElementById("btnBgTaskStop");
const btnBgTaskEnable = document.getElementById("btnBgTaskEnable");

// Check if the API is supported.
isSupported(("Notification" in window));

// Update the UI to indicate whether the API is supported.
function isSupported(support) {
  const notSupported = document.getElementById("notSupported");
  notSupported.classList.toggle("hidden", support);
}

var notification;

function displayNotification() {
  if (!notification) {
    notification = new Notification("Text");
  }  
}

function displaySwNotification() {
  navigator.serviceWorker.controller.postMessage( {type: "show_notification", useBadge:  swUseBadge.checked});   
}

// Click event handler for Show button.
notificationShow.addEventListener("click", () => {
  // Let's check whether notification permissions have already been granted
  if (Notification.permission === "granted") {
    // If it's okay let's create a notification
    displayNotification();
  }

  // Otherwise, we need to ask the user for permission
  else if (Notification.permission !== "denied") {
    Notification.requestPermission().then(function(permission) {
      // If the user accepts, let's create a notification
      if (permission === "granted") {
        displayNotification();
      }
    });
  }
});

// Click event handler for Clear button.
notificationClear.addEventListener("click", () => {
  if (notification) {
    notification.close();
    notification = null;
  }
});

// Click event handler for SW Show button.
swNotificationShow.addEventListener("click", () => {
  // Let's check whether notification permissions have already been granted
  if (Notification.permission === "granted") {
    displaySwNotification();
  }
  // Otherwise, we need to ask the user for permission
  else if (Notification.permission !== "denied") {
    Notification.requestPermission().then(function(permission) {
      // If the user accepts, let's create a notification
      if (permission === "granted") {
        displaySwNotification();        
      }
    });
  }    
});


// Click event handler for SW Clear button.
swNotificationClear.addEventListener("click", () => {
  navigator.serviceWorker.controller.postMessage( {type: "close_all"}); 
});

btnBgSync.addEventListener("click", async () => {
  const swRegistration = await navigator.serviceWorker.ready;
  swRegistration.sync.register("send-message");
});

btnBgTaskStart.addEventListener("click", () => {
  navigator.serviceWorker.controller.postMessage( {type: "start_bg"}); 
});

btnBgTaskStop.addEventListener("click", () => {
  navigator.serviceWorker.controller.postMessage( {type: "stop_bg"}); 
});

btnBgTaskEnable.addEventListener("click", () => {
  navigator.serviceWorker.controller.postMessage( {type: "enable_bg"}); 
});
