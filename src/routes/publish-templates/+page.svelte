<script lang="ts">
	import { onMount } from 'svelte';
	import BlockRenderer from '$lib/components/BlockRenderer.svelte'; // Controleer of dit pad klopt

	let storyData = $state<any>(null);

	// Deze code draait in de browser van de eindgebruiker,
	// nadat de pagina is gedownload en geopend.
	onMount(() => {
		const dataElement = document.getElementById('story-data');
		if (dataElement) {
			try {
				storyData = JSON.parse(dataElement.textContent || '{}');
			} catch (e) {
				console.error('Kon de verhaal-data niet laden', e);
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
	{#if storyData && storyData.data?.length > 0}
		{#each storyData.data as block (block.id)}
			<BlockRenderer {block} />
		{/each}
	{:else}
		<p>Verhaal wordt geladen...</p>
	{/if}
</main>
