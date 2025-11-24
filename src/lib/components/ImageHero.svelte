<script lang="ts">
	import HeroLayout from './HeroLayout.svelte';
	import type { ImageHeroContent, Theme } from '$lib/types';

	let {
		url,
		label,
		title,
		source,
		focusX = 50,
		focusY = 50,
		theme = {}
	}: ImageHeroContent & { theme?: Theme } = $props();
</script>

<HeroLayout {label} {title} {source} {theme}>
	<img
		src={url}
		alt={title}
		class="hero-background"
		style:object-position="{focusX}% {focusY}%"
		loading="eager"
	/>
</HeroLayout>
