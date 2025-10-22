<script lang="ts">
	import type { PageData } from './$types';
	import BlockRenderer from '$lib/components/BlockRenderer.svelte';
	import ThemeLoader from '$lib/components/ThemeLoader.svelte';

	// Deze 'data' prop wordt automatisch gevuld door de 'load' functie
	let { data } = $props<{ data: PageData }>();

	// We halen het 'project' object uit de data
	let project = $derived(data.project);
</script>

<svelte:head>
	<title>{project.storyName || 'Preview'} - Topverhalen</title>

	{#if data.isPreview}
		<meta name="robots" content="noindex" />
	{/if}
</svelte:head>

<ThemeLoader theme={project.theme} />

{#each project.data as block (block.id || block.type)}
	<BlockRenderer {block} />
{/each}
