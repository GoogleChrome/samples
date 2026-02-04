// Register service worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('service-worker.js')
      .then((registration) => {
        console.log('Service Worker registered successfully:', registration.scope);
        updateStatus('Service Worker Active ✓', true);
      })
      .catch((error) => {
        console.error('Service Worker registration failed:', error);
        updateStatus('Service Worker Failed ✗', false);
      });
  });

  // Update status when service worker state changes
  navigator.serviceWorker.ready.then(() => {
    updateStatus('Service Worker Active ✓', true);
  });
} else {
  updateStatus('Service Worker Not Supported ✗', false);
}

function updateStatus(message, isActive) {
  const statusEl = document.getElementById('sw-status');
  statusEl.textContent = message;
  statusEl.className = isActive ? 'status' : 'status offline';
}
