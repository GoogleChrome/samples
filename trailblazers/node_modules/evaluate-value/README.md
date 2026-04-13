# evaluate-value [![NPM Version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url]

> Return a value or an evaluated function (with arguments).


* When the first input argument is a function, it is executed with the remaining arguments, and the result is returned.
* When the first input argument is *not* a function, it is simply returned.


## Installation

[Node.js](http://nodejs.org/) `>= 8` is required. To install, type this at the command line:
```shell
npm install evaluate-value
```


## Usage

```js
const evaluateValue = require('evaluate-value');

evaluateValue(true);
//-> true

evaluateValue(() => true);
//-> true

evaluateValue(
  (arg1, arg2) => arg1 === arg2,
  true,
  false
);
//-> false
```


[npm-image]: https://img.shields.io/npm/v/evaluate-value.svg
[npm-url]: https://npmjs.com/package/evaluate-value
[travis-image]: https://img.shields.io/travis/stevenvachon/evaluate-value.svg
[travis-url]: https://travis-ci.org/stevenvachon/evaluate-value
