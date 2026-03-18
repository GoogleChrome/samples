# eleventy-base-blog v10

A starter repository showing how to build a blog with the [Eleventy](https://www.11ty.dev/) site generator (using the [v3.0 release](https://github.com/11ty/eleventy/releases/tag/v3.0.0)).

## Getting Started

- [Want a more generic/detailed getting started guide?](https://www.11ty.dev/docs/getting-started/)

1. Make a directory and navigate to it:

```
mkdir my-blog-name
cd my-blog-name
```

2. Clone this Repository

```
git clone https://github.com/11ty/eleventy-base-blog.git .
```

_Optional:_ Review `eleventy.config.js` and `_data/metadata.js` to configure the site’s options and data.

3. Install dependencies

```
npm install
```

4. Run Eleventy

Generate a production-ready build to the `_site` folder:

```
npx @11ty/eleventy
```

Or build and host on a local development server:

```
npx @11ty/eleventy --serve
```

Or you can run [debug mode](https://www.11ty.dev/docs/debugging/) to see all the internals.

## Admin Page: Create Blog Posts

This project includes a dedicated Admin Page at `/blog/create/?admin=true` for composing new blog posts directly in the browser. It features a Markdown editor with a live preview and advanced asset handling.

### Usage

- Load your blog's admin page at `/blog/create/?admin=true`.
- Open the Settings pane and link the editor with your blog's GitHub repository to enable publishing to GitHub.
- Optionally enable AI features and provide your AI API keys in the **Settings** section of the admin Page.
- Create new blog posts, or edit existing ones by clicking the "Edit" button in the Archive or on the Home page.

### Features

- **Draft Management**: Work on multiple drafts simultaneously. Drafts are saved automatically to your browser's local storage.
- **Rich Asset Support**:
  - Drag and drop or paste images directly into the editor.
  - Images are stored locally in **IndexedDB** for persistent offline editing.
- **Intelligent Housekeeping**: Automatically identifies and removes unused images from storage when drafts are updated or deleted.
- **PWA Support**: The Admin Page is installable as a Progressive Web App (PWA). Once installed, it requests **persistent storage**, making it significantly less likely that your drafts and images will be evicted by the browser under disk pressure.
- **Smart Pasting**: Paste rich text from other websites; the Admin Page automatically converts HTML to Markdown and attempts to download and locally host external images. If this isn't possible due to CORS, it falls back to the original remote URL.
- **Export & Sync**:
  - **Save as `.zip`**: Export your finished post and its images as a structured `.zip` file ready for manual deployment.
  - **GitHub Integration**: Create a Pull Request directly from the UI. The Admin Page handles branch creation, image uploads, and Markdown submission to your repository.
  - **Edit Existing Blog Posts**: Directly load and update existing posts from your GitHub repository by clicking the "Edit" button in the Archive or the Home page.

### Optional Built-in AI Features

The Admin Page offers several assistive features powered by the Built-in AI APIs. These APIs are also polyfilled to work in browsers that do not support them natively.

To use the polyfilled AI features with cloud AI providers, you need to provide your AI API keys in the **Settings** section of the Admin Page. The following backends are supported:

- **Local**: Transformers.js.
- **Cloud**: Firebase AI Logic (Developer/Vertex), OpenAI, Gemini API.

For more information on supported backends and configuration, see the [Prompt API Polyfill README](https://github.com/GoogleChromeLabs/web-ai-demos/tree/main/prompt-api-polyfill#configuring-dot_envjson--envjson).

Available AI features:

- **AI Writing Assistant**: Expand bullet points into full paragraphs or rewrite existing content to adjust the tone.
- **Smart Summarization**: Generate suggestions for blog post titles and meta descriptions from your content that you can then refine.
- **Multimodal Alt-Text**: Automatically generate suggestions for accessible alt-text and creative captions for uploaded or pasted images.
- **Tag Suggestions**: Receive relevant tag recommendations based on the topics discussed in your post.
- **Advertising Categories**: Generate suggestions for advertising categories based on the topics discussed in your post.

_Note: These features are privacy-focused and run entirely locally on your device when using the built-in AI APIs. They can be **completely** turned off in the Admin Page settings._

## Features

- Using [Eleventy v3](https://github.com/11ty/eleventy/releases/tag/v3.0.0) with zero-JavaScript output.
  - Content is exclusively pre-rendered (this is a static site).
  - Can easily [deploy to a subfolder without changing any content](https://www.11ty.dev/docs/plugins/html-base/)
  - All URLs are decoupled from the content’s location on the file system.
  - Configure templates via the [Eleventy Data Cascade](https://www.11ty.dev/docs/data-cascade/)
- **Performance focused**: four-hundos Lighthouse score out of the box!
  - _0 Cumulative Layout Shift_
  - _0ms Total Blocking Time_
- Local development live reload provided by [Eleventy Dev Server](https://www.11ty.dev/docs/dev-server/).
- Content-driven [navigation menu](https://www.11ty.dev/docs/plugins/navigation/)
- Fully automated [Image optimization](https://www.11ty.dev/docs/plugins/image/)
  - Zero-JavaScript output.
  - Support for modern image formats automatically (e.g. AVIF and WebP)
  - Processes images on-request during `--serve` for speedy local builds.
  - Prefers `<img>` markup if possible (single image format) but switches automatically to `<picture>` for multiple image formats.
  - Automated `<picture>` syntax markup with `srcset` and optional `sizes`
  - Includes `width`/`height` attributes to avoid [content layout shift](https://web.dev/cls/).
  - Includes `loading="lazy"` for native lazy loading without JavaScript.
  - Includes [`decoding="async"`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement/decoding)
  - Images can be co-located with blog post files.
- Per page CSS bundles [via `eleventy-plugin-bundle`](https://github.com/11ty/eleventy-plugin-bundle).
- Built-in [syntax highlighter](https://www.11ty.dev/docs/plugins/syntaxhighlight/) (zero-JavaScript output).
- Draft content: use `draft: true` to mark any template as a draft. Drafts are **only** included during `--serve`/`--watch` and are excluded from full builds. This is driven by the `addPreprocessor` configuration API in `eleventy.config.js`. Schema validator will show an error if non-boolean value is set in data cascade.
- Blog Posts
  - Automated next/previous links
  - Accessible deep links to headings
- Generated Pages
  - Home, Archive, and About pages.
  - [Atom feed included (with easy one-line swap to use RSS or JSON)](https://www.11ty.dev/docs/plugins/rss/)
  - `sitemap.xml`
  - Zero-maintenance tag pages ([View on the Demo](https://eleventy-base-blog.netlify.app/tags/))
  - Content not found (404) page

## Demos

- [Netlify](https://eleventy-base-blog.netlify.app/)
- [Vercel](https://demo-base-blog.11ty.dev/)
- [Cloudflare Pages](https://eleventy-base-blog-d2a.pages.dev/)
- [GitHub Pages](https://11ty.github.io/eleventy-base-blog/)

## Deploy this to your own site

Deploy this Eleventy site in just a few clicks on these services:

- Read more about [Deploying an Eleventy project](https://www.11ty.dev/docs/deployment/) to the web.
- [Deploy this to **Netlify**](https://app.netlify.com/start/deploy?repository=https://github.com/11ty/eleventy-base-blog)
- [Deploy this to **Vercel**](https://vercel.com/import/project?template=11ty%2Feleventy-base-blog)
- Look in `.github/workflows/gh-pages.yml.sample` for information on [Deploying to **GitHub Pages**](https://www.11ty.dev/docs/deployment/#deploy-an-eleventy-project-to-git-hub-pages).
- [Try it out on **Stackblitz**](https://stackblitz.com/github/11ty/eleventy-base-blog)

### Implementation Notes

- `content/about/index.md` is an example of a content page.
- `content/blog/` has the blog posts but really they can live in any directory. They need only the `posts` tag to be included in the blog posts [collection](https://www.11ty.dev/docs/collections/).
- Use the `eleventyNavigation` key (via the [Eleventy Navigation plugin](https://www.11ty.dev/docs/plugins/navigation/)) in your front matter to add a template to the top level site navigation. This is in use on `content/index.njk` and `content/about/index.md`.
- Content can be in _any template format_ (blog posts needn’t exclusively be markdown, for example). Configure your project’s supported templates in `eleventy.config.js` -> `templateFormats`.
- The `public` folder in your input directory will be copied to the output folder (via `addPassthroughCopy` in the `eleventy.config.js` file). This means `./public/css/*` will live at `./_site/css/*` after your build completes.
- This project uses three [Eleventy Layouts](https://www.11ty.dev/docs/layouts/):
  - `_includes/layouts/base.njk`: the top level HTML structure
  - `_includes/layouts/home.njk`: the home page template (wrapped into `base.njk`)
  - `_includes/layouts/post.njk`: the blog post template (wrapped into `base.njk`)
- `_includes/postslist.njk` is a Nunjucks include and is a reusable component used to display a list of all the posts. `content/index.njk` has an example of how to use it.

#### Content Security Policy

If your site enforces a [Content Security Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP) (as public-facing sites should), you have a few choices (pick one):

1. In `base.njk`, remove `<style>{% getBundle "css" %}</style>` and uncomment `<link rel="stylesheet" href="{% getBundleFileUrl "css" %}">`
2. Configure the server with the CSP directive `style-src: 'unsafe-inline'` (less secure).
