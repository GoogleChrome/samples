# eleventy-plugin-bundle

Little bundles of code, little bundles of joy.

Create minimal per-page or app-level bundles of CSS, JavaScript, or HTML to be included in your Eleventy project.

Makes it easy to implement Critical CSS, in-use-only CSS/JS bundles, SVG icon libraries, or secondary HTML content to load via XHR.

## Why?

This project is a minimum-viable-bundler and asset pipeline in Eleventy. It does not perform any transpilation or code manipulation (by default). The code you put in is the code you get out (with configurable `transforms` if you’d like to modify the code).

For more larger, more complex use cases you may want to use a more full featured bundler like Vite, Parcel, Webpack, rollup, esbuild, or others.

But do note that a full-featured bundler has a significant build performance cost, so take care to weigh the cost of using that style of bundler against whether or not this plugin has sufficient functionality for your use case—especially as the platform matures and we see diminishing returns on code transpilation (ES modules everywhere).

## Installation

No installation necessary. Starting with Eleventy `v3.0.0-alpha.10` and newer, this plugin is now bundled with Eleventy.

## Usage

By default, Bundle Plugin v2.0 does not include any default bundles. You must add these yourself via `eleventyConfig.addBundle`. One notable exception happens when using the WebC Eleventy Plugin, which adds `css`, `js`, and `html` bundles for you.

To create a bundle type, use `eleventyConfig.addBundle` in your Eleventy configuration file (default `.eleventy.js`):

```js
// .eleventy.js
export default function(eleventyConfig) {
	eleventyConfig.addBundle("css");
};
```

This does two things:

1. Creates a new `css` shortcode for adding arbitrary code to this bundle
2. Adds `"css"` as an eligible type argument to the `getBundle` and `getBundleFileUrl` shortcodes.

### Full options list

```js
export default function(eleventyConfig) {
	eleventyConfig.addBundle("css", {
		// (Optional) Folder (relative to output directory) files will write to
		toFileDirectory: "bundle",

		// (Optional) File extension used for bundle file output, defaults to bundle name
		outputFileExtension: "css",

		// (Optional) Name of shortcode for use in templates, defaults to bundle name
		shortcodeName: "css",
		// shortcodeName: false, // disable this feature.

		// (Optional) Modify bundle content
		transforms: [],

		// (Optional) If two identical code blocks exist in non-default buckets, they’ll be hoisted to the first bucket in common.
		hoist: true,

		// (Optional) In 11ty.js templates, having a named export of `bundle` will populate your bundles.
		bundleExportKey: "bundle",
		// bundleExportKey: false, // disable this feature.
	});
};
```

Read more about [`hoist` and duplicate bundle hoisting](https://github.com/11ty/eleventy-plugin-bundle/issues/5).

### Universal Shortcodes

The following Universal Shortcodes (available in `njk`, `liquid`, `hbs`, `11ty.js`, and `webc`) are provided by this plugin:

* `getBundle` to retrieve bundled code as a string.
* `getBundleFileUrl` to create a bundle file on disk and retrieve the URL to that file.

Here’s a [real-world commit showing this in use on the `eleventy-base-blog` project](https://github.com/11ty/eleventy-base-blog/commit/c9595d8f42752fa72c66991c71f281ea960840c9?diff=split).

### Example: Add bundle code in a Markdown file in Eleventy

```md
# My Blog Post

This is some content, I am writing markup.

{% css %}
em { font-style: italic; }
{% endcss %}

## More Markdown

{% css %}
strong { font-weight: bold; }
{% endcss %}
```

Renders to:

```html
<h1>My Blog Post</h1>

<p>This is some content, I am writing markup.</p>

<h2>More Markdown</h2>
```

Note that the bundled code is excluded!

_There are a few [more examples below](#examples)!_

### Render bundle code

```html
<!-- Use this *anywhere*: a layout file, content template, etc -->
<style>{% getBundle "css" %}</style>

<!--
You can add more code to the bundle after calling
getBundle and it will be included.
-->
{% css %}* { color: orange; }{% endcss %}
```

### Write a bundle to a file

Writes the bundle content to a content-hashed file location in your output directory and returns the URL to the file for use like this:

```html
<link rel="stylesheet" href="{% getBundleFileUrl "css" %}">
```

Note that writing bundles to files will likely be slower for empty-cache first time visitors but better cached in the browser for repeat-views (and across multiple pages, too).

### Asset bucketing

```html
<!-- This goes into a `defer` bucket (the bucket can be any string value) -->
{% css "defer" %}em { font-style: italic; }{% endcss %}
```

```html
<!-- Pass the arbitrary `defer` bucket name as an additional argument -->
<style>{% getBundle "css", "defer" %}</style>
<link rel="stylesheet" href="{% getBundleFileUrl 'css', 'defer' %}">
```

A `default` bucket is implied:

```html
<!-- These two statements are the same -->
{% css %}em { font-style: italic; }{% endcss %}
{% css "default" %}em { font-style: italic; }{% endcss %}

<!-- These two are the same too -->
<style>{% getBundle "css" %}</style>
<style>{% getBundle "css", "default" %}</style>
```

### Examples

#### Critical CSS

```js
// .eleventy.js
export default function(eleventyConfig) {
	eleventyConfig.addBundle("css");
};
```

Use asset bucketing to divide CSS between the `default` bucket and a `defer` bucket, loaded asynchronously.

_(Note that some HTML boilerplate has been omitted from the sample below)_

```html
<!-- … -->
<head>
	<!-- Inlined critical styles -->
	<style>{% getBundle "css" %}</style>

	<!-- Deferred non-critical styles -->
	<link rel="stylesheet" href="{% getBundleFileUrl 'css', 'defer' %}" media="print" onload="this.media='all'">
	<noscript>
		<link rel="stylesheet" href="{% getBundleFileUrl 'css', 'defer' %}">
	</noscript>
</head>
<body>
	<!-- This goes into a `default` bucket -->
	{% css %}/* Inline in the head, great with @font-face! */{% endcss %}
	<!-- This goes into a `defer` bucket (the bucket can be any string value) -->
	{% css "defer" %}/* Load me later */{% endcss %}
</body>
<!-- … -->
```

**Related**:

* Check out the [demo of Critical CSS using Eleventy Edge](https://demo-eleventy-edge.netlify.app/critical-css/) for a repeat view optimization without JavaScript.
* You may want to improve the above code with [`fetchpriority`](https://www.smashingmagazine.com/2022/04/boost-resource-loading-new-priority-hint-fetchpriority/) when [browser support improves](https://caniuse.com/mdn-html_elements_link_fetchpriority).

#### SVG Icon Library

Here an `svg` is bundle is created.

```js
// .eleventy.js
export default function(eleventyConfig) {
	eleventyConfig.addBundle("svg");
};
```

```html
<svg width="0" height="0" aria-hidden="true" style="position: absolute;">
	<defs>{% getBundle "svg" %}</defs>
</svg>

<!-- And anywhere on your page you can add icons to the set -->
{% svg %}
<g id="icon-close"><path d="…" /></g>
{% endsvg %}

And now you can use `icon-close` in as many SVG instances as you’d like (without repeating the heftier SVG content).

<svg><use xlink:href="#icon-close"></use></svg>
<svg><use xlink:href="#icon-close"></use></svg>
<svg><use xlink:href="#icon-close"></use></svg>
<svg><use xlink:href="#icon-close"></use></svg>
```

#### React Helmet-style `<head>` additions

```js
// .eleventy.js
export default function(eleventyConfig) {
	eleventyConfig.addBundle("html");
};
```

This might exist in an Eleventy layout file:

```html
<head>
	{% getBundle "html", "head" %}
</head>
```

And then in your content you might want to page-specific `preconnect`:

```html
{% html "head" %}
<link href="https://v1.opengraph.11ty.dev" rel="preconnect" crossorigin>
{% endhtml %}
```

#### Bundle Sass with the Render Plugin

You can render template syntax inside of the `{% css %}` shortcode too, if you’d like to do more advanced things using Eleventy template types.

This example assumes you have added the [Render plugin](https://www.11ty.dev/docs/plugins/render/) and the [`scss` custom template type](https://www.11ty.dev/docs/languages/custom/) to your Eleventy configuration file.

```html
{% css %}
  {% renderTemplate "scss" %}
  h1 { .test { color: red; } }
  {% endrenderTemplate %}
{% endcss %}
```

Now the compiled Sass is available in your default bundle and will show up in `getBundle` and `getBundleFileUrl`.

#### Use with [WebC](https://www.11ty.dev/docs/languages/webc/)

Starting with `@11ty/eleventy-plugin-webc@0.9.0` (track at [issue #48](https://github.com/11ty/eleventy-plugin-webc/issues/48)) this plugin is used by default in the Eleventy WebC plugin. Specifically, [WebC Bundler Mode](https://www.11ty.dev/docs/languages/webc/#css-and-js-(bundler-mode)) now uses the bundle plugin under the hood.

To add CSS to a bundle in WebC, you would use a `<style>` element in a WebC page or component:

```html
<style>/* This is bundled. */</style>
<style webc:keep>/* Do not bundle me—leave as is */</style>
```

To add JS to a page bundle in WebC, you would use a `<script>` element in a WebC page or component:

```html
<script>/* This is bundled. */</script>
<script webc:keep>/* Do not bundle me—leave as is */</script>
```

* Existing calls via WebC helpers `getCss` or `getJs` (e.g. `<style @raw="getCss(page.url)">`) have been wired up to `getBundle` (for `"css"` and `"js"` respectively) automatically.
	* For consistency, you may prefer using the bundle plugin method names everywhere: `<style @raw="getBundle('css')">` and `<script @raw="getBundle('js')">` both work fine.
* Outside of WebC, the Universal Filters `webcGetCss` and `webcGetJs` were removed in Eleventy `v3.0.0-alpha.10` in favor of the `getBundle` Universal Shortcode (`{% getBundle "css" %}` and `{% getBundle "js" %}` respectively).

#### Modify the bundle output

You can wire up your own async-friendly callbacks to transform the bundle output too. Here’s a quick example of [`postcss` integration](https://github.com/postcss/postcss#js-api).

```js
const postcss = require("postcss");
const postcssNested = require("postcss-nested");

export default function(eleventyConfig) {
	eleventyConfig.addBundle("css", {
		transforms: [
			async function(content) {
				// this.type returns the bundle name.
				// Same as Eleventy transforms, this.page is available here.
				let result = await postcss([postcssNested]).process(content, { from: this.page.inputPath, to: null });
				return result.css;
			}
		]
	});
};
```

## Advanced

### Limitations

Bundles do not support nesting or recursion (yet?). If this will be useful to you, please file an issue!

<!--
Version Two:

* Think about Eleventy transform order, scenarios where this transform needs to run first.
* JavaScript API independent of eleventy
* Clean up the _site/bundle folder on exit?
* Example ideas:
	* App bundle and page bundle
* can we make this work for syntax highlighting? or just defer to WebC for this?

{% css %}
<style>
em { font-style: italic; }
</style>
{% endcss %}
* a way to declare dependencies? or just defer to buckets here
* What if we want to add code duplicates? Adding `alert(1);` `alert(1);` to alert twice?
* sourcemaps (maybe via magic-string module or https://www.npmjs.com/package/concat-with-sourcemaps)
-->