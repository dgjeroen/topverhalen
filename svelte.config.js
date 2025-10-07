// svelte.config.js
import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte'; // Goede gewoonte om deze ook toe te voegen

/** @type {import('@sveltejs/kit').Config} */
const config = {
<<<<<<< HEAD
	// Voeg preprocess toe voor o.a. TypeScript en PostCSS ondersteuning in <style> blokken
	preprocess: vitePreprocess(),

	kit: {
		paths: {
			base: '/redactie/jeroen'
		},

=======
	preprocess: vitePreprocess(),

	kit: {
>>>>>>> c90f938825e21483a095a5906201aac5ab608739
		adapter: adapter({
			pages: 'build',
			assets: 'build'
		}),
<<<<<<< HEAD

		// ===================================================
		// ========= VOEG DEZE SECTIE TOE ====================
		alias: {
			'$lib': 'src/lib'
		}
		// ===================================================
		// ===================================================
=======
		alias: {
			'$lib': 'src/lib'
		}
>>>>>>> c90f938825e21483a095a5906201aac5ab608739
	}
};

export default config;