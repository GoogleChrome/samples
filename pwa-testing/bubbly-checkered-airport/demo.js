const notificationShow = document.getElementById("notificationShow");
const notificationClear = document.getElementById("notificationClear");

const swNotificationShow = document.getElementById("swNotificationShow");
const swNotificationClear = document.getElementById("swNotificationClear");

const swUseBadge = document.getElementById("swUseBadge");

// Check if the API is supported.
if ("Notification" in window) {
  isSupported();
}

// Update the UI to indicate whether the API is supported.
function isSupported() {
  const divNotSupported = document.getElementById("notSupported");
  divNotSupported.classList.toggle("hidden", true);
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

