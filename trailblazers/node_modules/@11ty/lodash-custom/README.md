# @11ty/lodash-custom

Eleventy uses 3 small `lodash` functions:

* [`get`](https://lodash.com/docs/4#get)
* [`set`](https://lodash.com/docs/4#set)
* [`chunk`](https://lodash.com/docs/4#chunk)

## Why?

1. The top level `lodash` package includes all of `lodash` and is a hefty 5 MB.
1. Using the individual, modularized `lodash.get`, `lodash.set`, `lodash.chunk` packages are a much smaller 106 KB but do contain duplicated code. More problematically, these are not being maintained/updated with the newest versions of `lodash`.

This package creates one focused custom dependency using the tools that `lodash` provides to do custom builds ([`lodash-cli`](https://lodash.com/custom-builds)) for these three `lodash` functions with updated versions of `lodash`.