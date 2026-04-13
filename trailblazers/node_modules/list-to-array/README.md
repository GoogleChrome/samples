# list-to-array

Simple javascript lib for converting a [comma || space] delimited string to an array.

Trims values so you can use human-friendly lists like `'one, two, three' => ['one','two','three']`

If in array is provided, it is simply returned. If a falsy or non-string value is provided, an empty array is returned.

Won't work with values that contain spaces.

## Installation

```
npm install list-to-array
```

Works in node.js, iojs or bundle for the browser with browserify or webpack.

## Usage

```
var listToArray = require('list-to-array');

console.log(listToArray('one, two, three'));

// logs ['one','two','three']
```

## License

(The MIT License)

Copyright (c) 2015 Jed Watson

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
