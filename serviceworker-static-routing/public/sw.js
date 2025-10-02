const CACHE_NAME = "V1";

const routerRules = [
  {
    condition: {
      urlPattern: { pathname: "/serviceworker_static_routing/pages/network" },
    },
    source: "network",
  },
  {
    condition: {
      urlPattern: { pathname: "/serviceworker_static_routing/pages/fetch-event" },
    },
    source: "fetch-event",
  },
  {
    condition: {
      urlPattern: { pathname: "/serviceworker_static_routing/pages/cache" },
    },
    source: {
      cacheName: CACHE_NAME,
    },
  },
  {
    condition: {
      urlPattern: { pathname: "/serviceworker_static_routing/pages/race-network-and-fetch-handler" },
    },
    source: "race-network-and-fetch-handler",
  },
];

const registerRouter = (e) => {
  if (e.addRoutes) {
    try {
      e.addRoutes(routerRules);
      console.log("Router registered: ", routerRules);
    } catch (err) {
      console.log(err);
    }
  } else {
    console.log("no static router support");
  }
};

const precache = async () => {
  const res = await fetch("/serviceworker_static_routing/cache.html");
  const cache = await caches.open(CACHE_NAME);
  await cache.addAll(["/serviceworker_static_routing/script.js", "/serviceworker_static_routing/style.css"]);
  return cache.put("/serviceworker_static_routing/pages/cache", res.clone());
};

self.addEventListener("fetch", async (e) => {
  const urlObj = new URL(e.request.url);
  if (e.request.mode == "navigate") {
    if (urlObj.pathname == "/serviceworker_static_routing/pages/race-network-and-fetch-handler") {
      const result = urlObj.searchParams.get("result");
      if (result == "network") {
        e.respondWith(
          fetch(e.request).then((response) => {
            return new Promise((resolve) => {
              setTimeout(() => {
                return response;
              }, 3000);
            });
          })
        );
      } else if (result == 'fetch-handler') {
        e.respondWith(fetch("/serviceworker_static_routing/fetch-event.html"));
      } else if (result == 'fallback') {
        console.log('fallback')
      } else {
        e.respondWith(fetch(e.request));
      }
    } else if (urlObj.pathname != "/serviceworker_static_routing/") {
      e.respondWith(fetch("/serviceworker_static_routing/fetch-event.html"));
    }
  }
});

self.addEventListener("install", async (e) => {
  console.log("install");
  registerRouter(e);
  precache(e);
  e.waitUntil(self.skipWaiting());
  console.log('install finished')
});

self.addEventListener("activate", (e) => {
  e.waitUntil(self.clients.claim());
});
