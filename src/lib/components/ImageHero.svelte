<!-- src/lib/components/ImageHero.svelte -->
<script lang="ts">
	import SwitchLogo from './SwitchLogo.svelte';
	import type { ImageHeroContent } from '$lib/types';

	let { url, label, title, source, textAlign = 'center' }: ImageHeroContent = $props();

	let elementsVisible = $state(false);
	let y = $state(0);
	let containerEl = $state<HTMLElement | undefined>(undefined);
	let imgEl = $state<HTMLImageElement | undefined>(undefined);
	let translateY = $state(0);

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

	$effect(() => {
		const timeout = setTimeout(() => {
			elementsVisible = true;
		}, 500);

		return () => clearTimeout(timeout);
	});

	// ✅ FIX: Verbeterde scroll functie met fallback
	function scrollToContent(event: Event) {
		event.preventDefault();

		// Probeer eerst #content-start
		let element = document.getElementById('content-start');

		// Fallback: scroll naar volgende sibling van hero container
		if (!element && containerEl) {
			element = containerEl.nextElementSibling as HTMLElement;
		}

		// Fallback 2: scroll één viewport naar beneden
		if (!element) {
			window.scrollTo({
				top: window.innerHeight,
				behavior: 'smooth'
			});
			return;
		}

		element.scrollIntoView({
			behavior: 'smooth',
			block: 'start'
		});
	}
</script>

<svelte:window bind:scrollY={y} />

<div class="hero-container" bind:this={containerEl}>
	<div class="image-wrapper">
		<img
			bind:this={imgEl}
			src={url}
			alt={title}
			class="background-image"
			style:transform="translateY({translateY}px)"
			loading="eager"
		/>
	</div>
	<div class="overlay"></div>

	<div class="hero-content" class:visible={elementsVisible} data-text-align={textAlign}>
		<header>
			<SwitchLogo />
		</header>

		<main class="title-container" class:visible={elementsVisible}>
			{#if label}
				<span class="label">{label}</span>
			{/if}
			<h1 class="hero-title">{title}</h1>
			{#if source}
				<span class="source">{source}</span>
			{/if}
		</main>
	</div>

	<button class="scroll-indicator" aria-label="Scroll naar beneden" onclick={scrollToContent}>
		<span>scroll</span>
		<svg
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
		>
			<path d="M12 5v14m0 0l-4-4m4 4l4-4" />
		</svg>
	</button>
</div>

<style>
	.hero-container {
		height: 100dvh;
		width: 100%;
		position: relative;
		display: flex;
		color: var(--color-white);
		overflow: hidden;
	}

	.image-wrapper {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: -2;
	}

	.background-image {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 120%;
		object-fit: cover;
		will-change: transform;
	}

	.overlay {
		position: absolute;
		inset: 0;
		background-color: rgba(var(--color-text-rgb), 0.5);
		z-index: -1;
	}

	.hero-content {
		flex-grow: 1;
		display: flex;
		flex-direction: column;
		padding: var(--space-l);
		max-width: var(--wide-max-width);
		width: 100%;
		margin: 0 auto;
		position: relative;
	}

	header {
		text-align: left;
	}

	/* ✅ FIX: Centreer de title-container horizontaal */
	.title-container {
		flex-grow: 1;
		display: flex;
		flex-direction: column;
		align-items: center; /* ✅ Horizontale centrering */
		text-align: center;
		opacity: 0;
		transform: translateY(10px);
		transition:
			opacity 1.5s ease-out,
			transform 1.5s ease-out;
		width: 100%; /* ✅ Neem volledige breedte */
	}

	.title-container.visible {
		opacity: 1;
		transform: translateY(0);
	}

	/* ✅ Text alignment variants */
	[data-text-align='top'] .title-container {
		justify-content: flex-start;
		padding-top: var(--space-xl);
	}

	[data-text-align='center'] .title-container {
		justify-content: center;
	}

	[data-text-align='bottom'] .title-container {
		justify-content: flex-end;
		padding-bottom: var(--space-xl);
	}

	/* ✅ FIX: Zorg dat child elementen max-width respecteren */
	.hero-title {
		font-family: var(--font-family-quote);
		font-weight: 700;
		text-transform: uppercase;
		max-width: 800px;
		width: 100%; /* ✅ Neem beschikbare ruimte tot max-width */
		line-height: 1.2;
		margin-block: var(--space-m);
	}

	.label,
	.source {
		font-family: var(--font-family-quote);
		font-size: 1.5rem;
		font-weight: 400;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		position: relative;
		width: 100%; /* ✅ Neem beschikbare ruimte */
		max-width: 800px;
	}

	.label {
		text-align: left;
	}

	.source {
		text-align: right;
	}

	.label::before,
	.source::after {
		content: '';
		position: absolute;
		width: 50px;
		height: 1px;
		background-color: var(--color-white);
		opacity: 0.5;
	}

	.label::before {
		top: calc(-1 * var(--space-s));
		left: 0;
	}

	.source::after {
		bottom: calc(-1 * var(--space-s));
		right: 0;
	}

	.scroll-indicator {
		position: absolute;
		bottom: var(--space-l);
		left: 50%;
		transform: translateX(-50%);
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 4px;
		font-size: var(--font-size-s);
		text-decoration: none;
		color: var(--color-white);
		opacity: 0.7;
		background: none;
		border: none;
		padding: 0;
		cursor: pointer;
	}

	.scroll-indicator svg {
		animation: bounce 2s infinite;
	}

	@keyframes bounce {
		0%,
		20%,
		50%,
		80%,
		100% {
			transform: translateY(0);
		}
		40% {
			transform: translateY(-10px);
		}
		60% {
			transform: translateY(-5px);
		}
	}

	@media (max-width: 768px) {
		.hero-title {
			font-size: var(--font-size-h2, 2rem);
		}

		.label,
		.source {
			font-size: 1rem;
		}
	}
</style>
