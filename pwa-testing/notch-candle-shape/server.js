const links = `
Links to pages for testing link capturing with launch_handler:
 - <a href="./">/</a> (not in scope of web app)
 - <a href="./app/">/app/</a>
 - <a href="./app/a">/app/a</a>
 - <a href="./app/b">/app/b</a>
 - <a href="./app/301_redirect">/app/301_redirect</a>
 - <a href="./app/302_redirect">/app/302_redirect</a>
 - <a href="./app/307_redirect">/app/307_redirect</a>
 - <a href="./app/meta_redirect">/app/meta_redirect</a>
`;
const iconUrl = 'https://cdn.glitch.me/5424b80f-25d2-4691-92b0-687db45cc3d6%2Fnotch-candle-shape.svg';

require('http').createServer((request, response) => {
  switch (request.url) {
    case '/':
      response.writeHead(200, { 'Content-Type': 'text/html' });
      response.write(`
<pre>
Notch Candle Shape

This page is out of scope of the <a href="./app/">app</a>.

${links}
</pre>
      `);
      response.end();
      break;

    case '/app/':
    case '/app/a':
    case '/app/b':
      response.writeHead(200, { 'Content-Type': 'text/html' });
      response.write(`
<!DOCTYPE html>
<head>
  <link rel="manifest" href="manifest.json">
  <link rel="icon" href="${iconUrl}">
  <title>Notch Candle Shape</title>
</head>
<img src="${iconUrl}"><br>
<pre>
Notch Candle Shape

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

    case '/app/manifest.json':
      response.writeHead(200, { 'Content-Type': 'application/json' });
      response.write(JSON.stringify({
        name: 'Notch Candle Shape',
        start_url: '/app/',
        scope: '/app/',
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

    case '/app/sw.js':
      response.writeHead(200, { 'Content-Type': 'text/javascript' });
      response.write(`
self.addEventListener('fetch', event => {
  event.respondWith(fetch(event.request).catch(_ => {
    return new Response('Offline candle.');
  }));
});
      `);
      response.end();
      break;

    case '/app/301_redirect':
      response.writeHead(301, { 'Location': '/app/a' });
      response.end();
      break;

    case '/app/302_redirect':
      response.writeHead(302, { 'Location': '/app/b' });
      response.end();
      break;

    case '/app/307_redirect':
      response.writeHead(307, { 'Location': '/app/a' });
      response.end();
      break;

    case '/app/meta_redirect':
      response.writeHead(200, { 'Content-Type': 'text/html' });
      response.write('<meta http-equiv="refresh" content="0;url=https://notch-candle-shape.glitch.me/app/b">');
      response.end();
      break;

}
}).listen(process.env.PORT);
