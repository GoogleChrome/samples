import copy from 'rollup-plugin-copy';
import replace from 'rollup-plugin-replace';
import resolve from 'rollup-plugin-node-resolve';
import svelte from 'rollup-plugin-svelte';

export default [{
	input: 'src/js/app.js',
	output: {
		sourcemap: true,
		format: 'iife',
		name: 'app',
		file: 'dist/js/app.js'
	},
	plugins: [
		copy({
			targets: [
				{src: 'src/*.{json,html}', dest: 'dist'},
				{src: 'src/css/**/*', dest: 'dist/css'},
				{src: 'src/images/**/*', dest: 'dist/images'},
			],
		}),
		svelte({
			dev: false,
			css: css => {
				css.write('dist/css/svelte.css');
			}
		}),
		resolve({
			browser: true,
			dedupe: importee => importee === 'svelte' || importee.startsWith('svelte/'),
		}),
		// We can't use terser; see https://github.com/terser/terser/issues/443
	],
}, {
	input: 'src/js/service-worker.js',
	output: {
		sourcemap: false,
		format: 'iife',
		name: 'workbox',
		file: 'dist/service-worker-sans-manifest.js'
	},
	plugins: [
		resolve(),
		replace({
			'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
		}),
	],
}];
