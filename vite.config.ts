import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	server: {
		watch: {
			// ✅ Negeer build folder om HMR te voorkomen
			ignored: ['**/build/**', '**/node_modules/**', '**/.git/**']
		},
		hmr: {
			// ✅ Verhoog timeout
			timeout: 120000
		}
	}
});