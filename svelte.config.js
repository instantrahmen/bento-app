import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),

	kit: {
		adapter: adapter(),
		alias: {
			'$features/*': './src/lib/features',
			'$api/*': './src/lib/api',
			'$lib/*': './src/lib',
		}
	},
	compilerOptions: {
		compatibility: {
			componentApi: 4
		}
	}
};

export default config;