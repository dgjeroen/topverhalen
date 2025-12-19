//svelte.config.static.js
import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

export default {
	preprocess: vitePreprocess(),
	kit: {
		adapter: adapter({
			pages: 'build',
			assets: 'build',
			fallback: null,
			precompress: false,
			strict: false
		}),
		alias: {
			$lib: 'src/lib'
		},
		prerender: {
			entries: ['/story'],
			handleHttpError: ({ path, message }) => {
				// Ignore errors voor routes die we niet willen prerenderen
				if (
					path.startsWith('/api/') ||
					path.startsWith('/cms/') ||
					path.startsWith('/test-env') ||
					path === '/story'
				) {
					// ✅ Ignore /story errors in normale builds
					console.warn(`Skipping prerender for ${path}: ${message}`);
					return;
				}
				throw new Error(message);
			}
		},
		paths: {
			relative: true
		}
	}
};
