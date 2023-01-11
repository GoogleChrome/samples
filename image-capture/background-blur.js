navigator.mediaDevices.getUserMedia({ video: true })
.then((mediaStream) => {
  document.querySelector("video").srcObject = mediaStream;

  const [track] = mediaStream.getVideoTracks();
  const capabilities = track.getCapabilities();
  const settings = track.getSettings();

  if ("backgroundBlur" in settings) {
    log(`Background blur is ${settings.backgroundBlur ? "ON" : "OFF"}`);
  }

  // Check whether toggling background blur is supported or not.
  if (capabilities.backgroundBlur?.length !== 2) {
    throw Error(`Background blur toggle is not supported by ${track.label}`);
  }

  // Listen to background blur changes.
  track.onconfigurationchange = onconfigurationchange;

  const toggleButton = document.querySelector("button");
  toggleButton.onclick = () => {
    const settings = track.getSettings();
    track.applyConstraints({
      advanced: [{ backgroundBlur: !settings.backgroundBlur }],
    });
  };
  toggleButton.disabled = false;
})
.catch((error) => log("Argh!", `${error}`));

function onconfigurationchange(event) {
  const settings = event.target.getSettings();
  if ("backgroundBlur" in settings) {
    log(`Background blur is now ${settings.backgroundBlur ? "ON" : "OFF"}`);
  }
}
