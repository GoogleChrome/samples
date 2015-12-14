function createGist(opts) {
  ChromeSamples.log('Posting request to GitHub API...');
  fetch('https://api.github.com/gists', {
    method: 'post',
    body: JSON.stringify(opts)
  }).then(function(response) {
    return response.json();
  }).then(function(data) {
    ChromeSamples.log('Created Gist:', data.html_url);
  });
}

function submitGist() {
  var content = document.querySelector('textarea').value;
  if (content) {
    createGist({
      description: 'Fetch API Post example',
      public: true,
      files: {
        'test.js': {
          content: content
        }
      }
    });
  } else {
    ChromeSamples.log('Please enter in content to POST to a new Gist.');
  }
}

var submitBtn = document.querySelector('button');
submitBtn.addEventListener('click', submitGist);
