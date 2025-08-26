self.skipWaiting();

addEventListener('install', evt => {
  console.log('==> install event');
});

addEventListener('activate', evt => {
  console.log('==> activate event');
  evt.waitUntil(self.clients.claim());
});

const eventAttrs = [
  'clientId',
  'resultingClientId',
]

const requestAttrs = [
  'method',
  'url',
  'destination',
  'referrer',
  'referrerPolicy',
  'mode',
  'credentials',
  'cache',
  'redirect',
  'integrity',
  'keepalive',
  'signal',
];

addEventListener('fetch', evt => {
  console.log('==> FetchEvent');
  for (let i = 0; i < eventAttrs.length; ++i) {
    console.log('==>   ' + eventAttrs[i] + ': ' + JSON.stringify(evt[eventAttrs[i]]));;
  }
  console.log('==>   request:');
  for (let i = 0; i < requestAttrs.length; ++i) {
    console.log('==>     ' + requestAttrs[i] + ': ' + JSON.stringify(evt.request[requestAttrs[i]]));;
  }
  console.log('==>   headers:');
  for (let h of evt.request.headers) {
    console.log('==>       ' + h);
    
  }
  evt.waitUntil(async function() {
    let r = await evt.preloadResponse;
    console.log('==>   preloadResponse: ' + r)
  }());
});