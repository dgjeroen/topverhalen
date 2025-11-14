<!-- src/routes/story/+page.svelte -->
<script lang="ts">
	import type { PageData } from './$types';
	import BlockRenderer from '$lib/components/BlockRenderer.svelte';
	import ThemeLoader from '$lib/components/ThemeLoader.svelte';

	let { data } = $props<{ data: PageData }>();
	let project = $derived(data.project);
</script>

<svelte:head>
	<title>{project.storyName || 'Story'} - Topverhalen</title>

	{#if data.isPreview}
		<meta name="robots" content="noindex" />
	{/if}
</svelte:head>

<!-- ✅ ADD: ThemeLoader for global CSS vars -->
<ThemeLoader theme={project.theme} />

<!-- ✅ FIX: Pass theme prop to BlockRenderer -->
{#each project.data as block, i (block.id || block.type)}
	<BlockRenderer {block} isFirst={i === 0} theme={project.theme} />
{/each}
