const copy = document.querySelector('#copy');
const paste = document.querySelector('#paste');
const out = document.querySelector('#out');

/** Write contents of the textarea to the clipboard when clicking "Copy" */
copy.onclick = () => {
  navigator.clipboard.writeText(out.value)
    .then(result => {
      ChromeSamples.log('Text copied.' + result);
    })
    .catch(err => {
      ChromeSamples.log('Failed to copy text: ' + err);
    });
};

/** Read from clipboard when clicking the Paste button */
paste.onclick = () => {
  navigator.clipboard.readText()
    .then(text => {
      out.value = text;
      ChromeSamples.log('Text pasted.');
    })
    .catch(err => {
      ChromeSamples.log('Failed to read from clipboard: ' + err);
    });
};

/** Watch for pastes */
document.addEventListener('paste', e => {
  e.preventDefault();
  navigator.clipboard.getText().then(text => {
    ChromeSamples.log('Updated clipboard contents: ' + text);
  });
});

/** Set up buttons to request permissions and display status: */
document.querySelectorAll('data-permission').forEach(btn => {
  let permission = btn.getAttribute('data-permission');
  navigator.permissions.query({name: permission})
    .then(status => {
      status.onchange = () => {
        btn.setAttribute('data-state', status.state);
      };
      status.onchange();
    });
  btn.onclick = () => {
    navigator.permissions.request({name: permission})
      .then(status => {
        ChromeSamples.log('Permission: ' + status.state);
      })
      .catch(err => {
        ChromeSamples.log('Permission request failed: ' + err);
      });
  };
});
