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

		const bgImage = theme['background-image'];
		const bgVars = bgImage
			? `
  --background-image: url(${bgImage});
  --background-repeat: ${theme['background-repeat'] || 'repeat'};
  --background-position: ${theme['background-position'] || 'center'};
  --background-size: ${theme['background-size'] || 'auto'};
  --background-opacity: ${(theme['background-opacity'] ?? 100) / 100};
  --background-attachment: ${theme['background-attachment'] || 'scroll'};`
			: `
  --background-image: none;`;

		// ❌ REMOVED: textColorOverride (niet meer nodig)

		const allVars = cssVars + bgVars;

		if (!allVars.trim()) return;

		const oldStyle = document.getElementById('theme-overrides');
		if (oldStyle) oldStyle.remove();

		const style = document.createElement('style');
		style.id = 'theme-overrides';
		style.textContent = `
:root {
${allVars}
}

html {
  overflow-y: scroll;
  overflow-x: hidden;
}

body {
  position: relative;
  background-color: var(--color-background-light, #ffffff);
  overflow: visible;
  min-height: 100vh;
  height: auto;
  /* ❌ REMOVED: color override (TextStyleEditor doet dit) */
}

@media (min-width: 769px) {
  body::before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: var(--background-image);
    background-repeat: var(--background-repeat);
    background-position: var(--background-position);
    background-size: var(--background-size);
    background-attachment: var(--background-attachment);
    opacity: var(--background-opacity);
    z-index: -10;
    pointer-events: none;
  }
}
`;
		document.head.appendChild(style);

		return () => {
			const el = document.getElementById('theme-overrides');
			if (el) el.remove();
		};
	});
</script>
