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
var main = document.querySelector('main');
var images = [];
var results = [];
var lastStartDrawTime = 0;
var lastJSStartExecutionTime = 0;

/**
 * The React component for each individual image.
 * It can't have `shouldComponentUpdate` set to false because on each
 * update to the dataset we want to update the "Last updated" string
 * to get set.
 */
var FlickrImage = React.createClass({
  render: function() {

    // Figure out how long ago this photo was taken.
    var fromNow = moment.unix(this.props.image.lastUpdate).fromNow();

    // Render away!
    /* jshint ignore:start */
    return (
      <div className="flickr-image">
        <h1>{this.props.image.title}</h1>
        <div className="flickr-image-container">
          <img src={this.props.image.imgUrl} />
        </div>
        <h2>{this.props.image.ownerName} - {this.props.image.license}</h2>
        <h3>Last updated: {fromNow}</h3>
        <a href={this.props.image.flickrUrl}>{this.props.image.flickrUrl}</a>
      </div>
    );
    /* jshint ignore:end */
  }
});

/**
 * The React class for the image list. Loads images from Flickr using its API
 * and then updates its internal state. It the state update that should get
 * measured, since this is going to trigger the vDOM diffing and actual DOM
 * updating.
 */
var FlickrImages = React.createClass({

  loadImagesFromFlickr: function () {
    var refreshButton = React.findDOMNode(this).querySelector('.refresh');
    refreshButton.disabled = true;

    var onFlickr = function (results) {

      // Update the internal state data, but don't set it yet.
      var newData = this.state.data.concat(results);

      // Take a timestamp.
      startDrawTime = window.performance.now();
      jSStartExecutionTime = window.performance.now();

      // Put down a marker for the console, just because it helps with
      // the manual testing.
      console.time("React Execution");

      // Go!
      this.setState({
        data: newData
      });

      console.timeEnd("React Execution");

      // Figure out how much time was spent in JavaScript, then set a rAF to
      // roughly track when the next frame arrived, i.e. DOM updates have all
      // completed.
      var jsExecutionTime = window.performance.now() - jSStartExecutionTime;
      var onNextFrameDone = function () {
        window.results.push({
          size: this.state.data.length,
          jsTime: jsExecutionTime,
          totalTime: window.performance.now() - startDrawTime
        });

        refreshButton.disabled = false;
      };

      requestAnimationFrame(onNextFrameDone.bind(this));
    };

    // Search for 100 images and move to the next search term.
    flickr.search(searchTerms[searchIndex], 100)
        .then(onFlickr.bind(this));

    searchIndex++;
    searchIndex %= searchTerms.length;
  },

  getInitialState: function () {
    return {data: []};
  },

  componentDidMount: function () {

    // Get the refresh and download buttons directly, and add on some callbacks.
    var refreshButton = React.findDOMNode(this).querySelector('.refresh');
    var downloadButton = React.findDOMNode(this).querySelector('.download');

    // Grab some more images.
    refreshButton.addEventListener('click',
        this.loadImagesFromFlickr.bind(this));

    // Make a zip for the results.
    downloadButton.addEventListener('click', function () {

      var zip = new JSZip();

      resultsStr = window.results.reduce(function(previous, value, index) {
        return previous +
            value.size + ',' + value.jsTime + ',' + value.totalTime + '\n';
      }, 'Size,JavaScript Time,Total Time\n');

      zip.file('results-react.csv', resultsStr);

      var blob = zip.generate({type:'blob'});
      saveAs(blob, 'results-react.zip');

    });
  },

  /**
   * Render the `<FlickrImage>`s based on the current data set.
   */
  render: function () {
    /* jshint ignore:start */
    return (
      <div className="flickr-image-list">
        <button className="refresh">Add images</button>
        <button className="download">Download results</button>
      {
        this.state.data.map(function(image, index) {
          return <FlickrImage key={index} image={image} />;
        })
      }
      </div>
    );
    /* jshint ignore:end */
  }
});

// Fire up React.
/* jshint ignore:start */
React.render(
  <FlickrImages />, main
);
/* jshint ignore:end */
