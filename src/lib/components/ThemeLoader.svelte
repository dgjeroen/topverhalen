<!--src\lib\components\ThemeLoader.svelte-->
<script lang="ts">
	import type { Theme } from '$lib/types';
	import { applyImageShape } from '$lib/utils/applyImageShape';

	let { theme } = $props<{ theme?: Theme }>();

	$effect(() => {
		if (!theme || Object.keys(theme).length === 0) return;

		// ✅ FIX: Handle ALL value types (string, number, boolean)
		// Separate quote variables from other variables for scoping
		const quoteVars: string[] = [];
		const rootVars: string[] = [];

		Object.entries(theme)
			.filter(([_, value]) => {
				// Accept strings, numbers, and booleans
				return (
					(typeof value === 'string' && value.trim() !== '') ||
					typeof value === 'number' ||
					typeof value === 'boolean'
				);
			})
			.forEach(([key, value]) => {
				let cssLine: string;

				// ✅ FIX: Special handling voor specifieke keys
				// Overlay opacity: convert percentage (0-100) to decimal (0-1)
				if (key === 'hero-video-overlay-opacity' && typeof value === 'number') {
					cssLine = `  --${key}: ${value / 100};`;
				}
				// Uppercase title: convert boolean to CSS value
				else if (key === 'hero-video-uppercase-title' && typeof value === 'boolean') {
					cssLine = `  --${key}: ${value ? 'uppercase' : 'none'};`;
				}
				// Default: direct value
				else {
					cssLine = `  --${key}: ${value};`;
				}

				// ✅ Scope quote variables to .quote-block only
				if (key.startsWith('quote-')) {
					quoteVars.push(cssLine);
				} else {
					rootVars.push(cssLine);
				}
			});

		const cssVars = rootVars.join('\n');

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

.quote-block {
${quoteVars.join('\n')}
}

html {
  overflow-y: scroll;
  overflow-x: hidden;
}

body {
  position: relative;
  background-color: var(--color-background-light, #ffffff);
  overflow: visible;
  min-height: 100dvh;
  height: auto;
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

		// Apply image shape data attributes after CSS variables are loaded
		// Use setTimeout to ensure CSS has been applied
		setTimeout(() => {
			applyImageShape();
		}, 0);

		return () => {
			const el = document.getElementById('theme-overrides');
			if (el) el.remove();
		};
	});
</script>
