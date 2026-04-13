<div align="center">
  <img width="150" height="150" title="PostHTML" src="https://posthtml.github.io/posthtml/logo.svg">
  <h1>posthtml-match-helper</h1>
  
  Expand CSS selectors into PostHTML matcher objects

  [![Version][npm-version-shield]][npm]
  [![Build][github-ci-shield]][github-ci]
  [![License][license-shield]][license]
  [![Downloads][npm-stats-shield]][npm-stats]
</div>

## Introduction

This PostHTML plugin can turn simple CSS selectors into [matcher objects](https://github.com/posthtml/posthtml/blob/master/README.md#match).

Supported features:

* Tags: `"div"` returns `{tag: "div"}`.
* Ids: `"#bar"` returns `{attrs: {id: "bar"}}`.
* Classes: `.foo` returns `{attrs: { class: /(?:^|\s)foo(?:\\s|$)/ }}`. Any number of classnames supported.
* Attribute selectors: any number of standard [attribute selectors](https://developer.mozilla.org/en/docs/Web/CSS/Attribute_selectors) can be used<sup><a href="#attribute_selectors_footnote">1</a></sup> including the following non-standard:
   * `[attr!=value]`: matches attributes with values that do not contain `value`.
* Multiple node selectors: `"div, span"` returns `[{tag: "div"}, {tag: "span"}]`.

**<sup><a name="attribute_selectors_footnote">1</a></sup>** Multiple attribute selectors for the same attribute are not supported (this includes mixing classnames and attribute selectors matching `class`).

The basic template for selectors (and order of features) looks like this:

```js
"tag#id.class.name[attr*=value][otherattr^='start']"
```

## Basic usage

```js
import matchHelper from "posthtml-match-helper";

tree.match(matchHelper("div.class"), function (node) {
  // do stuff with matched node...
});
```

## Advanced usage

```js
import matchHelper from "posthtml-match-helper";

tree.match(matchHelper("input.my-control[type!='radio'][checked], input[value^='foo'][checked]"), function (node) {
  // do stuff with node that matched either of the selectors...
});
```

## Classnames with escaped characters

If you need to match nodes with classnames that use escaped characters, like those in Tailwind CSS utilities with arbitrary values, use the following syntax:

```js
import matchHelper from "posthtml-match-helper";

tree.match(matchHelper("input.\\[display:none\\]"), function (node) {
  // do stuff with node that matched either of the selectors...
});
```


## The helper function

#### Arguments

* `matcher` (string) - A CSS selector that describes the node you want to match in PostHTML.

#### Returns

A matcher object or an array of matcher objects.

[npm]: https://www.npmjs.com/package/posthtml-match-helper
[npm-version-shield]: https://img.shields.io/npm/v/posthtml-match-helper.svg
[npm-stats]: http://npm-stat.com/charts.html?package=posthtml-match-helper
[npm-stats-shield]: https://img.shields.io/npm/dt/posthtml-match-helper.svg
[github-ci]: https://github.com/posthtml/posthtml-match-helper/actions/workflows/nodejs.yml
[github-ci-shield]: https://github.com/posthtml/posthtml-match-helper/actions/workflows/nodejs.yml/badge.svg
[license]: ./LICENSE
[license-shield]: https://img.shields.io/npm/l/posthtml-match-helper.svg
