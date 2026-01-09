<script lang="ts">
	import type { PageData } from './$types';
	import BlockRenderer from '$lib/components/BlockRenderer.svelte';
	import ThemeLoader from '$lib/components/ThemeLoader.svelte';

	let { data } = $props<{ data: PageData }>();

	// GEEN invalidateAll of handleFocus hier!
	let project = $derived(data.project);
</script>

<svelte:head>
	<title>{project.storyName || 'Story'}</title>
	{#if data.isPreview}
		<meta name="robots" content="noindex" />
	{/if}
</svelte:head>

<!-- GEEN <svelte:window> hier! -->

<ThemeLoader theme={project.theme} />

{#each project.data as block, i (block.id || block.type)}
	<BlockRenderer {block} isFirst={i === 0} theme={project.theme} />
{/each}
