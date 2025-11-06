<script lang="ts">
	import type { HeadingContent, Theme } from '$lib/types';
	import { getContext } from 'svelte';

	let { text, level = 2 }: HeadingContent = $props();

	const theme = getContext<Theme>('theme') || {};

	const marginBottom =
		level === 2
			? theme['h2-margin-bottom'] || '1rem'
			: level === 3
				? theme['h3-margin-bottom'] || '0.5rem'
				: level === 4
					? theme['h4-margin-bottom'] || '0.5rem'
					: '1rem';

	const fontWeight =
		level === 2
			? theme['font-weight-headings'] || '700'
			: level === 3
				? theme['font-weight-subheading-medium'] || '700'
				: level === 4
					? theme['font-weight-subheading'] || '500'
					: '400';

	const hasBackground = $derived(
		level === 3
			? theme['h3-background-enabled'] === 'true'
			: level === 4
				? theme['h4-background-enabled'] === 'true'
				: false
	);

	const bgColor = $derived(
		level === 3
			? theme['h3-background-color'] || '#000000'
			: level === 4
				? theme['h4-background-color'] || '#000000'
				: '#000000'
	);

	const bgTextColor = $derived(
		level === 3
			? theme['h3-background-text-color'] || '#ffffff'
			: level === 4
				? theme['h4-background-text-color'] || '#ffffff'
				: '#ffffff'
	);

	const bgPadding = $derived(
		level === 3
			? theme['h3-background-padding'] || '0.2rem 0.5rem'
			: level === 4
				? theme['h4-background-padding'] || '0.2rem 0.5rem'
				: '0.2rem 0.5rem'
	);
</script>

<svelte:element
	this={`h${level}`}
	class="heading heading-{level}"
	style="margin-bottom: {marginBottom}; font-weight: {fontWeight};"
>
	{#if hasBackground}
		<span
			class="heading-bg"
			style="background-color: {bgColor}; color: {bgTextColor}; padding: {bgPadding};"
		>
			{text}
		</span>
	{:else}
		{text}
	{/if}
</svelte:element>

<style>
	.heading {
		margin: 0;
		line-height: 1.3;
	}

	.heading-bg {
		display: inline-block;
		border-radius: 4px;
	}
</style>
