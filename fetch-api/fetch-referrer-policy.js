var policies = [
  // Referer will never be set.
  'no-referrer',

  // Referer will not be set when navigating from HTTPS to HTTP.
  'no-referrer-when-downgrade',

  // Referer will be set to just the origin, omitting the URL's path and search.
  'origin',

  // Full Referer for same-origin requests, and bare origin for cross-origin requests.
  'origin-when-cross-origin',

  // Full Referer for all requests, whether same- or cross-origin.
  'unsafe-url'
];
var url = 'users.json';

policies.forEach(policy => {
  ChromeSamples.log(`Fetching ${url}...`);
  fetch(url, {referrerPolicy: policy});
});
