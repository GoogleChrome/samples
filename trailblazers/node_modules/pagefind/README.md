# Pagefind Static Search

Pagefind is a fully static search library that aims to perform well on large sites, while using as little of your users’ bandwidth as possible, and without hosting any infrastructure.

The full documentation on using Pagefind can be found at https://pagefind.app/.

This packages houses a wrapper for running the precompiled Pagefind binary, and also serves as a NodeJS indexing library that can be integrated into existing tools.

## Running Pagefind through NPX

This is the recommended way of running Pagefind on a static site.

```bash
npx pagefind --site "public"
```

For more details on using the Pagefind binary, see [Installing and running Pagefind](https://pagefind.app/docs/installation/#running-via-npx), and the rest of the Pagefind documentation.

## Using Pagefind as a Node library

This package also provides an interface to the Pagefind binary directly as a package you can import.

```js
import * as pagefind from "pagefind";

// Create a Pagefind search index to work with
const { index } = await pagefind.createIndex();

// Index all HTML files in a directory
await index.addDirectory({
    path: "public"
});

// Add extra content
await index.addCustomRecord({
    url: "/resume.pdf",
    content: "Aenean lacinia bibendum nulla sed consectetur",
    language: "en",
});

// Get the index files in-memory
const { files } = await index.getFiles();

// Or, write the index to disk
await index.writeFiles({
    outputPath: "public/pagefind"
});
```

For more details on using Pagefind as a library, see [Indexing content using the NodeJS API](https://pagefind.app/docs/node-api/).
