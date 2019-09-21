const shareTargetHandler = async ({event}) => {
  const formData = await event.request.formData();
  const images = formData.getAll('image');

  const cache = await caches.open('images');
  for (const image of images) {
    await cache.put(
      // TODO: Don't hardcode .jpg as the default.
      `/images/${Date.now()}-${image.name || 'unnamed.jpg'}`,
      new Response(image)
    );
  }

  // After the POST succeeds, redirect to the main page.
  return Response.redirect('/', 303);
};

module.exports = {
  clientsClaim: true,
  globDirectory: '.',
  globPatterns: ['**/*.{js,html,json,css}'],
  mode: 'production',
  runtimeCaching: [{
    // Create a 'fake' route to handle the incoming POST.
    urlPattern: '/share-target',
    method: 'POST',
    handler: shareTargetHandler,
  }, {
    // Create a route to serve the cached images.
    urlPattern: new RegExp('/images/\\d+'),
    handler: 'CacheOnly',
    options: {
      cacheName: 'images',
    },
  }],
  skipWaiting: true,
  sourcemap: true,
  swDest: 'service-worker.js',
};
