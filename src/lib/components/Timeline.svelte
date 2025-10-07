<script lang="ts">
	import { browser } from '$app/environment';
	import type { TimelineItem } from '$lib/types';
	import { onMount, onDestroy } from 'svelte';

	// Vervang $props() door export let
	export let timelines: TimelineItem[];

	let isDesktop = false;

	let verticalTimelineContainer: HTMLElement | null = null;
	let horizontalTimelineContainer: HTMLElement | null = null;

	let horizontalScrollPosition = 0;
	let horizontalScrollWidth = 0;
	let horizontalClientWidth = 0;

	$: canScrollLeft = horizontalScrollPosition > 5;
	$: canScrollRight = horizontalScrollPosition < horizontalScrollWidth - horizontalClientWidth - 5;

	const scrollHorizontal = (direction: 'prev' | 'next') => {
		if (!horizontalTimelineContainer) return;
		// Scroll de breedte van één item
		const scrollAmount = direction === 'next' ? 292 : -292; // 260px breed + 32px marge
		horizontalTimelineContainer.scrollBy({ left: scrollAmount, behavior: 'smooth' });
	};

	onMount(() => {
		if (!browser) return;

		// Functie om timeline items te resetten (geen wijzigingen hier)
		const resetTimelineItems = () => {
			if (verticalTimelineContainer) {
				verticalTimelineContainer.querySelectorAll('.timeline-event').forEach((event) => {
					event.classList.add('opacity-0', 'translate-y-5');
				});
			}
		};

		// Aangepaste functie om de IntersectionObserver te initialiseren
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

		// Aangepaste checkSize functie
		const checkSize = () => {
			const wasDesktop = isDesktop;
			isDesktop = window.innerWidth >= 768;

			if (isDesktop) {
				// Wacht even tot de DOM is bijgewerkt
				setTimeout(() => {
					resetTimelineItems();
					initializeVerticalTimelineObserver();
				}, 0);
			}
		};

		checkSize();
		window.addEventListener('resize', checkSize);

		// Initialiseer de observer met een kleine vertraging
		setTimeout(() => {
			initializeVerticalTimelineObserver();
		}, 100);

		// Scroll listener voor de horizontale (mobiele) tijdlijn
		const handleScroll = () => {
			if (!horizontalTimelineContainer) return;
			horizontalScrollPosition = horizontalTimelineContainer.scrollLeft;
			horizontalScrollWidth = horizontalTimelineContainer.scrollWidth;
			horizontalClientWidth = horizontalTimelineContainer.clientWidth;
		};

		if (horizontalTimelineContainer) {
			handleScroll(); // Initial state
			horizontalTimelineContainer.addEventListener('scroll', handleScroll, { passive: true });
		}

		// Cleanup functie
		return () => {
			window.removeEventListener('resize', checkSize);
			if (horizontalTimelineContainer) {
				horizontalTimelineContainer.removeEventListener('scroll', handleScroll);
			}
		};
	});

	// Scroll-waarden direct updaten als de container verandert
	$: if (horizontalTimelineContainer) {
		horizontalScrollPosition = horizontalTimelineContainer.scrollLeft;
		horizontalScrollWidth = horizontalTimelineContainer.scrollWidth;
		horizontalClientWidth = horizontalTimelineContainer.clientWidth;
	}
</script>

{#if isDesktop}
	<section class="timeline-section">
		<div class="text-center">
			<h2>Tijdlijn</h2>
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
	<section class="horizontal-timeline-section">
		<h2 class="horizontal-title">De kop van het verhaal</h2>
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
				on:click={() => scrollHorizontal('prev')}
				disabled={!canScrollLeft}
				aria-label="Vorige items"
				class="scroll-button scroll-left"
			>
				<svg viewBox="0 0 24 24"><path d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
			</button>
			<button
				on:click={() => scrollHorizontal('next')}
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
	/* 1. GLOBALE STIJLEN                 */
	/* ==================================== */
	:root {
		--color-text: #111827;
		--color-white: #ffffff;
		--color-background-light: #fdf6e9;
		--color-accent-blue: #2c5599;
		--color-accent-amber: #f59e0b;
		--color-brown-text: #78350f;
	}
	section {
		margin-block: 4rem;
	}
	h2,
	h3 {
		font-family: var(--font-family-base, 'Inter', sans-serif);
		font-weight: 700;
	}
	h2 {
		font-size: 2rem;
		margin-bottom: 2rem;
	}
	h3 {
		font-size: 1.125rem;
		margin-bottom: 0.5rem;
	}
	p {
		font-size: 0.875rem;
		line-height: 1.6;
	}

	/* ==================================== */
	/* 2. VERTICAAL (DESKTOP) STYLING       */
	/* ==================================== */
	@media (min-width: 768px) {
		.timeline-section {
			max-width: 720px;
			margin-inline: auto;
			color: var(--color-text);
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
			background-color: var(--color-accent-amber);
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
			top: 1.5rem; /* Aangepast om beter bij de kaart te passen */
			width: 1rem;
			height: 1rem;
			background-color: var(--color-background-light);
			border: 4px solid var(--color-accent-blue);
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
			background-color: var(--color-background-light);
			padding: 1rem;
			border-radius: 0.5rem;
			box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
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
			color: var(--color-accent-amber);
		}
		.timeline-event-image {
			max-width: 80px;
			height: auto;
			border-radius: 0.25rem;
			margin: 0.5rem auto;
			display: block;
			box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
		}
	}

	/* ===================================== */
	/* 3. HORIZONTAAL (MOBIEL) STYLING       */
	/* ===================================== */
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
			background-color: var(--color-accent-amber);
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
			-ms-overflow-style: none; /* Verberg scrollbar */
			scrollbar-width: none; /* Verberg scrollbar */
			scroll-snap-type: x mandatory;
			/* Creëert het "doorkijk" effect */
			padding-inline: calc(50% - 130px); /* 130px = helft van kaartbreedte */
		}
		.horizontal-scroll-container::-webkit-scrollbar {
			display: none;
		} /* Verberg scrollbar */

		/* De horizontale lijn */

		/* De Tijdlijn Groep */
		.timeline-item-group {
			position: relative;
			flex-shrink: 0;
			width: 260px;
			scroll-snap-align: center;
			display: flex; /* Maakt flexbox layout mogelijk voor de inhoud */
			flex-direction: column;
			justify-content: flex-end; /* Duwt de kaart naar de bodem */
			margin-inline: 16px; /* Ruimte tussen de kaarten */
			padding-top: 5rem; /* Ruimte voor de details boven de kaart */
			z-index: 2;
		}

		/* De Details (Absoluut gepositioneerd) */
		.timeline-year {
			position: absolute;
			top: 1.5rem;
			left: 50%;
			transform: translateX(-50%);
			font-weight: 700;
			color: var(--color-brown-text);
			background-color: var(--color-background-light);
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
			background-color: var(--color-accent-amber);
			border: 2px solid var(--color-white);
			border-radius: 50%;
			z-index: 2;
		}
		.connector-line {
			position: absolute;
			top: 3.5rem; /* Dit blijft hetzelfde, aangezien het de positie van de marker is */
			left: 50%;
			transform: translateX(-50%);
			width: 2px;
			background-color: var(--color-accent-amber);
			/* Verwijder de vaste hoogte */
			/* height: 1.5rem; */

			/* Laat de lijn doorlopen tot aan de kaart */
			bottom: 0;
		}

		/* De Kaart */
		.timeline-card {
			background-color: var(--color-background-light);
			padding: 1rem;
			margin-top: 4px;
			border-radius: 0.5rem;
			box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
			border: 1px solid #e4b483;
			width: 100%;
			position: relative;
		}
		.card-image {
			width: 100%;
			height: 120px;
			object-fit: cover;
			border-radius: 4px;
			margin-bottom: 0.5rem;
		}

		/* Scroll Knoppen */
		.scroll-button {
			position: absolute;
			top: 50%;
			transform: translateY(-50%);
			background-color: rgba(255, 255, 255, 0.9);
			border: 1px solid #ddd;
			border-radius: 50%;
			width: 40px;
			height: 40px;
			display: flex;
			align-items: center;
			justify-content: center;
			cursor: pointer;
			z-index: 20;
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
			stroke: var(--color-brown-text);
			fill: none;
			stroke-width: 2.5;
			stroke-linecap: round;
			stroke-linejoin: round;
		}
	}
</style>
