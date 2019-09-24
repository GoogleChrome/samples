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

<script context="module">
  export const href = '/audio';
	export const svg = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"/><path d="M12 3v9.28c-.47-.17-.97-.28-1.5-.28C8.01 12 6 14.01 6 16.5S8.01 21 10.5 21c2.31 0 4.2-1.75 4.45-4H15V6h4V3h-7z"/></svg>';
  export const text = 'Audio';
	export const title = 'Listen to saved audio.';
</script>

<script>
	import {cacheName} from '../../js/constants';
	import {getCachedMediaMetadata} from '../../js/getCachedMediaMetadata';
  import Media from '../components/Media.svelte';

  const cachedMediaMetadataPromise = getCachedMediaMetadata('audio');
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
    <p>You don't have any saved audio.</p>
    <ol>
      <li><a href="https://developers.google.com/web/fundamentals/app-install-banners/">Add</a> this web app to your homescreen on Android, using Chrome 76+.</li>
      <li>Find a sound an another app and share it.</li>
      <li>Choose "Scrapbook PWA" as the share destination.</li>
    </ol>
  {/if}
{/await}
