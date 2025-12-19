<!--src/lib/components/Quote.svelte-->
<script lang="ts">
	import type { QuoteContent } from '$lib/types';

	// ✅ Props uitbreiden met defaults
	let {
		text,
		author,
		typewriter = true,
		italic = true,
		markSpacing = undefined
	}: QuoteContent = $props();

	let typingProgress = $state(0);
	let showAuthor = $state(false);
	let blockquoteEl = $state<HTMLElement | undefined>();

	$effect(() => {
		// ✅ Als typewriter UIT staat: toon alles direct en stop.
		if (!typewriter) {
			typingProgress = text.length;
			showAuthor = true;
			return;
		}

		// Reset state als tekst verandert en typewriter staat AAN
		typingProgress = 0;
		showAuthor = false;

		const element = blockquoteEl;
		if (!element) return;

		let typingTimer: ReturnType<typeof setInterval>;

		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting && typingProgress === 0) {
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

					observer.disconnect();
				}
			},
			{ threshold: 0.5 }
		);

		observer.observe(element);

		return () => {
			observer.disconnect();
			if (typingTimer) clearInterval(typingTimer);
		};
	});
</script>

<blockquote
	class="quote-block"
	bind:this={blockquoteEl}
	style:--local-mark-top={markSpacing !== undefined ? `${markSpacing}em` : undefined}
>
	<p
		class="quote-text"
		class:typing={typewriter && typingProgress < text.length}
		class:is-italic={italic}
	>
		{text.substring(0, typingProgress)}
	</p>
	<footer class="quote-author" class:visible={showAuthor}>— {author}</footer>
</blockquote>

<style>
	/* ✅ Quote CSS variabelen worden gescopeerd via ThemeLoader naar .quote-block */
	.quote-block {
		position: relative;
		margin: 0;
		padding: var(--quote-padding, var(--space-xxl) var(--space-xl) var(--space-m) var(--space-xxl));
		border-left: var(--quote-border-width, 10px) solid var(--quote-border-color, #d10a10);
		background-color: var(--quote-background, #edeaec);
		border-radius: var(--quote-border-radius, var(--border-radius-base));
		box-shadow: var(--quote-box-shadow, var(--box-shadow-base));
	}

	.quote-block::before {
		content: '"';
		position: absolute;
		/* ✅ Gebruik variabele voor top-positie (default -0.2em) */
		top: var(--local-mark-top, calc(var(--quote-mark-top, -0.2) * 1em));
		left: 0.3em;
		font-size: var(--quote-mark-size, 10em);
		font-family: var(--quote-mark-font-family, var(--font-family-quote, 'Catamaran')), sans-serif;
		color: var(--quote-mark-color, #6e757c);
		opacity: var(--quote-mark-opacity, 1);
		z-index: 10;
		line-height: 1;
		transition: top 0.2s ease;
	}

	.quote-text {
		position: relative;
		z-index: 1;
		font-family: var(--quote-font-family, var(--font-family-quote, 'Catamaran'));
		font-size: var(--quote-font-size, 2rem);
		font-weight: var(--quote-font-weight, 800);

		/* ✅ Standaard normal, italic via class */
		font-style: normal;

		color: var(--quote-color, #000000);
		line-height: var(--quote-line-height, 1);
		min-height: 1.6em;
	}

	/* ✅ Style voor italic toggle */
	.quote-text.is-italic {
		font-style: italic; /* Of var(--quote-font-style, italic) als je die nog wilt supporten */
	}

	.quote-text.typing::after {
		content: '|';
		animation: blink 1s step-end infinite;
		margin-left: 2px;
		font-weight: 600;
		color: var(--quote-cursor-color, var(--color-text-muted));
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
		margin-top: -1.5rem;
		font-size: var(--quote-author-font-size, 1.5rem);
		font-family: var(--quote-font-family, var(--font-family-quote, 'Catamaran'));
		font-weight: var(--quote-author-font-weight, 500);
		color: var(--quote-author-color, #6e757c);
		text-align: var(--quote-author-align, right);
		opacity: 0;
		/* ✅ Transition toegevoegd voor als typewriter uit staat (smooth fade in) */
		transition:
			opacity 0.6s ease,
			transform 0.6s ease;
	}

	.quote-author.visible {
		opacity: 1;
		transform: translateX(0);
		/* Animation alleen gebruiken als we fancy doen, anders via transition */
		/* animation: slideAndFadeIn 0.6s cubic-bezier(0.25, 1, 0.5, 1) forwards; */
	}

	/* Oorspronkelijke keyframes behouden indien nodig, maar transition is vaak soepeler in Svelte updates */
</style>
