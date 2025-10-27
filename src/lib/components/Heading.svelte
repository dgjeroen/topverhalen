<!-- src/lib/components/Heading.svelte -->
<script lang="ts">
	import type { HeadingContent } from '$lib/types';

	let { text, level = 2 }: HeadingContent = $props();
</script>

<svelte:element this={`h${level}`} class="heading">
	{text}
</svelte:element>

<style>
	.heading {
		margin: 0;
		line-height: 1.3;
	}

	/* H2 styling wordt overgenomen van app.css via CSS variabelen */
	/* H4 styling wordt overgenomen van app.css via CSS variabelen */
</style>
