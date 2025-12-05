<script lang="ts">
	import type { PageData } from './$types';
	// 1. Importeer de functie om data te verversen
	import { invalidateAll } from '$app/navigation';
	import BlockRenderer from '$lib/components/BlockRenderer.svelte';
	import ThemeLoader from '$lib/components/ThemeLoader.svelte';

	let { data } = $props<{ data: PageData }>();

	// We houden dit $derived!
	// Zodra invalidateAll() nieuwe data ophaalt, update dit automatisch.
	let project = $derived(data.project);

	// 2. Functie die draait als je het venster weer aanklikt
	function handleFocus() {
		// Dit dwingt SvelteKit om de server (+page.server.ts) opnieuw te vragen
		invalidateAll();
	}
</script>

<svelte:head>
	<title>{project.storyName || 'Story'}</title>

	{#if data.isPreview}
		<meta name="robots" content="noindex" />
	{/if}
</svelte:head>

<svelte:window onfocus={handleFocus} />

<ThemeLoader theme={project.theme} />

{#each project.data as block, i (block.id || block.type)}
	<BlockRenderer {block} isFirst={i === 0} theme={project.theme} />
{/each}
