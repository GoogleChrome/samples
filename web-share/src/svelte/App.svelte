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
		svg: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"/><path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/></svg>',
		text: 'Images',
		title: 'View saved images.',
	}, {
		href: '#videos',
		svg: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"/><path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/></svg>',
		text: 'Videos',
		title: 'View saved videos.',
	}, {
		href: '#audio',
		svg: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"/><path d="M12 3v9.28c-.47-.17-.97-.28-1.5-.28C8.01 12 6 14.01 6 16.5S8.01 21 10.5 21c2.31 0 4.2-1.75 4.45-4H15V6h4V3h-7z"/></svg>',
		text: 'Audio',
		title: 'View saved videos.',
	}, {
		active: true,
		href: '#help',
		svg: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"/><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z"/></svg>',
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

