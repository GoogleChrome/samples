[![Build Status](https://travis-ci.org/GoogleChrome/samples.svg?branch=gh-pages)](https://travis-ci.org/GoogleChrome/samples)

Google Chrome Samples
===
Samples tied to new functionality in Google Chrome.

Each sample corresponds to an entry in https://www.chromestatus.com/features, and using that
interface is currently the best way to browse.

Contributing Samples
===
Please use [`SAMPLE_STARTING_POINT`](SAMPLE_STARTING_POINT) as a starting point.

While it's possible to simply create a standard set of HTML/JS/CSS files within the new directory,
you can take advantage of the [Jekyll](http://jekyllrb.com/)-based templating system to handle
most of the boilerplate. Any files that start with a [front matter](http://jekyllrb.com/docs/frontmatter/)
block will be templated, and any other files will be served verbatim.

If you're still unsure, two canonical samples that use templates are:
- [image-rendering-pixelated](image-rendering-pixelated/index.html)
- [report-validity](report-validity/index.html)

Follow the [Using Jekyll with Pages](https://help.github.com/articles/using-jekyll-with-pages/)
guide to mimic the production Jekyll environment during local development.

Once complete, please file a pull request against the `gh-pages` branch with your sample.
It's ideal when filing a pull request @-mention the relevant engineer who worked on adding the
feature into Chrome, to solicit their feedback and ensure that the sample properly describes
the functionality. The email address of the engineer who worked on a given feature can be found in
the corresponding https://www.chromestatus.com/features entry. If you're unsure of the GitHub
username corresponding to the engineer, an alternative is to email them a link to the pull request
and ask for feedback directly.

Style / Linting / CI
===
The samples ideally should follow the [Google JavaScript Style Guide](http://google.github.io/styleguide/javascriptguide.xml),
and that's enforced via [ESLint](), using the [`eslint-config-google`](https://github.com/google/eslint-config-google)
base configuration, with a few overrides as needed.

Linting can be performed via `npm run lint` (make sure to `npm install` first).

Various IDEs offer [real-time ESLint integration](http://eslint.org/docs/user-guide/integrations.html),
and using those integrations that can help avoid errors before anything gets
checked in.

[Travis CI](https://travis-ci.org/GoogleChrome/samples) is currently being used to verify that the
Jekyll build completes successfully and that linting passes without errors.
