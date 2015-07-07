/**
 * Copyright 2015 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

var searchIndex = 0;
var searchTerms = ['tree', 'water', 'fire', 'earth', 'metal', 'wood',
    'blue', 'red', 'yellow', 'mountain', 'tunnel', 'train', 'brick',
    'architecture'];
var refreshButton = document.querySelector('.refresh');
var downloadButton = document.querySelector('.download');
var main = document.querySelector('main');
var images = [];
var results = [];
var lastStartDrawTime = 0;
var lastJSStartExecutionTime = 0;
var flickrList = document.querySelector('.flickr-image-list');

if (!flickrList) {
  console.time("Making container");
  flickrList = document.createElement('div');
  flickrList.classList.add('flickr-image-list');
  main.appendChild(flickrList);
  console.timeEnd("Making container");
}

downloadButton.disabled = true;

function updateDOM() {

  var docFragment = document.createDocumentFragment();
  images.forEach(function(image, index) {

    var timeLastUpdated = moment(image.lastUpdate * 1000).fromNow();
    var imageInDOM = document.getElementById('image-' + index);

    if (imageInDOM) {
      imageInDOM.querySelector('h3').textContent = timeLastUpdated;
    } else {

      var flickr = document.createElement('div');
      var flickrH1 = document.createElement('h1');
      var flickrH2 = document.createElement('h2');
      var flickrH3 = document.createElement('h3');
      var flickrA = document.createElement('a');
      var flickrImageContainer = document.createElement('div');
      var flickrImage = new Image();

      flickr.setAttribute('id', 'image-' + index);
      flickr.classList.add('flickr-image');
      flickrImageContainer.classList.add('flickr-image-container');

      flickrH1.textContent = image.title;
      flickrImage.src = image.imgUrl;
      flickrH2.textContent = image.ownerName + ' - ' + image.license;
      flickrH3.textContent = timeLastUpdated;
      flickrA.href = image.flickrUrl;
      flickrA.textContent = image.flickrUrl;

      flickr.appendChild(flickrH1);
      flickr.appendChild(flickrImageContainer);
      flickrImageContainer.appendChild(flickrImage);
      flickr.appendChild(flickrH2);
      flickr.appendChild(flickrH3);
      flickr.appendChild(flickrA);

      docFragment.appendChild(flickr);

    }
  });

  flickrList.appendChild(docFragment);
}

function updateMain () {

  startDrawTime = window.performance.now();
  jSStartExecutionTime = window.performance.now();

  console.time("Vanilla Execution");
  updateDOM();
  console.timeEnd("Vanilla Execution");

  var jsExecutionTime = window.performance.now() - jSStartExecutionTime;

  requestAnimationFrame(function() {
    results.push({
      size: images.length,
      jsTime: jsExecutionTime,
      totalTime: window.performance.now() - startDrawTime
    });
    refreshButton.disabled = false;
    downloadButton.disabled = false;
  });
}

refreshButton.addEventListener ('click', function() {

  refreshButton.disabled = true;

  flickr.search(searchTerms[searchIndex], 100).then(function(results) {
    images = images.concat(results);
    updateMain();
  });

  searchIndex++;
  searchIndex %= searchTerms.length;
});

downloadButton.addEventListener ('click', function() {
  var zip = new JSZip();

  resultsStr = results.reduce(function(previous, value, index) {
    return previous +
        value.size + ',' + value.jsTime + ',' + value.totalTime + '\n';
  }, 'Size,JavaScript Time,Total Time\n');

  zip.file('results-vanilla.csv', resultsStr);

  var blob = zip.generate({type:'blob'});
  saveAs(blob, 'results-vanilla.zip');
})
