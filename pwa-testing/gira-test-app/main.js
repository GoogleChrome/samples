// Register service worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js')
      .then(reg => console.log('[SW] Registered:', reg.scope))
      .catch(err => console.error('[SW] Registration failed:', err));
  });
}

// Fetch manifest and display related_applications live
fetch('./manifest.json')
  .then(r => r.json())
  .then(manifest => {
    const el = document.getElementById('manifest-display');
    if (manifest.related_applications) {
      el.textContent = '"related_applications": ' +
        JSON.stringify(manifest.related_applications, null, 2);
    } else {
      el.textContent = '// No related_applications found in manifest.json';
    }
  })
  .catch(() => {
    document.getElementById('manifest-display').textContent =
      '// Failed to load manifest.json';
  });
