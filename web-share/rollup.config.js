import copy from 'rollup-plugin-copy';
import resolve from 'rollup-plugin-node-resolve';
import svelte from 'rollup-plugin-svelte';

export default {
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
	],
};
