var baseUrl = 'users.json';
var policies = ['no-referrer', 'no-referrer-when-downgrade', 'origin',
  'origin-when-cross-origin', 'unsafe-url'];

policies.forEach(policy => {
  var url = `${baseUrl}?policy=${policy}`;
  ChromeSamples.log(`Fetching ${url}...`);
  fetch(url, {referrerPolicy: policy});
});
