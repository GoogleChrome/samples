# http-equiv-refresh [![NPM Version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Coverage Status][coveralls-image]][coveralls-url]

> Parse an HTML [meta refresh value](https://mdn.io/HTML/Element/meta#attr-http-equiv).


## Installation

[Node.js](http://nodejs.org) `>= 6` is required. To install, type this at the command line:
```shell
npm install http-equiv-refresh
```


## Usage
```js
const parseMetaRefresh = require('http-equiv-refresh');

parseMetaRefresh('5; url=http://domain.com/');
//-> { timeout:5, url:'http://domain.com/' }

parseMetaRefresh('5');
//-> { timeout:5, url:null }
```


[npm-image]: https://img.shields.io/npm/v/http-equiv-refresh.svg
[npm-url]: https://npmjs.com/package/http-equiv-refresh
[travis-image]: https://img.shields.io/travis/stevenvachon/http-equiv-refresh.svg
[travis-url]: https://travis-ci.org/stevenvachon/http-equiv-refresh
[coveralls-image]: https://img.shields.io/coveralls/stevenvachon/http-equiv-refresh.svg
[coveralls-url]: https://coveralls.io/github/stevenvachon/http-equiv-refresh
