<!--src\lib\components\ImageGrid.svelte-->
<script lang="ts">
	import type { GalleryContent } from '$lib/types';
	import { lightbox } from '$lib/stores/lightbox';

	// We accepteren nu ook 'columns' als prop.
	// We geven een default waarde (2) voor als deze niet wordt meegegeven.
	let { images, columns = 2 }: GalleryContent = $props();

	function handleOpen(index: number): void {
		lightbox.open(images, index);
	}
</script>

<div
	class="gallery-grid"
	class:layout-3-special={images.length === 3 && columns === 2}
	style="--grid-columns: {columns};"
>
	{#each images as image, i}
		<figure class="gallery-item">
			<button
				class="image-button"
				onclick={() => handleOpen(i)}
				aria-label={`Open afbeelding: ${image.caption || 'Zonder bijschrift'}`}
			>
				<img src={image.url} alt={image.caption || ''} loading="lazy" />
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
	@import '$lib/styles/image-shared.css';

	.gallery-grid {
		display: grid;
		gap: var(--space-m);
		grid-template-columns: repeat(var(--grid-columns, 2), 1fr);
	}

	.layout-3-special {
		grid-template-columns: repeat(2, 1fr);
		grid-template-rows: repeat(2, auto);
	}

	.layout-3-special > :nth-child(3) {
		grid-column: 2;
		grid-row: 1 / -1;
	}

	.gallery-item {
		margin: 0;
		display: flex;
		flex-direction: column;
	}

	.image-button {
		background: none;
		border: none;
		padding: 0;
		line-height: 0;
		display: block;
		width: 100%;
		flex-grow: 1;
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
		height: 100%;
		display: block;
		object-fit: cover;
		transition: transform 0.2s ease-in-out;
	}

	.image-button:hover img {
		transform: scale(1.03);
	}

	@media (max-width: 768px) {
		.gallery-grid {
			grid-template-columns: 1fr;
		}

		.layout-3-special > :nth-child(n) {
			grid-column: auto;
			grid-row: auto;
		}
	}
</style>
