<!--src\lib\components\ImageGrid.svelte-->
<script lang="ts">
	import type { GalleryContent } from '$lib/types';
	import { lightbox } from '$lib/stores/lightbox';

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
	@import '$lib/styles/image-shared.css';

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

	.gallery-item {
		margin: 0;
		/* ✅ CHANGED: Grid ipv flex voor expliciete row heights */
		display: grid;
		grid-template-rows: 300px auto; /* Foto: 300px, Caption: auto */
		row-gap: var(--space-s);
	}

	.image-button {
		background: none;
		border: none;
		padding: 0;
		line-height: 0;
		display: block;
		width: 100%;
		/* ✅ CHANGED: Height 100% werkt nu (grid row is 300px) */
		height: 100%;
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

	/* ✅ CHANGED: Overlap via transform ipv margin */
	.caption-container {
		position: relative;
		/* ✅ Transform verplaatst visueel, maar layout blijft intact */
		transform: translateY(calc(var(--space-m) * -0.5));
		z-index: 1;
		/* ✅ Pointer events door naar volgend blok (caption is alleen visueel) */
		pointer-events: none;
	}

	/* ✅ Text binnen caption moet wel klikbaar zijn */
	.caption-container * {
		pointer-events: auto;
	}

	@media (max-width: 768px) {
		.gallery-grid {
			grid-template-columns: 1fr;
		}

		.gallery-item {
			/* ✅ Kleinere foto op mobile */
			grid-template-rows: 200px auto;
			row-gap: var(--space-xs);
		}

		.layout-3-special > :nth-child(n) {
			grid-column: auto;
			grid-row: auto;
		}

		/* ✅ Minder overlap op mobile */
		.caption-container {
			transform: translateY(calc(var(--space-m) * -0.25));
		}
	}
</style>
