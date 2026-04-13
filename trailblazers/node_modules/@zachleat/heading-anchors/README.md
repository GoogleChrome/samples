# `<heading-anchors>` Web Component

A web component to add and position sibling anchor links for heading elements (`h1`–`h6`) when they have an `id` attribute.

Inspired by [David Darnes’ `<heading-anchors>`](https://github.com/daviddarnes/heading-anchors).

* [Demo](https://zachleat.github.io/heading-anchors/demo.html) on GitHub Pages

## Installation

```
npm install @zachleat/heading-anchors
```

Include the `heading-anchors.js` file on your web site (via `<script type="module">`) and use `<heading-anchors>`.

## Features

* Useful when you want preserve heading text as is (selectable, able to nest other links, etc).
* Useful when you want to exclude anchor links from your RSS feed.
* Links are positioned alongside heading text, but _not_ nested inside of headings (for improved screen-reader compatibility and accessibility)
* Establishes a placeholder element to establish space for the anchor link and so that heading text doesn’t reflow during interaction
* Prefers the CSS Anchoring API (where available) but works using JavaScript positioning when the API is not available.
* Automatically matches `font` styling of the heading (`font-family`, `line-height`, `font-size`, and `font-weight`)

### Options

* Use the `selector` attribute to change the headings used, e.g. `<heading-anchors selector="h2,h3,h4">`
	* Default: `h2,h3,h4,h5,h6`
* Internationalization (i18n) friendly using the `prefix` attribute to change the accessible text inside the anchor links, e.g. `<heading-anchors prefix="Ir a la sección titulada">`
	* Default: `Jump to section titled`
* Use the `content` attribute to change the character used.
	* Default: `#`, supports an empty string if you want to use CSS pseudo elements.
* Style the anchor link using `.ha-placeholder` selector (change font-family, etc).
* Use the `data-ha-exclude` attribute to opt-out of an anchor link.

### Prior Art

* https://github.com/daviddarnes/heading-anchors
* https://amberwilson.co.uk/blog/are-your-anchor-links-accessible/ (which has a lot of good related content too)


## Advanced

### Eliminate Layout Shift

(Optional) There is a small layout shift by the addition of the `#` character. Add this CSS to make room for this pre-component definition:

```css
heading-anchors:not(:defined) :is(h2,h3,h4,h5,h6):after {
	content: "#";
	padding: 0 .25em;
	opacity: 0;
}
```