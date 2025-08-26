const origin = self.registration.scope;

let resolveManifest = null;
let manifestPromise = new Promise(resolve => (resolveManifest = resolve));

self.addEventListener("message", event => {
  if (resolveManifest) {
    resolveManifest(event.data);
    resolveManifest = null;
  } else {
    manifestPromise = Promise.resolve(event.data);
  }
  console.log(
    "Message received, manifest serving at " + event.data.manifestUrl
  );
});

self.addEventListener("fetch", event => {
  if (
    event.request.method == "GET" &&
    event.request.url.endsWith("webmanifest")
  ) {
    console.log("Got fetch for manifest.");
    event.respondWith(
      manifestPromise.then(manifestData => {
        let manifestFullUrl = origin + manifestData.manifestUrl;
        if (event.request.url != manifestFullUrl) {
          console.log(
            "Got request for manifest " +
              event.request.url +
              " and custom manifest is being hosted at " +
              manifestFullUrl
          );
          return fetch(event.request).catch(_ => {
            return new Response("Offline chair.");
          });
        }
        return new Response(JSON.stringify(manifestData.manifest), {
          status: 200,
          headers: { "Content-Type": "application/manifest+json" }
        });
      })
    );
  } else {
    event.respondWith(
      fetch(event.request).catch(_ => {
        return new Response("Offline chair.");
      })
    );
  }
});
