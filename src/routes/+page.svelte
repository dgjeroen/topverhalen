<script lang="ts">
	import type { PageData } from './$types';
	import { onMount } from 'svelte';
	import BlockRenderer from '$lib/components/BlockRenderer.svelte'; // Pas dit pad eventueel aan

	let { data } = $props<{ data: PageData }>();

	// Initialiseer de state direct met de server data.
	// `data.content` bevat nu altijd `{ storyName, data: [...] }`
	let storyData = $state(data.content);

	onMount(() => {
		// Voor de GEPUBLICEERDE pagina: overschrijf de state met de geïnjecteerde data.
		const dataElement = document.getElementById('story-data');
		if (dataElement) {
			try {
				const injectedData = JSON.parse(dataElement.textContent || '{}');
				if (injectedData && injectedData.data) {
					storyData = injectedData;
				}
			} catch (e) {
				console.error('Kon de geïnjecteerde verhaal-data niet parsen', e);
			}
		}
	});
</script>

<svelte:head>
	{#if storyData?.storyName}
		<title>{storyData.storyName}</title>
	{/if}
</svelte:head>

<main>
	{#if storyData && storyData.data && storyData.data.length > 0}
		{#each storyData.data as block (block.id)}
			<BlockRenderer {block} />
		{/each}
	{:else}
		<p>{storyData?.storyName || 'Verhaal wordt geladen...'}</p>
	{/if}
</main>
