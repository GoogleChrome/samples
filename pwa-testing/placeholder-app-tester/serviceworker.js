const origin = self.registration.scope;

let id = 0;
let redirect = true;

const idbKeyval = (() => {
  let dbInstance;

  function getDB() {
    if (dbInstance) return dbInstance;

    dbInstance = new Promise((resolve, reject) => {
      const openreq = indexedDB.open("svgo-keyval", 1);

      openreq.onerror = () => {
        reject(openreq.error);
      };

      openreq.onupgradeneeded = () => {
        // First time setup: create an empty object store
        openreq.result.createObjectStore("keyval");
      };

      openreq.onsuccess = () => {
        resolve(openreq.result);
      };
    });

    return dbInstance;
  }

  async function withStore(type, callback) {
    const db = await getDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction("keyval", type);
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
      callback(transaction.objectStore("keyval"));
    });
  }

  return {
    async get(key) {
      let request;
      await withStore("readonly", (store) => {
        request = store.get(key);
      });
      return request.result;
    },
    set(key, value) {
      return withStore("readwrite", (store) => {
        store.put(value, key);
      });
    },
    delete(key) {
      return withStore("readwrite", (store) => {
        store.delete(key);
      });
    },
  };
})();

console.log("run");

self.addEventListener("message", (event) => {
  console.log("Setting redirect to " + event.data.redirect);
  idbKeyval.set("redirect", event.data.redirect);
});

self.addEventListener("fetch", (event) => {
  let url = new URL(event.request.url);
  if (event.request.method == "GET" && url.pathname.startsWith("/app/")) {
    event.respondWith(
      new Promise(async (resolve) => {
        let redirect = await idbKeyval.get("redirect");
        if (redirect) {
          resolve(Response.redirect("https://redirection-target.glitch.me/"));
        } else {
          return resolve(
            fetch(event.request).then((response) => {
              const newHeaders = new Headers(response.headers);
              newHeaders.append("Cache-Control", "no-cache, must-revalidate");

              return new Response(response.body, {
                status: response.status,
                statusText: response.statusText,
                headers: newHeaders,
              });
            })
          );
        }
      })
    );
  } else {
    event.respondWith(
      fetch(event.request).catch((_) => {
        return new Response("Offline test.");
      })
    );
  }
});
