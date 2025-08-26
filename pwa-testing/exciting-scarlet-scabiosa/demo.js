let otVersion = false;
const butSet = document.getElementById('butSet');
const butClear = document.getElementById('butClear');
const notSet = document.getElementById('notSet');
const notClear = document.getElementById('notClear');
const inputBadgeVal = document.getElementById('badgeVal');

const butMakeXHR = document.getElementById('butMakeXHR');

// Check if the API is supported.
if ('setExperimentalAppBadge' in navigator) {
  isSupported('v2')
}

// Check if the previous API surface is supported.
if ('ExperimentalBadge' in window) {
  isSupported('v1');
}

// Check if the previous API surface is supported.
if ('setAppBadge' in navigator) {
  isSupported('v3');
}

// Update the UI to indicate whether the API is supported.
function isSupported(kind) {
  console.log('supported', kind);
  const divNotSupported = document.getElementById('notSupported');
  divNotSupported.classList.toggle('hidden', true);
  butSet.removeAttribute('disabled');
  butClear.removeAttribute('disabled');
  inputBadgeVal.removeAttribute('disabled');  
  
  butMakeXHR.removeAttribute('disabled');
}

// Click event handler for Set button.
butSet.addEventListener('click', () => {
  const val = parseInt(inputBadgeVal.value, 10);
  if (isNaN(val)) {
    setBadge();
    return;
  }
  setBadge(val);
});

// Click event handler for Clear button.
butClear.addEventListener('click', () => {
  clearBadge();
});

// Click event handler for Set button.
var notification;
notSet.addEventListener('click', () => {
  // Let's check whether notification permissions have already been granted
  if (Notification.permission === "granted") {
    // If it's okay let's create a notification
    if (!notification) {
      notification = new Notification("Test");
    }
  }

  // Otherwise, we need to ask the user for permission
  else if (Notification.permission !== "denied") {
    Notification.requestPermission().then(function (permission) {
      // If the user accepts, let's create a notification
      if (permission === "granted") {
        if (!notification) {
          notification = new Notification("Test");
        }
      }
    });
  }
});

// Click event handler for Clear button.
notClear.addEventListener('click', () => {
  if (notification) {
    notification.close();
    notification = null;
  }
});

butMakeXHR.addEventListener('click', () => {
  fetch('manifest.json');
});

// Wrapper to support first and second origin trial
// See https://web.dev/badging-api/ for details.
function setBadge(...args) {
  if (navigator.setAppBadge) {
    navigator.setAppBadge(...args);
  } else if (navigator.setExperimentalAppBadge) {
    navigator.setExperimentalAppBadge(...args);
  } else if (window.ExperimentalBadge) {
    window.ExperimentalBadge.set(...args);
  }
}

// Wrapper to support first and second origin trial
// See https://web.dev/badging-api/ for details.
function clearBadge() {
  if (navigator.clearAppBadge) {
    navigator.clearAppBadge();
  } else if (navigator.clearExperimentalAppBadge) {
    navigator.clearExperimentalAppBadge();
  } else if (window.ExperimentalBadge) {
    window.ExperimentalBadge.clear();
  }
}