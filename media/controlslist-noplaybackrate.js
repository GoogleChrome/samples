window.onload = () => {
  const video = document.querySelector('video');
  if (!video.controlsList.supports('noplaybackrate')) {
    ChromeSamples.log('"noplaybackrate" is not supported.');
  }
}
