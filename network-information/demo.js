navigator.connection.addEventListener('change', logNetworkInfo);

function logNetworkInfo() {
  // Network type that browser uses
  log('         type: ' + navigator.connection.type);

  // Effective bandwidth estimate
  log('     downlink: ' + navigator.connection.downlink + ' Mb/s');

  // Effective round-trip time estimate
  log('          rtt: ' + navigator.connection.rtt + ' ms');

  // Upper bound on the downlink speed of the first network hop
  log('  downlinkMax: ' + navigator.connection.downlinkMax + ' Mb/s');

  // Effective connection type determined using a combination of recently
  // observed rtt and downlink values: ' +
  log('effectiveType: ' + navigator.connection.effectiveType);
  
  // True if the user has requested a reduced data usage mode from the user
  // agent.
  log('     saveData: ' + navigator.connection.saveData);
  
  // Add whitespace for readability
  log('');
}

logNetworkInfo();
