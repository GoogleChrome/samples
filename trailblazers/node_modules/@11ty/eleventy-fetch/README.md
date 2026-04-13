<p align="center"><img src="https://www.11ty.dev/img/logo-github.svg" width="200" height="200" alt="eleventy Logo"></p>

# eleventy-fetch

_Requires Node 18+_

Formerly known as [`@11ty/eleventy-cache-assets`](https://www.npmjs.com/package/@11ty/eleventy-cache-assets).

Fetch network resources and cache them so you don’t bombard your API (or other resources). Do this at configurable intervals—not with every build! Once per minute, or once per hour, once per day, or however often you like!

With the added benefit that if one successful request completes, you can now work offline!

This plugin can save any kind of asset—JSON, HTML, images, videos, etc.

## [The full `eleventy-fetch` documentation is on 11ty.dev](https://www.11ty.dev/docs/plugins/cache/).

- _This is a plugin for the [Eleventy static site generator](https://www.11ty.dev/)._
- Find more [Eleventy plugins](https://www.11ty.dev/docs/plugins/).
- Please star [Eleventy on GitHub](https://github.com/11ty/eleventy/), follow [@eleven_ty](https://twitter.com/eleven_ty) on Twitter, and support [11ty on Open Collective](https://opencollective.com/11ty)

[![npm Version](https://img.shields.io/npm/v/@11ty/eleventy-fetch.svg?style=for-the-badge)](https://www.npmjs.com/package/@11ty/eleventy-fetch) [![GitHub issues](https://img.shields.io/github/issues/11ty/eleventy-fetch.svg?style=for-the-badge)](https://github.com/11ty/eleventy/issues)

## Installation

```
npm install @11ty/eleventy-fetch
```

_[The full `eleventy-fetch` documentation is on 11ty.dev](https://www.11ty.dev/docs/plugins/cache/)._

## Tests

```
npm run test
```

- We use the [ava JavaScript test runner](https://github.com/avajs/ava) ([Assertions documentation](https://github.com/avajs/ava/blob/master/docs/03-assertions.md))
- ℹ️ To keep tests fast, thou shalt try to avoid writing files in tests.

<!--
## Roadmap

* Add support for tiered asset requests, e.g. CSS requests background-images and web fonts, for example.

## Open Questions

* `flat-cache` save method seems to be synchronous, is there a better async one?
* Our cache stores raw buffers internally, which are pretty bloated compared to the original. Surely there is a more efficient way to do this. Maybe store the files in their original format.
-->

## Community Roadmap

- [Top Feature Requests](https://github.com/11ty/eleventy-fetch/issues?q=label%3Aneeds-votes+sort%3Areactions-%2B1-desc+label%3Aenhancement) (Add your own votes using the 👍 reaction)
- [Top Bugs 😱](https://github.com/11ty/eleventy-fetch/issues?q=is%3Aissue+is%3Aopen+label%3Abug+sort%3Areactions-%2B1-desc) (Add your own votes using the 👍 reaction)
- [Newest Bugs 🙀](https://github.com/11ty/eleventy-fetch/issues?q=is%3Aopen+is%3Aissue+label%3Abug)
