<!--
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
-->
<script>
  import Router from 'svelte-spa-router'

  import {channelName} from '../js/constants';
  import * as audioRoute from './routes/Audio.svelte';
  import * as helpRoute from './routes/Help.svelte';
  import * as imagesRoute from './routes/Images.svelte';
  import * as videosRoute from './routes/Videos.svelte';
  import * as viewRoute from './routes/View.svelte';
  import Navbar from './components/Navbar.svelte';
  import Snackbar from './components/Snackbar.svelte';

  const orderedRoutes = [
    imagesRoute,
    videosRoute,
    audioRoute,
    helpRoute,
  ];

  let message = '';
  if ('BroadcastChannel' in window) {
    const brodcastChannel = new BroadcastChannel(channelName);
    brodcastChannel.addEventListener('message', (event) => message = event.data);
  };

  const routes = {};
  for (const route of orderedRoutes) {
    routes[route.href] = route.default;
  }
  // Explicitly add in the /view route, which isn't in the Navbar.
  routes[viewRoute.href] = viewRoute.default;
</script>

<style>
  #app {
    bottom: 0;
    display: flex;
    flex-direction: column;
    left: 0;
    position: fixed;
    right: 0;
    top: 0;
  }

  main {
    flex-grow: 1;
    padding: 0 16px 0 16px;
    overflow-y: auto;
  }
</style>

<div id="app">
  <main>
    <Router {routes}/>
    <Snackbar {message}/>
  </main>

  <footer>
    <Navbar buttons={orderedRoutes}/>
  </footer>
</div>

