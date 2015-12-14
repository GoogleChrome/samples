var menuEl = document.querySelector('#menu');
var entriesEl = document.querySelector('#entries');

function fetchSubreddit(url) {
  if (url) {
    fetch('https://www.reddit.com/r/' + url + '.json').then(function(response) {
      return response.json();
    }).then(function(json) {
      var links = '';
      for (var i = 0; i < json.data.children.length; i++) {
        links += '<li><a href="' + json.data.children[i].data.url + '">' +
          json.data.children[i].data.url + '</a></li>';
      }
      entriesEl.innerHTML = '<ul>' + links + '</ul>';
    });
  }
}

var subredditsByTopicUrl = 'https://www.reddit.com/api/subreddits_by_topic.json?query=javascript';
fetch(subredditsByTopicUrl).then(function(response) {
  return response.json();
}).then(function(json) {
  var select = document.createElement('select');
  var links = '';
  for (var k = 0; k < json.length; k++) {
    links += '<option value="' + json[k].name + '">' + json[k].name +
      '</option>';
  }
  select.innerHTML = links;
  select.addEventListener('change', function(e) {
    fetchSubreddit(e.target.value);
  });
  menuEl.appendChild(select);
}).catch(function(ex) {
  ChromeSamples.log('Parsing failed:', ex);
});
