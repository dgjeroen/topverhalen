// svelte.config.js
import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

export default {
	preprocess: vitePreprocess(),
	kit: {
		adapter: adapter({
			pages: 'build',
			assets: 'build',
			fallback: '404.html',
			precompress: false,
			strict: false
		}),
		alias: {
			$lib: 'src/lib'
		},
		prerender: {
			entries: ['*'],
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
			},
			handleUnseenRoutes: ({ path }) => {
				if (
					!path ||
					path.startsWith('/cms/') ||
					path.startsWith('/api/') ||
					path.startsWith('/test-env')
				)
					return;
				throw new Error(`Unseen route: ${path}`);
			}
		},
		paths: {
			relative: true
		}
	}
};
