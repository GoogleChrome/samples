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

export async function syncContentIndex(registration) {
  if (!('index' in registration)) {
    return;
  }

  const allEntries = await registration.index.getAll();
  const idsInIndex = new Set(allEntries.map((entry) => entry.id));

  const cachedMediaMetadata = await cachedMediaMetadataPromise;

  for (const metadata of cachedMediaMetadata) {
    if (idsInIndex.has(metadata.src)) {
      idsInIndex.delete(metadata.src);
    } else {
      const [category] = metadata.contentType.split('/');
      await registration.index.add({
        id: metadata.src,
        launchUrl: `/#view/${metadata.src}`,
        title: `A saved ${category}`,
        description: 'Saved via the Scrapbook PWA.',
        icons: [{
          sizes: '192x192',
          src: category === 'image' ? metadata.src : iconSrcs[category],
          type: category === 'image' ? metadata.contentType : 'image/png',
        }],
        category: category === 'image' ? 'article' : category,
      });
    }
  }

  for (const idToRemove of idsInIndex) {
    await registration.index.delete(idToRemove);
  }
}
