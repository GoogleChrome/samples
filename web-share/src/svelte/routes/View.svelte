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
  export const href = '/view/*';
</script>

<script>
  import Media from '../components/Media.svelte';

  import {getCachedMediaMetadataForURL} from '../../js/getCachedMediaMetadata';

  // See https://github.com/ItalyPaleAle/svelte-spa-router#parameters-from-routes
  export let params = {};
  const metadataPromise = getCachedMediaMetadataForURL(params.wild);
</script>

{#await metadataPromise then metadata}
  {#if metadata}
    <Media {...metadata} showSize={true} showButtons={false}/>
  {:else}
    <p>Can't display cached media with URL <code>{params.wild}</code>.</p>
  {/if}
{/await}
