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

/**
 * A modified version from https://github.com/jakearchibald/trained-to-thrill/blob/master/src/js/page/flickr.js
 */
var utils = {

  convertToLicenseString: function (license) {

    switch (license) {
      case "4": return "Attribution License";
      case "5": return "Attribution-ShareAlike License";
      case "6": return "Attribution-NoDerivs License";
      case "7": return "No known copyright restrictions";
      default: return "Unknown copyright information";
    }
  },

  defaults: function(opts, defaultOpts) {
    var r = Object.create(defaultOpts);

    if (!opts) { return r; }

    for (var key in opts) if (opts.hasOwnProperty(key)) {
      r[key] = opts[key];
    }

    return r;
  },

  toQuerystring: function(obj) {
    var str = [];
    for (var p in obj) {
      if (obj.hasOwnProperty(p)) {
        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
      }
    }
    return str.join("&");
  },

  strToEls: (function () {
    var tmpEl = document.createElement('div');
    return function (str) {
      var r = document.createDocumentFragment();
      tmpEl.innerHTML = str;
      while (tmpEl.childNodes[0]) {
        r.appendChild(tmpEl.childNodes[0]);
      }
      return r;
    };
  }())
};

var apiKey = '43c7e70eefe9a61720eab88e7979995a';
var apiUrl = 'https://api.flickr.com/services/rest/';

var flickr = {
  search: function (text, count, opts) {

    count = count || 10;

    var params = {
      method: 'flickr.photos.search',
      extras: 'description,license,owner_name,last_update',
      format: 'json',
      api_key: apiKey,
      text: text,
      license: '4,5,6,7',
      content_type: 1,
      nojsoncallback: 1,
      per_page: count
    };

    return fetch(apiUrl + '?' + utils.toQuerystring(params), opts).then(function(response) {
      return response.json();
    }).then(function(response) {
      if (response.stat == 'fail') {
        throw Error(response.err.msg);
      }

      return response.photos.photo.sort(function(a, b) {
        return b.id - a.id;
      }).map(function(photo) {
        return {
          id: photo.id,
          title: photo.title,
          lastUpdate: parseInt(photo.lastupdate),
          ownerName: photo.ownername,
          license: utils.convertToLicenseString(photo.license),
          flickrUrl: 'flickr.com/photos/' + photo.owner + '/' + photo.id + '/',
          imgUrl: 'https://farm' + photo.farm + '.staticflickr.com/' + photo.server + '/' + photo.id + '_' + photo.secret + '_c.jpg',
          description: photo.description._content.trim()
        };
      });
    });
  }
}
