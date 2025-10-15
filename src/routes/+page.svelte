<script lang="ts">
	import type { PageData } from './$types';
	import { onMount } from 'svelte';
	// Zorg ervoor dat je een component hebt dat een 'block' object kan renderen
	// De naam 'BlockRenderer' is een aanname.
	import BlockRenderer from '$lib/components/BlockRenderer.svelte';

	let { data } = $props<{ data: PageData }>();

	// Start met de data die van de server komt (voor live preview & de build-placeholder)
	let storyData = $state(data.content);

	onMount(() => {
		// Voor de GEPUBLICEERDE pagina: controleer of er een geïnjecteerd script is.
		// Zo ja, overschrijf de placeholder-data met de echte content.
		const dataElement = document.getElementById('story-data');
		if (dataElement) {
			try {
				const injectedData = JSON.parse(dataElement.textContent || '{}');
				// Alleen updaten als de geïnjecteerde data ook echt content heeft.
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
		<p>Verhaal wordt geladen of is leeg...</p>
	{/if}
</main>
