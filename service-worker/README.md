# Service Worker Recipes

- [Basic registration](https://googlechrome.github.io/samples/service-worker/registration/index.html) -
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

- [Fallback responses](https://googlechrome.github.io/samples/service-worker/fallback-response/index.html) -
a sample illustrating how you can return alternative "fallback" content if an initial fetch request fails.

- [Mock responses](https://googlechrome.github.io/samples/service-worker/mock-responses/index.html) -
a sample illustrating how you can return content created on the fly in response to a page's requests.
