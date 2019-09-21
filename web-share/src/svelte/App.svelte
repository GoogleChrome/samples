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
	import Image from './Image.svelte';

	async function getImageUrls() {
		const cache = await caches.open('images');
		const cachedRequests = await cache.keys();
		return cachedRequests.map(request => request.url).reverse();
	}
	const imageUrlsPromise = getImageUrls();
</script>

<style>
	div {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
	}
</style>

<h1>Scrapbook PWA</h1>
{#await imageUrlsPromise then imageUrls}
	{#if imageUrls.length > 0}
		<div>
			{#each imageUrls as src}
				<Image {src}/>
			{/each}
		</div>
	{:else}
		<p>You don't have any saved images.</p>
		<ol>
			<li>Please <a href="https://developers.google.com/web/fundamentals/app-install-banners/">add</a> this web app to your homescreen on Android, using Chrome 76+.</li>
			<li>Find an image in an another app (like Google Photos) and share it.</li>
			<li>Choose "Scrapbook PWA" as the share destination.</li>
		</ol>
	{/if}
{/await}
