<script lang="ts">
	import BlockRenderer from '$lib/components/BlockRenderer.svelte';
	import type { PageData } from './$types';
	import type { ContentBlock } from '$lib/types';

	let { data } = $props<{ data: PageData }>();

	const contentBlocks = $derived<ContentBlock[]>(data.content.data);

	const heroBlock = $derived(contentBlocks.find((block) => block.type === 'heroVideo'));
	const otherBlocks = $derived(contentBlocks.filter((block) => block.type !== 'heroVideo'));
</script>

{#if heroBlock}
	<BlockRenderer block={heroBlock} />
{/if}

<main id="content-start">
	{#each otherBlocks as block}
		<BlockRenderer {block} />
	{/each}
</main>
