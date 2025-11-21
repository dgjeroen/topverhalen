<script lang="ts">
	import SwitchLogo from './SwitchLogo.svelte';
	import type { Theme } from '$lib/types';
	import { onMount, type Snippet } from 'svelte';

	let {
		label,
		title,
		source,
		theme = {},
		children
	} = $props<{
		label?: string;
		title: string;
		source?: string;
		theme?: Theme;
		children: Snippet;
	}>();

	const t = (key: string, def: any) => (theme as any)?.[key] ?? def;

	let elementsVisible = $state(false);

	onMount(() => {
		const timer = setTimeout(() => (elementsVisible = true), 500);
		return () => clearTimeout(timer);
	});

	function scrollToContent(event: Event) {
		event.preventDefault();
		window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
	}
</script>

<div class="hero-container">
	<div class="background-layer">
		{@render children()}
		<div
			class="overlay"
			style:background-color="rgba(0,0,0, {t('hero-overlay-opacity', 0.5)})"
		></div>
	</div>

	<div
		class="ui-layer"
		style:--d-title-size={t('hero-title-size', '4rem')}
		style:--d-label-size={t('hero-label-size', '1.5rem')}
		style:--m-title-size={t('hero-title-size-mobile', '2.5rem')}
		style:--m-label-size={t('hero-label-size-mobile', '1rem')}
	>
		<header class="header-zone">
			<div class="logo-wrapper">
				<SwitchLogo />
			</div>
		</header>

		<div
			class="content-zone"
			class:visible={elementsVisible}
			style:justify-content={t('hero-position-y', 'center')}
			style:align-items={t('hero-align-items', 'center')}
		>
			<main class="text-wrapper" style:text-align={t('hero-text-align', 'center')}>
				{#if label}
					<span
						class="label"
						style:font-family={t('hero-label-font', 'var(--font-family-quote)')}
						style:color={t('hero-label-color', '#ffffff')}
						style:text-transform={t('hero-label-transform', 'uppercase')}
						style:font-style={t('hero-label-style', 'normal')}
						style:align-self={t('hero-label-align', 'center')}
					>
						{label}
					</span>
				{/if}

				<h1
					class="hero-title"
					style:font-family={t('hero-title-font', 'var(--font-family-quote)')}
					style:color={t('hero-title-color', '#ffffff')}
					style:text-transform={t('hero-title-transform', 'none')}
					style:font-style={t('hero-title-style', 'normal')}
				>
					{title}
				</h1>

				{#if source}
					<span
						class="source"
						style:font-family={t('hero-label-font', 'var(--font-family-quote)')}
						style:color={t('hero-label-color', '#ffffff')}
						style:text-transform={t('hero-label-transform', 'uppercase')}
						style:font-style={t('hero-label-style', 'normal')}
						style:align-self={t('hero-source-align', 'center')}
					>
						{source}
					</span>
				{/if}
			</main>
		</div>

		<div class="footer-zone">
			<button class="scroll-indicator" aria-label="Scroll naar beneden" onclick={scrollToContent}>
				<span>scroll</span>
				<svg
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"><path d="M12 5v14m0 0l-4-4m4 4l4-4" /></svg
				>
			</button>
		</div>
	</div>
</div>

<style>
	.hero-container {
		position: relative;
		height: 100dvh;
		width: 100%;
		overflow: hidden;
		background-color: #000;
	}

	/* Achtergrond vult alles absoluut */
	.background-layer {
		position: absolute;
		inset: 0;
		z-index: 0;
	}

	:global(.hero-background) {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.overlay {
		position: absolute;
		inset: 0;
		z-index: 1;
	}

	/* UI Laag: Flex kolom over de hele hoogte */
	.ui-layer {
		position: absolute;
		inset: 0;
		z-index: 2;
		display: flex;
		flex-direction: column;
		justify-content: space-between; /* Verdeel: Top - Midden - Bottom */
		pointer-events: none; /* Laat kliks door naar video controls indien nodig */

		/* Desktop Defaults */
		--current-title-size: var(--d-title-size);
		--current-label-size: var(--d-label-size);
	}

	/* --- A. HEADER ZONE --- */
	.header-zone {
		flex: 0 0 auto; /* Krimp niet */
		padding: 2rem 1rem 1rem 1rem; /* Ruimte bovenin */
		display: flex;
		justify-content: center;
		pointer-events: auto;
	}

	/* --- B. CONTENT ZONE --- */
	.content-zone {
		flex: 1; /* Pak alle beschikbare ruimte tussen header en footer */
		display: flex; /* Flexbox voor verticale uitlijning tekst (boven/midden/onder) */
		flex-direction: column;

		/* Padding zodat tekst nooit tegen logo of scroll aan komt */
		padding: 1rem 2rem;

		opacity: 0;
		transition: opacity 1s ease-out;
		min-height: 0; /* Fix voor flex overflow issues */
	}
	.content-zone.visible {
		opacity: 1;
	}

	/* De eigenlijke tekst container */
	.text-wrapper {
		display: flex;
		flex-direction: column;
		width: 100%;
		max-width: 1100px;
		pointer-events: auto;
		/* Zorg dat de wrapper zelf niet breder is dan de content als dat niet hoeft */
		width: fit-content;
		max-width: 100%;
	}

	.hero-title {
		font-size: var(--current-title-size);
		font-weight: 700;
		line-height: 1.1;
		margin: 0.5rem 0;
		white-space: pre-wrap;
	}

	.label {
		font-size: var(--current-label-size);
		font-weight: 400;
		letter-spacing: 0.05em;
	}

	.source {
		font-size: var(--current-label-size);
		font-weight: 400;
		letter-spacing: 0.05em;
		margin-top: 0.5rem;
	}

	/* --- C. FOOTER ZONE --- */
	.footer-zone {
		flex: 0 0 auto; /* Krimp niet */
		padding: 1rem 1rem 2rem 1rem; /* Ruimte onderin */
		display: flex;
		justify-content: center;
		pointer-events: auto;
	}

	.scroll-indicator {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 4px;
		color: white;
		background: none;
		border: none;
		opacity: 0.8;
		cursor: pointer;
		font-size: 0.875rem;
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
		.ui-layer {
			--current-title-size: var(--m-title-size);
			--current-label-size: var(--m-label-size);
		}
		.header-zone {
			padding-top: 1.5rem;
		}
		/* Zorg dat het logo niet te groot is op mobiel */
		:global(.header-zone svg),
		:global(.header-zone img) {
			max-width: 100px;
			height: auto;
		}
	}
</style>
