<script lang="ts">
	import { onMount } from 'svelte';
	import BlockRenderer from '$lib/components/BlockRenderer.svelte'; // Aangenomen dat je zoiets hebt

	let storyData = $state<{ storyName: string; data: any[] } | null>(null);

	onMount(() => {
		// Lees de data uit het <script> tag dat we in de server action hebben geïnjecteerd
		const dataElement = document.getElementById('story-data');
		if (dataElement) {
			storyData = JSON.parse(dataElement.textContent || '{}');
		}
	});
</script>

<svelte:head>
	{#if storyData?.storyName}
		<title>{storyData.storyName}</title>
	{/if}
</svelte:head>

<main>
	{#if storyData}
		{#each storyData.data as block (block.id)}
			<BlockRenderer {block} />
		{/each}
	{:else}
		<p>Verhaal wordt geladen...</p>
	{/if}
</main>
