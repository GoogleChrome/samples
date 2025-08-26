function random(x) {
  return Math.random() * x;
}

self.addEventListener("fetch", event => {
  if (
    event.request.method == "GET" &&
    event.request.url == "https://barkbarkbark/"
  ) {
    event.respondWith(
      (async () => {
        const size = 144;
        const canvas = new OffscreenCanvas(size, size);
        const context = canvas.getContext("2d");
        context.fillStyle = "black";
        context.beginPath();
        context.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
        context.fill();
        for (let i = 0; i < 20; ++i) {
          const x = (random(size) + random(size)) / 2;
          const y = (random(size) + random(size)) / 2;
          const rectSize = (size - Math.abs(size - x - y)) / 8;
          context.fillStyle = `hsl(${random(360) | 0}deg, 100%, 50%)`;
          context.fillRect(
            x - rectSize / 2,
            y - rectSize / 2,
            rectSize,
            rectSize
          );
        }
        return new Response(await canvas.convertToBlob(), { status: 200 });
      })()
    );
    return;
  }

  event.respondWith(
    fetch(event.request).catch(_ => {
      return new Response("Offline sparkles.");
    })
  );
});
