# `dependency-tree-esm`

Returns an unordered array of local paths to dependencies of a Node ES module JavaScript file.

* See also: [`dependency-tree`](https://github.com/11ty/eleventy-dependency-tree) for the CommonJS version.

This is used by Eleventy to find dependencies of a JavaScript file to watch for changes to re-run Eleventy’s build.

## Installation

```
npm install --save-dev @11ty/dependency-tree-esm
```

## Features

* Ignores bare specifiers (e.g. `import "my-package"`)
* Ignores Node’s built-ins (e.g. `import "path"`)
* Handles circular dependencies
* Returns an empty set if the file does not exist.

## Usage

```js
// my-file.js

// if my-local-dependency.js has dependencies, it will include those too
import "./my-local-dependency.js";


// ignored, is a built-in
import path from "path";
```

```js
import { find } from "@11ty/dependency-tree-esm";
// CommonJS is fine too
// const { find } = require("@11ty/dependency-tree-esm");

await find("./my-file.js");
// returns ["./my-local-dependency.js"]
```

Return a [dependency-graph](https://github.com/jriecken/dependency-graph) instance:

```js
import { findGraph } from "@11ty/dependency-tree-esm";
// CommonJS is fine too
// const { find } = require("@11ty/dependency-tree-esm");

(await findGraph("./my-file.js")).overallOrder();
// returns ["./my-local-dependency.js", "./my-file.js"]
```