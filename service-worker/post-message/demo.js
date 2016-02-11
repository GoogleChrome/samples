function showCommands() {
  document.querySelector('#add').addEventListener('click', function() {
    sendMessage({
      command: 'add',
      url: document.querySelector('#url').value
    }).then(function() {
      // If the promise resolves, just display a success message.
      ChromeSamples.setStatus('Added to cache.');
    }).catch(ChromeSamples.setStatus); // If the promise rejects, show the error.
  });

  document.querySelector('#delete').addEventListener('click', function() {
    sendMessage({
      command: 'delete',
      url: document.querySelector('#url').value
    }).then(function() {
      // If the promise resolves, just display a success message.
      ChromeSamples.setStatus('Deleted from cache.');
    }).catch(ChromeSamples.setStatus); // If the promise rejects, show the error.
  });

  document.querySelector('#listcontents').addEventListener('click', function() {
    sendMessage({command: 'keys'})
      .then(function(data) {
        var contentsElement = document.querySelector('#contents');
        // Clear out the existing items from the list.
        while (contentsElement.firstChild) {
          contentsElement.removeChild(contentsElement.firstChild);
        }

        // Add each cached URL to the list, one by one.
        data.urls.forEach(function(url) {
          var liElement = document.createElement('li');
          liElement.textContent = url;
          contentsElement.appendChild(liElement);
        });
      }).catch(ChromeSamples.setStatus); // If the promise rejects, show the error.
  });

  document.querySelector('#commands').style.display = 'block';
}

function sendMessage(message) {
  // This wraps the message posting/response in a promise, which will resolve if the response doesn't
  // contain an error, and reject with the error if it does. If you'd prefer, it's possible to call
  // controller.postMessage() and set up the onmessage handler independently of a promise, but this is
  // a convenient wrapper.
  return new Promise(function(resolve, reject) {
    var messageChannel = new MessageChannel();
    messageChannel.port1.onmessage = function(event) {
      if (event.data.error) {
        reject(event.data.error);
      } else {
        resolve(event.data);
      }
    };

    // This sends the message data as well as transferring messageChannel.port2 to the service worker.
    // The service worker can then use the transferred port to reply via postMessage(), which
    // will in turn trigger the onmessage handler on messageChannel.port1.
    // See https://html.spec.whatwg.org/multipage/workers.html#dom-worker-postmessage
    navigator.serviceWorker.controller.postMessage(message,
      [messageChannel.port2]);
  });
}

if ('serviceWorker' in navigator) {
  // Set up a listener for messages posted from the service worker.
  // The service worker is set to post a message to all its clients once it's run its activation
  // handler and taken control of the page, so you should see this message event fire once.
  // You can force it to fire again by visiting this page in an Incognito window.
  navigator.serviceWorker.addEventListener('message', function(event) {
    ChromeSamples.setStatus(event.data);
  });

  navigator.serviceWorker.register('service-worker.js')
    // Wait until the service worker is active.
    .then(function() {
      return navigator.serviceWorker.ready;
    })
    // ...and then show the interface for the commands once it's ready.
    .then(showCommands)
    .catch(function(error) {
      // Something went wrong during registration. The service-worker.js file
      // might be unavailable or contain a syntax error.
      ChromeSamples.setStatus(error);
    });
} else {
  ChromeSamples.setStatus('This browser does not support service workers.');
}
