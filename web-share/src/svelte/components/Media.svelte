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
  import prettyBytes from 'pretty-bytes'; 

  import Button from './Button.svelte';

  import {cacheName} from '../../js/constants';

  export let contentType = '';
  export let showButtons = true;
  export let showSize = false;
  export let size = 0;
  export let src = '';

  const canShare = 'canShare' in navigator;

  function handleView() {
    window.location.href = `#/view/${src}`;
  }

  async function handleDelete() {
    const cache = await caches.open(cacheName);
    await cache.delete(src);

    window.location.reload();
  }

  async function handleShare() {
    const cache = await caches.open(cacheName);
    const response = await cache.match(src);
    const blob = await response.blob();
    const file = new  File([blob], src, {
      type: response.headers.get('content-type'),
    });
    const files = [file];
    if (canShare && navigator.canShare({files})) {
      navigator.share({files});
    }
  }
</script>

<style>
  .card {
    background-color: var(--tertiary-color);
    border: 1px solid var(--secondary-color);
    border-radius: 2px;
    box-shadow: 1px 1px 1px var(--secondary-color);
    display: flex;
    flex-direction: column;
    margin: 16px;
    padding: 8px;
  }

  .buttons {
    align-self: center;
    display: flex;
    justify-content: space-evenly;
    margin-top: 8px;
    width: 100%;
  }

  .size {
    margin-top: 8px;
    text-align: right;
  }

  img, video {
    height: auto;
  }

  audio, img, video {
    max-width: 100%;
  }
</style>

<div class="card">
  {#if contentType.startsWith('image/')}
    <img {src} alt="An image in the scrapbook.">
  {:else if contentType.startsWith('video/')}
    <video {src} controls controlsList="nodownload" alt="A video in the scrapbook."></video>
  {:else if contentType.startsWith('audio/')}
    <audio {src} controls controlsList="nodownload" alt="A sound in the scrapbook."></audio>
  {:else}
    <p>Unable to display media with MIME type <code>{contentType}</code>.</p>
  {/if}
  {#if showButtons}
    <div class="buttons">
      <Button handleClick={handleView}>View</Button>
      {#if canShare}
        <Button handleClick={handleShare}>Share</Button>
      {/if}
      <Button handleClick={handleDelete}>Delete</Button>
    </div>
  {/if}
  {#if showSize}
    <div class="size">{prettyBytes(size)}</div>
  {/if}
</div>
