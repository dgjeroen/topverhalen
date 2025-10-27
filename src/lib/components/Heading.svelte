<!-- src/lib/components/Heading.svelte -->
<script lang="ts">
	import type { HeadingContent } from '$lib/types';

	let { text, level = 2 }: HeadingContent = $props();
</script>

<svelte:element this={`h${level}`} class="heading heading-{level}">
	{text}
</svelte:element>

<style>
	.heading {
		margin: 0;
		line-height: 1.3;
	}
</style>
