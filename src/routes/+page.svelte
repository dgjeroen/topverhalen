<script lang="ts">
	import type { PageData } from './$types';
	import BlockRenderer from '$lib/components/BlockRenderer.svelte'; // Controleer dit pad

	let { data } = $props<{ data: PageData }>();

	// De data komt nu direct en correct binnen via de `data` prop.
	const storyData = data.content;
</script>

<svelte:head>
	{#if storyData?.storyName}
		<title>{storyData.storyName}</title>
	{/if}
</svelte:head>

<main>
	{#if storyData && storyData.data?.length > 0}
		{#each storyData.data as block (block.id)}
			<BlockRenderer {block} />
		{/each}
	{:else}
		<p>Kon het verhaal niet laden of het project is leeg.</p>
	{/if}
</main>
