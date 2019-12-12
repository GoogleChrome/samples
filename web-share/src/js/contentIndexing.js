/**
 * Copyright 2019 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 **/

import {cachedMediaMetadataPromise} from './getCachedMediaMetadata';
import {iconSrcs} from './constants';

// This method syncs the currently cached media with the Content Indexing API
// (on browsers that support it). The Cache Storage is the source of truth.
export async function syncContentIndex(registration) {
  //  Bail early if the Content Indexing API isn't supported.
  if (!('index' in registration)) {
    return;
  }

  // Get a list of everything currently in the content index. The id of each
  // entry will match the media URLs that are stored in the cache.
  const allEntries = await registration.index.getAll();
  const idsInIndex = new Set(allEntries.map((entry) => entry.id));

  // Get a list of all cached media.
  const cachedMediaMetadata = await cachedMediaMetadataPromise;

  for (const metadata of cachedMediaMetadata) {
    if (idsInIndex.has(metadata.src)) {
      // If a given id/URL is in both the content index and currently in our
      // cache, remove it from the set.
      idsInIndex.delete(metadata.src);
    } else {
      // Otherwise, if the id/URL is cached but not currently in the index, add
      // it to the index.
      // category should end up being 'image', 'audio', or 'video'.
      const [category] = metadata.contentType.split('/');
      await registration.index.add({
        // Use the cached media URL as the id.
        id: metadata.src,
        // Our web app has a route for viewing a specific cached media URL.
        // Note that this needs to be the URL for a page that will display the
        // cached media; *not* the URL for the media itself.
        launchUrl: `/#/view/${metadata.src}`,
        // Use a generic title and description.
        title: `A saved ${category}`,
        description: 'Saved via the Scrapbook PWA.',
        icons: [{
          sizes: '192x192',
          // If the cached media item is an image, use it as the icon.
          // Otherwise, use a generic video or audio icon.
          src: category === 'image' ? metadata.src : iconSrcs[category],
          type: category === 'image' ? metadata.contentType : 'image/png',
        }],
        // 'article' isn't a great fit for images, but there's nothing better.
        // See https://github.com/rayankans/content-index/issues/7#issuecomment-561761805
        category: category === 'image' ? 'article' : category,
      });
    }
  }

  for (const idToRemove of idsInIndex) {
    // Finally, for all of the ids that are currently in the index but aren't
    // cached (i.e. all values that are still in the idsInIndex set), remove
    // them from the index.
    await registration.index.delete(idToRemove);
  }
}
