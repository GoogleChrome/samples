# liquidjs
[![npm version](https://img.shields.io/npm/v/liquidjs.svg?logo=npm&style=flat-square)](https://www.npmjs.org/package/liquidjs)
[![npm downloads](https://img.shields.io/npm/dm/liquidjs.svg?style=flat-square)](https://www.npmjs.org/package/liquidjs)
[![Coverage](https://img.shields.io/coveralls/harttle/liquidjs.svg?style=flat-square)](https://coveralls.io/github/harttle/liquidjs?branch=master)
[![Build Status](https://img.shields.io/github/actions/workflow/status/harttle/liquidjs/ci-build.yml?branch=master&style=flat-square)](https://github.com/harttle/liquidjs/actions/workflows/ci-build.yml?query=branch%3Amaster)
[![DUB license](https://img.shields.io/dub/l/vibe-d.svg?style=flat-square)](https://github.com/harttle/liquidjs/blob/master/LICENSE)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg?style=flat-square)](https://github.com/harttle/liquidjs)

A simple, expressive and safe [Shopify][shopify/liquid] / GitHub Pages compatible template engine in pure JavaScript.
**The purpose of this repo** is to provide a standard Liquid implementation for the JavaScript community so that [Jekyll sites](https://jekyllrb.com), [GitHub Pages](https://pages.github.com/) and [Shopify templates](https://themes.shopify.com/) can be ported to Node.js without pain.

* [Documentation][doc]
* Please star [LiquidJS on GitHub][github]!
* Financial support via [GitHub Sponsors](https://github.com/sponsors/harttle).

<p align="center"><a href="https://liquidjs.com"><img height="155px" width="155px" src="https://liquidjs.com/icon/mstile-310x310.png" alt="logo"></a></p>

## What's it like?

Basically there're two types of Liquid syntax: tags enclosed by `{% %}` and outputs enclosed by `{{ }}`. A Liquid template looks like:

```liquid
{% if username %}
  {{ username | append: ", welcome to LiquidJS!" | capitalize }}
{% endif %}
```

[A live demo](https://liquidjs.com/playground.html) is also available and here's a [quick tutorial](https://liquidjs.com/tutorials/intro-to-liquid.html) for Liquid syntax.


## Installation

Install from npm in Node.js:

```bash
npm install liquidjs
```

Or use the UMD bundle from jsDelivr:

```html
<script src="https://cdn.jsdelivr.net/npm/liquidjs/dist/liquid.browser.min.js"></script>
```

Or render directly from CLI using npx:

```bash
npx liquidjs --template 'Hello, {{ name }}!' --context '{"name": "Snake"}'
```

For more details, refer to the [Setup Guide][setup].

## Who's Using LiquidJS?

- [Eleventy](https://www.11ty.dev/): Eleventy, a simpler static site generator.
- [Github Docs](https://github.com/github/docs): The open-source repo for docs.github.com.
- [Opensense](https://www.opensense.com/): The smarter way to send email.
- [Directus](https://docs.directus.io/): an instant REST+GraphQL API and intuitive no-code data collaboration app for any SQL database.
- [Semgrep](https://github.com/returntocorp/semgrep): Lightweight static analysis for many languages.
- [Rock](https://www.rockrms.com/): An open source CMS, Relationship Management System (RMS) and Church Management System (ChMS) all rolled into one.
- [Mitosis](https://github.com/BuilderIO/mitosis): Write components once, run everywhere. Compiles to React, Vue, Qwik, Solid, Angular, Svelte, and more.
- [Pattern Lab](https://patternlab.io/): a frontend workshop environment that helps you build, view, test, and showcase your design system's UI components.
- [Builder.io](https://www.builder.io/m/developers): the first and only headless CMS with a visual editor that lets you drag and drop with your components, directly within your current site or app. Completely API-driven, for cleaner code and simpler workflows.
- [Microsoft Power Pages](https://learn.microsoft.com/en-us/power-pages/introduction): a secure, enterprise-grade, low-code software as a service (SaaS) platform for creating, hosting, and administering modern external-facing business websites.
- [Azure API Management developer portal](https://learn.microsoft.com/en-us/azure/api-management/api-management-howto-developer-portal): an automatically generated, fully customizable website with the documentation of your APIs.
- [WISMOlabs](https://wismolabs.com/): Post Purchase Experience platform for eCommerce retailers enhancing customer satisfaction by using LiquidJS to provide customizable post-purchase experiences through programmable email, SMS, order tracking pages, and webhooks.

Feel free to create a PR or contact me to add your use case into this list!

## Financial Support

If you personally love LiquidJS or it's benefiting your business, please consider financially support us via [GitHub Sponsors](https://github.com/sponsors/harttle). Special thanks to our sponsors!

<!-- FINANCIAL-CONTRIBUTORS-BEGIN -->
<p align="center" style="line-height: 2.5;">
  <a href="https://www.11ty.dev/" style="display: inline-block; vertical-align: middle; margin: 8px;"><img src="https://avatars.githubusercontent.com/u/35147177?v=4&s=100" height="80" style="vertical-align: middle;" alt="Eleventy" title="Eleventy"/></a>
  <a href="https://www.opensense.com/" style="display: inline-block; vertical-align: middle; margin: 8px;"><img src="https://images.opencollective.com/opensense-inc/bf840ae/logo/256.png?height=100" height="80" style="vertical-align: middle;" alt="Opensense Inc." title="Opensense"/></a>
  <a href="https://github.com/microsoft" style="display: inline-block; vertical-align: middle; margin: 8px;"><img src="https://avatars.githubusercontent.com/u/6154722?v=4&s=100" height="80" style="vertical-align: middle;" alt="Microsoft" title="Microsoft"/></a>
  <a href="https://sentry.io/" style="display: inline-block; vertical-align: middle; margin: 8px;"><img src="https://avatars.githubusercontent.com/u/1396951?v=4&s=100" height="80" style="vertical-align: middle;" alt="Sentry" title="Sentry"/></a>
  <a href="https://www.checkoutblocks.com/" style="display: inline-block; vertical-align: middle; margin: 8px;"><img src="https://avatars.githubusercontent.com/u/114603307?v=4&s=100" height="80" style="vertical-align: middle;" alt="Checkout Blocks" title="Checkout Blocks"/></a>
  <a href="https://customer.io/" style="display: inline-block; vertical-align: middle; margin: 8px;"><img src="https://avatars.githubusercontent.com/u/1152079?v=4&s=100" height="80" style="vertical-align: middle;" alt="Customer IO" title="Customer IO"/></a>
  <a href="https://syntax.fm/" style="display: inline-block; vertical-align: middle; margin: 8px;"><img src="https://avatars.githubusercontent.com/u/130389858?v=4&s=100" height="80" style="vertical-align: middle;" alt="Syntax Podcast" title="Syntax Podcast"/></a>
  <br/>
  <a href="https://www.testmuai.com/?utm_medium=sponsor&utm_source=liquidjs" style="display: inline-block; vertical-align: middle; margin: 8px;"><img src="https://avatars.githubusercontent.com/u/27130435?s=200&v=4" width="80" style="vertical-align: middle;" alt="TestMu AI" title="TestMu AI"/></a>
  <a href="https://chudovo.com/" style="display: inline-block; vertical-align: middle; margin: 8px;"><img src="https://images.opencollective.com/Chudovo/avatar/256.png?height=100" width="160" style="vertical-align: middle;background: white;padding: 8px 16px;" alt="Chudovo" title="Chudovo"/></a>
  <a href="https://dailycontributors.com/" style="display: inline-block; vertical-align: middle; margin: 8px;"><img src="https://images.opencollective.com/dailycontributors/3c2e057/logo/256.png?height=50&width=100" width="120" style="vertical-align: middle;" alt="Dailycontributors" title="Dailycontributors"/></a>
  <a href="https://www.pakstyle.pk/" style="display: inline-block; vertical-align: middle; margin: 8px;"><img src="https://images.opencollective.com/pakstyle/2b81605/logo/256.png?height=100" height="80" style="vertical-align: middle;" alt="PakStyle.pk" title="PakStyle.pk"/></a>
  <a href="https://www.escorta.com/" style="display: inline-block; vertical-align: middle; margin: 8px;"><img src="https://images.opencollective.com/escortacom/avatar/256.png?height=100" height="45" style="vertical-align: middle;" alt="EscortA.com" title="EscortA.com"/></a>
  <br/>
  <a href="https://opencollective.com/touchless" style="display: inline-block; vertical-align: middle; margin: 8px;"><img src="https://images.opencollective.com/touchless/273bc74/logo/256.png?height=100" height="80" style="vertical-align: middle;" alt="Touchless" title="Touchless"/></a>
  <a href="https://www.dropkiq.com/" style="display: inline-block; vertical-align: middle; margin: 8px;"><img src="https://images.opencollective.com/1bertlol/43a8ea8/logo/256.png?height=100" height="80" style="vertical-align: middle;" alt="Dropkiq" title="Dropkiq"/></a>
  <a href="https://about.me/peterdehaan" style="display: inline-block; vertical-align: middle; margin: 8px;"><img src="https://avatars2.githubusercontent.com/u/557895?v=4&s=100" height="80" style="vertical-align: middle;" alt="Peter deHaan" title="Peter deHaan"/></a>
  <a href="https://github.com/coni2k" style="display: inline-block; vertical-align: middle; margin: 8px;"><img src="https://avatars0.githubusercontent.com/u/1284601?v=4&s=100" height="80" style="vertical-align: middle;" alt="Serkan Holat" title="Serkan Holat"/></a>
  <a href="https://github.com/amit777" style="display: inline-block; vertical-align: middle; margin: 8px;"><img src="https://avatars0.githubusercontent.com/u/2703309?v=4&s=100" height="80" style="vertical-align: middle;" alt="amit777" title="amit777"/></a>
  <a href="https://opencollective.com/khaled-salem" style="display: inline-block; vertical-align: middle; margin: 8px;"><img src="https://images.opencollective.com/khaled-salem/avatar/256.png?height=256" height="80" style="vertical-align: middle;" alt="Khaled Salem" title="Khaled Salem"/></a>
  <a href="https://github.com/15fathoms" style="display: inline-block; vertical-align: middle; margin: 8px;"><img src="https://avatars.githubusercontent.com/u/79156039?v=4&s=100" height="80" style="vertical-align: middle;" alt="Emmanuel Cartelli" title="Emmanuel Cartelli"/></a>
  <a href="https://opencollective.com/cartelli-emmanuel" style="display: inline-block; vertical-align: middle; margin: 8px;"><img src="https://images.opencollective.com/cartelli-emmanuel/avatar/256.png?height=100" height="80" style="vertical-align: middle;" alt="Cartelli Emmanuel" title="Cartelli Emmanuel"/></a>
</p>
<!-- FINANCIAL-CONTRIBUTORS-END -->

## Contributors ✨

Want to contribute? see [Contribution Guidelines][contribution]. Thanks goes to these wonderful people:

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tbody>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="https://harttle.land"><img src="https://avatars3.githubusercontent.com/u/4427974?v=4?s=100" width="100px;" alt="Jun Yang"/><br /><sub><b>Jun Yang</b></sub></a><br /><a href="#maintenance-harttle" title="Maintenance">🚧</a> <a href="https://github.com/harttle/liquidjs/commits?author=harttle" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/chenos"><img src="https://avatars0.githubusercontent.com/u/2993310?v=4?s=100" width="100px;" alt="chenos"/><br /><sub><b>chenos</b></sub></a><br /><a href="https://github.com/harttle/liquidjs/commits?author=chenos" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://zachleat.com/"><img src="https://avatars2.githubusercontent.com/u/39355?v=4?s=100" width="100px;" alt="Zach Leatherman"/><br /><sub><b>Zach Leatherman</b></sub></a><br /><a href="https://github.com/harttle/liquidjs/issues?q=author%3Azachleat" title="Bug reports">🐛</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/thardy"><img src="https://avatars3.githubusercontent.com/u/120636?v=4?s=100" width="100px;" alt="Tim Hardy"/><br /><sub><b>Tim Hardy</b></sub></a><br /><a href="https://github.com/harttle/liquidjs/commits?author=thardy" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://paulrobertlloyd.com/"><img src="https://avatars3.githubusercontent.com/u/813383?v=4?s=100" width="100px;" alt="Paul Robert Lloyd"/><br /><sub><b>Paul Robert Lloyd</b></sub></a><br /><a href="https://github.com/harttle/liquidjs/commits?author=paulrobertlloyd" title="Code">💻</a> <a href="https://github.com/harttle/liquidjs/issues?q=author%3Apaulrobertlloyd" title="Bug reports">🐛</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://twitter.com/alecdotbiz"><img src="https://avatars2.githubusercontent.com/u/1925840?v=4?s=100" width="100px;" alt="Alec Larson"/><br /><sub><b>Alec Larson</b></sub></a><br /><a href="https://github.com/harttle/liquidjs/commits?author=aleclarson" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/pmalouin"><img src="https://avatars1.githubusercontent.com/u/1411117?v=4?s=100" width="100px;" alt="Patrick Malouin"/><br /><sub><b>Patrick Malouin</b></sub></a><br /><a href="https://github.com/harttle/liquidjs/commits?author=pmalouin" title="Code">💻</a> <a href="https://github.com/harttle/liquidjs/commits?author=pmalouin" title="Documentation">📖</a></td>
    </tr>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="https://jaswrks.com"><img src="https://avatars3.githubusercontent.com/u/1563559?v=4?s=100" width="100px;" alt="jaswrks"/><br /><sub><b>jaswrks</b></sub></a><br /><a href="https://github.com/harttle/liquidjs/commits?author=jaswrks" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://oott123.com"><img src="https://avatars2.githubusercontent.com/u/905663?v=4?s=100" width="100px;" alt="三三"/><br /><sub><b>三三</b></sub></a><br /><a href="https://github.com/harttle/liquidjs/commits?author=oott123" title="Code">💻</a> <a href="#ideas-oott123" title="Ideas, Planning, & Feedback">🤔</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/ssendev"><img src="https://avatars0.githubusercontent.com/u/450793?v=4?s=100" width="100px;" alt="ssendev"/><br /><sub><b>ssendev</b></sub></a><br /><a href="https://github.com/harttle/liquidjs/commits?author=ssendev" title="Code">💻</a> <a href="https://github.com/harttle/liquidjs/commits?author=ssendev" title="Documentation">📖</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/wojtask9"><img src="https://avatars3.githubusercontent.com/u/6099236?v=4?s=100" width="100px;" alt="wojtask9"/><br /><sub><b>wojtask9</b></sub></a><br /><a href="https://github.com/harttle/liquidjs/commits?author=wojtask9" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/thelornenelson"><img src="https://avatars3.githubusercontent.com/u/24596583?v=4?s=100" width="100px;" alt="Andrew Barclay"/><br /><sub><b>Andrew Barclay</b></sub></a><br /><a href="https://github.com/harttle/liquidjs/commits?author=thelornenelson" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://www.stam.pr/"><img src="https://avatars2.githubusercontent.com/u/142338?v=4?s=100" width="100px;" alt="Cory Mawhorter"/><br /><sub><b>Cory Mawhorter</b></sub></a><br /><a href="https://github.com/harttle/liquidjs/commits?author=cmawhorter" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/thehappybug"><img src="https://avatars0.githubusercontent.com/u/3393530?v=4?s=100" width="100px;" alt="Mehdi Jaffery"/><br /><sub><b>Mehdi Jaffery</b></sub></a><br /><a href="https://github.com/harttle/liquidjs/commits?author=thehappybug" title="Code">💻</a></td>
    </tr>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/robinbijlani"><img src="https://avatars0.githubusercontent.com/u/2503108?v=4?s=100" width="100px;" alt="Robin Bijlani"/><br /><sub><b>Robin Bijlani</b></sub></a><br /><a href="https://github.com/harttle/liquidjs/commits?author=robinbijlani" title="Code">💻</a> <a href="https://github.com/harttle/liquidjs/issues?q=author%3Arobinbijlani" title="Bug reports">🐛</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://www.rmkennedy.com"><img src="https://avatars3.githubusercontent.com/u/8356669?v=4?s=100" width="100px;" alt="Ryan Kennedy"/><br /><sub><b>Ryan Kennedy</b></sub></a><br /><a href="https://github.com/harttle/liquidjs/commits?author=ryaninvents" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/strax"><img src="https://avatars2.githubusercontent.com/u/587213?v=4?s=100" width="100px;" alt="Sami Kukkonen"/><br /><sub><b>Sami Kukkonen</b></sub></a><br /><a href="https://github.com/harttle/liquidjs/commits?author=strax" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://ScottFreeCode.github.io/"><img src="https://avatars3.githubusercontent.com/u/16506071?v=4?s=100" width="100px;" alt="Scott Santucci"/><br /><sub><b>Scott Santucci</b></sub></a><br /><a href="https://github.com/harttle/liquidjs/commits?author=ScottFreeCode" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="http://stevenrescigno.com"><img src="https://avatars3.githubusercontent.com/u/8505293?v=4?s=100" width="100px;" alt="Steven "/><br /><sub><b>Steven </b></sub></a><br /><a href="#example-stevenanthonyrevo" title="Examples">💡</a> <a href="https://github.com/harttle/liquidjs/commits?author=stevenanthonyrevo" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://efcl.info/"><img src="https://avatars1.githubusercontent.com/u/19714?v=4?s=100" width="100px;" alt="azu"/><br /><sub><b>azu</b></sub></a><br /><a href="https://github.com/harttle/liquidjs/commits?author=azu" title="Documentation">📖</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/wyozi"><img src="https://avatars3.githubusercontent.com/u/4894573?v=4?s=100" width="100px;" alt="Joonas"/><br /><sub><b>Joonas</b></sub></a><br /><a href="https://github.com/harttle/liquidjs/commits?author=wyozi" title="Code">💻</a></td>
    </tr>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/jamelait"><img src="https://avatars1.githubusercontent.com/u/14369255?v=4?s=100" width="100px;" alt="Jamel A."/><br /><sub><b>Jamel A.</b></sub></a><br /><a href="https://github.com/harttle/liquidjs/commits?author=jamelait" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://brandonpittman.net"><img src="https://avatars0.githubusercontent.com/u/967145?v=4?s=100" width="100px;" alt="Brandon Pittman"/><br /><sub><b>Brandon Pittman</b></sub></a><br /><a href="https://github.com/harttle/liquidjs/commits?author=brandonpittman" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/tgrandgent"><img src="https://avatars3.githubusercontent.com/u/17069042?v=4?s=100" width="100px;" alt="tgrandgent"/><br /><sub><b>tgrandgent</b></sub></a><br /><a href="https://github.com/harttle/liquidjs/commits?author=tgrandgent" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/mastodon0"><img src="https://avatars1.githubusercontent.com/u/7924332?v=4?s=100" width="100px;" alt="Martin Schuster"/><br /><sub><b>Martin Schuster</b></sub></a><br /><a href="https://github.com/harttle/liquidjs/commits?author=mastodon0" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="http://js.chenlei.me"><img src="https://avatars0.githubusercontent.com/u/6339390?v=4?s=100" width="100px;" alt="Ray"/><br /><sub><b>Ray</b></sub></a><br /><a href="https://github.com/harttle/liquidjs/commits?author=richardo2016" title="Tests">⚠️</a> <a href="https://github.com/harttle/liquidjs/commits?author=richardo2016" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/CriGoT"><img src="https://avatars0.githubusercontent.com/u/1936786?v=4?s=100" width="100px;" alt="Cristofer Gonzales"/><br /><sub><b>Cristofer Gonzales</b></sub></a><br /><a href="https://github.com/harttle/liquidjs/commits?author=CriGoT" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://www.raymondcamden.com"><img src="https://avatars3.githubusercontent.com/u/393660?v=4?s=100" width="100px;" alt="Raymond Camden"/><br /><sub><b>Raymond Camden</b></sub></a><br /><a href="https://github.com/harttle/liquidjs/commits?author=cfjedimaster" title="Documentation">📖</a></td>
    </tr>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="https://stedman.dev"><img src="https://avatars1.githubusercontent.com/u/183122?v=4?s=100" width="100px;" alt="Steve Stedman"/><br /><sub><b>Steve Stedman</b></sub></a><br /><a href="https://github.com/harttle/liquidjs/commits?author=stedman" title="Documentation">📖</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://ciccarello.me"><img src="https://avatars0.githubusercontent.com/u/11273838?v=4?s=100" width="100px;" alt="Anthony Ciccarello"/><br /><sub><b>Anthony Ciccarello</b></sub></a><br /><a href="https://github.com/harttle/liquidjs/commits?author=aciccarello" title="Documentation">📖</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://twitter.com/IAmTrySound"><img src="https://avatars0.githubusercontent.com/u/5635476?v=4?s=100" width="100px;" alt="Bogdan Chadkin"/><br /><sub><b>Bogdan Chadkin</b></sub></a><br /><a href="https://github.com/harttle/liquidjs/commits?author=TrySound" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://hightouch.io"><img src="https://avatars0.githubusercontent.com/u/5959235?v=4?s=100" width="100px;" alt="Tejas Manohar"/><br /><sub><b>Tejas Manohar</b></sub></a><br /><a href="https://github.com/harttle/liquidjs/commits?author=tejasmanohar" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="http://about.me/peterdehaan"><img src="https://avatars2.githubusercontent.com/u/557895?v=4?s=100" width="100px;" alt="Peter deHaan"/><br /><sub><b>Peter deHaan</b></sub></a><br /><a href="https://github.com/harttle/liquidjs/commits?author=pdehaan" title="Documentation">📖</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/amit777"><img src="https://avatars0.githubusercontent.com/u/2703309?v=4?s=100" width="100px;" alt="amit777"/><br /><sub><b>amit777</b></sub></a><br /><a href="https://github.com/harttle/liquidjs/commits?author=amit777" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="http://www.ifi.uzh.ch/en/ce/people/schuldenzucker.html"><img src="https://avatars3.githubusercontent.com/u/1100776?v=4?s=100" width="100px;" alt="Steffen Schuldenzucker"/><br /><sub><b>Steffen Schuldenzucker</b></sub></a><br /><a href="https://github.com/harttle/liquidjs/commits?author=sschuldenzucker" title="Code">💻</a></td>
    </tr>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/Pixcell"><img src="https://avatars0.githubusercontent.com/u/4005291?v=4?s=100" width="100px;" alt="Pixcell"/><br /><sub><b>Pixcell</b></sub></a><br /><a href="https://github.com/harttle/liquidjs/commits?author=Pixcell" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://jasonet.co"><img src="https://avatars.githubusercontent.com/u/10660468?v=4?s=100" width="100px;" alt="Jason Etcovitch"/><br /><sub><b>Jason Etcovitch</b></sub></a><br /><a href="https://github.com/harttle/liquidjs/commits?author=JasonEtco" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/kayuapi"><img src="https://avatars.githubusercontent.com/u/10304328?v=4?s=100" width="100px;" alt="ZC"/><br /><sub><b>ZC</b></sub></a><br /><a href="https://github.com/harttle/liquidjs/commits?author=kayuapi" title="Documentation">📖</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://memmie.lenglet.name"><img src="https://avatars.githubusercontent.com/u/729275?v=4?s=100" width="100px;" alt="Memmie Lenglet"/><br /><sub><b>Memmie Lenglet</b></sub></a><br /><a href="https://github.com/harttle/liquidjs/commits?author=mems" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/ilhamdev0"><img src="https://avatars.githubusercontent.com/u/57636145?v=4?s=100" width="100px;" alt="ilhamdev0"/><br /><sub><b>ilhamdev0</b></sub></a><br /><a href="https://github.com/harttle/liquidjs/commits?author=ilhamdev0" title="Documentation">📖</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/c412216887"><img src="https://avatars.githubusercontent.com/u/29691650?v=4?s=100" width="100px;" alt="一饮一啄皆是人生"/><br /><sub><b>一饮一啄皆是人生</b></sub></a><br /><a href="https://github.com/harttle/liquidjs/commits?author=c412216887" title="Documentation">📖</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://digitalinspiration.com/"><img src="https://avatars.githubusercontent.com/u/1344071?v=4?s=100" width="100px;" alt="Amit Agarwal"/><br /><sub><b>Amit Agarwal</b></sub></a><br /><a href="https://github.com/harttle/liquidjs/commits?author=labnol" title="Documentation">📖</a></td>
    </tr>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="https://n1ru4l.cloud/"><img src="https://avatars.githubusercontent.com/u/14338007?v=4?s=100" width="100px;" alt="Laurin Quast"/><br /><sub><b>Laurin Quast</b></sub></a><br /><a href="https://github.com/harttle/liquidjs/commits?author=n1ru4l" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/mattvague"><img src="https://avatars.githubusercontent.com/u/64985?v=4?s=100" width="100px;" alt="Matt Vague"/><br /><sub><b>Matt Vague</b></sub></a><br /><a href="https://github.com/harttle/liquidjs/commits?author=mattvague" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/bglw"><img src="https://avatars.githubusercontent.com/u/40188355?v=4?s=100" width="100px;" alt="Liam Bigelow"/><br /><sub><b>Liam Bigelow</b></sub></a><br /><a href="https://github.com/harttle/liquidjs/commits?author=bglw" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://about.me/jasonkurian"><img src="https://avatars.githubusercontent.com/u/2642545?v=4?s=100" width="100px;" alt="Jason Kurian"/><br /><sub><b>Jason Kurian</b></sub></a><br /><a href="https://github.com/harttle/liquidjs/commits?author=JaKXz" title="Documentation">📖</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/dphm"><img src="https://avatars.githubusercontent.com/u/1707217?v=4?s=100" width="100px;" alt="d pham (they/them)"/><br /><sub><b>d pham (they/them)</b></sub></a><br /><a href="https://github.com/harttle/liquidjs/commits?author=dphm" title="Documentation">📖</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://www.aleksandrhovhannisyan.com/"><img src="https://avatars.githubusercontent.com/u/19352442?v=4?s=100" width="100px;" alt="Aleksandr Hovhannisyan"/><br /><sub><b>Aleksandr Hovhannisyan</b></sub></a><br /><a href="https://github.com/harttle/liquidjs/commits?author=AleksandrHovhannisyan" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/jg-rp"><img src="https://avatars.githubusercontent.com/u/72664870?v=4?s=100" width="100px;" alt="jg-rp"/><br /><sub><b>jg-rp</b></sub></a><br /><a href="https://github.com/harttle/liquidjs/commits?author=jg-rp" title="Code">💻</a></td>
    </tr>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/ameyaapte1"><img src="https://avatars.githubusercontent.com/u/16054747?v=4?s=100" width="100px;" alt="Ameya Apte"/><br /><sub><b>Ameya Apte</b></sub></a><br /><a href="https://github.com/harttle/liquidjs/commits?author=ameyaapte1" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/tbdrz"><img src="https://avatars.githubusercontent.com/u/50599116?v=4?s=100" width="100px;" alt="tbdrz"/><br /><sub><b>tbdrz</b></sub></a><br /><a href="https://github.com/harttle/liquidjs/commits?author=tbdrz" title="Documentation">📖</a></td>
      <td align="center" valign="top" width="14.28%"><a href="http://santialbo.com"><img src="https://avatars.githubusercontent.com/u/1557563?v=4?s=100" width="100px;" alt="Santi Albo"/><br /><sub><b>Santi Albo</b></sub></a><br /><a href="https://github.com/harttle/liquidjs/commits?author=santialbo" title="Documentation">📖</a> <a href="https://github.com/harttle/liquidjs/commits?author=santialbo" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/YahangWu"><img src="https://avatars.githubusercontent.com/u/12295975?v=4?s=100" width="100px;" alt="Yahang Wu"/><br /><sub><b>Yahang Wu</b></sub></a><br /><a href="https://github.com/harttle/liquidjs/commits?author=YahangWu" title="Documentation">📖</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/hongl-1"><img src="https://avatars.githubusercontent.com/u/101576612?v=4?s=100" width="100px;" alt="hongl"/><br /><sub><b>hongl</b></sub></a><br /><a href="https://github.com/harttle/liquidjs/commits?author=hongl-1" title="Documentation">📖</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/zxx-457"><img src="https://avatars.githubusercontent.com/u/114141362?v=4?s=100" width="100px;" alt="zxx-457"/><br /><sub><b>zxx-457</b></sub></a><br /><a href="https://github.com/harttle/liquidjs/commits?author=zxx-457" title="Documentation">📖</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/prassie"><img src="https://avatars.githubusercontent.com/u/1357831?v=4?s=100" width="100px;" alt="prassie"/><br /><sub><b>prassie</b></sub></a><br /><a href="https://github.com/harttle/liquidjs/commits?author=prassie" title="Documentation">📖</a></td>
    </tr>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="http://slavv.com/"><img src="https://avatars.githubusercontent.com/u/713329?v=4?s=100" width="100px;" alt="Slav Ivanov"/><br /><sub><b>Slav Ivanov</b></sub></a><br /><a href="https://github.com/harttle/liquidjs/commits?author=slavivanov" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="http://www.orgflow.io/"><img src="https://avatars.githubusercontent.com/u/3889090?v=4?s=100" width="100px;" alt="Daniel Rosenberg"/><br /><sub><b>Daniel Rosenberg</b></sub></a><br /><a href="https://github.com/harttle/liquidjs/commits?author=DaRosenberg" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/bobgubko"><img src="https://avatars.githubusercontent.com/u/733312?v=4?s=100" width="100px;" alt="bobgubko"/><br /><sub><b>bobgubko</b></sub></a><br /><a href="https://github.com/harttle/liquidjs/commits?author=bobgubko" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/bangank36"><img src="https://avatars.githubusercontent.com/u/10071857?v=4?s=100" width="100px;" alt="BaNgan"/><br /><sub><b>BaNgan</b></sub></a><br /><a href="https://github.com/harttle/liquidjs/commits?author=bangank36" title="Documentation">📖</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/mahyar-pasarzangene"><img src="https://avatars.githubusercontent.com/u/16485039?v=4?s=100" width="100px;" alt="Mahyar Pasarzangene"/><br /><sub><b>Mahyar Pasarzangene</b></sub></a><br /><a href="https://github.com/harttle/liquidjs/commits?author=mahyar-pasarzangene" title="Documentation">📖</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://hubelbauer.net/"><img src="https://avatars.githubusercontent.com/u/6831144?v=4?s=100" width="100px;" alt="Tomáš Hübelbauer"/><br /><sub><b>Tomáš Hübelbauer</b></sub></a><br /><a href="https://github.com/harttle/liquidjs/commits?author=TomasHubelbauer" title="Code">💻</a> <a href="https://github.com/harttle/liquidjs/commits?author=TomasHubelbauer" title="Documentation">📖</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://sixtwothree.org"><img src="https://avatars.githubusercontent.com/u/73866?v=4?s=100" width="100px;" alt="Jason Garber"/><br /><sub><b>Jason Garber</b></sub></a><br /><a href="https://github.com/harttle/liquidjs/commits?author=jgarber623" title="Code">💻</a></td>
    </tr>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="http://nickreilingh.com/"><img src="https://avatars.githubusercontent.com/u/2458645?v=4?s=100" width="100px;" alt="Nick Reilingh"/><br /><sub><b>Nick Reilingh</b></sub></a><br /><a href="https://github.com/harttle/liquidjs/commits?author=NReilingh" title="Documentation">📖</a></td>
      <td align="center" valign="top" width="14.28%"><a href="http://ebobby.org"><img src="https://avatars.githubusercontent.com/u/170356?v=4?s=100" width="100px;" alt="Francisco Soto"/><br /><sub><b>Francisco Soto</b></sub></a><br /><a href="https://github.com/harttle/liquidjs/commits?author=ebobby" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://www.davidlj95.com"><img src="https://avatars.githubusercontent.com/u/8050648?v=4?s=100" width="100px;" alt="David LJ"/><br /><sub><b>David LJ</b></sub></a><br /><a href="https://github.com/harttle/liquidjs/commits?author=davidlj95" title="Documentation">📖</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/RasmusWL"><img src="https://avatars.githubusercontent.com/u/1054041?v=4?s=100" width="100px;" alt="Rasmus Wriedt Larsen"/><br /><sub><b>Rasmus Wriedt Larsen</b></sub></a><br /><a href="https://github.com/harttle/liquidjs/commits?author=RasmusWL" title="Documentation">📖</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/brunodccarvalho"><img src="https://avatars.githubusercontent.com/u/24962950?v=4?s=100" width="100px;" alt="Bruno Carvalho"/><br /><sub><b>Bruno Carvalho</b></sub></a><br /><a href="https://github.com/harttle/liquidjs/commits?author=brunodccarvalho" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/fupengl"><img src="https://avatars.githubusercontent.com/u/20211964?v=4?s=100" width="100px;" alt="傅鹏"/><br /><sub><b>傅鹏</b></sub></a><br /><a href="https://github.com/harttle/liquidjs/commits?author=fupengl" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/joel-hamilton"><img src="https://avatars.githubusercontent.com/u/12899024?v=4?s=100" width="100px;" alt="Joel Hamilton"/><br /><sub><b>Joel Hamilton</b></sub></a><br /><a href="https://github.com/harttle/liquidjs/commits?author=joel-hamilton" title="Code">💻</a></td>
    </tr>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/amedve"><img src="https://avatars.githubusercontent.com/u/23156422?v=4?s=100" width="100px;" alt="Max Medve"/><br /><sub><b>Max Medve</b></sub></a><br /><a href="https://github.com/harttle/liquidjs/commits?author=amedve" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://maizzle.com"><img src="https://avatars.githubusercontent.com/u/1656595?v=4?s=100" width="100px;" alt="Cosmin Popovici"/><br /><sub><b>Cosmin Popovici</b></sub></a><br /><a href="https://github.com/harttle/liquidjs/commits?author=cossssmin" title="Documentation">📖</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/admtnnr"><img src="https://avatars.githubusercontent.com/u/27502?v=4?s=100" width="100px;" alt="Adam Tanner"/><br /><sub><b>Adam Tanner</b></sub></a><br /><a href="https://github.com/harttle/liquidjs/commits?author=admtnnr" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/GuillermoCasalCaro"><img src="https://avatars.githubusercontent.com/u/18685581?v=4?s=100" width="100px;" alt="Guillermo Casal Caro"/><br /><sub><b>Guillermo Casal Caro</b></sub></a><br /><a href="https://github.com/harttle/liquidjs/commits?author=GuillermoCasalCaro" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/jsoref"><img src="https://avatars.githubusercontent.com/u/2119212?v=4?s=100" width="100px;" alt="Josh Soref"/><br /><sub><b>Josh Soref</b></sub></a><br /><a href="https://github.com/harttle/liquidjs/commits?author=jsoref" title="Documentation">📖</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://vrugtehagel.nl"><img src="https://avatars.githubusercontent.com/u/41021050?v=4?s=100" width="100px;" alt="Koen"/><br /><sub><b>Koen</b></sub></a><br /><a href="https://github.com/harttle/liquidjs/commits?author=vrugtehagel" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://neamar.fr"><img src="https://avatars.githubusercontent.com/u/536844?v=4?s=100" width="100px;" alt="Matthieu Bacconnier"/><br /><sub><b>Matthieu Bacconnier</b></sub></a><br /><a href="https://github.com/harttle/liquidjs/commits?author=Neamar" title="Documentation">📖</a></td>
    </tr>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="https://tovd.dev"><img src="https://avatars.githubusercontent.com/u/35376389?v=4?s=100" width="100px;" alt="Tim van Dam"/><br /><sub><b>Tim van Dam</b></sub></a><br /><a href="https://github.com/harttle/liquidjs/commits?author=timvandam" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/edh649"><img src="https://avatars.githubusercontent.com/u/527604?v=4?s=100" width="100px;" alt="Ed Hanton"/><br /><sub><b>Ed Hanton</b></sub></a><br /><a href="https://github.com/harttle/liquidjs/commits?author=edh649" title="Documentation">📖</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://gurdiga.com"><img src="https://avatars.githubusercontent.com/u/53922?v=4?s=100" width="100px;" alt="Vlad GURDIGA"/><br /><sub><b>Vlad GURDIGA</b></sub></a><br /><a href="https://github.com/harttle/liquidjs/commits?author=gurdiga" title="Documentation">📖</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://www.streakingman.com"><img src="https://avatars.githubusercontent.com/u/30397306?v=4?s=100" width="100px;" alt="裸奔狂甩丁丁"/><br /><sub><b>裸奔狂甩丁丁</b></sub></a><br /><a href="https://github.com/harttle/liquidjs/commits?author=StreakingMan" title="Documentation">📖</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/skynetigor"><img src="https://avatars.githubusercontent.com/u/20903171?v=4?s=100" width="100px;" alt="Ihor Panasiuk"/><br /><sub><b>Ihor Panasiuk</b></sub></a><br /><a href="https://github.com/harttle/liquidjs/commits?author=skynetigor" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/rosomri"><img src="https://avatars.githubusercontent.com/u/68001413?v=4?s=100" width="100px;" alt="Omri Rosner"/><br /><sub><b>Omri Rosner</b></sub></a><br /><a href="https://github.com/harttle/liquidjs/commits?author=rosomri" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/immerrr"><img src="https://avatars.githubusercontent.com/u/579798?v=4?s=100" width="100px;" alt="immerrr again"/><br /><sub><b>immerrr again</b></sub></a><br /><a href="https://github.com/harttle/liquidjs/commits?author=immerrr" title="Documentation">📖</a></td>
    </tr>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/rongjiecomputer"><img src="https://avatars.githubusercontent.com/u/13115060?v=4?s=100" width="100px;" alt="Loo Rong Jie"/><br /><sub><b>Loo Rong Jie</b></sub></a><br /><a href="https://github.com/harttle/liquidjs/commits?author=rongjiecomputer" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/MorielHarush"><img src="https://avatars.githubusercontent.com/u/93482738?v=4?s=100" width="100px;" alt="MorielHarush"/><br /><sub><b>MorielHarush</b></sub></a><br /><a href="https://github.com/harttle/liquidjs/commits?author=MorielHarush" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://doruk.ch"><img src="https://avatars.githubusercontent.com/u/77903714?v=4?s=100" width="100px;" alt="Peak Twilight"/><br /><sub><b>Peak Twilight</b></sub></a><br /><a href="https://github.com/harttle/liquidjs/commits?author=peaktwilight" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/joecottam"><img src="https://avatars.githubusercontent.com/u/44173086?v=4?s=100" width="100px;" alt="Joe Cottam"/><br /><sub><b>Joe Cottam</b></sub></a><br /><a href="https://github.com/harttle/liquidjs/commits?author=joecottam" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/timbze"><img src="https://avatars.githubusercontent.com/u/35117769?v=4?s=100" width="100px;" alt="Timmy Braun"/><br /><sub><b>Timmy Braun</b></sub></a><br /><a href="https://github.com/harttle/liquidjs/commits?author=timbze" title="Code">💻</a></td>
    </tr>
  </tbody>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

[shopify/liquid]: https://shopify.github.io/liquid/
[plugins]: https://liquidjs.com/tutorials/plugins.html#Plugin-List
[setup]: https://liquidjs.com/tutorials/setup.html
[doc]: https://liquidjs.com
[github]: https://github.com/harttle/liquidjs
[oc]: https://opencollective.com/liquidjs/
[contribution]: https://liquidjs.com/tutorials/contribution-guidelines.html
