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

	// ✅ FIXED: Alle CSS variabelen in één string
	const cssVars = $derived(
		[
			// Titel
			`--timeline-title-size: ${theme['timeline-title-size'] || '2rem'}`,
			`--timeline-title-color: ${theme['timeline-title-color'] || '#111827'}`,

			// Desktop
			`--timeline-vertical-line-color: ${theme['timeline-vertical-line-color'] || '#f59e0b'}`,
			`--timeline-vertical-marker-bg: ${theme['timeline-vertical-marker-bg'] || '#fdf6e9'}`,
			`--timeline-vertical-marker-border: ${theme['timeline-vertical-marker-border'] || '#2c5599'}`,
			`--timeline-vertical-card-bg: ${theme['timeline-vertical-card-bg'] || '#fdf6e9'}`,
			`--timeline-vertical-card-shadow: ${theme['timeline-vertical-card-shadow'] || '0 4px 6px rgba(0, 0, 0, 0.1)'}`,
			`--timeline-vertical-year-color: ${theme['timeline-vertical-year-color'] || '#f59e0b'}`,
			`--timeline-vertical-text-color: ${theme['timeline-vertical-text-color'] || '#111827'}`,

			// Mobile
			`--timeline-horizontal-line-color: ${theme['timeline-horizontal-line-color'] || '#f59e0b'}`,
			`--timeline-horizontal-marker-bg: ${theme['timeline-horizontal-marker-bg'] || '#f59e0b'}`,
			`--timeline-horizontal-marker-border: ${theme['timeline-horizontal-marker-border'] || '#ffffff'}`,
			`--timeline-horizontal-card-bg: ${theme['timeline-horizontal-card-bg'] || '#fdf6e9'}`,
			`--timeline-horizontal-card-border: ${theme['timeline-horizontal-card-border'] || '#e4b483'}`,
			`--timeline-horizontal-card-shadow: ${theme['timeline-horizontal-card-shadow'] || '0 4px 10px rgba(0, 0, 0, 0.2)'}`,
			`--timeline-horizontal-year-color: ${theme['timeline-horizontal-year-color'] || '#78350f'}`,
			`--timeline-horizontal-year-bg: ${theme['timeline-horizontal-year-bg'] || '#fdf6e9'}`,
			`--timeline-horizontal-text-color: ${theme['timeline-horizontal-text-color'] || '#111827'}`,
			`--timeline-horizontal-connector-color: ${theme['timeline-horizontal-connector-color'] || '#f59e0b'}`,

			// Scroll buttons
			`--timeline-scroll-btn-bg: ${theme['timeline-scroll-btn-bg'] || 'rgba(255, 255, 255, 0.9)'}`,
			`--timeline-scroll-btn-border: ${theme['timeline-scroll-btn-border'] || '#ddd'}`,
			`--timeline-scroll-btn-color: ${theme['timeline-scroll-btn-color'] || '#78350f'}`,
			`--timeline-scroll-btn-hover-bg: ${theme['timeline-scroll-btn-hover-bg'] || 'rgba(255, 255, 255, 1)'}`
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
		font-weight: 700;
	}

	h2 {
		font-size: var(--timeline-title-size, 2rem);
		color: var(--timeline-title-color, #111827);
		margin-bottom: 2rem;
	}

	h3 {
		font-size: 1.125rem;
		margin-bottom: 0.5rem;
		color: inherit;
	}

	p {
		font-size: 0.875rem;
		line-height: 1.6;
		color: inherit;
	}

	/* ==================================== */
	/* 2. VERTICAAL (DESKTOP) STYLING      */
	/* ==================================== */
	@media (min-width: 768px) {
		.timeline-section {
			max-width: 720px;
			margin-inline: auto;
			color: var(--timeline-vertical-text-color, #111827);
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
			width: 4px;
			background-color: var(--timeline-vertical-line-color, #f59e0b);
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
			width: 1rem;
			height: 1rem;
			background-color: var(--timeline-vertical-marker-bg, #fdf6e9);
			border: 4px solid var(--timeline-vertical-marker-border, #2c5599);
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
			background-color: var(--timeline-vertical-card-bg, #fdf6e9);
			padding: 1rem;
			border-radius: 0.5rem;
			box-shadow: var(--timeline-vertical-card-shadow, 0 4px 6px rgba(0, 0, 0, 0.1));
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
			font-weight: 700;
			font-size: 1.125rem;
			color: var(--timeline-vertical-year-color, #f59e0b);
			/* ✅ NIEUW: Default links uitlijnen */
			text-align: left;
		}

		/* ✅ NIEUW: Rechter items (odd) krijgen rechts uitlijning */
		.is-odd .timeline-event-year {
			text-align: right;
		}

		.timeline-event-image {
			/* ✅ FIXED: Full width i.p.v. max-width: 80px */
			width: 100%;
			max-width: 100%;
			height: auto;
			border-radius: 0.25rem;
			margin: 0.5rem 0; /* ✅ FIXED: Verticale margin alleen */
			display: block;
			box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
		}

		.timeline-event-desc {
			color: var(--timeline-vertical-text-color, #111827);
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
			height: 4px;
			background-color: var(--timeline-horizontal-line-color, #f59e0b);
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
			font-weight: 700;
			color: var(--timeline-horizontal-year-color, #78350f);
			background-color: var(--timeline-horizontal-year-bg, #fdf6e9);
			padding: 0 0.5rem;
			border-radius: 4px;
			z-index: 3;
		}

		.timeline-marker {
			position: absolute;
			top: 3.5rem;
			left: 50%;
			transform: translate(-50%, -50%);
			width: 1rem;
			height: 1rem;
			background-color: var(--timeline-horizontal-marker-bg, #f59e0b);
			border: 2px solid var(--timeline-horizontal-marker-border, #ffffff);
			border-radius: 50%;
			z-index: 2;
		}

		.connector-line {
			position: absolute;
			top: 3.5rem;
			left: 50%;
			transform: translateX(-50%);
			width: 2px;
			background-color: var(--timeline-horizontal-connector-color, #f59e0b);
			bottom: 0;
		}

		.timeline-card {
			background-color: var(--timeline-horizontal-card-bg, #fdf6e9);
			padding: 1rem;
			margin-top: 4px;
			border-radius: 0.5rem;
			box-shadow: var(--timeline-horizontal-card-shadow, 0 4px 10px rgba(0, 0, 0, 0.2));
			border: 1px solid var(--timeline-horizontal-card-border, #e4b483);
			width: 100%;
			position: relative;
		}

		.timeline-card h3 {
			color: var(--timeline-horizontal-text-color, #111827);
			font-size: 1.125rem;
			margin-bottom: 0.5rem;
		}

		.timeline-card p {
			color: var(--timeline-horizontal-text-color, #111827);
			font-size: 0.875rem;
			line-height: 1.6;
			margin: 0;
		}

		/* ✅ FIXED: Full width afbeelding */
		.card-image {
			width: 100%;
			height: auto; /* ✅ CHANGED: Auto height i.p.v. fixed 120px */
			max-height: 200px; /* ✅ NIEUW: Max height om te grote foto's te voorkomen */
			object-fit: cover;
			border-radius: 4px;
			margin-bottom: 0.5rem;
		}

		.scroll-button {
			position: absolute;
			top: 50%;
			transform: translateY(-50%);
			background-color: var(--timeline-scroll-btn-bg, rgba(255, 255, 255, 0.9));
			border: 1px solid var(--timeline-scroll-btn-border, #ddd);
			border-radius: 50%;
			width: 40px;
			height: 40px;
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
