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
though this is not automatically enforced. (See https://github.com/GoogleChrome/samples/issues/141)

It's recommended that all new samples pass the [`jshint`](http://jshint.com/install/) linting
process, using the customized [`.jshintrc`](.jshintrc) settings. To automate linting against
JavaScript in the Jekyll-ized HTML output, [`linter.rb`](linter.rb) can be used. Regular
contributors should set up a git pre-commit
[hook](https://git-scm.com/book/en/v2/Customizing-Git-Git-Hooks) to run [`linter.rb`](linter.rb)
against all files that are being committed, via `ln -s -f ../../linter.rb .git/hooks/pre-commit`

Various IDEs offer real-time JSHint integration (e.g. via
[SublimeLinter-jshint](https://github.com/SublimeLinter/SublimeLinter-jshint)) and using those
integrations that can help avoid errors before anything gets checked in.

[Travis CI](https://travis-ci.org/GoogleChrome/samples) is currently being used to verify that the
Jekyll build completes successfully, but doesn't currently lint/style check the full site.
Once the all the older files in the project have been updated to pass `linter.rb` cleanly, that will
be integrated into the Travis CI process.
