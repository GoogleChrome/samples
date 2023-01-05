navigator.mediaDevices.getUserMedia({ video: true })
.then((mediaStream) => {
  document.querySelector("video").srcObject = mediaStream;

  const [track] = mediaStream.getVideoTracks();
  const settings = track.getSettings();

  // Check whether background blur is supported or not.
  if (!("backgroundBlur" in settings)) {
    throw new Error(
      `Background blur is not supported by ${track.label}`
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
