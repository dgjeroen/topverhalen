<!-- src/lib/components/Heading.svelte -->
<script lang="ts">
	import type { HeadingContent, Theme } from '$lib/types';
	import { getContext } from 'svelte';

	let { text, level = 2 }: HeadingContent = $props();

	const theme = getContext<Theme>('theme') || {};

	// ✅ Get margin-bottom from theme with fallback
	const marginBottom =
		level === 2
			? theme['h2-margin-bottom'] || '1rem'
			: level === 4
				? theme['h4-margin-bottom'] || '0.5rem'
				: '1rem';
</script>

<svelte:element
	this={`h${level}`}
	class="heading heading-{level}"
	style="margin-bottom: {marginBottom}"
>
	{text}
</svelte:element>

<style>
	.heading {
		margin: 0;
		line-height: 1.3;
	}
</style>
