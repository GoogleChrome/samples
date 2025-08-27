const notificationShow = document.getElementById("notificationShow");
const notificationClear = document.getElementById("notificationClear");

const swNotificationShow = document.getElementById("swNotificationShow");
const swNotificationClear = document.getElementById("swNotificationClear");

const swUseBadge = document.getElementById("swUseBadge");
const swWithActions = document.getElementById("swWithActions");
const swViaPage = document.getElementById("swViaPage");

const permissionState = document.getElementById("permissionState");
const permissionRequest = document.getElementById("permissionRequest");

const displayedNotifications = document.getElementById("displayedNotifications");

const receivedActions = document.getElementById("receivedActions");

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

function doLog(message) {
  console.log(message);
  receivedActions.innerText = receivedActions.innerText + message + "\n";
}

navigator.serviceWorker.addEventListener('message', e => {
  if ('log' in e.data) {
    doLog('SW: ' + e.data.log);
  }
});

function displayNotification() {
  //if (!notification) {
    notification = new Notification("Text");
    notification.onclick = () => {
      doLog('Click!');
      window.focus();
    };
    notification.onshow = () => {
      doLog('Show!');
    };
    notification.onerror = () => {
      doLog('Error!');
    };
    notification.onclose = () => {
      doLog('Close!');
    };
  //}  
}

async function displayPersistentNotification() {
  var options = {
    body: "A notification body",
    icon:
      "fugu-512.png",
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 2
    }
  };
  if (swWithActions.checked) {
    options.actions = [
      {
        action: 'actionname',
        title: 'action title',
      }
    ];
  }

  let registration = await navigator.serviceWorker.ready;
  registration.showNotification("Text from persistent notification", options);  
}

function displaySwNotification() {
  if (swViaPage.checked) {
    displayPersistentNotification();
    return;
  }
  navigator.serviceWorker.controller.postMessage( {type: "show_notification", useBadge:  swUseBadge.checked, withActions: swWithActions.checked});   
}

permissionState.innerText = Notification.permission;

permissionRequest.addEventListener("click", async () => {
  let permission = await Notification.requestPermission();
  permissionState.innerText = permission;
});

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

async function updateDisplayedNotifications() {
  displayedNotifications.innerText = 'Updating...';
  let registration = await navigator.serviceWorker.ready;
  let notifications = await registration.getNotifications();
  let s = '';
  for (let n of notifications) {
    s += `${n.title} - ${n.body} - ${n.tag}\n`;
  }
  if (s == '') s = 'None';
  displayedNotifications.innerText = s;
}

document.getElementById("refreshNotifications").addEventListener("click", updateDisplayedNotifications);
updateDisplayedNotifications();

let globalKey = 100;
document.getElementById("notDisplay").addEventListener("click", async () => {
  const inpTitle = document.getElementById("notTitle");
  const inpBody = document.getElementById("notBody");
  const inpTag = document.getElementById("notTag");
  const inpRenotify = document.getElementById("notRenotify");
  const inpSilent = document.getElementById("notSilent");
  const inpRequireInteraction = document.getElementById("notRequireInteraction");
  
  let options = {
    body: inpBody.value,
    icon:
      "fugu-512.png",
    tag: inpTag.value,
    renotify: inpRenotify.checked,
    silent: inpSilent.checked,
    requireInteraction: inpRequireInteraction.checked,
    data: {
      dateOfArrival: Date.now(),
      primaryKey: globalKey,
    },
  };
  globalKey += 1;
  let registration = await navigator.serviceWorker.ready;
  registration.showNotification(inpTitle.value, options);    
});