function logConnectionType() {
  var connectionType = 'not supported';
  var downlinkMax = 'not supported';

  if ('connection' in navigator) {
    connectionType = navigator.connection.type;

    if ('downlinkMax' in navigator.connection) {
      downlinkMax = navigator.connection.downlinkMax;
    }
  }

  ChromeSamples.log('Current connection type: ' + connectionType +
    ' (downlink max: ' + downlinkMax + ')');
}

logConnectionType();
navigator.connection.addEventListener('change', logConnectionType);
