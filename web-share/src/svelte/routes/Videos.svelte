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
  export const href = '/videos';
  export const mimePrefix = 'video/';
  export const mimeRoute = {href, mimePrefix};
  export const svg = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"/><path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/></svg>';
  export const text = 'Videos';
  export const title = 'View saved videos.';
</script>

<script>
  import {fade} from 'svelte/transition';

  import {fadeConfig} from '../../js/constants';
  import {getCachedMediaMetadata} from '../../js/getCachedMediaMetadata';
  import MediaList from '../components/MediaList.svelte';

  const cachedMediaMetadataPromise = getCachedMediaMetadata(mimePrefix);
</script>

<div in:fade={fadeConfig}>
  {#await cachedMediaMetadataPromise then cachedMediaMetadatas}
    <MediaList {cachedMediaMetadatas} typeOfMedia={text.toLowerCase()}/>
  {/await}
</div>

