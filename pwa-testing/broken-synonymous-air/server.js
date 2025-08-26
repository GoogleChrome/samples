const links = `
Links to pages for testing link capturing with launch_handler:
 - <a href="./app/a">/app/a</a>
 - <a href="./a">/a (out of scope based on manifest)</a>
 - <a href="./app/302_redirect">/app/302_redirect</a>
 - <a href="./app/302_redirect_out_scope">/app/302_redirect_out_scope</a>
`;
const iconUrl = 'notch-candle-shape.svg';

require('http').createServer((request, response) => {
  switch (request.url) {
    case '/':
    case '/app/':
    case '/a':
      response.writeHead(200, { 'Content-Type': 'text/html' });
      response.write(`
<!DOCTYPE html>
<head>
  <link rel="manifest" href="manifest.json">
  <link rel="icon" href="${iconUrl}">
</head>
<img src="${iconUrl}"><br>
<pre>
Out of scope air

${links}
</pre>
<pre id="output"></pre>
<script>
navigator.serviceWorker.register('sw.js');

output.textContent += 'Current page: ' + location.href + '\\n';
output.textContent += 'window.launchQueue: ' + (window.launchQueue ? 'exists' : 'missing') + '\\n';
if (window.launchQueue) {
  output.textContent += 'Launches:\\n';
  window.launchQueue.setConsumer(launchParams => {
    output.textContent += ' - [' + new Date().toLocaleTimeString() + ']: ' + launchParams.targetURL + '\\n';
  });
}
</script>
      `);
      response.end();
      break;
    case '/app/a':
      response.writeHead(200, { 'Content-Type': 'text/html' });
      response.write(`
<!DOCTYPE html>
<head>
  <link rel="manifest" href="manifest.json">
  <link rel="icon" href="${iconUrl}">
  <title>Broken Air</title>
</head>
<img src="${iconUrl}"><br>
<pre>
Broken Air

This app uses launch_handler: {
  route_to: 'existing-client',
  navigate_existing_client: 'never',
}

${links}
</pre>
<pre id="output"></pre>
<script>
navigator.serviceWorker.register('sw.js');

output.textContent += 'Current page: ' + location.href + '\\n';
output.textContent += 'window.launchQueue: ' + (window.launchQueue ? 'exists' : 'missing') + '\\n';
if (window.launchQueue) {
  output.textContent += 'Launches:\\n';
  window.launchQueue.setConsumer(launchParams => {
    output.textContent += ' - [' + new Date().toLocaleTimeString() + ']: ' + launchParams.targetURL + '\\n';
  });
}
</script>
      `);
      response.end();
      break;

    case '/manifest.json':
      response.writeHead(200, { 'Content-Type': 'application/json' });
      response.write(JSON.stringify({
        name: 'Broken Air OOS',
        start_url: '/a',
        scope: '/a',
        display: 'standalone',
        theme_color: '#e82ac3',
        icons: [{
          src: iconUrl,
          sizes: '144x144',
          type: 'image/svg+xml',
        }],
        launch_handler: {
          route_to: 'existing-client',
          navigate_existing_client: 'never',
        },
      }, null, '  '));
      response.end();
      break;
    case '/app/manifest.json':
      response.writeHead(200, { 'Content-Type': 'application/json' });
      response.write(JSON.stringify({
        name: 'Broken Air',
        start_url: '/app/a',
        scope: '/app/a',
        display: 'standalone',
        theme_color: '#e82ac3',
        icons: [{
          src: iconUrl,
          sizes: '144x144',
          type: 'image/svg+xml',
        }],
        launch_handler: {
          route_to: 'existing-client',
          navigate_existing_client: 'never',
        },
      }, null, '  '));
      response.end();
      break;

    case '/app/302_redirect':
      response.writeHead(302, { 'Location': '/app/a' });
      response.end();
      break;

    case '/app/302_redirect_out_scope':
      response.writeHead(302, { 'Location': '/a' });
      response.end();
      break;

    default:
        response.writeHead(404);
      response.end();
      break;
}
}).listen(process.env.PORT);
