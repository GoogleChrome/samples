# `@11ty/posthtml-urls`

PostHTML plugin for transforming URLs. This is a fork of [`posthtml/posthtml-urls`](https://github.com/posthtml/posthtml-urls).


## Installation

[Node.js](http://nodejs.org) `>= 6` is required. To install, type this at the command line:

```shell
npm install @11ty/posthtml-urls
```


## Usage

```js
const posthtml = require('posthtml');
const urls = require('@11ty/posthtml-urls');

const options = {
  eachURL: (url, attr, tagName, rawNode) => `http://domain.com/${url}`
};

posthtml()
  .use( urls(options) )
  .process('<a href="link.html">link</a>')
  .then(result => console.log(result.html));
//-> <a href="http://domain.com/link.html">link</a>
```


## Options

### `eachURL`
Type: `Function`
Default value: `undefined`
A callback function ran for each URL value found. You can return either a synchronous value or a `Promise`. The `rawNode` argument was added in `v1.0.3`.

### `filter`
Type: `Object`
Default value: [`{…}`](https://github.com/posthtml/posthtml-urls/blob/master/lib/defaultOptions.js)
The elements and attributes for which to search. An attribute value can optionally be a function, for deeper filtering.


## FAQ
1. **How can I filter `<style>` elements and `style` attributes?**
Use [posthtml-postcss](https://npmjs.com/posthtml-postcss) and [postcss-url](https://npmjs.com/postcss-url).
