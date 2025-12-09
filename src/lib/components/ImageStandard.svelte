<!-- src/lib/components/ImageStandard.svelte -->
<script lang="ts">
	import { lightbox } from '$lib/stores/lightbox';

	let {
		url,
		caption,
		source,
		aspectRatio = 'original',
		focusX,
		focusY
	}: {
		url: string;
		caption: string;
		source: string;
		aspectRatio?: 'original' | '4:3' | '4:5' | '16:9' | '1:1';
		focusX?: number;
		focusY?: number;
	} = $props();

	// Determine if cropping is needed based on aspect ratio
	const needsCropping = $derived(aspectRatio !== 'original');

	// Convert aspect ratio string to CSS value and replace : with /
	const cssAspectRatio = $derived(
		aspectRatio === 'original' ? undefined : aspectRatio.replace(':', ' / ')
	);

	// Object position for cropping
	const objectPosition = $derived(
		needsCropping ? `${focusX ?? 50}% ${focusY ?? 50}%` : undefined
	);
</script>

<figure>
	<div
		class="image-container"
		class:cropped={needsCropping}
		style:aspect-ratio={cssAspectRatio}
		role="button"
		tabindex="0"
		onclick={() => lightbox.open([{ url, caption, source }], 0)}
		onkeydown={(e) => {
			if (e.key === 'Enter' || e.key === ' ') {
				lightbox.open([{ url, caption, source }], 0);
			}
		}}
	>
		<img
			src={url}
			alt={caption || 'Afbeelding'}
			loading="lazy"
			style:object-position={objectPosition}
		/>
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
		position: relative;
		width: 100%;
	}

	.image-container.cropped {
		overflow: hidden;
	}

	img {
		width: 100%;
		height: auto;
		display: block;
		transition: transform 0.2s ease;
	}

	.cropped img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.image-container:hover img {
		transform: var(--image-hover-img-transform, scale(1));
	}

	figcaption {
		margin-top: var(--space-s, 0.75rem);
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		gap: 1rem;
	}

	.caption {
		font-family: var(--caption-font-family, inherit);
		font-size: var(--caption-font-size, 0.875rem);
		font-weight: var(--caption-font-weight, 400);
		font-style: var(--caption-font-style, normal);
		color: var(--caption-color, #6b7280);
		line-height: var(--caption-line-height, 1.5);
		text-align: left;
	}

	.source {
		font-family: var(--source-font-family, inherit);
		font-size: var(--source-font-size, 0.75rem);
		font-weight: var(--source-font-weight, 400);
		font-style: var(--source-font-style, normal);
		color: var(--source-color, #9ca3af);
		line-height: var(--source-line-height, 1.4);
		text-align: right;
		margin-left: auto;
	}
</style>
