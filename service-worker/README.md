# Service Worker Recipes

- [Basic registration](https://github.com/GoogleChrome/samples/tree/gh-pages/service-worker/registration) -
a bare-bones sample that simply performs service worker registration, with placeholders for various event handlers.

- [Detailed registration](https://github.com/GoogleChrome/samples/tree/gh-pages/service-worker/registration-events) -
a sample that provides detailed information about the service worker registration and the state changes that a
service worker undergoes.

- [Prefetching resources during installation](https://github.com/GoogleChrome/samples/tree/gh-pages/service-worker/prefetch) -
a sample demonstrating how to prefetch and cache a list of URLs during the service worker's installation, ensuring that they're
available offline.

- [Selective caching](https://github.com/GoogleChrome/samples/tree/gh-pages/service-worker/selective-caching) -
a sample of how a service worker can cache resources "on the fly", assuming the resources meet certain criteria (MIME type,
domain, etc.).

- [Pass-through caching](https://github.com/GoogleChrome/samples/tree/gh-pages/service-worker/pass-through-caching) -
a sample of caching _all_ resources that are requested "on the fly", unconditionally.

- [Fallback responses](https://github.com/GoogleChrome/samples/tree/gh-pages/service-worker/fallback-response) -
a sample illustrating how you can return alternative "fallback" content if an initial fetch request fails.

- [Mock responses](https://github.com/GoogleChrome/samples/tree/gh-pages/service-worker/mock-responses) -
a sample illustrating how you can return content created on the fly in response to a page's requests.
