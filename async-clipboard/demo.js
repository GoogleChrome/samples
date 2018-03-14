/** Write contents of the textarea to the clipboard when clicking "Copy" */
document.querySelector('#copy').addEventListener('click', () => {
  navigator.clipboard.writeText(document.querySelector('#out').value)
    .then(() => {
      ChromeSamples.log('Text copied.');
    })
    .catch(() => {
      ChromeSamples.log('Failed to copy text.');
    });
});

/** Read from clipboard when clicking the Paste button */
document.querySelector('#paste').addEventListener('click', () => {
  navigator.clipboard.readText()
    .then(text => {
      document.querySelector('#out').value = text;
      ChromeSamples.log('Text pasted.');
    })
    .catch(() => {
      ChromeSamples.log('Failed to read from clipboard.');
    });
});

/** Watch for pastes */
document.addEventListener('paste', e => {
  e.preventDefault();
  navigator.clipboard.getText().then(text => {
    ChromeSamples.log('Updated clipboard contents: ' + text);
  });
});

/** Set up buttons to request permissions and display status: */
document.querySelectorAll('[data-permission]').forEach(btn => {
  const permission = btn.getAttribute('data-permission');
  navigator.permissions.query({name: permission})
    .then(status => {
      status.onchange = () => {
        btn.setAttribute('data-state', status.state);
      };
      status.onchange();
    })
    .catch(() => {
      btn.setAttribute('data-state', 'unavailable');
      btn.title = 'Permissions API unavailable.';
    });
  btn.addEventListener('click', () => {
    Promise.resolve().then(() => {
      return navigator.permissions.request({name: permission});
    })
      .then(status => {
        ChromeSamples.log('Permission: ' + status.state);
      })
      .catch(err => {
        ChromeSamples.log('Permission request failed: ' + err);
      });
  });
});
