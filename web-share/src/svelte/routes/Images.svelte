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
  export const href = '/images';
  export const mimePrefix = 'image/';
  export const mimeRoute = {href, mimePrefix};
  export const svg = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"/><path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/></svg>';
  export const text = 'Images';
  export const title = 'View saved images.';
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
