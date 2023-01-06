navigator.mediaDevices.getUserMedia({ video: true })
.then((mediaStream) => {
  document.querySelector("video").srcObject = mediaStream;

  const [track] = mediaStream.getVideoTracks();
  const capabilities = track.getCapabilities();

  // Check whether toggling background blur is supported or not.
  if (capabilities.backgroundBlur?.length !== 2) {
    throw new Error(
      `Toggling background blur is not supported by ${track.label}`
    );
  }

  const toggleButton = document.querySelector("button");
  toggleButton.onclick = () => {
    const backgroundBlur = track.getSettings().backgroundBlur;
    track.applyConstraints({
      advanced: [{ backgroundBlur: !backgroundBlur }],
    });
  };
  toggleButton.disabled = false;
})
.catch((error) => ChromeSamples.log("Argh!", `${error}`));
