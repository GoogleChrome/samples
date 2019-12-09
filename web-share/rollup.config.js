import {terser} from 'rollup-plugin-terser';
import commonjs from 'rollup-plugin-commonjs';
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
				{src: 'testfiles/*', dest: 'dist/testfiles'},
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
			dedupe: (importee) => importee === 'svelte' || importee.startsWith('svelte/'),
		}),
		commonjs({
			namedExports: {
				'pretty-bytes': ['default'],
			},
		}),
		terser(),
	],
}, {
	input: 'src/js/service-worker.js',
	output: {
		sourcemap: true,
		format: 'iife',
		name: 'workbox',
		file: 'dist/service-worker.js'
	},
	plugins: [
		svelte({
			dev: false,
		}),
		resolve(),
		commonjs({
			namedExports: {
				'pretty-bytes': ['default'],
			},
		}),
		replace({
			'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production'),
		}),
		terser(),
	],
}];
