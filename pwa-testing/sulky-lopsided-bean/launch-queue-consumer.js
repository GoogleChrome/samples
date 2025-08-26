const output = document.createElement('pre');
document.body.appendChild(output);
output.textContent += `window.location.href: ${window.location.href}\n\n`;
output.textContent += `window.launchQueue: ${window.launchQueue ? 'exists' : 'missing'}\n\n`;
let paramsList = [];
if (window.launchQueue) {
  output.textContent += 'Consumed LaunchParams:\n';
  launchQueue.setConsumer(params => {
    output.textContent += `[${new Date().toTimeString().slice(0, 8)}] LaunchParams {\n${
      ['files', 'targetURL'].map(key => `  ${key}: ${params[key]},\n`).join('')
    }}\n`;
  });
}