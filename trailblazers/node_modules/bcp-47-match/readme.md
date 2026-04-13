<!--lint disable no-html-->

# bcp-47-match

[![Build][build-badge]][build]
[![Coverage][coverage-badge]][coverage]
[![Downloads][downloads-badge]][downloads]
[![Size][size-badge]][size]

Match BCP 47 language tags with language ranges per RFC 4647.

## Contents

*   [What is this?](#what-is-this)
*   [When should I use this?](#when-should-i-use-this)
*   [Install](#install)
*   [Use](#use)
*   [API](#api)
    *   [`basicFilter(tags[, ranges='*'])`](#basicfiltertags-ranges)
    *   [`extendedFilter(tags[, ranges='*'])`](#extendedfiltertags-ranges)
    *   [`lookup(tags, ranges)`](#lookuptags-ranges)
*   [Types](#types)
*   [Compatibility](#compatibility)
*   [Security](#security)
*   [Related](#related)
*   [Contribute](#contribute)
*   [License](#license)

## What is this?

This package can match [BCP 47][spec] language tags with “language ranges” per
[RFC 4647][match].
This is done by the `:lang()` pseudo class in CSS, the `Accept-Language` HTTP
header, and a few other places.

## When should I use this?

You can use this package if you want to choose a certain document based on
language tags.

## Install

This package is [ESM only][esm].
In Node.js (version 14.14+, 16.0+), install with [npm][]:

```sh
npm install bcp-47-match
```

In Deno with [`esm.sh`][esmsh]:

```js
import * as bcp47Match from 'https://esm.sh/bcp-47-match@2'
```

In browsers with [`esm.sh`][esmsh]:

```html
<script type="module">
  import * as bcp47Match from 'https://esm.sh/bcp-47-match@2?bundle'
</script>
```

## Use

```js
import {basicFilter, extendedFilter, lookup} from 'bcp-47-match'

const tags = ['en-GB', 'de-CH', 'en', 'de']

console.log(basicFilter(tags, '*')) // => [ 'en-GB', 'de-CH', 'en', 'de' ]
console.log(basicFilter(tags, 'en')) // => [ 'en-GB', 'en' ]
console.log(basicFilter(tags, 'en-GB')) // => [ 'en-GB' ]
console.log(basicFilter(tags, ['en-GB', 'en'])) // => [ 'en-GB', 'en' ]
console.log(basicFilter(tags, 'jp')) // => []

console.log(extendedFilter(tags, '*')) // => [ 'en-GB', 'de-CH', 'en', 'de' ]
console.log(extendedFilter(tags, 'en')) // => [ 'en-GB', 'en' ]
console.log(extendedFilter(tags, 'en-GB')) // => [ 'en-GB' ]
console.log(extendedFilter(tags, '*-GB')) // => [ 'en-GB' ]
console.log(extendedFilter(tags, ['en-GB', 'en'])) // => [ 'en-GB', 'en' ]
console.log(extendedFilter(tags, 'jp')) // => []

console.log(lookup(tags, 'en')) // => 'en'
console.log(lookup(tags, 'en-GB')) // => 'en-GB'
console.log(lookup(tags, ['en-GB', 'en'])) // => 'en-GB'
console.log(lookup(tags, ['en', 'en-GB'])) // => 'en'
console.log(lookup(tags, 'jp')) // => undefined
```

## API

This package exports the identifier `basicFilter`, `extendedFilter`, and
`lookup`.
There is no default export.

### `basicFilter(tags[, ranges='*'])`

> 👉 **Note**: See
> [Basic Filtering spec](https://tools.ietf.org/html/rfc4647#section-3.3.1)

Match language tags to a list of simple ranges.
Searches for matches between the first range and all tags, and continues
with further ranges.
Returns a list of matching tags in the order they matched.

<details><summary>View matching table</summary>

| Basic Filter | `*` | `de` | `de-CH` | `de-DE` | `de-*-DE` | `*-CH` |
| - | - | - | - | - | - | - |
| `de` | ✔︎ | ✔︎ | | | | |
| `de-CH` | ✔︎ | ✔︎ | ✔︎ | | | |
| `de-CH-1996` | ✔︎ | ✔︎ | ✔︎ | | | |
| `de-DE` | ✔︎ | ✔︎ | | ✔︎ | | |
| `de-DE-1996` | ✔︎ | ✔︎ | | ✔︎ | | |
| `de-DE-x-goethe` | ✔︎ | ✔︎ | | ✔︎ | | |
| `de-Deva` | ✔︎ | ✔︎ | | | | |
| `de-Deva-DE` | ✔︎ | ✔︎ | | | | |
| `de-Latf-DE` | ✔︎ | ✔︎ | | | | |
| `de-Latn-DE` | ✔︎ | ✔︎ | | | | |
| `de-Latn-DE-1996` | ✔︎ | ✔︎ | | | | |
| `de-x-DE` | ✔︎ | ✔︎ | | | | |
| `en` | ✔︎ | | | | | |
| `en-GB` | ✔︎ | | | | | |
| `zh` | ✔︎ | | | | | |
| `zh-Hans` | ✔︎ | | | | | |
| `zh-Hant` | ✔︎ | | | | | |

</details>

###### Parameters

*   `tags` (`string` or `Array<string>`)
    — list of BCP 47 tags
*   `ranges` (`string` or `Array<string>`, default: `'*'`)
    — list of RFC 4647
    [basic ranges][basic-range]
    (aka, matching `/^(\*|[a-z]{1,8}(-[a-z0-9]{1,8})*)$/i`)

###### Returns

Possibly empty list of matching tags in the order they matched
(`Array<string>`).

### `extendedFilter(tags[, ranges='*'])`

> 👉 **Note**: See
> [Extended Filtering spec](https://tools.ietf.org/html/rfc4647#section-3.3.2)

Match language tags to a list of extended ranges.
Searches for matches between the first range and all tags, and continues
with further ranges.

<details><summary>View matching table</summary>

| Extended Filter | `*` | `de` | `de-CH` | `de-DE` | `de-*-DE` | `*-CH` |
| - | - | - | - | - | - | - |
| `de` | ✔︎ | ✔︎ | | | | |
| `de-CH` | ✔︎ | ✔︎ | ✔︎ | | | ✔︎ |
| `de-CH-1996` | ✔︎ | ✔︎ | ✔︎ | | | ✔︎ |
| `de-DE` | ✔︎ | ✔︎ | | ✔︎ | ✔︎ | |
| `de-DE-1996` | ✔︎ | ✔︎ | | ✔︎ | ✔︎ | |
| `de-DE-x-goethe` | ✔︎ | ✔︎ | | ✔︎ | ✔︎ | |
| `de-Deva` | ✔︎ | ✔︎ | | | | |
| `de-Deva-DE` | ✔︎ | ✔︎ | | ✔︎ | ✔︎ | |
| `de-Latf-DE` | ✔︎ | ✔︎ | | ✔︎ | ✔︎ | |
| `de-Latn-DE` | ✔︎ | ✔︎ | | ✔︎ | ✔︎ | |
| `de-Latn-DE-1996` | ✔︎ | ✔︎ | | ✔︎ | ✔︎ | |
| `de-x-DE` | ✔︎ | ✔︎ | | | | |
| `en` | ✔︎ | | | | | |
| `en-GB` | ✔︎ | | | | | |
| `zh` | ✔︎ | | | | | |
| `zh-Hans` | ✔︎ | | | | | |
| `zh-Hant` | ✔︎ | | | | | |

</details>

###### Parameters

*   `tags` (`string` or `Array<string>`)
    — list of BCP 47 tags
*   `ranges` (`string` or `Array<string>`, default: `'*'`)
    — list of RFC 4647 [extended ranges][extended-range]
    (aka, matching `/^(\*|[a-z]{1,8})(-(\*|[a-z0-9]{1,8}))*$/i`)

###### Returns

Possibly empty list of matching tags in the order they matched
(`Array<string>`).

### `lookup(tags, ranges)`

> 👉 **Note**: See
> [Lookup spec](https://tools.ietf.org/html/rfc4647#section-3.4)

Find the best language tag that matches a list of ranges.
Searches for a match between the first range and all tags, and continues
with further ranges.
Returns the first match, if any.

<details><summary>View matching table</summary>

| Lookup | `*` | `de` | `de-CH` | `de-DE` | `de-*-DE` | `*-CH` |
| - | - | - | - | - | - | - |
| `de` | | ✔︎︎ | ✔︎︎ | ✔︎ | ✔︎ | ✔︎ |
| `de-CH` | | | ✔︎ | | | ✔︎ |
| `de-CH-1996` | | | | | | ✔︎ |
| `de-DE` | | | | ✔︎ | | ✔︎ |
| `de-DE-1996` | | | | | | ✔︎ |
| `de-DE-x-goethe` | | | | | | ✔︎ |
| `de-Deva` | | | | | | ✔︎ |
| `de-Deva-DE` | | | | | | ✔︎ |
| `de-Latf-DE` | | | | | | ✔︎ |
| `de-Latn-DE` | | | | | | ✔︎ |
| `de-Latn-DE-1996` | | | | | | ✔︎ |
| `de-x-DE` | | | | | | ✔︎ |
| `en` | | | | | | ✔︎ |
| `en-GB` | | | | | | ✔︎ |
| `zh` | | | | | | ✔︎ |
| `zh-Hans` | | | | | | ✔︎ |
| `zh-Hant` | | | | | | ✔︎ |

</details>

###### Parameters

*   `tags` (`string` or `Array<string>`)
    — list of BCP 47 tags
*   `ranges` (`string` or `Array<string>`)
    — list of RFC 4647 basic ranges (but `*` is ignored)

###### Returns

First matching tag in `tags`, `undefined` otherwise (`string?`).

## Types

This package is fully typed with [TypeScript][].
It exports no additional types.

## Compatibility

This package is at least compatible with all maintained versions of Node.js.
As of now, that is Node.js 14.14+ and 16.0+.
It also works in Deno and modern browsers.

## Security

This package is safe.

## Related

*   [`wooorm/bcp-47`](https://github.com/wooorm/bcp-47)
    — parse and serialize BCP 47 language tags
*   [`wooorm/bcp-47-normalize`](https://github.com/wooorm/bcp-47-normalize)
    — normalize, canonicalize, and format BCP 47 tags
*   [`wooorm/iso-3166`](https://github.com/wooorm/iso-3166)
    — ISO 3166 codes
*   [`wooorm/iso-639-2`](https://github.com/wooorm/iso-639-2)
    — ISO 639-2 codes
*   [`wooorm/iso-639-3`](https://github.com/wooorm/iso-639-3)
    — ISO 639-3 codes
*   [`wooorm/iso-15924`](https://github.com/wooorm/iso-15924)
    — ISO 15924 codes
*   [`wooorm/un-m49`](https://github.com/wooorm/un-m49)
    — UN M49 codes

## Contribute

Yes please!
See [How to Contribute to Open Source][contribute].

## License

[MIT][license] © [Titus Wormer][author]

<!-- Definitions -->

[build-badge]: https://github.com/wooorm/bcp-47-match/workflows/main/badge.svg

[build]: https://github.com/wooorm/bcp-47-match/actions

[coverage-badge]: https://img.shields.io/codecov/c/github/wooorm/bcp-47-match.svg

[coverage]: https://codecov.io/github/wooorm/bcp-47-match

[downloads-badge]: https://img.shields.io/npm/dm/bcp-47-match.svg

[downloads]: https://www.npmjs.com/package/bcp-47-match

[size-badge]: https://img.shields.io/bundlephobia/minzip/bcp-47-match.svg

[size]: https://bundlephobia.com/result?p=bcp-47-match

[npm]: https://docs.npmjs.com/cli/install

[esmsh]: https://esm.sh

[license]: license

[author]: https://wooorm.com

[esm]: https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c

[typescript]: https://www.typescriptlang.org

[contribute]: https://opensource.guide/how-to-contribute/

[spec]: https://tools.ietf.org/html/bcp47

[match]: https://tools.ietf.org/html/rfc4647

[basic-range]: https://tools.ietf.org/html/rfc4647#section-2.1

[extended-range]: https://tools.ietf.org/html/rfc4647#section-2.2
