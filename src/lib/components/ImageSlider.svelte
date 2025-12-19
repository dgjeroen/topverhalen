<!-- src/lib/components/ImageSlider.svelte -->
<script lang="ts">
	import type { SliderContent, Theme } from '$lib/types';
	import { lightbox } from '$lib/stores/lightbox';
	import { onMount } from 'svelte';

	type ImageWithOrientation = SliderContent['images'][0] & {
		orientation?: 'portrait' | 'landscape';
	};
	export let images: ImageWithOrientation[];
	export let theme: Theme = {};

	let currentIndex = 0;
	$: currentImage = images[currentIndex];

	// Apply different styles based on indicator type
	$: indicatorStyle = theme['slider-indicator-style'] || 'dots';
	$: isBars = indicatorStyle === 'bars';

	// Generate dynamic CSS variables based on indicator style
	// Match preview styling exactly: dots = 8px circles, bars = 30px x 3px rectangles
	$: indicatorVars = isBars
		? {
				'--slider-dot-width': '30px',
				'--slider-dot-height': '3px',
				'--slider-dot-border-radius': '2px',
				'--slider-dot-scale': '1.15',
				'--slider-dots-bg': 'transparent',
				'--slider-dots-padding': '0',
				'--slider-dots-gap': '6px'
			}
		: {
				'--slider-dot-width': '8px',
				'--slider-dot-height': '8px',
				'--slider-dot-border-radius': '50%',
				'--slider-dot-scale': '1.2',
				'--slider-dots-bg': theme['slider-dots-bg'] || 'rgba(255, 255, 255, 0.9)',
				'--slider-dots-padding': theme['slider-dots-padding'] || '4px 8px',
				'--slider-dots-gap': theme['slider-dots-gap'] || '6px'
			};

	let touchstartX = 0;
	let touchendX = 0;
	const swipeThreshold = 50;

	let sliderViewport: HTMLDivElement;
	let isLoaded = false;

	onMount(async () => {
		const processedImages = await Promise.all(
			images.map(
				(image) =>
					new Promise<ImageWithOrientation>((resolve) => {
						const img = new Image();
						img.onload = () => {
							const orientation = img.height > img.width ? 'portrait' : 'landscape';
							resolve({ ...image, orientation });
						};
						img.src = image.url;
					})
			)
		);
		images = processedImages;
		isLoaded = true;

		if (sliderViewport) {
			sliderViewport.focus({ preventScroll: true });
		}
	});

	function handleTouchStart(e: TouchEvent) {
		touchstartX = e.changedTouches[0].screenX;
	}

	function handleTouchEnd(e: TouchEvent) {
		touchendX = e.changedTouches[0].screenX;
		const swipeDistance = touchendX - touchstartX;

		if (swipeDistance > swipeThreshold) {
			prev();
		}
		if (swipeDistance < -swipeThreshold) {
			next();
		}
	}

	function next() {
		currentIndex = (currentIndex + 1) % images.length;
		requestAnimationFrame(() => scrollToCenter());
	}
	function prev() {
		currentIndex = (currentIndex - 1 + images.length) % images.length;
		requestAnimationFrame(() => scrollToCenter());
	}
	function goTo(index: number) {
		currentIndex = index;
		requestAnimationFrame(() => scrollToCenter());
	}

	function scrollToCenter() {
		if (sliderViewport) {
			const rect = sliderViewport.getBoundingClientRect();
			const viewportHeight = window.innerHeight;
			const elementCenter = rect.top + rect.height / 2;
			const viewportCenter = viewportHeight / 2;

			// Only scroll if not already centered
			if (Math.abs(elementCenter - viewportCenter) > 50) {
				sliderViewport.scrollIntoView({ behavior: 'smooth', block: 'center' });
			}
		}
	}
</script>

<figure class="slider-container">
	<div
		class="slider-viewport"
		role="button"
		tabindex="0"
		bind:this={sliderViewport}
		onclick={() => {
			lightbox.open(images, currentIndex);
			sliderViewport.focus();
		}}
		onkeydown={(e) => {
			if (e.key === 'Enter' || e.key === ' ') {
				lightbox.open(images, currentIndex);
			}
			if (e.key === 'ArrowLeft') {
				e.preventDefault();
				prev();
			}
			if (e.key === 'ArrowRight') {
				e.preventDefault();
				next();
			}
		}}
		aria-label="Open afbeelding in lightbox"
		ontouchstart={handleTouchStart}
		ontouchend={handleTouchEnd}
	>
		<div
			class="dots-nav"
			style="--slider-dot-width: {indicatorVars['--slider-dot-width']}; --slider-dot-height: {indicatorVars['--slider-dot-height']}; --slider-dot-border-radius: {indicatorVars['--slider-dot-border-radius']}; --slider-dot-scale: {indicatorVars['--slider-dot-scale']}; --slider-dots-bg: {indicatorVars['--slider-dots-bg']}; --slider-dots-padding: {indicatorVars['--slider-dots-padding']}; --slider-dots-gap: {indicatorVars['--slider-dots-gap']};"
		>
			{#each images as _, i}
				<button
					class:active={currentIndex === i}
					tabindex="0"
					onclick={(e) => {
						e.stopPropagation();
						goTo(i);
						sliderViewport.focus();
					}}
					onkeydown={(e) => {
						if (e.key === 'Enter' || e.key === ' ') {
							e.preventDefault();
							goTo(i);
						}
					}}
					aria-label="Ga naar slide {i + 1}"
				></button>
			{/each}
		</div>

		{#if isLoaded}
			<div class="slides" style:transform="translateX(-{currentIndex * 100}%)">
				{#each images as image}
					<div
						class="slide"
						class:is-portrait={image.orientation === 'portrait'}
						class:is-landscape={image.orientation === 'landscape'}
						style:background-image="url({image.url})"
					></div>
				{/each}
			</div>
		{/if}

		<button
			class="slider-btn prev"
			onclick={(e) => {
				e.stopPropagation();
				prev();
				sliderViewport.focus();
			}}
			aria-label="Vorige slide">‹</button
		>
		<button
			class="slider-btn next"
			onclick={(e) => {
				e.stopPropagation();
				next();
				sliderViewport.focus();
			}}
			aria-label="Volgende slide">›</button
		>
	</div>

	<figcaption class="slider-footer">
		<span class="caption">{currentImage.caption}</span>
		{#if currentImage.source}<span class="source">{currentImage.source}</span>{/if}
	</figcaption>
</figure>

<style>
	.slider-container {
		position: relative;
		margin: 0;
	}

	.slider-viewport {
		overflow: hidden;
		border-radius: var(--image-border-radius, var(--border-radius-base));
		position: relative;
		height: 0;
		padding-bottom: 56.25%;
		cursor: pointer;
		background-color: var(--slider-container-bg, var(--color-background-light));
		transition: box-shadow 0.2s ease-in-out;
	}

	.slider-viewport:focus {
		outline: none;
		box-shadow: 0 0 0 4px var(--color-primary-light);
	}

	.slider-viewport:focus:not(:focus-visible) {
		box-shadow: none;
	}

	.slides {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		display: flex;
		transition: transform 0.5s cubic-bezier(0.77, 0, 0.175, 1);
	}

	.slide {
		flex: 0 0 100%;
		min-width: 100%;
		background-repeat: no-repeat;
		background-position: center;
		background-color: var(--color-background-dark);
	}

	.slide.is-landscape {
		background-size: cover;
	}

	.slide.is-portrait {
		background-size: contain;
	}

	.slider-btn {
		position: absolute;
		top: 50%;
		transform: translateY(-50%);
		background-color: var(--slider-btn-bg, rgba(255, 255, 255, 0.9));
		color: var(--slider-btn-color, #1f2937);
		border: none;
		border-radius: 50%;
		width: var(--slider-btn-size, 40px);
		height: var(--slider-btn-size, 40px);
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: var(--slider-btn-font-size, 24px);
		cursor: pointer;
		transition: background-color 0.2s;
		z-index: 30;
	}

	.slider-btn:hover {
		background-color: var(--slider-btn-hover-bg, rgba(255, 255, 255, 1));
	}

	.slider-btn.prev {
		left: var(--space-s);
	}

	.slider-btn.next {
		right: var(--space-s);
	}

	.dots-nav {
		position: absolute;
		bottom: var(--space-s);
		left: 50%;
		transform: translateX(-50%);
		z-index: 20;
		display: flex;
		gap: var(--slider-dots-gap, 8px);
		/* Container styling - controlled by CSS variables */
		background: var(--slider-dots-bg, rgba(255, 255, 255, 0.9));
		padding: var(--slider-dots-padding, 6px 12px);
		border-radius: var(--slider-dots-border-radius, 50px);
	}

	.dots-nav button {
		width: var(--slider-dot-width, 8px);
		height: var(--slider-dot-height, 8px);
		min-width: var(--slider-dot-width, 8px);
		min-height: var(--slider-dot-height, 8px);
		max-width: var(--slider-dot-width, 8px);
		max-height: var(--slider-dot-height, 8px);
		border-radius: var(--slider-dot-border-radius, 50%);
		border: none;
		background-color: var(--slider-dot-bg, #d1d5db);
		cursor: pointer;
		transition: all 0.2s ease;
		outline: none;
		box-sizing: border-box;
		flex-shrink: 0;
		padding: 0;
	}

	.dots-nav button:focus {
		box-shadow: 0 0 0 2px var(--color-primary);
	}

	.dots-nav button.active {
		background-color: var(--slider-dot-active-bg, #d10a10);
		border: none;
		transform: scale(var(--slider-dot-scale, 1.2));
	}

	.slider-footer {
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
