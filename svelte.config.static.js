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
            '$lib': 'src/lib'
        },
        prerender: {
            entries: ['/test-env'],  // ✅ Prerender deze specifieke route
            handleHttpError: ({ path, referrer, message }) => {
                // Ignore errors voor andere routes
                if (path.startsWith('/api/') || path.startsWith('/cms/')) {
                    return;
                }
                console.warn(`Prerender warning for ${path}: ${message}`);
            }
        },
        paths: {
            relative: true
        }
    }
};