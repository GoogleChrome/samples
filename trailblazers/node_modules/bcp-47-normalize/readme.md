# bcp-47-normalize

[![Build][build-badge]][build]
[![Coverage][coverage-badge]][coverage]
[![Downloads][downloads-badge]][downloads]
[![Size][size-badge]][size]

Normalize, canonicalize, and format [BCP 47][spec] tags.

## Contents

*   [What is this?](#what-is-this)
*   [When should I use this?](#when-should-i-use-this)
*   [Install](#install)
*   [Use](#use)
*   [API](#api)
    *   [`bcp47Normalize(tag[, options])`](#bcp47normalizetag-options)
*   [Types](#types)
*   [Compatibility](#compatibility)
*   [Security](#security)
*   [Related](#related)
*   [Contribute](#contribute)
*   [License](#license)

## What is this?

This package takes BCP 47 tags and makes them uniform.
It removes unneeded info (`en-us` -> `en`) and replaces deprecated,
overlong, and otherwise unpreferred values with preferred values
(`en-bu` -> `en-MM`).
It works by applying [Unicode CLDR suggestions][alias].

## When should I use this?

You can use this package when dealing with user-provided language tags and want
to normalize and clean them.

## Install

This package is [ESM only][esm].
In Node.js (version 14.14+, 16.0+), install with [npm][]:

```sh
npm install bcp-47-normalize
```

In Deno with [`esm.sh`][esmsh]:

```js
import {bcp47Normalize} from 'https://esm.sh/bcp-47-normalize@2'
```

In browsers with [`esm.sh`][esmsh]:

```html
<script type="module">
  import {bcp47Normalize} from 'https://esm.sh/bcp-47-normalize@2?bundle'
</script>
```

## Use

```js
import {bcp47Normalize} from 'bcp-47-normalize'

const tags = [
  'de-de-1901',
  'en-gb',
  'en-us',
  'en-bu',
  'hy-arevmda',
  'nld-nl',
  'no-nyn',
  'pt-br',
  'pt-pt',
  'zh-hans-cn'
]

tags.forEach((tag) => console.log('%s -> %s', tag, bcp47Normalize(tag)))
```

Yields:

```txt
de-de-1901 -> de-1901
en-gb -> en-GB
en-us -> en
en-bu -> en-MM
hy-arevmda -> hyw
nld-nl -> nl
no-nyn -> nn
pt-br -> pt
pt-pt -> pt-PT
zh-hans-cn -> zh
```

## API

This package exports the identifier `bcp47Normalize`.
There is no default export.

### `bcp47Normalize(tag[, options])`

Normalize the given BCP 47 tag according to [Unicode CLDR suggestions][alias].

###### Parameters

*   `tag` (`string`)
    — BCP 47 tag
*   `options.forgiving` (`boolean`, default: `false`)
    — passed to `bcp-47` as [`options.forgiving`][forgiving]
*   `options.warning` (`Function?`, default: `undefined`)
    — passed to `bcp-47` as [`options.warning`][warning]

    One additional warning is given:

    | code | reason                                                     |
    | :--- | :--------------------------------------------------------- |
    | 7    | Deprecated region `CURRENT`, expected one of `SUGGESTIONS` |

    This warning is only given if the region cannot be automatically fixed (when
    regions split into multiple regions).

###### Returns

Normal, canonical, and pretty [BCP 47][spec] tag (`string`).

## Types

This package is fully typed with [TypeScript][].
It exports the additional types `Options` and `Warning`.

## Compatibility

This package is at least compatible with all maintained versions of Node.js.
As of now, that is Node.js 14.14+ and 16.0+.
It also works in Deno and modern browsers.

## Security

This package is safe.

## Related

*   [`wooorm/bcp-47`](https://github.com/wooorm/bcp-47)
    — parse and stringify BCP 47 language tags
*   [`wooorm/bcp-47-match`](https://github.com/wooorm/bcp-47-match)
    — match BCP 47 language tags with language ranges per RFC 4647
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

[build-badge]: https://github.com/wooorm/bcp-47-normalize/workflows/main/badge.svg

[build]: https://github.com/wooorm/bcp-47-normalize/actions

[coverage-badge]: https://img.shields.io/codecov/c/github/wooorm/bcp-47-normalize.svg

[coverage]: https://codecov.io/github/wooorm/bcp-47-normalize

[downloads-badge]: https://img.shields.io/npm/dm/bcp-47-normalize.svg

[downloads]: https://www.npmjs.com/package/bcp-47-normalize

[size-badge]: https://img.shields.io/bundlephobia/minzip/bcp-47-normalize.svg

[size]: https://bundlephobia.com/result?p=bcp-47-normalize

[npm]: https://docs.npmjs.com/cli/install

[esmsh]: https://esm.sh

[license]: license

[author]: https://wooorm.com

[esm]: https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c

[typescript]: https://www.typescriptlang.org

[contribute]: https://opensource.guide/how-to-contribute/

[spec]: https://tools.ietf.org/rfc/bcp/bcp47.html

[alias]: https://github.com/unicode-org/cldr/blob/142b327/common/supplemental/supplementalMetadata.xml#L32

[forgiving]: https://github.com/wooorm/bcp-47#optionsforgiving

[warning]: https://github.com/wooorm/bcp-47#optionswarning
