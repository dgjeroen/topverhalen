<!-- src/lib/components/ThemeLoader.svelte -->
<script lang="ts">
	import type { Theme } from '$lib/types';

	let { theme } = $props<{ theme?: Theme }>();

	$effect(() => {
		if (!theme || Object.keys(theme).length === 0) return;

		const cssVars = Object.entries(theme)
			.filter(([_, value]) => typeof value === 'string' && value.trim() !== '')
			.map(([key, value]) => `  --${key}: ${value};`)
			.join('\n');

		if (!cssVars) return;

		const oldStyle = document.getElementById('theme-overrides');
		if (oldStyle) oldStyle.remove();

		const style = document.createElement('style');
		style.id = 'theme-overrides';
		style.textContent = `:root {\n${cssVars}\n}`;
		document.head.appendChild(style);

		return () => {
			const el = document.getElementById('theme-overrides');
			if (el) el.remove();
		};
	});
</script>
