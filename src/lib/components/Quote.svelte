<!--src/lib/components/Quote.svelte-->
<script lang="ts">
	import type { QuoteContent } from '$lib/types';

	let { text, author }: QuoteContent = $props();

	let typingProgress = $state(0);
	let showAuthor = $state(false);
	let blockquoteEl = $state<HTMLElement | undefined>();

	$effect(() => {
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
		padding: var(--quote-padding, var(--space-xxl) var(--space-xl) var(--space-m) var(--space-xxl));
		border-left: var(--quote-border-width, 10px) solid var(--quote-border-color, #ffd302);
		background-color: var(--quote-background, #ffffff);
		border-radius: var(--quote-border-radius, var(--border-radius-base));
		box-shadow: var(--quote-box-shadow, var(--box-shadow-base));
	}

	.quote-block::before {
		content: '"';
		position: absolute;
		top: -0.2em;
		left: 0.3em;
		font-size: var(--quote-mark-size, 10em);
		font-family: var(--quote-mark-font-family, var(--font-family-quote)), sans-serif;
		color: var(--quote-mark-color, black);
		opacity: var(--quote-mark-opacity, 1);
		z-index: 10;
		line-height: 1;
	}

	.quote-text {
		position: relative;
		z-index: 1;
		font-family: var(--quote-font-family, var(--font-family-quote));
		font-size: var(--quote-font-size, 2rem);
		font-weight: var(--quote-font-weight, 800);
		font-style: var(--quote-font-style, italic);
		color: var(--quote-color, var(--color-text));
		line-height: var(--quote-line-height, 1);
		min-height: 1.6em;
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
		font-family: var(--quote-font-family, var(--font-family-quote));
		font-weight: var(--quote-author-font-weight, 500);
		color: var(--quote-author-color, var(--color-text-muted));
		text-align: var(--quote-author-align, right);
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
