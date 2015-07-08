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
most of the boilerplate.

Follow the [Using Jekyll with Pages](https://help.github.com/articles/using-jekyll-with-pages/)
guide to mimic the production Jekyll environment during local development.

Once complete, please file a pull request against the `gh-pages` branch with your sample.
It's ideal when filing a pull request @-mention the relevant engineer who worked on adding the
feature into Chrome, to solicit their feedback and ensure that the sample properly describes
the functionality. The email address of the engineer who worked on a given feature can be found in
the corresponding https://www.chromestatus.com/features entry. If you're unsure of the GitHub
username corresponding to the engineer, an alternative is to email them a link to the pull request
and ask for feedback directly.
