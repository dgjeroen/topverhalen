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
		border-radius: var(--border-radius-base);
		overflow: hidden;
		line-height: 0;
		cursor: pointer;
	}
	img {
		width: 100%;
		display: block;
	}
	figcaption {
		padding-top: var(--space-s);
		font-size: var(--font-size-s);
		color: var(--color-text-muted);
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: 100%;
	}
	.caption {
		text-align: left;
	}
	.source {
		text-align: right;
		font-style: italic;
	}
</style>
