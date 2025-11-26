<!-- src/lib/components/ImageStandard.svelte -->
<script lang="ts">
	import type { ImageContent } from '$lib/types';
	import { lightbox } from '$lib/stores/lightbox';

	let { url, caption, source }: ImageContent = $props();
</script>

<figure>
	<div
		class="image-container"
		role="button"
		tabindex="0"
		onclick={() => lightbox.open([{ url, caption, source }], 0)}
		onkeydown={(e) => {
			if (e.key === 'Enter' || e.key === ' ') {
				lightbox.open([{ url, caption, source }], 0);
			}
		}}
	>
		<img src={url} alt={caption || 'Afbeelding'} loading="lazy" />
	</div>

	{#if caption || source}
		<figcaption>
			<span class="caption">{caption}</span>
			{#if source}<span class="source">{source}</span>{/if}
		</figcaption>
	{/if}
</figure>

<style>
	figure {
		margin: 0;
	}

	.image-container {
		line-height: 0;
		box-shadow: var(--image-box-shadow, none);
		transition:
			transform 0.2s ease,
			box-shadow 0.2s ease;
	}

	.image-container:hover {
		transform: var(--image-hover-transform, translateY(-2px));
		box-shadow: var(--image-hover-shadow, 0 4px 12px rgba(0, 0, 0, 0.15));
	}

	img {
		width: 100%;
		display: block;
	}
</style>
