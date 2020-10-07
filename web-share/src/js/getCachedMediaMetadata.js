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

import {cacheName} from './constants';

async function _getCachedMediaMetadata() {
  const cache = await caches.open(cacheName);
  const requests = await cache.keys();
  return Promise.all(requests.reverse().map(async (request) => {
    const response = await cache.match(request);
    const responseBlob = await response.blob();
    const size = responseBlob.size;

    return {
      size,
      contentType: response.headers.get('content-type'),
      src: request.url,
    };
  }));
}
export const cachedMediaMetadataPromise = _getCachedMediaMetadata();

export async function getCachedMediaMetadata(contentTypePrefix) {
  const cachedMetadata = await cachedMediaMetadataPromise;
  return cachedMetadata.filter((metadata) =>  metadata.contentType.startsWith(contentTypePrefix));
}

export async function getCachedMediaMetadataForURL(url) {
  const cachedMetadata = await cachedMediaMetadataPromise;
  return cachedMetadata.find((metadata) => metadata.src === url);
}

