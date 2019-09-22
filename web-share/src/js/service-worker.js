import {CacheOnly} from 'workbox-strategies';
import {clientsClaim, skipWaiting} from 'workbox-core';
import {precacheAndRoute} from 'workbox-precaching';
import {RangeRequestsPlugin} from 'workbox-range-requests';
import {registerRoute} from 'workbox-routing';

const MEDIA_CACHE_NAME = 'media';
const MEDIA_URL_PREFIX = '/_media/';

const broadcastChannel = BroadcastChannel ? new BroadcastChannel('message') : null;

const shareTargetHandler = async ({event}) => {
  if (broadcastChannel) {
    broadcastChannel.postMessage('Saving media locally...');
  }

  const formData = await event.request.formData();
  const mediaFiles = formData.getAll('media');
  const cache = await caches.open(MEDIA_CACHE_NAME);

  for (const mediaFile of mediaFiles) {
    // TODO: Instead of bailing, come up with a
    // default name for each possible MIME type.
    if (!mediaFile.name) {
      if (broadcastChannel) {
        broadcastChannel.postMessage('Sorry! No name found on incoming media.');
      }
      continue;
    }
    await cache.put(
      // TODO: Handle scenarios in which mediaFile.name isn't set,
      // or doesn't include a proper extension.
      `${MEDIA_URL_PREFIX}${Date.now()}-${mediaFile.name}`,
      new Response(mediaFile)
    );
  }
  
  // After the POST succeeds, redirect to the main page.
  return Response.redirect('/', 303);
};

const cachedMediaHandler = new CacheOnly({
  cacheName: MEDIA_CACHE_NAME,
  plugins: [
    // Support for cache requests that include a Range: header.
    new RangeRequestsPlugin(),
  ],
});

skipWaiting();
clientsClaim();

// This will be replaced by the list of files to precache by
// the `workbox injectManifest` build step.
precacheAndRoute(self.__WB_MANIFEST);

registerRoute(
  '/_share-target',
  shareTargetHandler,
  'POST'
);

registerRoute(
  new RegExp(MEDIA_URL_PREFIX),
  cachedMediaHandler
);
