function onButtonClick() {
  const minHdcpVersion = document.querySelector('#minHdcpVersion').value;
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
      return Promise.reject('HDCP Policy Check API is not available.');
    }

    /* This is where the real magic happens... */
    return mediaKeys.getStatusForPolicy({ minHdcpVersion });
  })
  .then(status => {
    if (status !== 'usable') {
      return Promise.reject(status);
    }

    log('> HDCP is available for ' + minHdcpVersion);
  })
  .catch(error => {
    log('Argh! ' + error);
  });
}
