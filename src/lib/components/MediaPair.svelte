<!--src\lib\components\MediaPair.svelte-->
<script lang="ts">
	import Hls from 'hls.js';
	import type { Action } from 'svelte/action';
	import { dev } from '$app/environment';
	import type { MediaPairContent } from '$lib/types';

	let { items, verticalAlign = 'bottom' }: MediaPairContent = $props();

	/**
	 * Svelte Action die een IntersectionObserver gebruikt om een video
	 * af te spelen zodra deze in de viewport verschijnt.
	 */
	const playOnView: Action<HTMLVideoElement> = (node) => {
		const observer = new IntersectionObserver(
			(entries) => {
				const [entry] = entries;
				if (entry.isIntersecting) {
					node.play().catch(() => {
						if (dev) console.warn('Video kon niet automatisch afspelen.');
					});
					observer.unobserve(node);
				}
			},
			{ threshold: 0.5 }
		);

		observer.observe(node);

		return {
			destroy() {
				observer.disconnect();
			}
		};
	};

	/**
	 * Svelte Action om HLS (.m3u8) video's af te spelen.
	 */
	const playHls: Action<HTMLVideoElement, string> = (node, src) => {
		let hls: Hls;

		if (!src?.endsWith('.m3u8')) {
			node.src = src;
			return;
		}

		if (Hls.isSupported()) {
			hls = new Hls();
			hls.loadSource(src);
			hls.attachMedia(node);
		} else if (node.canPlayType('application/vnd.apple.mpegurl')) {
			node.src = src;
		}

		return {
			destroy() {
				if (hls) {
					hls.destroy();
				}
			}
		};
	};
</script>

<section class="media-pair" data-layout={verticalAlign}>
	{#if items && (items.length === 2 || items.length === 3)}
		{#each items as item}
			<div class="media-item">
				<figure>
					{#if item.type === 'image'}
						<img src={item.url} alt={item.caption || 'Afbeelding in mediapaar'} loading="lazy" />
					{:else if item.type === 'video'}
						<video
							use:playHls={item.url}
							use:playOnView
							playsinline
							muted
							loop
							poster={item.poster || ''}
							controls={item.showControls ?? true}
						></video>
					{/if}

					{#if item.caption || item.source}
						<figcaption>
							<span class="caption">{item.caption}</span>
							{#if item.source}
								<span class="source">{item.source}</span>
							{/if}
						</figcaption>
					{/if}
				</figure>
			</div>
		{/each}
	{:else if dev}
		<div class="dev-error-overlay">
			<p><strong>[MediaPair Component Error]</strong></p>
			<p>
				Deze component verwacht 2 of 3 media items, maar ontving
				{items ? items.length : 'geen'}.
			</p>
			<p>Controleer de data die wordt doorgegeven vanuit je CMS of `content.json`.</p>
		</div>
	{/if}
</section>

<style>
	.media-pair {
		display: grid;
		gap: var(--space-m);
		margin-block: var(--space-l);
		width: 100%;
	}

	/* 2-item layouts */
	.media-pair[data-layout='top'],
	.media-pair[data-layout='center'],
	.media-pair[data-layout='bottom'],
	.media-pair[data-layout='bottom-alt'] {
		grid-template-columns: repeat(2, 1fr);
	}

	.media-pair[data-layout='top'] {
		align-items: start;
	}

	.media-pair[data-layout='center'] {
		align-items: center;
	}

	.media-pair[data-layout='bottom'],
	.media-pair[data-layout='bottom-alt'] {
		align-items: end;
	}

	/* 3-item layouts: column-based */
	.media-pair[data-layout='3col-left'],
	.media-pair[data-layout='3col-right'] {
		grid-template-columns: 1fr 1fr;
		grid-template-rows: 1fr 1fr;
	}

	.media-pair[data-layout='3col-left'] .media-item:nth-child(1) {
		grid-row: 1 / 3;
		grid-column: 1;
	}

	.media-pair[data-layout='3col-left'] .media-item:nth-child(2) {
		grid-row: 1;
		grid-column: 2;
	}

	.media-pair[data-layout='3col-left'] .media-item:nth-child(3) {
		grid-row: 2;
		grid-column: 2;
	}

	.media-pair[data-layout='3col-right'] .media-item:nth-child(1) {
		grid-row: 1;
		grid-column: 1;
	}

	.media-pair[data-layout='3col-right'] .media-item:nth-child(2) {
		grid-row: 2;
		grid-column: 1;
	}

	.media-pair[data-layout='3col-right'] .media-item:nth-child(3) {
		grid-row: 1 / 3;
		grid-column: 2;
	}

	/* 3-item layouts: row-based */
	.media-pair[data-layout='3row-top'],
	.media-pair[data-layout='3row-bottom'] {
		grid-template-columns: 1fr 1fr;
		grid-template-rows: 1fr 1fr;
	}

	.media-pair[data-layout='3row-top'] .media-item:nth-child(1) {
		grid-row: 1;
		grid-column: 1 / 3;
	}

	.media-pair[data-layout='3row-top'] .media-item:nth-child(2) {
		grid-row: 2;
		grid-column: 1;
	}

	.media-pair[data-layout='3row-top'] .media-item:nth-child(3) {
		grid-row: 2;
		grid-column: 2;
	}

	.media-pair[data-layout='3row-bottom'] .media-item:nth-child(1) {
		grid-row: 1;
		grid-column: 1;
	}

	.media-pair[data-layout='3row-bottom'] .media-item:nth-child(2) {
		grid-row: 1;
		grid-column: 2;
	}

	.media-pair[data-layout='3row-bottom'] .media-item:nth-child(3) {
		grid-row: 2;
		grid-column: 1 / 3;
	}

	.media-item {
		display: flex;
		flex-direction: column;
	}

	.media-item figure {
		margin: 0;
	}

	.media-item img,
	.media-item video {
		width: 100%;
		height: auto;
		display: block;
		border-radius: var(--border-radius-base);
	}

	/*	.media-item figcaption {
		padding-top: var(--space-s);
		font-size: var(--font-size-s);
		color: var(--color-text-muted);
		display: flex;
		justify-content: space-between;
	}
*/

	.media-item figcaption {
		padding-top: var(--space-s);
		font-size: var(--font-size-s);
		color: var(--color-text-muted);
		display: block;
		overflow: hidden;
	}
	.media-item .caption {
		display: inline;
	}
	.media-item .source {
		font-style: italic;
		white-space: nowrap;
		float: right;
		margin-left: var(--space-xs);
	}
	.dev-error-overlay {
		grid-column: 1 / -1;
		padding: var(--space-m);
		background-color: hsla(0, 100%, 90%, 1);
		border: 2px dashed hsla(0, 80%, 50%, 1);
		border-radius: var(--border-radius-base);
		color: #333;
		font-family: monospace;
	}

	@media (max-width: 768px) {
		.media-pair {
			grid-template-columns: 1fr;
			align-items: start; /* Zorg dat ze op mobiel altijd bovenaan beginnen */
		}
	}
</style>
