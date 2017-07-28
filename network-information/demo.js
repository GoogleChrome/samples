function logConnectionInfo() {
  var properties = [
    'type',
    'effectiveType',
    'downlinkMax',
    'downlink',
    'rtt'
  ];

  ChromeSamples.log('Current Connection Status:');
  properties.forEach(function(property) {
    ChromeSamples.log('  ' + property + ':' +
      (navigator.connection[property] || '[unknown]'));
  });
}

// Log the connection info once at startup.
logConnectionInfo();
// Log the new connection info whenever it changes.
navigator.connection.addEventListener('change', logConnectionInfo);
