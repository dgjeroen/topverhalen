<script lang="ts">
	import type { PageData } from './$types';
	import BlockRenderer from '$lib/components/BlockRenderer.svelte';

	let { data } = $props<{ data: PageData }>();
	let project = $derived(data.project);
</script>

<svelte:head>
	<title>{project.storyName || 'Preview'} - Topverhalen</title>

	{#if data.isPreview}
		<meta name="robots" content="noindex" />
	{/if}
</svelte:head>

<!-- ✅ FIXED: Voeg theme toe -->
{#each project.data as block, i (block.id || block.type)}
	<BlockRenderer {block} isFirst={i === 0} theme={project.theme} />
{/each}
