<!-- src/lib/components/ImageParallax.svelte -->
<script lang="ts">
	import type { ImageContent } from '$lib/types';
	import { lightbox } from '$lib/stores/lightbox';

	let {
		url,
		caption,
		source,
		aspectRatio = 'original',
		focusX = 50,
		focusY = 50
	}: ImageContent = $props();
	let y = $state(0);
	let containerEl = $state<HTMLElement | undefined>(undefined);
	let imgEl = $state<HTMLImageElement | undefined>(undefined);
	let translateY = $state(0);

	// Convert aspect ratio string to CSS value and replace : with /
	const cssAspectRatio = $derived(
		aspectRatio === 'original' ? undefined : aspectRatio.replace(':', ' / ')
	);

	const startThreshold = 0.18;
	const endThreshold = 0.82;

	$effect(() => {
		const _ = y;
		if (containerEl && imgEl) {
			const { top, height: containerHeight } = containerEl.getBoundingClientRect();
			const windowHeight = window.innerHeight;
			const travelDistance = imgEl.clientHeight - containerHeight;

			if (travelDistance <= 0) {
				translateY = 0;
				return;
			}

			const scrollProgress = (windowHeight - top) / (windowHeight + containerHeight);
			const activeZoneProgress =
				(scrollProgress - startThreshold) / (endThreshold - startThreshold);
			const clampedProgress = Math.max(0, Math.min(1, activeZoneProgress));
			translateY = clampedProgress * travelDistance * -1;
		}
	});
</script>

<svelte:window bind:scrollY={y} />

<figure>
	<div class="parallax-wrapper" style:aspect-ratio={cssAspectRatio}>
		<button
			class="parallax-window"
			bind:this={containerEl}
			onclick={() => lightbox.open([{ url, caption, source }], 0)}
			aria-label={caption || 'Open afbeelding in lightbox'}
		>
			<img
				src={url}
				alt={caption || 'Parallax afbeelding'}
				class="parallax-img"
				style:transform="translateY({translateY}px)"
				style:object-position="{focusX}% {focusY}%"
				loading="lazy"
				bind:this={imgEl}
			/>
		</button>
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
		display: block;
	}

	.parallax-wrapper {
		width: 100%;
		position: relative;
		overflow: hidden;
	}

	.parallax-window {
		border: none;
		padding: 0;
		background: none;
		font: inherit;
		text-align: left;
		cursor: pointer;
		display: block;
		width: 100%;
		height: 100%;
		position: absolute;
		top: 0;
		left: 0;
		overflow: hidden;
		box-shadow: var(--image-box-shadow, none);
		transition: box-shadow 0.2s ease;
	}

	.parallax-window:hover {
		box-shadow: var(--image-hover-shadow, 0 4px 12px rgba(0, 0, 0, 0.15));
	}

	.parallax-img {
		position: absolute;
		left: 0;
		top: 0;
		width: 100%;
		height: auto;
		min-height: 130%;
		object-fit: cover;
	}

	figcaption {
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
</style>
