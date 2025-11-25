<!--src\lib\components\Heading.svelte-->
<script lang="ts">
	import type { HeadingContent, Theme } from '$lib/types';
	import { getContext } from 'svelte';
	import { browser } from '$app/environment';

	let { text, level = 2 }: HeadingContent = $props();

	const theme = getContext<Theme>('theme') || {};

	// ✅ Lees CSS variabelen in plaats van theme object
	let element: HTMLElement | undefined = $state();

	const hasBackground = $derived.by(() => {
		if (!browser || !element) return false;
		const styles = getComputedStyle(element);
		const enabled = styles.getPropertyValue(`--h${level}-background-enabled`).trim();
		return enabled === 'true';
	});

	const bgColor = $derived.by(() => {
		if (!browser || !element) return '#000000';
		const styles = getComputedStyle(element);
		return styles.getPropertyValue(`--h${level}-background-color`).trim() || '#000000';
	});

	const bgTextColor = $derived.by(() => {
		if (!browser || !element) return '#ffffff';
		const styles = getComputedStyle(element);
		return styles.getPropertyValue(`--h${level}-background-text-color`).trim() || '#ffffff';
	});

	const bgPadding = $derived.by(() => {
		if (!browser || !element) return '0.2rem 0.5rem';
		const styles = getComputedStyle(element);
		return styles.getPropertyValue(`--h${level}-background-padding`).trim() || '0.2rem 0.5rem';
	});
</script>

<svelte:element this={`h${level}`} bind:this={element} class="heading heading-{level}">
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
		margin-top: 0;
		margin-left: 0;
		margin-right: 0;
	}

	.heading-2 {
		margin-bottom: var(--h2-margin-bottom, 2rem);
		line-height: var(--h2-line-height, 1.3);
	}

	.heading-3 {
		margin-bottom: var(--h3-margin-bottom, 1.5rem);
		line-height: var(--h3-line-height, 1.3);
	}

	.heading-4 {
		margin-bottom: var(--h4-margin-bottom, 1rem);
		line-height: var(--h4-line-height, 1.3);
	}

	.heading-bg {
		display: inline-block;
		border-radius: 4px;
	}
</style>
