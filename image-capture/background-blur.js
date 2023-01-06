navigator.mediaDevices.getUserMedia({ video: true })
.then((mediaStream) => {
  document.querySelector("video").srcObject = mediaStream;

  const [track] = mediaStream.getVideoTracks();
  const capabilities = track.getCapabilities();

  // Check whether toggling background blur is supported or not.
  if (capabilities.backgroundBlur?.length !== 2) {
    throw Error(`Background blur toggle is not supported by ${track.label}`);
  }

  const toggleButton = document.querySelector("button");
  toggleButton.onclick = () => {
    const settings = track.getSettings();
    track.applyConstraints({
      advanced: [{ backgroundBlur: !settings.backgroundBlur }],
    });
  };
  toggleButton.disabled = false;
})
.catch((error) => ChromeSamples.log("Argh!", `${error}`));
