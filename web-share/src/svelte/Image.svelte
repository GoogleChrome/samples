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
	export let src;
	export const canShare = 'canShare' in navigator;

	function handleView() {
		window.location.href = src;
	}

	async function handleDelete() {
		const cache = await caches.open('images');
		await cache.delete(src);
		window.location.reload();
	}

	async function handleShare() {
		const cache = await caches.open('images');
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
		background-color: #ecfcff;
		border: 1px solid #b2fcff;
		display: flex;
		flex-direction: column;
		margin: 8px;
		padding: 8px;
	}

	.buttons {
		align-self: center;
		display: flex;
		justify-content: space-evenly;
		margin-top: 8px;
		width: 100%;
	}

	img {
		height: auto;
		max-width: 100%;
	}
</style>

<div class="card">
	<img {src} alt="An image in the scrapbook.">
	<div class="buttons">
		<button on:click={handleView}>View</button>
		{#if canShare}
			<button on:click={handleShare}>Share</button>
		{/if}
		<button on:click={handleDelete}>Delete</button>
	</div>
</div>
