'use strict';

(() => {

function escapeQuotes(text) {
  return text.replace(/&/g, '&amp;').replace(/"/g, '&quot;');
}

// Promise-based version of FileReader.readAsText.
function readAsFilePromise(fileReader, field, blob, encoding) {
  return new Promise(resolve => {
    fileReader.onload = e => resolve(e.target.result);
    fileReader.readAsBinaryString(blob);
  });
}

function respondToShare(event) {
  event.respondWith((async () => {
    const response = await fetch('share-target-destination.template.html');
    const page = await response.text();
    let formData;
    try {
      formData = await event.request.formData();
    } catch (error) {
      formData = new FormData();
    }
    const receivedText = formData.get('received_text') || '';

    const init = {
      status: 200,
      statusText: 'OK',
      headers: {'Content-Type': 'text/html'}
    };

    let body = page.replace('{{received_text}}', escapeQuotes(receivedText));

    const file_fields = ['attached_text', 'attached_image'];

    let field_index = 0;

    let files = undefined;
    let file_contents = '';
    let index = 0;

    function prepareField() {
      files = formData.getAll(
          file_fields[field_index]);  // sequence of File objects
      file_contents = '';
      index = 0;
    }

    prepareField();

    async function progress() {
      while (index === files.length) {
        body = body.replace(
            '{{' + file_fields[field_index] + '}}', file_contents);

        ++field_index;
        if (field_index === file_fields.length) {
          return new Response(body, init);
        }
        prepareField();
      }

      const fileReader = new FileReader();
      const dataFromFileLoaded =
          await readAsFilePromise(fileReader, file_fields[field_index], files[index], 'UTF-8');
      if (index > 0) {
        file_contents += ', ';
      }
      if (file_fields[field_index] === 'attached_image') {
        file_contents += '<img src="data:' + files[index].type + ';base64,' + btoa(dataFromFileLoaded) + '">';
      } else {
        file_contents += escapeQuotes(dataFromFileLoaded);
      }
      index += 1;
      return await progress();
    }

    return await progress();
  })());
}

self.addEventListener('activate', event => {
  event.waitUntil(clients.claim());
});

self.addEventListener('fetch', event => {
  const pathname = (new URL(event.request.url)).pathname;
  if (event.request.method === 'POST' &&
      pathname.endsWith('/share-target-destination.html')) {
    respondToShare(event);
    return;
  }

  event.respondWith((async () => {
    try {
      return await fetch(event.request);
    } catch (error) {
      return new Response('Offline');
    }
  })());
});

})();

