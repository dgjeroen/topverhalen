<script lang="ts">
	import type { TimelineItem, Theme } from '$lib/types';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';

	let {
		timelines,
		title = 'Tijdlijn', // ✅ ADD: Default title
		theme = {},
		useHorizontalLayout = false
	}: {
		timelines: TimelineItem[];
		title?: string;
		theme?: Theme;
		useHorizontalLayout?: boolean;
	} = $props();

	// Check if mobile and desktop should use same styling
	const syncMobileDesktop = $derived(theme['timeline-sync-mobile-desktop'] === 'true');

	let isDesktop = $state(false);
	let verticalTimelineContainer: HTMLElement | null = $state(null);
	let horizontalTimelineContainer: HTMLElement | null = $state(null);
	let horizontalScrollPosition = $state(0);
	let horizontalScrollWidth = $state(0);
	let horizontalClientWidth = $state(0);

	let canScrollLeft = $derived(horizontalScrollPosition > 5);
	let canScrollRight = $derived(
		horizontalScrollPosition < horizontalScrollWidth - horizontalClientWidth - 5
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

{#if isDesktop && !useHorizontalLayout}
	<section
		class="timeline-section"
		style:--timeline-section-margin={theme['timeline-section-margin'] || '4rem'}
		style:--timeline-title-color={theme['timeline-title-color'] || '#111827'}
		style:--timeline-title-size={theme['timeline-title-size'] || '2rem'}
		style:--timeline-title-weight={theme['timeline-title-weight'] || '700'}
		style:--timeline-line-color={theme['timeline-line-color'] || '#f59e0b'}
		style:--timeline-line-width={theme['timeline-line-width'] || '4px'}
		style:--timeline-marker-size={theme['timeline-marker-size'] || '1rem'}
		style:--timeline-marker-bg={theme['timeline-marker-bg'] || '#fdf6e9'}
		style:--timeline-marker-border-color={theme['timeline-marker-border-color'] || '#2c5599'}
		style:--timeline-marker-border-width={theme['timeline-marker-border-width'] || '4px'}
		style:--timeline-card-bg={theme['timeline-card-bg'] || '#fdf6e9'}
		style:--timeline-card-padding={theme['timeline-card-padding'] || '1rem'}
		style:--timeline-card-border-radius={theme['timeline-card-border-radius'] || '0.5rem'}
		style:--timeline-card-shadow={theme['timeline-card-shadow'] || '0 4px 6px rgba(0, 0, 0, 0.1)'}
		style:--timeline-year-color={theme['timeline-year-color'] || '#f59e0b'}
		style:--timeline-year-size={theme['timeline-year-size'] || '1.125rem'}
		style:--timeline-year-weight={theme['timeline-year-weight'] || '700'}
		style:--timeline-heading-color={theme['timeline-heading-color'] || '#111827'}
		style:--timeline-text-color={theme['timeline-text-color'] || '#111827'}
		style:--timeline-text-size={theme['timeline-text-size'] || '0.875rem'}
		style:--timeline-text-line-height={theme['timeline-text-line-height'] || '1.6'}
		style:--timeline-image-max-width={theme['timeline-image-max-width-percent']
			? `${theme['timeline-image-max-width-percent']}%`
			: '100%'}
		style:--timeline-image-border-radius={theme['timeline-image-round'] ? '50%' : '0.25rem'}
		style:--timeline-image-aspect-ratio={theme['timeline-image-round'] ? '1 / 1' : 'auto'}
	>
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
								style:object-position="{item.focusX || 50}% {item.focusY || 50}%"
							/>
						{/if}
						<p class="timeline-event-desc">{@html item.description}</p>
					</div>
				</div>
			{/each}
		</div>
	</section>
{:else}
	<section
		class="horizontal-timeline-section"
		class:sync-desktop={syncMobileDesktop}
		style:--timeline-section-margin={theme['timeline-section-margin'] || '4rem'}
		style:--timeline-title-color={theme['timeline-title-color'] || '#111827'}
		style:--timeline-title-size={theme['timeline-title-size'] || '2rem'}
		style:--timeline-title-weight={theme['timeline-title-weight'] || '700'}
		style:--timeline-mobile-title-align={theme['timeline-mobile-title-align'] || 'left'}
		style:--timeline-mobile-line-color={syncMobileDesktop
			? theme['timeline-line-color'] || '#f59e0b'
			: theme['timeline-mobile-line-color'] || '#f59e0b'}
		style:--timeline-mobile-line-height={theme['timeline-mobile-line-height'] || '4px'}
		style:--timeline-mobile-marker-size={theme['timeline-mobile-marker-size'] || '1rem'}
		style:--timeline-mobile-marker-bg={syncMobileDesktop
			? theme['timeline-marker-bg'] || '#fdf6e9'
			: theme['timeline-mobile-marker-bg'] || '#f59e0b'}
		style:--timeline-mobile-marker-border-color={syncMobileDesktop
			? theme['timeline-marker-border-color'] || '#2c5599'
			: theme['timeline-mobile-marker-border-color'] || '#ffffff'}
		style:--timeline-mobile-marker-border-width={syncMobileDesktop
			? theme['timeline-marker-border-width'] || '4px'
			: theme['timeline-mobile-marker-border-width'] || '2px'}
		style:--timeline-mobile-card-width={theme['timeline-mobile-card-width'] || '260px'}
		style:--timeline-mobile-card-bg={syncMobileDesktop
			? theme['timeline-card-bg'] || '#fdf6e9'
			: theme['timeline-mobile-card-bg'] || '#fdf6e9'}
		style:--timeline-mobile-card-padding={theme['timeline-mobile-card-padding'] || '1rem'}
		style:--timeline-mobile-card-border-radius={theme['timeline-mobile-card-border-radius'] ||
			'0.5rem'}
		style:--timeline-mobile-card-shadow={syncMobileDesktop
			? theme['timeline-card-shadow'] || '0 4px 6px rgba(0, 0, 0, 0.1)'
			: theme['timeline-mobile-card-shadow'] || '0 4px 10px rgba(0, 0, 0, 0.2)'}
		style:--timeline-mobile-card-border-color={syncMobileDesktop
			? 'transparent'
			: theme['timeline-mobile-card-border-color'] || '#e4b483'}
		style:--timeline-mobile-year-color={syncMobileDesktop
			? theme['timeline-year-color'] || '#f59e0b'
			: theme['timeline-mobile-year-color'] || '#78350f'}
		style:--timeline-mobile-year-bg={syncMobileDesktop
			? 'transparent'
			: theme['timeline-mobile-year-bg'] || '#fdf6e9'}
		style:--timeline-mobile-connector-color={syncMobileDesktop
			? theme['timeline-line-color'] || '#f59e0b'
			: theme['timeline-mobile-connector-color'] || '#f59e0b'}
		style:--timeline-mobile-connector-width={theme['timeline-mobile-connector-width'] || '2px'}
		style:--timeline-mobile-image-height={theme['timeline-mobile-image-height'] || '120px'}
		style:--timeline-mobile-button-bg={theme['timeline-mobile-button-bg'] ||
			'rgba(255, 255, 255, 0.9)'}
		style:--timeline-mobile-button-border={theme['timeline-mobile-button-border'] || '#ddd'}
		style:--timeline-mobile-button-icon-color={theme['timeline-mobile-button-icon-color'] ||
			'#78350f'}
		style:--timeline-mobile-button-size={theme['timeline-mobile-button-size'] || '40px'}
		style:--timeline-heading-color={theme['timeline-heading-color'] || '#111827'}
		style:--timeline-text-color={theme['timeline-text-color'] || '#111827'}
		style:--timeline-text-size={theme['timeline-text-size'] || '0.875rem'}
		style:--timeline-text-line-height={theme['timeline-text-line-height'] || '1.6'}
		style:--timeline-image-max-width={theme['timeline-image-max-width-percent']
			? `${theme['timeline-image-max-width-percent']}%`
			: '100%'}
		style:--timeline-image-border-radius={theme['timeline-image-round'] ? '50%' : '0.25rem'}
		style:--timeline-image-aspect-ratio={theme['timeline-image-round'] ? '1 / 1' : 'auto'}
	>
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
									style:object-position="{item.focusX || 50}% {item.focusY || 50}%"
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
	/* 1. GLOBALE STIJLEN - SCOPED!        */
	/* ==================================== */
	.timeline-section,
	.horizontal-timeline-section {
		margin-block: var(--timeline-section-margin, 4rem);
	}

	/* ✅ SCOPED: Alleen binnen timeline sections */
	.timeline-section h2,
	.horizontal-timeline-section h2 {
		font-family: var(--font-family-base, 'Inter', sans-serif);
		font-size: var(--timeline-title-size, 2rem);
		color: var(--timeline-title-color, #111827);
		font-weight: var(--timeline-title-weight, 700);
		margin-bottom: 2rem;
	}

	.horizontal-timeline-section h3 {
		font-family: var(--font-family-base, 'Inter', sans-serif);
		font-size: 1.125rem;
		font-weight: 700;
		color: var(--timeline-heading-color, #111827);
		margin-bottom: 0.5rem;
	}

	.timeline-section p,
	.horizontal-timeline-section p {
		font-size: var(--timeline-text-size, 0.875rem);
		line-height: var(--timeline-text-line-height, 1.6);
		color: var(--timeline-text-color, #111827);
	}

	/* ==================================== */
	/* 2. VERTICAAL (DESKTOP) STYLING       */
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
			font-weight: var(--timeline-year-weight, 700);
			font-size: var(--timeline-year-size, 1.125rem);
			color: var(--timeline-year-color, #f59e0b);
		}
		.timeline-event-image {
			max-width: var(--timeline-image-max-width, 80px);
			height: auto;
			border-radius: var(--timeline-image-border-radius, 0.25rem);
			margin: 0.5rem auto;
			display: block;
			box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
			aspect-ratio: var(--timeline-image-aspect-ratio, auto);
			object-fit: cover;
		}
	}

	/* ===================================== */
	/* 3. HORIZONTAAL STYLING (MOBILE + DESKTOP MET OPTIE) */
	/* ===================================== */
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
		height: var(--timeline-mobile-line-height, 4px);
		background-color: var(--timeline-mobile-line-color, #f59e0b);
		z-index: 1;
	}
	.horizontal-title {
		text-align: var(--timeline-mobile-title-align, left);
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
		width: var(--timeline-mobile-card-width, 260px);
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
		color: var(--timeline-mobile-year-color, #78350f);
		background-color: var(--timeline-mobile-year-bg, #fdf6e9);
		padding: 0 0.5rem;
		border-radius: 4px;
		z-index: 3;
	}
	.timeline-marker {
		position: absolute;
		top: 3.5rem;
		left: 50%;
		transform: translate(-50%, -50%);
		width: var(--timeline-mobile-marker-size, 1rem);
		height: var(--timeline-mobile-marker-size, 1rem);
		background-color: var(--timeline-mobile-marker-bg, #f59e0b);
		border: var(--timeline-mobile-marker-border-width, 2px) solid
			var(--timeline-mobile-marker-border-color, #ffffff);
		border-radius: 50%;
		z-index: 2;
	}
	.connector-line {
		position: absolute;
		top: 3.5rem;
		left: 50%;
		transform: translateX(-50%);
		width: var(--timeline-mobile-connector-width, 2px);
		background-color: var(--timeline-mobile-connector-color, #f59e0b);
		bottom: 0;
	}

	.timeline-card {
		background-color: var(--timeline-mobile-card-bg, #fdf6e9);
		padding: var(--timeline-mobile-card-padding, 1rem);
		margin-top: 4px;
		border-radius: var(--timeline-mobile-card-border-radius, 0.5rem);
		box-shadow: var(--timeline-mobile-card-shadow, 0 4px 10px rgba(0, 0, 0, 0.2));
		border: 1px solid var(--timeline-mobile-card-border-color, #e4b483);
		width: 100%;
		position: relative;
	}
	.card-image {
		width: var(--timeline-image-max-width, 100%);
		height: auto;
		object-fit: cover;
		border-radius: var(--timeline-image-border-radius, 4px);
		margin: 0 auto 0.5rem auto;
		display: block;
		aspect-ratio: var(--timeline-image-aspect-ratio, auto);
	}

	.scroll-button {
		position: absolute;
		top: 50%;
		transform: translateY(-50%);
		background-color: var(--timeline-mobile-button-bg, rgba(255, 255, 255, 0.9));
		border: 1px solid var(--timeline-mobile-button-border, #ddd);
		border-radius: 50%;
		width: var(--timeline-mobile-button-size, 40px);
		height: var(--timeline-mobile-button-size, 40px);
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
		stroke: var(--timeline-mobile-button-icon-color, #78350f);
		fill: none;
		stroke-width: 2.5;
		stroke-linecap: round;
		stroke-linejoin: round;
	}
</style>
