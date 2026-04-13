import debugUtil from "debug";
import pkg from "../package.json" with {type: "json"};

import { DeepCopy } from "@11ty/eleventy-utils";

import rssPlugin from "./rssPlugin.js";

const debug = debugUtil("Eleventy:Rss:Feed");

function getFeedContent({ type, stylesheet, collection, script }) {
  // Note: page.lang comes from the i18n plugin: https://www.11ty.dev/docs/plugins/i18n/#page.lang

  if(type === "rss") {
    // Nunjucks template
    return `<?xml version="1.0" encoding="utf-8"?>
${stylesheet ? `<?xml-stylesheet href="${stylesheet}" type="text/xsl"?>\n` : ""}<rss version="2.0" xmlns:dc="http://purl.org/dc/elements/1.1/" xml:base="{{ metadata.base | addPathPrefixToFullUrl }}" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    ${script ? `<script src="${script}" xmlns="http://www.w3.org/1999/xhtml"></script>` : ""}
    <title>{{ metadata.title }}</title>
    <link>{{ metadata.base | addPathPrefixToFullUrl }}</link>
    <atom:link href="{{ permalink | htmlBaseUrl(metadata.base) }}" rel="self" type="application/rss+xml" />
    <description>{{ metadata.subtitle }}</description>
    <language>{{ metadata.language or page.lang }}</language>
    {%- if metadata.icon %}<image>{{ metadata.icon }}</image>{%- endif %}
    {%- for post in collections.${collection.name} | reverse | eleventyFeedHead(${collection.limit}) %}
    {%- set absolutePostUrl = post.url | htmlBaseUrl(metadata.base) %}
    <item>
      <title>{{ post.data.title }}</title>
      <link>{{ absolutePostUrl }}</link>
      {%- if (post.data.summary) -%}
      <description>{{ post.data.summary }}</description>
      <content:encoded>{{ post.content | renderTransforms(post.data.page, metadata.base) }}</content:encoded>
      {%- else -%}
      <description>{{ post.content | renderTransforms(post.data.page, metadata.base) }}</description>
      {%- endif -%}
      <pubDate>{{ post.date | dateToRfc822 }}</pubDate>
      <dc:creator>{{ metadata.author.name }}</dc:creator>
      <guid>{{ absolutePostUrl }}</guid>
    </item>
    {%- endfor %}
  </channel>
</rss>`;
  }

  if(type === "atom") {
    // Nunjucks template
    return `<?xml version="1.0" encoding="utf-8"?>
${stylesheet ? `<?xml-stylesheet href="${stylesheet}" type="text/xsl"?>\n` : ""}<feed xmlns="http://www.w3.org/2005/Atom" xml:lang="{{ metadata.language or page.lang }}">
  ${script ? `<script src="${script}" xmlns="http://www.w3.org/1999/xhtml"></script>` : ""}
  <title>{{ metadata.title }}</title>
  <subtitle>{{ metadata.subtitle }}</subtitle>
  <link href="{{ permalink | htmlBaseUrl(metadata.base) }}" rel="self" />
  <link href="{{ metadata.base | addPathPrefixToFullUrl }}" />
  <updated>{{ collections['${collection.name}'] | getNewestCollectionItemDate | dateToRfc3339 }}</updated>
  <id>{{ metadata.base | addPathPrefixToFullUrl }}</id>
  {%- if metadata.icon %}
  <icon>{{ metadata.icon }}</icon>
  {%- endif %}
  {%- if metadata.logo %}
  <icon>{{ metadata.logo }}</icon>
  {%- endif %}
  <author>
    <name>{{ metadata.author.name }}</name>
    {%- if metadata.author.email %}
    <email>{{ metadata.author.email }}</email>
    {%- endif %}
  </author>
  {%- for post in collections['${collection.name}'] | reverse | eleventyFeedHead(${collection.limit}) %}
  {%- set absolutePostUrl %}{{ post.url | htmlBaseUrl(metadata.base) }}{% endset %}
  <entry>
    <title>{{ post.data.title }}</title>
    <link href="{{ absolutePostUrl }}" />
    <updated>{{ post.date | dateToRfc3339 }}</updated>
    <id>{{ absolutePostUrl }}</id>
    {%- if post.data.summary %}
    <summary>{{ post.data.summary }}</summary>
    {%- endif %}
    <content type="html">{{ post.content | renderTransforms(post.data.page, metadata.base) }}</content>
  </entry>
  {%- endfor %}
</feed>`;
  }

  if(type === "json") {
    return `{
  "version": "https://jsonfeed.org/version/1.1",
  "title": "{{ metadata.title }}",
  "language": "{{ metadata.language or page.lang }}",
  "home_page_url": "{{ metadata.base | addPathPrefixToFullUrl }}",
  "feed_url": "{{ permalink | htmlBaseUrl(metadata.base) }}",
  "description": "{{ metadata.description }}",
  "authors": [
    {
      "name": "{{ metadata.author.name }}"{% if metadata.author.email %},
      "url": "mailto:{{ metadata.author.email }}"
      {%- endif %}
    }
  ],
  "items": [
    {%- for post in collections['${collection.name}'] | reverse | eleventyFeedHead(${collection.limit}) %}
    {%- set absolutePostUrl %}{{ post.url | htmlBaseUrl(metadata.base) }}{% endset %}
    {
      "id": "{{ absolutePostUrl }}",
      "url": "{{ absolutePostUrl }}",
      "title": "{{ post.data.title }}",
      "content_html": {% if post.content %}{{ post.content | renderTransforms(post.data.page, metadata.base) | dump | safe }}{% else %}""{% endif %},
      "date_published": "{{ post.date | dateToRfc3339 }}"
    }
    {% if not loop.last %},{% endif %}
    {%- endfor %}
  ]
}`
  }

  throw new Error("Missing or invalid feed type. Received: " + type);
}

export default function eleventyFeedPlugin(eleventyConfig, options = {}) {
  eleventyConfig.versionCheck(pkg["11ty"].compatibility);

  // Guaranteed unique, first add wins
  const pluginHtmlBase = eleventyConfig.resolvePlugin("@11ty/eleventy/html-base-plugin");
  eleventyConfig.addPlugin(pluginHtmlBase, options.htmlBasePluginOptions || {});

  // Guaranteed unique, first add wins
  eleventyConfig.addPlugin(rssPlugin, options.rssPluginOptions || {});

  let slugifyFilter = eleventyConfig.getFilter("slugify");
  let inputPathSuffix = options?.metadata?.title ? `-${slugifyFilter(options?.metadata?.title)}` : "";

  options = DeepCopy({
    // rss and json also supported
    type: "atom",
    collection: {
      name: false, // required
      limit: 0, // limit number of entries, 0 means no limit
    },
    outputPath: "/feed.xml",
    inputPath: `eleventy-plugin-feed${inputPathSuffix}-${options.type || "atom"}.njk`, // TODO make this more unique
    templateData: {},
    metadata: {
      title: "Blog Title",
      subtitle: "This is a longer description about your blog.",
      language: "", // downstream templates use `page.lang` as fallback
      base: "https://example.com/",
      author: {
        name: "Your Name",
        email: "", // Optional
      }
    }
  }, options);

  if(!options.collection?.name) {
    throw new Error("Missing `collection.name` option in feedPlugin from @11ty/eleventy-plugin-rss.");
  }
  if(typeof options.collection?.name !== "string") {
    throw new Error("Only string is supported in `collection.name` option in feedPlugin from @11ty/eleventy-plugin-rss. Received: " + typeof options.collection?.name);
  }

  let eleventyExcludeFromCollections;
  let eleventyImport;
  if(options.collection.name === "all") {
    eleventyExcludeFromCollections = true;
    eleventyImport = {};
  } else {
    eleventyExcludeFromCollections = [ options.collection.name ]
    eleventyImport = {
      collections: [ options.collection.name ],
    };
  }

  let templateData = {
    ...options?.templateData || {},
    permalink: options.outputPath,
    eleventyExcludeFromCollections,
    eleventyImport,
    layout: false,
    metadata: options.metadata,
  };

  // Get the first `n` elements of a collection.
  eleventyConfig.addFilter("eleventyFeedHead", function(array, n) {
    if(!n || n === 0) {
      return array;
    }
    if(n < 0) {
      return array.slice(n);
    }
    return array.slice(0, n);
  });

  eleventyConfig.addTemplate(options.inputPath, getFeedContent(options), templateData);
};

Object.defineProperty(eleventyFeedPlugin, "eleventyPackage", {
  value: `${pkg.name}/feed-plugin`
});

Object.defineProperty(eleventyFeedPlugin, "eleventyPluginOptions", {
  value: {
    // multiple adds of this one is OK
    unique: false
  }
});
