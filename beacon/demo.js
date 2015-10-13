if ('sendBeacon' in navigator) {
  window.addEventListener('pagehide', function() {
    navigator.sendBeacon(
      'https://putsreq.herokuapp.com/4GE2nVUuDoDGsNyKES2G',
      'Sent by a beacon!');
  }, false);
}
