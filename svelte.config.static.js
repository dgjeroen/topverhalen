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
            entries: ['/story'],
            handleHttpError: ({ path }) => {
                if (path.startsWith('/api/') || path.startsWith('/cms/') || path.startsWith('/test-env')) {
                    return;
                }
            }
        },
        paths: {
            relative: true
        }
    }
};