import adapter from '@sveltejs/adapter-vercel';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),

	kit: {
		adapter: adapter({
			// runtime: 'edge',
		}),
		alias: {
			'$features/*': './src/lib/features',
			'$api/*': './src/lib/api',
			'$lib/*': './src/lib',
		},
	},

	compilerOptions: {
		compatibility: {
			componentApi: 4,
		},
	},

	vitePlugin: {
		inspector: {
			toggleKeyCombo: 'meta-ctrl-alt-shift-i',
			showToggleButton: 'active',
			toggleButtonPos: 'bottom-right',
		},
	},
};

export default config;
