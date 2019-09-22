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
	import Media from './Media.svelte';
	import Navbar from './Navbar.svelte';
	import Snackbar from './Snackbar.svelte';

	import {cacheName, channelName} from '../js/constants';

	const icons = [{
		href: '#images',
		src: 'images/image.svg',
		text: 'Images',
		title: 'View saved images.',
	}, {
		href: '#videos',
		src: 'images/video.svg',
		text: 'Videos',
		title: 'View saved videos.',
	}, {
		href: '#audio',
		src: 'images/audio.svg',
		text: 'Audio',
		title: 'View saved videos.',
	}, {
		href: '#help',
		src: 'images/help.svg',
		text: 'Help',
		title: 'Learn more about this web app.',
	}];

	async function getCachedMediaMetadata() {
		const cache = await caches.open(cacheName);
		const requests = await cache.keys();
		return Promise.all(requests.reverse().map(async (request) => {
			const response = await cache.match(request);
			return {
				contentType: response.headers.get('content-type'),
				src: request.url,
			};
		}));
	}
	const cachedMediaMetadataPromise = getCachedMediaMetadata();

	let message = '';
	if (BroadcastChannel) {
		const brodcastChannel = new BroadcastChannel(channelName);
		brodcastChannel.addEventListener('message', (event) => message = event.data);
	};
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
		margin: 16px;
		overflow-y: auto;
	}

	p {
		margin: 0;
	}

	.media {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
	}

	footer {
		flex-shrink: 0;
		margin: 0;
	}
</style>

<div id="app">
	<main>
		{#await cachedMediaMetadataPromise then cachedMediaMetadatas}
			{#if cachedMediaMetadatas.length > 0}
				<div class="media">
					{#each cachedMediaMetadatas as metadata}
						<Media {...metadata}/>
					{/each}
				</div>
			{:else}
				<p>You don't have any saved media.</p>
				<ol>
					<li><a href="https://developers.google.com/web/fundamentals/app-install-banners/">Add</a> this web app to your homescreen on Android, using Chrome 76+.</li>
					<li>Find an image, movie, or audio file in an another app (like Google Photos) and share it.</li>
					<li>Choose "Scrapbook PWA" as the share destination.</li>
				</ol>
				<ol>
					<li><a href="https://developers.google.com/web/fundamentals/app-install-banners/">Add</a> this web app to your homescreen on Android, using Chrome 76+.</li>
					<li>Find an image, movie, or audio file in an another app (like Google Photos) and share it.</li>
					<li>Choose "Scrapbook PWA" as the share destination.</li>
				</ol>
				<ol>
					<li><a href="https://developers.google.com/web/fundamentals/app-install-banners/">Add</a> this web app to your homescreen on Android, using Chrome 76+.</li>
					<li>Find an image, movie, or audio file in an another app (like Google Photos) and share it.</li>
					<li>Choose "Scrapbook PWA" as the share destination.</li>
				</ol>
				<ol>
					<li><a href="https://developers.google.com/web/fundamentals/app-install-banners/">Add</a> this web app to your homescreen on Android, using Chrome 76+.</li>
					<li>Find an image, movie, or audio file in an another app (like Google Photos) and share it.</li>
					<li>Choose "Scrapbook PWA" as the share destination.</li>
				</ol>
				<ol>
					<li><a href="https://developers.google.com/web/fundamentals/app-install-banners/">Add</a> this web app to your homescreen on Android, using Chrome 76+.</li>
					<li>Find an image, movie, or audio file in an another app (like Google Photos) and share it.</li>
					<li>Choose "Scrapbook PWA" as the share destination.</li>
				</ol>
				<ol>
					<li><a href="https://developers.google.com/web/fundamentals/app-install-banners/">Add</a> this web app to your homescreen on Android, using Chrome 76+.</li>
					<li>Find an image, movie, or audio file in an another app (like Google Photos) and share it.</li>
					<li>Choose "Scrapbook PWA" as the share destination.</li>
				</ol>
				<ol>
					<li><a href="https://developers.google.com/web/fundamentals/app-install-banners/">Add</a> this web app to your homescreen on Android, using Chrome 76+.</li>
					<li>Find an image, movie, or audio file in an another app (like Google Photos) and share it.</li>
					<li>Choose "Scrapbook PWA" as the share destination.</li>
				</ol>
			{/if}
		{/await}
		<Snackbar {message}/>
	</main>

	<footer>
		<Navbar {icons}/>
	</footer>
</div>

