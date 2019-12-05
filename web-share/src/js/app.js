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

import App from '../svelte/App.svelte';
import {syncContentIndex} from './contentIndexing.js';

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    window.location.reload();
  });

  window.addEventListener('load', async () => {
    const registration = await navigator.serviceWorker.register('service-worker.js');

    // After the initial load, force a service worker update check each time
    // our web app is hidden and then brought back to the foreground.
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        registration.update();
      }
    });

    await syncContentIndex(registration);
  });
}

const app = new App({
  target: document.body,
});

export default app;
