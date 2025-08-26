

function createLogElement(message) {
  const logElement = document.createElement('div');
  logElement.classList.add('log-entry');
  logElement.textContent = `${new Date(log.timestamp).toLocaleString()}: ${message}`;
  return logElement;
}

function log(message) {
  console.log(message);
  const logContainer = document.getElementById('log-container');
  const logElement = createLogElement(log);
  logContainer.appendChild(logElement);
}

window.launchConsumer((params) => {
  log(`Got launch for ${params.targetUrl}`);
})