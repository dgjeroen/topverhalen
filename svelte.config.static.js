import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

export default {
    preprocess: vitePreprocess(),
    kit: {
        adapter: adapter({
            pages: 'build',
            assets: 'build',
            fallback: null,  // ✅ WIJZIGING 1: was 'index.html'
            precompress: false,
            strict: false
        }),
        alias: {
            '$lib': 'src/lib'
        },
        prerender: {
            entries: ['/']
        },
        paths: {
            relative: true  // ✅ WIJZIGING 2: NIEUWE regel
        }
    }
};