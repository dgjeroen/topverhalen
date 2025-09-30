<script lang="ts">
	import type { QuoteContent } from '$lib/types';

	let { text, author }: QuoteContent = $props();

	// State voor de animatie
	let typingProgress = $state(0);
	let showAuthor = $state(false);

	// NIEUW: Een state-variabele om een referentie naar het DOM-element te bewaren
	let blockquoteEl = $state<HTMLElement | undefined>();

	// De $effect beheert nu de visibility-check ÉN de animatie
	$effect(() => {
		const element = blockquoteEl;
		if (!element) return; // Wacht tot het element in de DOM is

		// We hebben een timer-variabele nodig die in de hele effect-scope bekend is
		// voor de cleanup-functie.
		let typingTimer: ReturnType<typeof setInterval>;

		const observer = new IntersectionObserver(
			([entry]) => {
				// Als het element in beeld is EN we nog niet zijn begonnen met typen...
				if (entry.isIntersecting && typingProgress === 0) {
					// START DE TYPE-ANIMATIE (deze code is hierheen verplaatst)
					const typeSpeed = 20;
					const authorDelay = 500;
					let charIndex = 0;

					typingTimer = setInterval(() => {
						if (charIndex < text.length) {
							typingProgress = charIndex + 1;
							charIndex++;
						} else {
							clearInterval(typingTimer);
							setTimeout(() => (showAuthor = true), authorDelay);
						}
					}, typeSpeed);

					// Zodra de animatie is gestart, hebben we de observer niet meer nodig.
					observer.disconnect();
				}
			},
			{ threshold: 0.5 } // Start als 50% van het element zichtbaar is
		);

		observer.observe(element);

		// De cleanup-functie ruimt ZOWEL de observer als een eventuele
		// lopende timer op als de component wordt vernietigd.
		return () => {
			observer.disconnect();
			clearInterval(typingTimer);
		};
	});
</script>

<blockquote class="quote-block" bind:this={blockquoteEl}>
	<p class="quote-text" class:typing={typingProgress < text.length}>
		{text.substring(0, typingProgress)}
	</p>
	<footer class="quote-author" class:visible={showAuthor}>— {author}</footer>
</blockquote>

<style>
	.quote-block {
		position: relative;
		margin: 0;
		padding: var(--space-xl) var(--space-xl) var(--space-xl) var(--space-xxl);
		border-left: 10px solid #ffd302;
		background-color: #ffffff;
		border-radius: var(--border-radius-base);
		box-shadow: var(--box-shadow-base);
	}

	.quote-block::before {
		content: '“';
		position: absolute;
		top: -0.2em;
		left: 0.3em;
		font-size: 10em;
		font-family: var(--font-family-quote), sans-serif;
		color: black;
		opacity: 1;
		z-index: 10;
		line-height: 1;
	}

	.quote-text {
		position: relative;
		z-index: 1;
		font-family: var(--font-family-quote);
		font-size: 2rem;
		font-weight: 800;
		font-style: italic;
		color: var(--color-text);
		line-height: 1;
		min-height: 1.6em;
	}
	.quote-text.typing::after {
		content: '|';
		animation: blink 1s step-end infinite;
		margin-left: 2px;
		font-weight: 600;
		color: var(--color-text-muted);
	}
	@keyframes blink {
		from,
		to {
			opacity: 1;
		}
		50% {
			opacity: 0;
		}
	}

	.quote-author {
		position: relative;
		z-index: 1;
		margin-top: var(--space-m);
		font-size: 1.5rem;
		font-family: var(--font-family-quote);
		font-weight: 500;
		color: var(--color-text-muted);
		text-align: right;
		opacity: 0;
	}

	.quote-author.visible {
		animation: slideAndFadeIn 0.6s cubic-bezier(0.25, 1, 0.5, 1) forwards;
	}
	@keyframes slideAndFadeIn {
		from {
			opacity: 0;
			transform: translateX(20px);
		}
		to {
			opacity: 1;
			transform: translateX(0);
		}
	}
</style>
