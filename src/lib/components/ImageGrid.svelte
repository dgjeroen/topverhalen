<!-- src/lib/components/ImageGrid.svelte -->
<script lang="ts">
	import type { GalleryContent } from '$lib/types';
	import { lightbox } from '$lib/stores/lightbox';

	let { images, columns = 2, aspectRatio = 'original' }: GalleryContent = $props();

	function handleOpen(index: number): void {
		lightbox.open(images, index);
	}
</script>

<div
	class="gallery-grid"
	class:layout-3-special={images.length === 3 && columns === 2}
	class:layout-4-square={images.length === 4 && columns === 2}
	style="--grid-columns: {columns}; --gallery-aspect: {aspectRatio === 'original'
		? 'auto'
		: aspectRatio.replace(':', ' / ')};"
>
	{#each images as image, i}
		<figure class="gallery-item">
			<button
				class="image-button"
				onclick={() => handleOpen(i)}
				aria-label={`Open afbeelding: ${image.caption || 'Zonder bijschrift'}`}
			>
				<img
					src={image.url}
					alt={image.caption || ''}
					loading="lazy"
					style:object-position="{image.focusX ?? 50}% {image.focusY ?? 50}%"
				/>
			</button>

			{#if image.caption || image.source}
				<figcaption class="caption-container">
					<span class="caption">{image.caption}</span>
					{#if image.source}<span class="source">{image.source}</span>{/if}
				</figcaption>
			{/if}
		</figure>
	{/each}
</div>

<style>
	.gallery-grid {
		display: grid;
		gap: var(--space-m);
		grid-template-columns: repeat(var(--grid-columns, 2), 1fr);
	}

	.layout-3-special {
		grid-template-columns: repeat(2, 1fr);
	}

	.layout-3-special > :nth-child(3) {
		grid-column: 2;
		grid-row: 1 / -1;
	}

	/* 4 images in 2x2 square grid */
	.layout-4-square {
		grid-template-columns: repeat(2, 1fr);
	}

	.gallery-item {
		margin: 0;
		display: grid;
		grid-template-rows: auto auto; /* Photo then caption */
		row-gap: var(--space-s);
	}

	.image-button {
		background: none;
		border: none;
		padding: 0;
		line-height: 0;
		display: block;
		width: 100%;
		height: auto;
		box-shadow: var(--image-box-shadow, none);
		transition:
			transform 0.2s ease,
			box-shadow 0.2s ease;
	}

	.image-button:hover {
		box-shadow: var(--image-hover-shadow, 0 4px 12px rgba(0, 0, 0, 0.15));
	}

	.image-button:focus-visible {
		outline: 3px solid var(--color-focus);
		outline-offset: 3px;
	}

	img {
		width: 100%;
		height: auto;
		display: block;
		object-fit: cover;
		transition: transform 0.2s ease-in-out;
		aspect-ratio: var(--gallery-aspect, auto);
	}

	.image-button:hover img {
		transform: scale(1.03);
	}

	.caption-container {
		padding-top: var(--space-s);
		font-size: var(--font-size-s);
		color: var(--color-text-muted);
		display: block;
		overflow: hidden;
	}

	.caption {
		display: inline;
	}

	.source {
		font-style: italic;
		white-space: nowrap;
		float: right;
		margin-left: var(--space-xs);
	}

	@media (max-width: 768px) {
		.gallery-grid {
			grid-template-columns: 1fr;
		}

		/* If exactly 4 images in a 4-column layout, show 2x2 on mobile */
		.layout-4-square {
			grid-template-columns: repeat(2, 1fr);
		}

		.gallery-item {
			/* photo height adapts to actual image size */
			grid-template-rows: auto auto;
			row-gap: var(--space-s);
		}

		.layout-3-special > :nth-child(n) {
			grid-column: auto;
			grid-row: auto;
		}
	}
</style>
