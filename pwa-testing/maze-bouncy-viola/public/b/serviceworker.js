self.addEventListener('install', () => {
  console.log('Installed');
});

self.addEventListener('activate', () => {
  console.log('Activated');
});

self.addEventListener('fetch', event => {});
