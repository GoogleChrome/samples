navigator.mediaDevices.getUserMedia({ video: true })
.then((stream) => {
  document.querySelector("video").srcObject = stream;

  const [track] = stream.getVideoTracks();
  const capabilities = track.getCapabilities();
  const settings = track.getSettings();

  if (!("backgroundBlur" in settings)) {
    throw Error(`Background blur is not supported by ${track.label}`);
  }

  log(`Background blur is ${settings.backgroundBlur ? "ON" : "OFF"}`);
  
  // Listen to background blur changes.
  track.addEventListener("configurationchange", configurationChange);
  
  // Check whether the user can toggle background blur in the web app.
  if (capabilities.backgroundBlur?.length !== 2) {
    throw Error(`Background blur toggle is not supported by ${track.label}`);
  }

  const button = document.querySelector("button");
  button.addEventListener("click", buttonClick);
  button.disabled = false;
})
.catch((error) => log("Argh!", `${error}`));

async function buttonClick() {
  const stream = document.querySelector("video").srcObject;
  const [track] = stream.getVideoTracks();
  const settings = track.getSettings();
  const newState = !settings.backgroundBlur;
  const constraints = {
    backgroundBlur: newState
  };
  try {
    await track.applyConstraints(constraints);
    log(`Background blur constraint was set to ${newState ? "ON" : "OFF"}`);
  } catch (error) {
    log("Argh!", `${error}`);
  }
}

function configurationChange(event) {
  const settings = event.target.getSettings();
  if ("backgroundBlur" in settings) {
    log(`Background blur setting changed to ${settings.backgroundBlur ? "ON" : "OFF"}`);
  }
}
