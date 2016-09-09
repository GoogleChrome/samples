# Service Worker Recipes

- [Basic Demo](https://googlechrome.github.io/samples/service-worker/basic/index.html) -
a sample covering a basic, common use case. It precaches a set of local resources in a
versioned cache, and maintains another cache that's populated at runtime as additional
resources are requested.

- [Simple registration](https://googlechrome.github.io/samples/service-worker/registration/index.html) -
a bare-bones sample that simply performs service worker registration, with placeholders for various event handlers.

- [Detailed registration](https://googlechrome.github.io/samples/service-worker/registration-events/index.html) -
a sample that provides detailed information about the service worker registration and the state changes that a
service worker undergoes.

- [Prefetching resources during installation](https://googlechrome.github.io/samples/service-worker/prefetch/index.html) -
a sample demonstrating how to prefetch and cache a list of URLs during the service worker's installation, ensuring that they're
available offline.

- [Selective caching](https://googlechrome.github.io/samples/service-worker/selective-caching/index.html) -
a sample of how a service worker can cache resources "on the fly", assuming the resources meet certain criteria (MIME type,
domain, etc.).

- [Read-through caching](https://googlechrome.github.io/samples/service-worker/read-through-caching/index.html) -
a sample of caching _all_ resources that are requested "on the fly", unconditionally.

- [Offline Google Analytics](https://googlechrome.github.io/samples/service-worker/offline-analytics/index.html) -
extends the [read-through caching](https://googlechrome.github.io/samples/service-worker/read-through-caching/index.html) example to add in support for "replaying" failed Google Analytics pings, allowing pages to submit Google Analytics data associated with offline/cached page views.

- [Fallback responses](https://googlechrome.github.io/samples/service-worker/fallback-response/index.html) -
a sample illustrating how you can return alternative "fallback" content if an initial fetch request fails.

- [Mock responses](https://googlechrome.github.io/samples/service-worker/mock-responses/index.html) -
a sample illustrating how you can return content created on the fly in response to a page's requests.

- [Using `postMessage`](https://googlechrome.github.io/samples/service-worker/post-message/index.html) -
a sample illustrating the use of `postMessage()` to send commands from a controlled page to its service worker, giving the page control over the cache.

- [Multiple `fetch` handlers](https://googlechrome.github.io/samples/service-worker/multiple-handlers/index.html) -
a sample illustrating multiple `fetch` handlers, each of which intercepts a different type of request.

- [Custom offline page](https://googlechrome.github.io/samples/service-worker/custom-offline-page/index.html) -
a sample showing how to display a custom "Sorry, you're offline." error page when a network request fails.

- [Immediate control](https://googlechrome.github.io/samples/service-worker/immediate-control/index.html) -
a sample showing how to use `skipWaiting()` and `clients.claim()` to force a new service worker to
take control of the page that just registered it.

- [Using `window.caches`](https://googlechrome.github.io/samples/service-worker/window-caches/index.html) -
a sample showing how `window.caches` provides access to the Cache Storage API.

- [Using `WindowClient.navigate()`](https://googlechrome.github.io/samples/service-worker/windowclient-navigate/index.html) -
a sample showing how a service worker can cause web page clients it controls to
navigate to a given URL.

- [Foreign Fetch](https://googlechrome.github.io/samples/service-worker/foreign-fetch/index.html) -
a sample showing a client making use of the foreign fetch service worker
deployed by a third-party service.


# Related samples

- Instructions for [registering for Push Messages and showing Notifications](https://github.com/GoogleChrome/samples/tree/gh-pages/push-messaging-and-notifications).
