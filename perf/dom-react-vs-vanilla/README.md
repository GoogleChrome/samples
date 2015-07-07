# React perf test

This is a test to see how execution time changes as the number of DOM elements increases. It uses the Flickr API to populate an ever-growing list.

![The perf test](https://aerotwist.com/static/blog/react-plus-performance-equals-what/demo-site.jpg)

There are two versions of the test:

1. React-based
2. Vanilla / no-framework

## Build

In order to build the `app.js` file you will need the [JSX tool](https://facebook.github.io/react/docs/getting-started.html#offline-transform), which will convert the JSX to JavaScript.

From the root folder type `jsx --watch src/ build/` and then open either `index.html` or `vanilla.html`

Notes

* There is already [a React component for infinite lists](http://facebook.github.io/fixed-data-table/); this is a test of how performance scales as DOM size increases, not a test implementation of an infinite list.
* The test is designed to require updates across the entire tree by virtue of a "Last updated" label that shows how long ago the photo was taken.
* The browser you use will need `fetch()`; you will need to [polyfill it](https://github.com/github/fetch) for browsers that don't support `fetch()`.
