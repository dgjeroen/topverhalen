<!-- src/lib/components/SubheadingSoccer.svelte -->
<script lang="ts">
	import type { HeadingContent } from '$lib/types';
	import { viewport } from '$lib/actions/viewport';

	let { text }: HeadingContent = $props();

	let chars = $derived(text.split(''));
	let charElements = $state<Array<HTMLElement | undefined>>([]);
	let carrierEl = $state<HTMLElement | undefined>();
	let isAnimating = false;

	let headingWidth = $state(0);
	const pixelsPerSecond = 90;
	let animationDuration = $derived(headingWidth > 0 ? headingWidth / pixelsPerSecond : 0);

	function startRevealLoop() {
		isAnimating = true;
		function updateVisibility() {
			if (!isAnimating || !carrierEl) return;
			const ballRect = carrierEl.getBoundingClientRect();
			const ballRevealPoint = ballRect.left + ballRect.width / 2;
			for (const el of charElements) {
				if (el && el.style.opacity !== '1') {
					const charRect = el.getBoundingClientRect();
					if (ballRevealPoint >= charRect.left) {
						el.style.opacity = '1';
					}
				}
			}
			requestAnimationFrame(updateVisibility);
		}
		requestAnimationFrame(updateVisibility);
	}

	function stopRevealLoop() {
		isAnimating = false;
	}
</script>

<div
	class="heading-wrapper"
	use:viewport
	style="--heading-width: {headingWidth}px; --animation-duration: {animationDuration}s;"
>
	<h4 class="heading-text-container" bind:clientWidth={headingWidth}>
		<span class="text-placeholder" aria-hidden="true">{text}</span>

		<div class="text-reveal-layer" aria-hidden="true">
			{#each chars as char, i}
				<span bind:this={charElements[i]} class="char">
					{char === ' ' ? '\u00A0' : char}
				</span>
			{/each}
		</div>

		<div
			bind:this={carrierEl}
			class="mask-carrier"
			onanimationstart={startRevealLoop}
			onanimationend={stopRevealLoop}
			aria-hidden="true"
		></div>

		<span class="visually-hidden">{text}</span>
	</h4>
</div>

<style>
	.heading-wrapper {
		--ball-size: var(--subheading-soccer-ball-size, 30px);
		--container-height: var(--subheading-soccer-height, 30px);
		--heading-font-size: var(--subheading-soccer-font-size, 22px);
		position: relative;
		width: fit-content;
		overflow: hidden;
		background: var(--subheading-soccer-bg, #000000);
		border-radius: var(--subheading-soccer-border-radius, 0);
		margin-bottom: var(--subheading-soccer-margin-bottom, -2.5rem);
	}

	.heading-text-container {
		position: relative;
		display: flex;
		align-items: center;
		min-height: var(--container-height);
		padding: var(--subheading-soccer-padding, 0 8px);
		margin: 0;
		font:
			var(--subheading-soccer-font-weight, 800) var(--heading-font-size) / 1.2 system-ui,
			-apple-system,
			Segoe UI,
			Roboto,
			Arial,
			sans-serif;
		color: var(--subheading-soccer-color, #ffffff);
		white-space: nowrap;
		text-transform: uppercase;
	}

	.text-placeholder {
		visibility: hidden;
	}

	.text-reveal-layer {
		position: absolute;
		left: var(--subheading-soccer-text-offset, 8px);
		top: 50%;
		transform: translateY(-50%);
		pointer-events: none;
	}

	.char {
		display: inline-block;
		opacity: 0;
		transition: opacity 150ms ease-in-out;
	}

	.mask-carrier {
		position: absolute;
		left: var(--subheading-soccer-text-offset, 8px);
		top: 50%;
		width: var(--ball-size);
		height: var(--ball-size);
		transform: translate(-150%, -50%);
		background-image: url('../assets/voetbal.svg');
		background-size: contain;
		background-repeat: no-repeat;
		will-change: transform;
	}

	:global(.in-view) .mask-carrier {
		animation: roll-out var(--animation-duration, 4s) linear forwards;
	}

	@keyframes roll-out {
		to {
			transform: translate(calc(var(--heading-width, 500px) + 50px), -50%) rotate(720deg);
		}
	}

	.visually-hidden {
		position: absolute;
		width: 1px;
		height: 1px;
		margin: -1px;
		padding: 0;
		overflow: hidden;
		clip: rect(0, 0, 0, 0);
		border: 0;
	}

	@media (prefers-reduced-motion: reduce) {
		.mask-carrier {
			display: none;
		}
		.char {
			opacity: 1;
			transition: none;
		}
	}
</style>
