import {
  IdAttributePlugin,
  InputPathToUrlTransformPlugin,
  HtmlBasePlugin,
} from '@11ty/eleventy';
import { feedPlugin } from '@11ty/eleventy-plugin-rss';
import pluginSyntaxHighlight from '@11ty/eleventy-plugin-syntaxhighlight';
import pluginNavigation from '@11ty/eleventy-navigation';
import { eleventyImageTransformPlugin } from '@11ty/eleventy-img';
import i18n from 'eleventy-plugin-i18n';
import translations from './_data/i18n/translations.js';
import pluginFilters from './_config/filters.js';
import locales from './_data/locales.js';
import metadata from './_data/metadata.js';

/** @param {import("@11ty/eleventy").UserConfig} eleventyConfig */
export default async function (eleventyConfig) {
  // Drafts, see also _data/eleventyDataSchema.js
  eleventyConfig.addPreprocessor('drafts', '*', (data, content) => {
    if (data.draft) {
      data.title = `${data.title} (draft)`;
    }

    if (data.draft && process.env.ELEVENTY_RUN_MODE === 'build') {
      return false;
    }
  });

  // Copy the contents of the `public` folder to the output folder
  // For example, `./public/css/` ends up in `_site/css/`
  eleventyConfig
    .addPassthroughCopy({
      './public/': '/',
      './node_modules/@google/genai/dist/web/index.mjs': '/js/google-genai.js',
      './node_modules/@huggingface/transformers/dist/':
        '/js/huggingface-transformers/',
      './node_modules/browser-fs-access/dist/index.modern.js':
        '/js/browser-fs-access.js',
      './node_modules/built-in-ai-task-apis-polyfills/dist/': '/js/task-apis/',
      './node_modules/dompurify/dist/purify.min.js': '/js/purify.min.js',
      './node_modules/firebase/': '/js/firebase/',
      './node_modules/firebase/firebase-ai.js': '/js/firebase-ai.js',
      './node_modules/firebase/firebase-app.js': '/js/firebase-app.js',
      './node_modules/input-switch-polyfill/input-switch-polyfill.css':
        '/js/input-switch-polyfill.css',
      './node_modules/input-switch-polyfill/input-switch-polyfill.js':
        '/js/input-switch-polyfill.js',
      './node_modules/jszip/dist/jszip.js': '/js/jszip.js',
      './node_modules/marked/lib/marked.umd.js': '/js/marked.js',
      './node_modules/onnxruntime-web/dist/': '/js/onnxruntime-web/',
      './node_modules/onnxruntime-web/dist/ort.webgpu.min.mjs':
        '/js/onnxruntime-web/webgpu.js',
      './node_modules/openai/': '/js/openai/',
      './node_modules/prismjs/prism.js': '/js/prism.js',
      './node_modules/prismjs/themes/prism-okaidia.css':
        '/css/prism-okaidia.css',
      './node_modules/prompt-api-polyfill/dist/backends/': '/js/backends/',
      './node_modules/prompt-api-polyfill/dist/chunks/': '/js/chunks/',
      './node_modules/prompt-api-polyfill/dist/prompt-api-polyfill.js':
        '/js/prompt-api-polyfill.js',
      './node_modules/prompt-api-polyfill/dot_env.json': '/dot_env.json',
      './node_modules/turndown/dist/turndown.js': '/js/turndown.js',
    })


  // Run Eleventy when these files change:
  // https://www.11ty.dev/docs/watch-serve/#add-your-own-watch-targets

  // Watch CSS files
  eleventyConfig.addWatchTarget('css/**/*.css');
  // Watch images for the image pipeline.
  eleventyConfig.addWatchTarget('content/**/*.{svg,webp,png,jpg,jpeg,gif}');

  // Per-page bundles, see https://github.com/11ty/eleventy-plugin-bundle
  // Bundle <style> content and adds a {% css %} paired shortcode
  eleventyConfig.addBundle('css', {
    toFileDirectory: 'dist',
    // Add all <style> content to `css` bundle (use <style eleventy:ignore> to opt-out)
    // Supported selectors: https://www.npmjs.com/package/posthtml-match-helper
    bundleHtmlContentFromSelector: 'style',
  });

  // Bundle <script> content and adds a {% js %} paired shortcode
  eleventyConfig.addBundle('js', {
    toFileDirectory: 'dist',
    // Add all <script> content to the `js` bundle (use <script eleventy:ignore> to opt-out)
    // Supported selectors: https://www.npmjs.com/package/posthtml-match-helper
    bundleHtmlContentFromSelector: 'script',
  });

  // Official plugins
  eleventyConfig.addPlugin(pluginSyntaxHighlight, {
    preAttributes: { tabindex: 0 },
  });
  eleventyConfig.addPlugin(pluginNavigation);
  eleventyConfig.addPlugin(HtmlBasePlugin);
  eleventyConfig.addPlugin(InputPathToUrlTransformPlugin);

  // Localized collections for feeds
  const mainLocales = ['en', 'es', 'ja'];
  for (const lang of mainLocales) {
    eleventyConfig.addCollection(`posts_${lang}`, function (collectionApi) {
      return collectionApi.getFilteredByTag('posts').filter((item) => {
        const itemLocale =
          item.data.locale || (item.url ? item.url.split('/')[1] : '');
        return itemLocale === lang;
      });
    });

    eleventyConfig.addPlugin(feedPlugin, {
      type: 'atom',
      outputPath: `/${lang}/feed/feed.xml`,
      stylesheet: '../../feed/pretty-atom-feed.xsl',
      templateData: {
        locale: lang,
        eleventyNavigation: {
          key: 'feed',
          order: 4,
        },
      },
      collection: {
        name: `posts_${lang}`,
        limit: 10,
      },
      metadata: {
        language: lang,
        title: `${{ en: 'Posts', es: 'Publicaciones', ja: '記事' }[lang]} - ${metadata.title}`,
        subtitle: metadata.description,
        base: metadata.url,
        author: metadata.author,
      },
    });
  }

  eleventyConfig.addCollection('authorLocaleCombos', function (collectionApi) {
    const authors = [
      { id: 'maya', name: 'Maya' },
      { id: 'ashok', name: 'Ashok' },
      { id: 'julia', name: 'Julia' },
    ];
    const combos = [];
    for (const locale of ['en', 'es', 'ja']) {
      for (const author of authors) {
        combos.push({ author: author.id, locale });
      }
    }
    return combos;
  });

  eleventyConfig.addCollection('tagLocaleCombos', function (collectionApi) {
    const allItems = collectionApi.getAll();
    const slugsSet = new Set();
    const combos = [];

    for (const item of allItems) {
      const itemLocale =
        item.data.locale || (item.url ? item.url.split('/')[1] : '');
      if (!['en', 'es', 'ja'].includes(itemLocale)) continue;

      let itemTags = item.data.tags || [];
      if (typeof itemTags === 'string') {
        itemTags = [itemTags];
      }

      for (const tag of itemTags) {
        if (tag && tag !== 'all' && tag !== 'posts') {
          // Simplified slugification for deduplication
          const slug = tag.toLowerCase().replace(/\s+/g, '-');
          const slugKey = `${itemLocale}|${slug}`;
          if (!slugsSet.has(slugKey)) {
            slugsSet.add(slugKey);
            combos.push({ tag, locale: itemLocale });
          }
        }
      }
    }
    return combos;
  });

  // Image optimization: https://www.11ty.dev/docs/plugins/image/#eleventy-transform
  eleventyConfig.addPlugin(eleventyImageTransformPlugin, {
    // Output formats for each image.
    formats: ['avif', 'webp', 'auto'],

    // widths: ["auto"],

    failOnError: false,
    htmlOptions: {
      imgAttributes: {
        // e.g. <img loading decoding> assigned on the HTML tag will override these values.
        loading: 'lazy',
        decoding: 'async',
      },
    },

    sharpOptions: {
      animated: true,
    },
  });

  // Filters
  eleventyConfig.addPlugin(pluginFilters);

  const fallbackLocales = {
    'en-US': 'en',
    'en-GB': 'en',
    'es-ES': 'es',
    'es-US': 'es',
    '404.html': 'en',
    '': 'en',
  };

  // Silence i18n warnings by programmatically expanding translations
  // for sub-locales so the plugin finds them and doesn't log a fallback warning.
  for (const values of Object.values(translations)) {
    for (const [locale, fallback] of Object.entries(fallbackLocales)) {
      if (!values[locale] && values[fallback]) {
        values[locale] = values[fallback];
      }
    }
  }

  eleventyConfig.addGlobalData('translations', translations);

  eleventyConfig.addPlugin(i18n, {
    translations,
    fallbackLocales: {
      ...fallbackLocales,
      '*': 'en',
    },
  });

  eleventyConfig.addPlugin(IdAttributePlugin, {
    // by default we use Eleventy’s built-in `slugify` filter:
    // slugify: eleventyConfig.getFilter("slugify"),
    // selector: "h1,h2,h3,h4,h5,h6", // default
  });

  eleventyConfig.addShortcode('currentBuildDate', () => {
    return new Date().toISOString();
  });

  // Features to make your build faster (when you need them)

  // If your passthrough copy gets heavy and cumbersome, add this line
  // to emulate the file copy on the dev server. Learn more:
  // https://www.11ty.dev/docs/copy/#emulate-passthrough-copy-during-serve

  // eleventyConfig.setServerPassthroughCopyBehavior("passthrough");
}

export const config = {
  // Control which files Eleventy will process
  // e.g.: *.md, *.njk, *.html, *.liquid
  templateFormats: ['md', 'njk', 'html', 'liquid', '11ty.js'],

  // Pre-process *.md files with: (default: `liquid`)
  markdownTemplateEngine: 'njk',

  // Pre-process *.html files with: (default: `liquid`)
  htmlTemplateEngine: 'njk',

  // These are all optional:
  dir: {
    input: 'content', // default: "."
    includes: '../_includes', // default: "_includes" (`input` relative)
    data: '../_data', // default: "_data" (`input` relative)
    output: 'dist',
  },

  // -----------------------------------------------------------------
  // Optional items:
  // -----------------------------------------------------------------

  // If your site deploys to a subdirectory, change `pathPrefix`.
  // Read more: https://www.11ty.dev/docs/config/#deploy-to-a-subdirectory-with-a-path-prefix

  // When paired with the HTML <base> plugin https://www.11ty.dev/docs/plugins/html-base/
  // it will transform any absolute URLs in your HTML to include this
  // folder name and does **not** affect where things go in the output folder.

  pathPrefix: '/samples/trailblazers/dist/',
};
