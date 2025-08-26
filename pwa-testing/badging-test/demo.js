import { logMessage } from './log.js'

const butSet = document.getElementById('butSet');
const butClear = document.getElementById('butClear');
const inputBadgeVal = document.getElementById('badgeVal');
const expectBadgeNumber = document.getElementById('expectBadgeNumber');

const updateExpectBadgeNumber = () => {
  const val = parseInt(inputBadgeVal.value, 10) || 1;
  expectBadgeNumber.innerText = val;
}
inputBadgeVal.addEventListener('input', () => {
  updateExpectBadgeNumber();
});
updateExpectBadgeNumber();

function setBadge(...args) {
  if (navigator.setAppBadge)
    navigator.setAppBadge(...args);
  else if (navigator.setExperimentalAppBadge)
    navigator.setExperimentalAppBadge(...args);
  else if (window.ExperimentalBadge)
    window.ExperimentalBadge.set(...args);
}

function clearBadge() {
  if (navigator.clearAppBadge)
    navigator.clearAppBadge();
  else if (navigator.clearExperimentalAppBadge)
    navigator.clearExperimentalAppBadge();
  else if (window.ExperimentalBadge)
    window.ExperimentalBadge.clear();
}

const badgingSupported = navigator.setAppBadge
  || navigator.setExperimentalAppBadge
  || (window.ExperimentalBadge && window.ExperimentalBadge.set);

const doSet = () => {
  const val = parseInt(inputBadgeVal.value, 10);
  if (isNaN(val)) {
    setBadge();
    logMessage(`Attempted to set badge to 'flag'`);
  } else {
    setBadge(val);
    logMessage(`Attempted to set badge to ${val}`)
  }
};

const doClear = () => {
  clearBadge();
  logMessage(`Attempted to clear badge.`)
};

// Check if the API is supported or not.
if (badgingSupported) {
  const notSupported = document.getElementById('notSupported');
  notSupported.classList.toggle('hidden', true);
  
  const demoControls = document.getElementById('demoControls');
  demoControls.classList.toggle('hidden', false);
}

// Add global keylistener to make testing easier.
document.addEventListener('keyup', e => {
  console.log(e);
  if (e.key === 'f') {
    inputBadgeVal.value = '';
    doSet();
  }
  
  if (e.key === 'n') {
    inputBadgeVal.value = parseInt(inputBadgeVal.value) || 1
    doSet();
  }
  
  if (e.key === 'c') {
    doClear();
  }
});

// Click event handler for Set button.
butSet.addEventListener('click', doSet);

// Click event handler for Clear button.
butClear.addEventListener('click', doClear);