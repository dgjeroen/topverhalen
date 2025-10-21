import adapterVercel from '@sveltejs/adapter-vercel';
import adapterStatic from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),

	kit: {
		adapter: process.env.ADAPTER === 'static'
			? adapterStatic({
				pages: 'build',
				assets: 'build',
				fallback: 'index.html', // ✅ SPA fallback
				precompress: false,
				strict: false
			})
			: adapterVercel({
				runtime: 'nodejs20.x'
			}),

		alias: {
			'$lib': 'src/lib'
		},

		// ✅ Relatieve paden
		paths: {
			base: '',
			relative: process.env.ADAPTER === 'static'
		}
	}
};

export default config;