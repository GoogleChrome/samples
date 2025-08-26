'use strict';

(() => {

function escapeQuotes(text) {
  return text.replace(/&/g, '&amp;').replace(/"/g, '&quot;');
}

let handleClientSide = true;

// Promise-based version of FileReader.readAsText.
function readAsFilePromise(fileReader, field, blob, encoding) {
  return new Promise(resolve => {
    fileReader.onload = e => resolve(e.target.result);
    if (field === 'received_image_files') {
      fileReader.readAsBinaryString(blob);
    } else {
      fileReader.readAsText(blob, encoding);
    }
  });
}

self.addEventListener('activate', event => {
  event.waitUntil(clients.claim());
});


  
self.addEventListener('fetch', event => {
  // Ideally, share-target-destination.template.html would be cached in advance.
  function respondToShare(event) {
    event.respondWith((async () => {
      const response = await fetch('share-target-destination.template.html');
      const page = await response.text();
      const formData = (event.request.method === 'POST') ? await event.request.formData() : (new URL(event.request.url)).searchParams;
      const title = formData.get('received_title') || '(no title)';
      const text = formData.get('received_text') || '(no text)';
      const url = formData.get('received_url') || '(no url)';

      const init = {
        status: 200,
        statusText: 'OK',
        headers: {'Content-Type': 'text/html'}
      };

      let body = page.replace('{{generation_location}}', 'client-side')
                     .replace('{{received_title}}', escapeQuotes(title))
                     .replace('{{received_text}}', escapeQuotes(text))
                     .replace('{{received_url}}', escapeQuotes(url));

      if (event.request.method !== 'POST') {
        return new Response(body, init);
      }

      const file_fields = ['received_html_files', 'received_css_files', 'received_image_files'];

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
        if (file_fields[field_index] === 'received_image_files') {
          // WAS  image/jpeg 
          file_contents += '<img src="data:image/svg+xml;base64,' + btoa(dataFromFileLoaded) + '">'
        } else {
          file_contents += dataFromFileLoaded;
        }
        index += 1;
        return await progress();
      }

      return await progress();
    })());
  }

  console.log('Received fetch event: ' + event.request.method + ' ' + event.request.url);

  const pathname = (new URL(event.request.url)).pathname;
  if (event.request.method === 'POST') {
    if (pathname === '/client') {
      handleClientSide = true;
      event.respondWith(
        fetch('share-target-destination.template.html'));
      return;
    } else if (pathname === '/server') {
      handleClientSide = false;
      event.respondWith(
        fetch('share-target-destination.template.html'));
      return;
    }
  }
  if (handleClientSide && pathname.endsWith('/share.html')) {
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

