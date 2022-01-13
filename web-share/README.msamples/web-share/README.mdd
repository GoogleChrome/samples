# Web Share Demo

**Try it out:** https://scrapbook-pwa.web.app/

This is a small [progressive web app](https://developers.google.com/web/progressive-web-apps/)
demo that shows off the use of three emerging web platform features:

- [Web Share Target API Level 2](https://developers.google.com/web/updates/2018/12/web-share-target),
for receiving incoming media files shared **by** other installed applications.

- [Web Share Level 2](https://developers.google.com/web/updates/2019/05/web-share-files),
for taking local media files and natively sharing them **to** other installed applications.

- [Content Indexing API](https://web.dev/content-indexing-api/),
for letting browsers know about offline-viewable content that's saved locally.

All media files are stored locally in the browser using the
[Cache Storage API](https://developers.google.com/web/fundamentals/instant-and-offline/web-storage/cache-api).
Media shared to this web app is _not_ backed up anywhere—please keep this in
mind before deleting something. Anything you'd like to keep should be shared to
a more permanent location.

## Requirements

To fully use this web app, you need a combination of browser and operating
system that supports the underlying APIs. As of Oct. 2019, that's limited to
Chrome on Android.

Before you can receive incoming media files via the Web Share Target API Level
2, you need to add the web app to your home screen. This will register it as a
share target with the operating system, and you'll start seeing it in the list
of available share targets when you attempt to share supported media from a
local application (e.g. a photo gallery).

## Technologies Used

- [Svelte](https://svelte.dev) powers the HTML generation.
[This template](https://github.com/sveltejs/template) was used as a starting point.

- [Workbox](https://developers.google.com/web/tools/workbox/) powers the
[service worker](workbox-config.js), allowing the web app to cache incoming
media files, and allowing it to work while offline.

- [Roman Nurik](https://twitter.com/romannurik)'s
[Android Asset Studio](https://romannurik.github.io/AndroidAssetStudio/)
was used to generate the icons.

## License

Copyright 2019 Google, Inc.

Licensed under the [Apache License, Version 2.0](LICENSE) (the "License");
you may not use this file except in compliance with the License. You may
obtain a copy of the License at

  http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
