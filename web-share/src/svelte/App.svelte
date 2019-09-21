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

{#await imageUrlsPromise then imageUrls}
	{#if imageUrls.length > 0}
		<div>
			{#each imageUrls as src}
				<Image {src}/>
			{/each}
		</div>
	{/if}
	{#if imageUrls.length === 0}
		<p>You don't have any saved images.</p>
		<ol>
			<li>Please <a href="https://developers.google.com/web/fundamentals/app-install-banners/">add</a> this web app to your homescreen on Android.</li>
			<li>Find an image in an another app (like Google Photos) and share it.</li>
			<li>Choose "Scrapbook PWA" as the share destination.</li>
		</ol>
	{/if}
{/await}
