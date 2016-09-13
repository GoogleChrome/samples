// This is the web server implementation for the "random number API".
// It is currently deployed to https://foreign-fetch-demo.appspot.com

const express = require('express');
const app = express();

const SW_JS_FILE = 'foreign-fetch-sw.js';
const MAX_RANDOM_NUMBER = 100;

app.use((req, res, next) => {
  res.setHeader('Link', `</${SW_JS_FILE}>; rel="serviceworker"`);
  res.setHeader('Access-Control-Allow-Origin', '*');
  // To test locally against a service without an Origin Trial token, enable
  // chrome://flags/#enable-experimental-web-platform-features
  // on all of the Chrome clients used for testing.
  // The deployment at https://foreign-fetch-demo.appspot.com has a
  // token, so its foreign fetch service worker does not require the flag.
  // res.setHeader('Origin-Trial', 'your-token-here');
  return next();
});

app.get('/random', (req, res) => {
  var randomNumber = Math.round(Math.random() * MAX_RANDOM_NUMBER);
  res.send(String(randomNumber));
});

app.get(`/${SW_JS_FILE}`, (req, res) => {
  res.sendFile(SW_JS_FILE, {root: '.'});
});

if (module === require.main) {
  const server = app.listen(process.env.PORT || 8080, () => {
    const port = server.address().port;
    console.log(`Server listening on port ${port}`);
  });
}

module.exports = app;
