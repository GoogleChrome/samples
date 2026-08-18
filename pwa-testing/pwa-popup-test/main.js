const log = (msg) => {
  document.getElementById('status-log').innerText = `Status: ${msg}`;
};

// 1. Gestured popup (Should succeed)
document.getElementById('btn-gestured').addEventListener('click', () => {
  log('Opening popup with gesture...');
  const win = window.open('https://www.google.com', '_blank');
  if (win) {
    log('Popup opened successfully (gestured).');
  } else {
    log('Failed to open popup.');
  }
});

// 2. Ungestured popup via setTimeout (Should be blocked)
document.getElementById('btn-ungestured').addEventListener('click', () => {
  log('Triggering ungestured popup in 3 seconds...');
  setTimeout(() => {
    log('Attempting to open popup (timeout/ungestured)...');
    const win = window.open('https://www.google.com', '_blank');
    if (win) {
      log('Popup opened successfully (should not have happened!).');
    } else {
      log('Popup blocked (expected). Check PWA title bar for the blocked popup icon.');
    }
  }, 3000);
});

// 3. Attempt popup immediately on load (Should be blocked)
window.addEventListener('load', () => {
  log('Attempting to open popup automatically on load...');
  const win = window.open('https://www.google.com', '_blank');
  if (win) {
    log('Popup opened on load (should not have happened).');
  } else {
    log('Popup blocked on load (expected). Check PWA title bar for the blocked popup icon.');
  }
});
