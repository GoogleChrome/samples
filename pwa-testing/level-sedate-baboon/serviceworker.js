self.addEventListener("fetch", (event) => {
  event.respondWith(
    fetch(event.request).catch((_) => {
      return new Response(
        "Offline. The site may be asleep - try refreshing in ~5 sec."
      );
    })
  );
});
