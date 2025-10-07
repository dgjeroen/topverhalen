// svelte.config.js
import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte'; // Goede gewoonte om deze ook toe te voegen

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Voeg preprocess toe voor o.a. TypeScript en PostCSS ondersteuning in <style> blokken
	preprocess: vitePreprocess(),

	kit: {
		paths: {
			base: '/redactie/jeroen'
		},

		adapter: adapter({
			pages: 'build',
			assets: 'build'
		}),

		// ===================================================
		// ========= VOEG DEZE SECTIE TOE ====================
		alias: {
			'$lib': 'src/lib'
		}
		// ===================================================
		// ===================================================
	}
};

export default config;