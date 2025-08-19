if ("serviceWorker" in navigator) {
  window.addEventListener("load", async () => {
    const registration = await navigator.serviceWorker.register("./sw.js");
    console.log("Service worker registered for scope", registration.scope);
  });
}

if ("windowControlsOverlay" in navigator) {
  import('./wco.js');
}

if ( 'AmbientLightSensor' in window ) {
  import('./als.js');
}