function onButtonClick() {
  const config = [{
    videoCapabilities: [{
      contentType: 'video/webm; codecs="vp09.00.10.08"',
      robustness: 'SW_SECURE_DECODE' // Widevine L3
    }]
  }];
  
  log('Requesting Widevine system access...');
  navigator.requestMediaKeySystemAccess('com.widevine.alpha', config)
  .then(mediaKeySystemAccess => mediaKeySystemAccess.createMediaKeys())
  .then(mediaKeys => {
    log('Getting HDCP status...');
    if (!('getStatusForPolicy' in mediaKeys)) {
      return Promise.reject('HDCP Policy Check API is not available');
    }

    /* This is where the real magic happens... */
    const minHdcpVersion = document.querySelector('#minHdcpVersion').value;
    return mediaKeys.getStatusForPolicy({ minHdcpVersion });
  })
  .then(status => {
    if (status === 'usable') {
      log('> HDCP is available at the specified version.');
    } else {
      log('> HDCP is NOT available at the specified version: ' + status);
    }
  })
  .catch(error => {
    log('Argh! ' + error);
  });
}
