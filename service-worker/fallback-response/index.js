function enableRequestButtons() {
  var validButton = document.querySelector('#valid-api-call');
  validButton.addEventListener('click', function() {
    // This is a valid YouTube API key, and should result in a valid API request.
    makeApiRequest('AIzaSyCr0XVB-Hz1ohPpjvLatdj4qZ5zcSohHsU');
  });
  validButton.disabled = false;

  var invalidButton = document.querySelector('#invalid-api-call');
  invalidButton.addEventListener('click', function() {
    // This is an (obviously) invalid YouTube API key, and should result in an invalid API request.
    makeApiRequest('INVALID_API_KEY');
  });
  invalidButton.disabled = false;
}

function makeApiRequest(apiKey) {
  var url = 'https://www.googleapis.com/youtube/v3/playlistItems?part=snippet' +
    '&maxResults=3&playlistId=UU_x5XG1OV2P6uZZ5FSM9Ttw&key=' + apiKey;

  fetch(url).then(function(response) {
    return response.json();
  }).then(function(json) {
    var titles = json.items.map(function(item) {
      return '"' + item.snippet.title + '"';
    }).join(', ');

    ChromeSamples.setStatus('The three most recent videos are: ' + titles);
  });
}

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('service-worker.js');

  // Enable the buttons once the service worker has taken control of the page.
  navigator.serviceWorker.ready.then(enableRequestButtons);
} else {
  ChromeSamples.setStatus('This browser does not support service workers.');
}
