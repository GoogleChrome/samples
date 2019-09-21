import App from '../svelte/App.svelte';

if ('serviceWorker' in navigator) {
	navigator.serviceWorker.addEventListener('controllerchange', () => {
		window.location.reload();
	});

	window.addEventListener('load', () => {
		navigator.serviceWorker.register('service-worker.js');
	});
}

const app = new App({
	target: document.body,
});

export default app;
