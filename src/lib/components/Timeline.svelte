<script lang="ts">
	import { browser } from '$app/environment';
	import type { TimelineItem, Theme } from '$lib/types';
	import { onMount } from 'svelte';

	let {
		title = 'Tijdlijn',
		timelines,
		theme = {}
	} = $props<{
		title?: string;
		timelines: TimelineItem[];
		theme?: Theme;
	}>();

	let isDesktop = $state(false);
	let verticalTimelineContainer = $state<HTMLElement | null>(null);
	let horizontalTimelineContainer = $state<HTMLElement | null>(null);
	let horizontalScrollPosition = $state(0);
	let horizontalScrollWidth = $state(0);
	let horizontalClientWidth = $state(0);

	const canScrollLeft = $derived(horizontalScrollPosition > 5);
	const canScrollRight = $derived(
		horizontalScrollPosition < horizontalScrollWidth - horizontalClientWidth - 5
	);

	// ✅ UNIFIED: Één set CSS variabelen voor beide layouts
	const cssVars = $derived(
		[
			// Titel
			`--timeline-title-size: ${theme['timeline-title-size'] || '2rem'}`,
			`--timeline-title-color: ${theme['timeline-title-color'] || '#111827'}`,

			// Lijn
			`--timeline-line-color: ${theme['timeline-line-color'] || '#f59e0b'}`,
			`--timeline-line-width: ${theme['timeline-line-width'] || '4px'}`,

			// Markers
			`--timeline-marker-bg: ${theme['timeline-marker-bg'] || '#fdf6e9'}`,
			`--timeline-marker-border-color: ${theme['timeline-marker-border-color'] || '#2c5599'}`,
			`--timeline-marker-border-width: ${theme['timeline-marker-border-width'] || '4px'}`,
			`--timeline-marker-size: ${theme['timeline-marker-size'] || '1rem'}`,

			// Jaar
			`--timeline-year-color: ${theme['timeline-year-color'] || '#f59e0b'}`,
			`--timeline-year-bg: ${theme['timeline-year-bg'] || 'transparent'}`,
			`--timeline-year-font-size: ${theme['timeline-year-font-size'] || '1.125rem'}`,
			`--timeline-year-font-weight: ${theme['timeline-year-font-weight'] || '700'}`,
			`--timeline-year-padding: ${theme['timeline-year-padding'] || '0 0.5rem'}`,
			`--timeline-year-border-radius: ${theme['timeline-year-border-radius'] || '4px'}`,

			// Kaarten
			`--timeline-card-bg: ${theme['timeline-card-bg'] || '#fdf6e9'}`,
			`--timeline-card-border-color: ${theme['timeline-card-border-color'] || '#e4b483'}`,
			`--timeline-card-border-width: ${theme['timeline-card-border-width'] || '1px'}`,
			`--timeline-card-border-radius: ${theme['timeline-card-border-radius'] || '0.5rem'}`,
			`--timeline-card-shadow: ${theme['timeline-card-shadow'] || '0 4px 6px rgba(0, 0, 0, 0.1)'}`,
			`--timeline-card-padding: ${theme['timeline-card-padding'] || '1rem'}`,

			// Tekst
			`--timeline-text-color: ${theme['timeline-text-color'] || '#111827'}`,
			`--timeline-text-font-size: ${theme['timeline-text-font-size'] || '0.875rem'}`,
			`--timeline-text-line-height: ${theme['timeline-text-line-height'] || '1.6'}`,
			`--timeline-heading-color: ${theme['timeline-heading-color'] || '#111827'}`,
			`--timeline-heading-font-size: ${theme['timeline-heading-font-size'] || '1.125rem'}`,
			`--timeline-heading-font-weight: ${theme['timeline-heading-font-weight'] || '700'}`,

			// Afbeeldingen
			`--timeline-image-border-radius: ${theme['timeline-image-border-radius'] || '0.25rem'}`,
			`--timeline-image-shadow: ${theme['timeline-image-shadow'] || '0 1px 3px rgba(0, 0, 0, 0.1)'}`,

			// Connector
			`--timeline-connector-color: ${theme['timeline-connector-color'] || '#f59e0b'}`,
			`--timeline-connector-width: ${theme['timeline-connector-width'] || '2px'}`,

			// Scroll buttons
			`--timeline-scroll-btn-bg: ${theme['timeline-scroll-btn-bg'] || 'rgba(255, 255, 255, 0.9)'}`,
			`--timeline-scroll-btn-border: ${theme['timeline-scroll-btn-border'] || '#ddd'}`,
			`--timeline-scroll-btn-color: ${theme['timeline-scroll-btn-color'] || '#78350f'}`,
			`--timeline-scroll-btn-hover-bg: ${theme['timeline-scroll-btn-hover-bg'] || 'rgba(255, 255, 255, 1)'}`,
			`--timeline-scroll-btn-size: ${theme['timeline-scroll-btn-size'] || '40px'}`
		].join(';')
	);

	const scrollHorizontal = (direction: 'prev' | 'next') => {
		if (!horizontalTimelineContainer) return;
		const scrollAmount = direction === 'next' ? 292 : -292;
		horizontalTimelineContainer.scrollBy({ left: scrollAmount, behavior: 'smooth' });
	};

	onMount(() => {
		if (!browser) return;

		const resetTimelineItems = () => {
			if (verticalTimelineContainer) {
				verticalTimelineContainer.querySelectorAll('.timeline-event').forEach((event) => {
					event.classList.add('opacity-0', 'translate-y-5');
				});
			}
		};

		const initializeVerticalTimelineObserver = () => {
			if (!isDesktop || !verticalTimelineContainer) return;

			const verticalTimelineObserver = new IntersectionObserver(
				(entries) => {
					entries.forEach((entry) => {
						if (entry.isIntersecting) {
							entry.target.classList.remove('opacity-0', 'translate-y-5');
							verticalTimelineObserver.unobserve(entry.target);
						}
					});
				},
				{ threshold: 0.2, rootMargin: '0px 0px -100px 0px' }
			);

			verticalTimelineContainer.querySelectorAll('.timeline-event').forEach((event) => {
				verticalTimelineObserver.observe(event);
			});
		};

		const checkSize = () => {
			isDesktop = window.innerWidth >= 768;

			if (isDesktop) {
				setTimeout(() => {
					resetTimelineItems();
					initializeVerticalTimelineObserver();
				}, 0);
			}
		};

		checkSize();
		window.addEventListener('resize', checkSize);

		setTimeout(() => {
			initializeVerticalTimelineObserver();
		}, 100);

		const handleScroll = () => {
			if (!horizontalTimelineContainer) return;
			horizontalScrollPosition = horizontalTimelineContainer.scrollLeft;
			horizontalScrollWidth = horizontalTimelineContainer.scrollWidth;
			horizontalClientWidth = horizontalTimelineContainer.clientWidth;
		};

		if (horizontalTimelineContainer) {
			handleScroll();
			horizontalTimelineContainer.addEventListener('scroll', handleScroll, { passive: true });
		}

		return () => {
			window.removeEventListener('resize', checkSize);
			if (horizontalTimelineContainer) {
				horizontalTimelineContainer.removeEventListener('scroll', handleScroll);
			}
		};
	});

	$effect(() => {
		if (horizontalTimelineContainer) {
			horizontalScrollPosition = horizontalTimelineContainer.scrollLeft;
			horizontalScrollWidth = horizontalTimelineContainer.scrollWidth;
			horizontalClientWidth = horizontalTimelineContainer.clientWidth;
		}
	});
</script>

{#if isDesktop}
	<section class="timeline-section" style={cssVars}>
		<div class="text-center">
			<h2>{title}</h2>
		</div>
		<div bind:this={verticalTimelineContainer} class="timeline-container">
			{#each timelines as item, index}
				<div
					class="timeline-event opacity-0 translate-y-5"
					class:is-odd={index % 2 !== 0}
					class:is-even={index % 2 === 0}
				>
					<div class="timeline-marker"></div>
					<div class="timeline-event-content">
						<div class="timeline-event-year">{item.year}</div>
						{#if item.imageSrc}
							<img
								class="timeline-event-image"
								src={item.imageSrc}
								alt={item.imageAlt || 'Tijdlijn afbeelding'}
								loading="lazy"
								decoding="async"
							/>
						{/if}
						<p class="timeline-event-desc">{@html item.description}</p>
					</div>
				</div>
			{/each}
		</div>
	</section>
{:else}
	<section class="horizontal-timeline-section" style={cssVars}>
		<h2 class="horizontal-title">{title}</h2>
		<div class="horizontal-timeline-wrapper">
			<div class="horizontal-line"></div>
			<div class="horizontal-scroll-container" bind:this={horizontalTimelineContainer}>
				{#each timelines as item}
					<div class="timeline-item-group">
						<div class="timeline-year">{item.year}</div>
						<div class="timeline-marker"></div>
						<div class="connector-line"></div>

						<div class="timeline-card">
							{#if item.title}
								<h3>{item.title}</h3>
							{/if}
							{#if item.imageSrc}
								<img
									src={item.imageSrc}
									alt={item.imageAlt || 'Afbeelding tijdlijnitem'}
									loading="lazy"
									decoding="async"
									class="card-image"
								/>
							{/if}
							<p>{@html item.description}</p>
						</div>
					</div>
				{/each}
			</div>
			<button
				onclick={() => scrollHorizontal('prev')}
				disabled={!canScrollLeft}
				aria-label="Vorige items"
				class="scroll-button scroll-left"
			>
				<svg viewBox="0 0 24 24"><path d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
			</button>
			<button
				onclick={() => scrollHorizontal('next')}
				disabled={!canScrollRight}
				aria-label="Volgende items"
				class="scroll-button scroll-right"
			>
				<svg viewBox="0 0 24 24"><path d="m8.25 4.5 7.5 7.5-7.5 7.5" /></svg>
			</button>
		</div>
	</section>
{/if}

<style>
	/* ==================================== */
	/* 1. GLOBALE STIJLEN                  */
	/* ==================================== */
	section {
		margin-block: 4rem;
	}

	h2,
	h3 {
		font-family: var(--font-family-base, 'Inter', sans-serif);
	}

	h2 {
		font-size: var(--timeline-title-size, 2rem);
		color: var(--timeline-title-color, #111827);
		margin-bottom: 2rem;
		font-weight: 700;
	}

	h3 {
		font-size: var(--timeline-heading-font-size, 1.125rem);
		font-weight: var(--timeline-heading-font-weight, 700);
		color: var(--timeline-heading-color, #111827);
		margin-bottom: 0.5rem;
	}

	p {
		font-size: var(--timeline-text-font-size, 0.875rem);
		line-height: var(--timeline-text-line-height, 1.6);
		color: var(--timeline-text-color, #111827);
		margin: 0;
	}

	/* ==================================== */
	/* 2. VERTICAAL (DESKTOP) STYLING      */
	/* ==================================== */
	@media (min-width: 768px) {
		.timeline-section {
			max-width: 720px;
			margin-inline: auto;
		}

		.text-center {
			text-align: center;
		}

		.timeline-container {
			position: relative;
			padding-block: 1rem;
		}

		.timeline-container::before {
			content: '';
			position: absolute;
			left: 50%;
			transform: translateX(-50%);
			top: 0;
			bottom: 0;
			width: var(--timeline-line-width, 4px);
			background-color: var(--timeline-line-color, #f59e0b);
		}

		.timeline-event {
			position: relative;
			margin-bottom: -39%;
			padding-bottom: 30%;
			width: 50%;
			transition:
				opacity 1s ease-out,
				transform 1s ease-out;
		}

		.timeline-event:last-child {
			margin-bottom: 0;
			padding-bottom: 0;
		}

		.opacity-0 {
			opacity: 0;
		}

		.translate-y-5 {
			transform: translateY(20px);
		}

		.is-even {
			margin-left: 50%;
			padding-left: 4rem;
		}

		.is-odd {
			margin-right: 50%;
			padding-right: 4rem;
		}

		.timeline-marker {
			position: absolute;
			top: 1.5rem;
			width: var(--timeline-marker-size, 1rem);
			height: var(--timeline-marker-size, 1rem);
			background-color: var(--timeline-marker-bg, #fdf6e9);
			border: var(--timeline-marker-border-width, 4px) solid
				var(--timeline-marker-border-color, #2c5599);
			border-radius: 50%;
			z-index: 2;
		}

		.is-even .timeline-marker {
			left: 0;
			transform: translateX(-50%);
		}

		.is-odd .timeline-marker {
			right: 0;
			transform: translateX(50%);
		}

		.timeline-event-content {
			background-color: var(--timeline-card-bg, #fdf6e9);
			padding: var(--timeline-card-padding, 1rem);
			border-radius: var(--timeline-card-border-radius, 0.5rem);
			box-shadow: var(--timeline-card-shadow, 0 4px 6px rgba(0, 0, 0, 0.1));
			border: var(--timeline-card-border-width, 1px) solid
				var(--timeline-card-border-color, #e4b483);
			position: relative;
			z-index: 1;
		}

		.is-even .timeline-event-content {
			margin-left: 1rem;
		}

		.is-odd .timeline-event-content {
			margin-right: 1rem;
		}

		.timeline-event-year {
			font-weight: var(--timeline-year-font-weight, 700);
			font-size: var(--timeline-year-font-size, 1.125rem);
			color: var(--timeline-year-color, #f59e0b);
			background-color: var(--timeline-year-bg, transparent);
			padding: var(--timeline-year-padding, 0 0.5rem);
			border-radius: var(--timeline-year-border-radius, 4px);
			text-align: left;
			display: block;
			width: fit-content;
		}

		.is-odd .timeline-event-year {
			text-align: right;
			margin-left: auto;
		}

		.timeline-event-image {
			width: 100%;
			max-width: 100%;
			height: auto;
			border-radius: var(--timeline-image-border-radius, 0.25rem);
			margin: 0.5rem 0;
			display: block;
			box-shadow: var(--timeline-image-shadow, 0 1px 3px rgba(0, 0, 0, 0.1));
		}

		.timeline-event-desc {
			color: var(--timeline-text-color, #111827);
		}
	}

	/* ==================================== */
	/* 3. HORIZONTAAL (MOBIEL) STYLING     */
	/* ==================================== */
	@media (max-width: 767px) {
		.horizontal-timeline-section {
			padding-block: 2rem;
		}

		.horizontal-timeline-wrapper {
			position: relative;
		}

		.horizontal-line {
			position: absolute;
			left: 0;
			right: 0;
			top: 3.5rem;
			height: var(--timeline-line-width, 4px);
			background-color: var(--timeline-line-color, #f59e0b);
			z-index: 1;
		}

		.horizontal-title {
			text-align: left;
		}

		.horizontal-scroll-container {
			position: relative;
			display: flex;
			overflow-x: auto;
			scroll-behavior: smooth;
			-ms-overflow-style: none;
			scrollbar-width: none;
			scroll-snap-type: x mandatory;
			padding-inline: calc(50% - 130px);
		}

		.horizontal-scroll-container::-webkit-scrollbar {
			display: none;
		}

		.timeline-item-group {
			position: relative;
			flex-shrink: 0;
			width: 260px;
			scroll-snap-align: center;
			display: flex;
			flex-direction: column;
			justify-content: flex-end;
			margin-inline: 16px;
			padding-top: 5rem;
			z-index: 2;
		}

		.timeline-year {
			position: absolute;
			top: 1.5rem;
			left: 50%;
			transform: translateX(-50%);
			font-weight: var(--timeline-year-font-weight, 700);
			font-size: var(--timeline-year-font-size, 1.125rem);
			color: var(--timeline-year-color, #78350f);
			background-color: var(--timeline-year-bg, #fdf6e9);
			padding: var(--timeline-year-padding, 0 0.5rem);
			border-radius: var(--timeline-year-border-radius, 4px);
			z-index: 3;
		}

		.timeline-marker {
			position: absolute;
			top: 3.5rem;
			left: 50%;
			transform: translate(-50%, -50%);
			width: var(--timeline-marker-size, 1rem);
			height: var(--timeline-marker-size, 1rem);
			background-color: var(--timeline-marker-bg, #f59e0b);
			border: var(--timeline-marker-border-width, 2px) solid
				var(--timeline-marker-border-color, #ffffff);
			border-radius: 50%;
			z-index: 2;
		}

		.connector-line {
			position: absolute;
			top: 3.5rem;
			left: 50%;
			transform: translateX(-50%);
			width: var(--timeline-connector-width, 2px);
			background-color: var(--timeline-connector-color, #f59e0b);
			bottom: 0;
		}

		.timeline-card {
			background-color: var(--timeline-card-bg, #fdf6e9);
			padding: var(--timeline-card-padding, 1rem);
			margin-top: 4px;
			border-radius: var(--timeline-card-border-radius, 0.5rem);
			box-shadow: var(--timeline-card-shadow, 0 4px 10px rgba(0, 0, 0, 0.2));
			border: var(--timeline-card-border-width, 1px) solid
				var(--timeline-card-border-color, #e4b483);
			width: 100%;
			position: relative;
		}

		.card-image {
			width: 100%;
			height: auto;
			max-height: 200px;
			object-fit: cover;
			border-radius: var(--timeline-image-border-radius, 4px);
			margin-bottom: 0.5rem;
			box-shadow: var(--timeline-image-shadow, 0 1px 3px rgba(0, 0, 0, 0.1));
		}

		.scroll-button {
			position: absolute;
			top: 50%;
			transform: translateY(-50%);
			background-color: var(--timeline-scroll-btn-bg, rgba(255, 255, 255, 0.9));
			border: 1px solid var(--timeline-scroll-btn-border, #ddd);
			border-radius: 50%;
			width: var(--timeline-scroll-btn-size, 40px);
			height: var(--timeline-scroll-btn-size, 40px);
			display: flex;
			align-items: center;
			justify-content: center;
			cursor: pointer;
			z-index: 20;
			transition: background-color 0.2s ease;
		}

		.scroll-button:hover:not(:disabled) {
			background-color: var(--timeline-scroll-btn-hover-bg, rgba(255, 255, 255, 1));
		}

		.scroll-button:disabled {
			opacity: 0.3;
			cursor: not-allowed;
		}

		.scroll-left {
			left: 1rem;
		}

		.scroll-right {
			right: 1rem;
		}

		.scroll-button svg {
			width: 1.5rem;
			height: 1.5rem;
			stroke: var(--timeline-scroll-btn-color, #78350f);
			fill: none;
			stroke-width: 2.5;
			stroke-linecap: round;
			stroke-linejoin: round;
		}
	}
</style>
