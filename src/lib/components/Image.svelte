<script lang="ts">
	import type { ImageContent } from '$lib/types';
	import ImageStandard from './ImageStandard.svelte';
	import ImageParallax from './ImageParallax.svelte';

	// DE FIX: Destructure de props direct uit de ImageContent interface
	let { url, caption, source, parallax }: ImageContent = $props();
</script>

{#if parallax}
	<ImageParallax {url} {caption} {source} {parallax} />
{:else}
	<ImageStandard {url} {caption} {source} {parallax} />
{/if}
