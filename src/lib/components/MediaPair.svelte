<!--src\lib\components\MediaPair.svelte-->
<script lang="ts">
	import Hls from 'hls.js';
	import type { Action } from 'svelte/action';
	import { dev } from '$app/environment';
	import type { MediaPairContent } from '$lib/types';

	let { items, verticalAlign = 'bottom', caption, source }: MediaPairContent = $props();

	// Bereken layout informatie voor 3-item configuratie
	const layoutInfo = $derived.by(() => {
		if (!items || items.length !== 3) return null;

		// Zoek portrait item, of gebruik het eerste item als fallback
		let portraitIndex = items.findIndex((item) => item.orientation === 'portrait');

		// Als er geen portrait item is, gebruik het eerste item als portrait
		if (portraitIndex === -1) {
			portraitIndex = 0;
		}

		// Filter landscape items (alle items behalve de portrait)
		const landscapeItems = items.filter((_, idx) => idx !== portraitIndex);

		// Bepaal of portrait item links of rechts staat
		const portraitPosition = verticalAlign?.includes('right') ? 'right' : 'left';

		// Check of er een video bij de gestapelde items zit
		const hasVideo = landscapeItems.some((item) => item.type === 'video');
		const videoIndex = hasVideo ? landscapeItems.findIndex((item) => item.type === 'video') : -1;

		return {
			portraitIndex,
			portraitPosition,
			landscapeItems,
			hasVideo,
			videoIndex: videoIndex !== -1 ? videoIndex : null
		};
	});

	/**
	 * Helper functie om object-position te berekenen voor focuspoint
	 */
	function getObjectPosition(item: any): string | undefined {
		if (item.type === 'image' && (item.focusX !== undefined || item.focusY !== undefined)) {
			return `${item.focusX ?? 50}% ${item.focusY ?? 50}%`;
		}
		return undefined;
	}

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

{#if items && items.length === 2}
	<!-- 2 Items: naast elkaar met originele aspect ratio's -->
	<figure class="media-pair-container">
		<section class="media-pair two-items" data-layout={verticalAlign}>
			{#each items as item}
				<div class="media-item">
					<div class="media-wrapper">
						{#if item.type === 'image'}
							<img src={item.url} alt={caption || 'Afbeelding in mediapaar'} loading="lazy" />
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
					</div>
				</div>
			{/each}
		</section>

		{#if caption || source}
			<figcaption>
				<span class="caption">{caption}</span>
				{#if source}
					<span class="source">{source}</span>
				{/if}
			</figcaption>
		{/if}
	</figure>
{:else if items && items.length === 3 && layoutInfo}
	<!-- 3 Items: portrait + 2 landscape gestapeld -->
	<figure class="media-pair-container">
		<section
			class="media-pair three-items"
			data-portrait-position={layoutInfo.portraitPosition}
			data-has-video={layoutInfo.hasVideo}
			data-video-index={layoutInfo.videoIndex}
		>
			{#if layoutInfo.portraitPosition === 'left'}
				<!-- Portrait item links -->
				<div class="portrait-column">
					<div class="media-item portrait-item">
						<figure>
							{#if items[layoutInfo.portraitIndex].type === 'image'}
								<img
									src={items[layoutInfo.portraitIndex].url}
									alt={caption || 'Afbeelding in mediapaar'}
									loading="lazy"
								/>
							{:else if items[layoutInfo.portraitIndex].type === 'video'}
								<video
									use:playHls={items[layoutInfo.portraitIndex].url}
									use:playOnView
									playsinline
									muted
									loop
									poster={items[layoutInfo.portraitIndex].poster || ''}
									controls={items[layoutInfo.portraitIndex].showControls ?? true}
								></video>
							{/if}
						</figure>
					</div>
				</div>

				<!-- Landscape items rechts gestapeld -->
				<div class="landscape-column">
					{#each layoutInfo.landscapeItems as item, index}
						<div
							class="media-item landscape-item"
							class:is-video={item.type === 'video'}
							class:is-image={item.type === 'image'}
							data-stack-index={index}
						>
							<figure>
								{#if item.type === 'image'}
									<img
										src={item.url}
										alt={caption || 'Afbeelding in mediapaar'}
										loading="lazy"
										style:object-position={getObjectPosition(item)}
									/>
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
							</figure>
						</div>
					{/each}
				</div>
			{:else}
				<!-- Landscape items links gestapeld -->
				<div class="landscape-column">
					{#each layoutInfo.landscapeItems as item, index}
						<div
							class="media-item landscape-item"
							class:is-video={item.type === 'video'}
							class:is-image={item.type === 'image'}
							data-stack-index={index}
						>
							<figure>
								{#if item.type === 'image'}
									<img
										src={item.url}
										alt={caption || 'Afbeelding in mediapaar'}
										loading="lazy"
										style:object-position={getObjectPosition(item)}
									/>
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
							</figure>
						</div>
					{/each}
				</div>

				<!-- Portrait item rechts -->
				<div class="portrait-column">
					<div class="media-item portrait-item">
						<figure>
							{#if items[layoutInfo.portraitIndex].type === 'image'}
								<img
									src={items[layoutInfo.portraitIndex].url}
									alt={caption || 'Afbeelding in mediapaar'}
									loading="lazy"
								/>
							{:else if items[layoutInfo.portraitIndex].type === 'video'}
								<video
									use:playHls={items[layoutInfo.portraitIndex].url}
									use:playOnView
									playsinline
									muted
									loop
									poster={items[layoutInfo.portraitIndex].poster || ''}
									controls={items[layoutInfo.portraitIndex].showControls ?? true}
								></video>
							{/if}
						</figure>
					</div>
				</div>
			{/if}
		</section>

		{#if caption || source}
			<figcaption>
				<span class="caption">{caption}</span>
				{#if source}
					<span class="source">{source}</span>
				{/if}
			</figcaption>
		{/if}
	</figure>
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

<style>
	/* === COMMON STYLES === */
	.media-pair-container {
		margin: var(--space-l) 0;
	}

	.media-pair {
		width: 100%;
	}

	/* Media wrappers voor beide 2-item en 3-item layouts */
	.media-item figure,
	.media-item .media-wrapper {
		margin: 0;
		overflow: hidden;
		border-radius: var(--border-radius-base);
		height: 100%;
	}

	.media-item img,
	.media-item video {
		width: 100%;
		height: 100%;
		display: block;
	}

	/* Gezamenlijk bijschrift onder de hele MediaPair */
	.media-pair-container figcaption {
		padding-top: var(--space-s);
		font-size: var(--font-size-s);
		color: var(--color-text-muted);
		display: block;
		overflow: hidden;
	}

	.media-pair-container .caption {
		display: inline;
	}

	.media-pair-container .source {
		font-style: italic;
		white-space: nowrap;
		float: right;
		margin-left: var(--space-xs);
	}

	/* === 2 ITEMS: NAAST ELKAAR MET ORIGINELE ASPECT RATIOS === */
	.media-pair.two-items {
		display: flex;
		gap: var(--space-m);
		align-items: flex-end; /* Standaard: bottom alignment */
	}

	/* Specifieke alignment voor verschillende layouts */
	.media-pair.two-items[data-layout='top'] {
		align-items: flex-start;
	}

	.media-pair.two-items[data-layout='center'],
	.media-pair.two-items[data-layout='bottom-alt'] {
		align-items: flex-end; /* Bottom alignment voor liggende items */
	}

	.media-pair.two-items .media-item {
		flex: 1;
	}

	.media-pair.two-items .media-item img,
	.media-pair.two-items .media-item video {
		width: 100%;
		height: auto;
		object-fit: contain;
		border-radius: var(--border-radius-base); /* Consistente afronding voor alle hoeken */
	}

	/* === 3 ITEMS: PORTRAIT + 2 LANDSCAPE GESTAPELD === */
	.media-pair.three-items {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: var(--space-m);
		align-items: stretch;
	}

	/* Portrait kolom bepaalt de hoogte */
	.portrait-column {
		display: flex;
		flex-direction: column;
	}

	.portrait-item figure {
		height: 100%;
	}

	.portrait-item img,
	.portrait-item video {
		height: 100%;
		object-fit: contain;
	}

	/* Landscape kolom: 2 items gestapeld */
	.landscape-column {
		display: flex;
		flex-direction: column;
		gap: var(--space-m);
		height: 100%;
	}

	/* Scenario A: Beide items zijn afbeeldingen -> 50/50 verdeling */
	.media-pair.three-items[data-has-video='false'] .landscape-column {
		display: grid;
		grid-template-rows: 1fr 1fr;
	}

	.media-pair.three-items[data-has-video='false'] .landscape-item img {
		object-fit: cover;
	}

	/* Scenario B: Eén item is een video -> video behoudt aspect ratio, afbeelding vult ruimte */
	.media-pair.three-items[data-has-video='true'] .landscape-column {
		display: flex;
		flex-direction: column;
	}

	/* Video behoudt aspect ratio */
	.media-pair.three-items[data-has-video='true'] .landscape-item.is-video {
		flex: 0 0 auto;
	}

	.media-pair.three-items[data-has-video='true'] .landscape-item.is-video figure {
		height: auto;
	}

	.media-pair.three-items[data-has-video='true'] .landscape-item.is-video video {
		height: auto;
		object-fit: contain;
	}

	/* Afbeelding vult resterende ruimte */
	.media-pair.three-items[data-has-video='true'] .landscape-item.is-image {
		flex: 1 1 0;
	}

	.media-pair.three-items[data-has-video='true'] .landscape-item.is-image img {
		object-fit: cover;
	}

	/* === MOBILE RESPONSIVE === */
	@media (max-width: 768px) {
		.media-pair.two-items,
		.media-pair.three-items {
			display: flex;
			flex-direction: column;
			gap: var(--space-m);
		}

		.media-pair.two-items .media-item img,
		.media-pair.two-items .media-item video {
			height: auto;
		}

		.portrait-column,
		.landscape-column {
			width: 100%;
		}

		.portrait-item img,
		.portrait-item video {
			height: auto;
			object-fit: contain;
		}
	}

	/* === DEV ERROR OVERLAY === */
	.dev-error-overlay {
		padding: var(--space-m);
		background-color: hsla(0, 100%, 90%, 1);
		border: 2px dashed hsla(0, 80%, 50%, 1);
		border-radius: var(--border-radius-base);
		color: #333;
		font-family: monospace;
	}
</style>
