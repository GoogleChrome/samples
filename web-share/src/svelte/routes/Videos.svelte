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
	import {cacheName} from '../../js/constants';
	import {getCachedMediaMetadata} from '../../js/getCachedMediaMetadata';
  import Media from '../components/Media.svelte';

  const cachedMediaMetadataPromise = getCachedMediaMetadata('video');
</script>

<style>
	div {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
	}
</style>

{#await cachedMediaMetadataPromise then cachedMediaMetadatas}
  {#if cachedMediaMetadatas.length > 0}
    <div>
      {#each cachedMediaMetadatas as metadata}
        <Media {...metadata}/>
      {/each}
    </div>
  {:else}
    <span>You don't have any saved videos.</span>
    <ol>
      <li><a href="https://developers.google.com/web/fundamentals/app-install-banners/">Add</a> this web app to your homescreen on Android, using Chrome 76+.</li>
      <li>Find a video in an another app (like Google Photos) and share it.</li>
      <li>Choose "Scrapbook PWA" as the share destination.</li>
    </ol>
  {/if}
{/await}
