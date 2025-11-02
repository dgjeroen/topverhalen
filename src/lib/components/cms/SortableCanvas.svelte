<script lang="ts">
	import { onDestroy, tick, createEventDispatcher } from 'svelte';
	import type { ContentBlock, Theme } from '$lib/types';
	import Sortable from 'sortablejs';
	import IconButton from '$lib/components/ui/IconButton.svelte'; // Zorg dat dit pad klopt!

	// === PROPS ===
	let {
		blocks = [],
		theme = {},
		toolbox = null
	} = $props<{
		blocks?: ContentBlock[];
		theme?: Theme;
		toolbox?: Sortable | null;
	}>();

	console.log("WERKER (SortableCanvas) - 4. 'blocks' PROP ONTVANGEN:", blocks);
	// === STATE ===
	let canvasEl!: HTMLElement;
	let canvasSortable: Sortable | null = null;
	const dispatch = createEventDispatcher();

	// === HULPFUNCTIES ===
	let splideInstances = new Map<string, any>();
	let showMarkdownInfo = $state(false);

	// ✅ Lead checkbox logic
	const firstTextblockId = $derived(
		blocks.find((b: ContentBlock) => b.type === 'textblock')?.id || null
	);

	function canBeLead(blockId: string): boolean {
		return blockId === firstTextblockId;
	}

	// ✅ Cleanup lead status
	$effect(() => {
		blocks.forEach((block: ContentBlock) => {
			if (block.type === 'textblock' && block.id !== firstTextblockId) {
				if (block.content.isLead) {
					block.content.isLead = false;
					dispatch('save');
				}
			}
		});
	});

	function initHlsPlayer(block: ContentBlock) {
		// <-- ': ContentBlock' toegevoegd
		if ((block.type !== 'heroVideo' && block.type !== 'video') || !block.content.url) return;
		const videoEl = document.getElementById(
			block.type === 'heroVideo' ? `hero-video-${block.id}` : `video-${block.id}`
		) as HTMLVideoElement;
		if (!videoEl) return;

		const youtubeRegex =
			/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
		const youtubeMatch = block.content.url.match(youtubeRegex);

		if (youtubeMatch) {
			const videoId = youtubeMatch[1];
			const iframe = document.createElement('iframe');
			iframe.width = '100%';
			iframe.height = '315';
			iframe.src = `https://www.youtube.com/embed/${videoId}`;
			iframe.frameBorder = '0';
			iframe.allow =
				'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
			iframe.allowFullscreen = true;
			videoEl.replaceWith(iframe);
		} else if (block.content.url.endsWith('.m3u8')) {
			// @ts-ignore
			if (typeof Hls !== 'undefined' && Hls.isSupported()) {
				// @ts-ignore
				const hls = new Hls();
				hls.loadSource(block.content.url);
				hls.attachMedia(videoEl);
			} else if (videoEl.canPlayType('application/vnd.apple.mpegurl')) {
				videoEl.src = block.content.url;
			}
		} else {
			videoEl.src = block.content.url;
		}
	}
	function initSplideForBlock(blockId: string, blockType: string) {
		if (typeof window === 'undefined') return;

		setTimeout(async () => {
			const Splide = (await import('@splidejs/splide')).default;
			const splideEl = document.getElementById(`splide-${blockId}`);
			if (!splideEl) return;

			if (splideInstances.has(blockId)) {
				splideInstances.get(blockId).destroy();
			}

			const splide = new Splide(splideEl, {
				arrows: false,
				pagination: false,
				drag: false,
				autoWidth: true,
				focus: 'center',
				clones: 0
			});

			splide.mount();
			splideInstances.set(blockId, splide);

			updateSlideNumbers(blockId);
		}, 100);
	}

	function updateSlideNumbers(blockId: string) {
		const splideEl = document.getElementById(`splide-${blockId}`);
		if (!splideEl) return;

		const slides = splideEl.querySelectorAll('.splide__slide');

		slides.forEach((slide, index) => {
			const numberEl = slide.querySelector('.editor-item-number');
			if (numberEl) numberEl.textContent = (index + 1).toString();

			const prevBtn = slide.querySelector('[data-direction="prev"]') as HTMLButtonElement;
			const nextBtn = slide.querySelector('[data-direction="next"]') as HTMLButtonElement;

			if (prevBtn) prevBtn.disabled = index === 0;
			if (nextBtn) nextBtn.disabled = index === slides.length - 1;
		});
	}

	function getGalleryLayoutInfo(block: ContentBlock) {
		if (block.type !== 'gallery') return '';
		const layoutMap: Record<number, string> = {
			2: '2 Kolommen',
			3: '3 Kolommen',
			4: '4 Kolommen'
		};
		const count = block.content.images.length;
		const cols = block.content.columns;
		return `${layoutMap[cols] || `${cols} kolommen`} • ${count} foto's`;
	}

	function isGalleryAddDisabled(block: ContentBlock): boolean {
		if (block.type !== 'gallery') return true;
		const cols = block.content.columns;
		const count = block.content.images.length;

		if ([2, 3, 4].includes(cols)) return count >= cols;
		if (cols === 2 && count >= 4) return true;
		if (cols === 3 && count >= 6) return true;

		return false;
	}

	// ✅ GOED (Stabiel & Waterdicht)
	$effect(() => {
		// Dit $effect runt nu als 'blocks' verandert.
		// We moeten de 'splideInstances' Map synchroniseren met de 'blocks' array.

		if (typeof window === 'undefined') return;

		// Maak een 'Set' van alle block-ID's die *nu* in de DOM zouden moeten zijn
		const currentBlockIds = new Set(blocks.map((b: ContentBlock) => b.id));

		// --- STAP 1: OUDE/VERWIJDERDE INSTANTIES OPKUISTEN (Het Geheugenlek Fixen) ---
		// Loop door de instances die we nu beheren in de Map
		for (const blockId of splideInstances.keys()) {
			if (!currentBlockIds.has(blockId)) {
				// Dit blok-ID is NIET MEER in de 'blocks' array.
				// Het is verwijderd. Vernietig de instantie.
				const instance = splideInstances.get(blockId);
				if (instance) {
					instance.destroy();
				}
				splideInstances.delete(blockId);
			}
		}

		// --- STAP 2: NIEUWE/BESTAANDE BLOKKEN INITIALISEREN (De "Bom" Ontmantelen) ---
		blocks.forEach((block: ContentBlock) => {
			// initHlsPlayer is 'idempotent' (veilig om vaker aan te roepen)
			if ((block.type === 'heroVideo' || block.type === 'video') && block.content.url) {
				setTimeout(() => initHlsPlayer(block), 50);
			}

			// Moet dit een slider zijn?
			if (['slider', 'gallery', 'timeline'].includes(block.type)) {
				// En beheren we deze nog NIET?
				if (!splideInstances.has(block.id)) {
					// Initialiseer het DAN PAS.
					setTimeout(() => initSplideForBlock(block.id, block.type), 100);
				}
				// Als we het al beheren (omdat het is verplaatst of een re-render
				// is door 'bind:value'), DOEN WE NIETS. We laten het met rust.
			}
		});
	});

	$effect(() => {
		if (canvasEl) {
			canvasSortable = new Sortable(canvasEl, {
				group: { name: 'shared', pull: true, put: true },
				animation: 150,
				handle: '.drag-handle',
				ghostClass: 'sortable-ghost',
				dragClass: 'dragging-preview',

				onAdd: async (evt) => {
					canvasSortable?.option('disabled', true);
					if (toolbox) toolbox.option('disabled', true);

					const blockType = evt.item.dataset.type;
					const newIndex = evt.newIndex;
					if (blockType && newIndex !== undefined) {
						dispatch('add', { blockType, newIndex });
					}
					evt.item.remove();

					await tick();

					canvasSortable?.option('disabled', false);
					if (toolbox) toolbox.option('disabled', false);
				},

				onUpdate: async (evt) => {
					canvasSortable?.option('disabled', true);
					if (toolbox) toolbox.option('disabled', true);

					const { oldIndex, newIndex } = evt;
					if (oldIndex !== undefined && newIndex !== undefined) {
						dispatch('move', { oldIndex, newIndex });
					}

					await tick();

					canvasSortable?.option('disabled', false);
					if (toolbox) toolbox.option('disabled', false);
				}
			});

			return () => {
				canvasSortable?.destroy();
				canvasSortable = null;
			};
		}
	});

	onDestroy(() => {
		splideInstances.forEach((instance) => instance.destroy());
	});
</script>

<div class="canvas-wrapper" bind:this={canvasEl}>
	{#each blocks as block (block.id)}
		<div class="canvas-block" data-type={block.type} data-block-id={block.id}>
			<div class="drag-handle">⋮⋮</div>
			<button type="button" class="remove-btn" onclick={() => dispatch('remove', block.id)}
				>×</button
			>
			<div class="content">
				{#if block.type === 'heroVideo'}
					<div class="hero-video-editor">
						<div class="input-row">
							<div class="input-col">
								<span class="input-label">Video URL (.m3u8)</span>
								<input
									type="url"
									placeholder="https://..."
									bind:value={block.content.url}
									oninput={() => dispatch('save')}
								/>
							</div>
							<div class="input-col">
								<span class="input-label">Poster Afbeelding</span>
								<input
									type="url"
									placeholder="https://..."
									bind:value={block.content.poster}
									oninput={() => dispatch('save')}
								/>
							</div>
						</div>

						{#if block.content.url || block.content.poster}
							<div class="input-row">
								{#if block.content.url}
									<div class="preview-col">
										<video
											id="hero-video-{block.id}"
											poster={block.content.poster || ''}
											controls
											muted
											loop
											class="media-preview"
										>
											<track kind="captions" />
										</video>
									</div>
								{/if}
								{#if block.content.poster}
									<div class="preview-col">
										<img src={block.content.poster} alt="Poster" class="media-preview" />
									</div>
								{/if}
							</div>
						{/if}

						<div class="input-row-split">
							<div class="input-col-left">
								<div class="input-group">
									<span class="input-label">Label (optioneel)</span>
									<input
										type="text"
										placeholder="SPECIAL"
										bind:value={block.content.label}
										oninput={() => dispatch('save')}
									/>
								</div>
								<div class="input-group">
									<span class="input-label">Titel</span>
									<input
										type="text"
										placeholder="Hoofdtitel"
										bind:value={block.content.title}
										oninput={() => dispatch('save')}
									/>
								</div>
								<div class="input-group">
									<span class="input-label">Bron (verplicht)</span>
									<input
										type="text"
										placeholder="ANP"
										bind:value={block.content.source}
										oninput={() => dispatch('save')}
									/>
								</div>
							</div>

							<div class="input-col-right">
								<span class="input-label">Tekstpositie</span>
								<div class="hero-align-picker">
									<label class:active={block.content.textAlign === 'top'}>
										<input
											type="radio"
											bind:group={block.content.textAlign}
											value="top"
											onchange={() => dispatch('save')}
										/>
										<div class="hero-align-icon">
											<svg viewBox="0 0 24 24" fill="none">
												<text
													x="12"
													y="8"
													text-anchor="middle"
													font-size="7"
													font-weight="600"
													fill="currentColor">TOP</text
												>
											</svg>
										</div>
									</label>
									<label class:active={block.content.textAlign === 'center'}>
										<input
											type="radio"
											bind:group={block.content.textAlign}
											value="center"
											onchange={() => dispatch('save')}
										/>
										<div class="hero-align-icon">
											<svg viewBox="0 0 24 24" fill="none">
												<text
													x="12"
													y="14"
													text-anchor="middle"
													font-size="6"
													font-weight="600"
													fill="currentColor">CENTER</text
												>
											</svg>
										</div>
									</label>
									<label class:active={block.content.textAlign === 'bottom'}>
										<input
											type="radio"
											bind:group={block.content.textAlign}
											value="bottom"
											onchange={() => dispatch('save')}
										/>
										<div class="hero-align-icon">
											<svg viewBox="0 0 24 24" fill="none">
												<text
													x="12"
													y="21"
													text-anchor="middle"
													font-size="6"
													font-weight="600"
													fill="currentColor">BOTTOM</text
												>
											</svg>
										</div>
									</label>
								</div>
							</div>
						</div>
					</div>
				{:else if block.type === 'imageHero'}
					<div class="image-hero-editor">
						<div class="input-row">
							<div class="input-col">
								<span class="input-label">Afbeelding URL</span>
								<input
									type="url"
									placeholder="https://picsum.photos/1920/1080"
									bind:value={block.content.url}
									oninput={() => dispatch('save')}
								/>
							</div>
						</div>

						{#if block.content.url}
							<div class="input-row">
								<div class="preview-col">
									<img src={block.content.url} alt="Hero preview" class="media-preview" />
								</div>
							</div>
						{/if}

						<div class="input-row-split">
							<div class="input-col-left">
								<div class="input-group">
									<span class="input-label">Label (optioneel)</span>
									<input
										type="text"
										placeholder="SPECIAL"
										bind:value={block.content.label}
										oninput={() => dispatch('save')}
									/>
								</div>
								<div class="input-group">
									<span class="input-label">Titel</span>
									<input
										type="text"
										placeholder="Hoofdtitel"
										bind:value={block.content.title}
										oninput={() => dispatch('save')}
									/>
								</div>
								<div class="input-group">
									<span class="input-label">Bron (optioneel)</span>
									<input
										type="text"
										placeholder="Foto: Naam Fotograaf"
										bind:value={block.content.source}
										oninput={() => dispatch('save')}
									/>
								</div>
							</div>

							<div class="input-col-right">
								<span class="input-label">Tekstpositie</span>
								<div class="hero-align-picker">
									<label class:active={block.content.textAlign === 'top'}>
										<input
											type="radio"
											bind:group={block.content.textAlign}
											value="top"
											onchange={() => dispatch('save')}
										/>
										<div class="hero-align-icon">
											<svg viewBox="0 0 24 24" fill="none">
												<text
													x="12"
													y="8"
													text-anchor="middle"
													font-size="7"
													font-weight="600"
													fill="currentColor">TOP</text
												>
											</svg>
										</div>
									</label>
									<label class:active={block.content.textAlign === 'center'}>
										<input
											type="radio"
											bind:group={block.content.textAlign}
											value="center"
											onchange={() => dispatch('save')}
										/>
										<div class="hero-align-icon">
											<svg viewBox="0 0 24 24" fill="none">
												<text
													x="12"
													y="14"
													text-anchor="middle"
													font-size="6"
													font-weight="600"
													fill="currentColor">CENTER</text
												>
											</svg>
										</div>
									</label>
									<label class:active={block.content.textAlign === 'bottom'}>
										<input
											type="radio"
											bind:group={block.content.textAlign}
											value="bottom"
											onchange={() => dispatch('save')}
										/>
										<div class="hero-align-icon">
											<svg viewBox="0 0 24 24" fill="none">
												<text
													x="12"
													y="21"
													text-anchor="middle"
													font-size="6"
													font-weight="600"
													fill="currentColor">BOTTOM</text
												>
											</svg>
										</div>
									</label>
								</div>
							</div>
						</div>
					</div>
				{:else if block.type === 'heading'}
					<input
						type="text"
						placeholder="Tekst kop..."
						bind:value={block.content.text}
						oninput={() => dispatch('save')}
						class="block-input"
					/>
				{:else if block.type === 'subheading'}
					<input
						type="text"
						placeholder="Tekst tussenkop..."
						bind:value={block.content.text}
						oninput={() => dispatch('save')}
						class="block-input block-input-subheading"
					/>
				{:else if block.type === 'subheadingMedium'}
					<input
						type="text"
						placeholder="Tekst tussenkop (H3)..."
						bind:value={block.content.text}
						oninput={() => dispatch('save')}
						class="block-input block-input-subheading-medium"
					/>
				{:else if block.type === 'subheadingSoccer'}
					<div class="subheading-soccer-editor">
						<input
							type="text"
							placeholder="Tekst tussenkop voetbal..."
							bind:value={block.content.text}
							oninput={() => dispatch('save')}
							class="block-input block-input-subheading"
						/>
						<div class="style-preview">
							<div
								class="preview-box"
								style:background-color={theme?.['subheading-soccer-bg'] || '#000000'}
							>
								<span style:color={theme?.['subheading-soccer-color'] || '#ffffff'}>
									{block.content.text || 'VOORBEELD'}
								</span>
							</div>
							<p class="preview-hint">Preview van je tussenkop (pas aan via Styling tab)</p>
						</div>
					</div>
				{:else if block.type === 'textblock'}
					<div class="textblock-editor">
						<div class="editor-header-row">
							<label class="input-label">
								Tekst (Markdown)
								<button
									type="button"
									class="info-button"
									onclick={() => (showMarkdownInfo = !showMarkdownInfo)}
									aria-label="Markdown hulp"
								>
									<svg
										width="16"
										height="16"
										viewBox="0 0 16 16"
										fill="none"
										xmlns="http://www.w3.org/2000/svg"
									>
										<circle cx="8" cy="8" r="7" stroke="currentColor" stroke-width="1.5" />
										<path
											d="M8 7V11M8 5V5.5"
											stroke="currentColor"
											stroke-width="1.5"
											stroke-linecap="round"
										/>
									</svg>
								</button>
							</label>
						</div>

						{#if showMarkdownInfo}
							<div class="markdown-tooltip">
								<div class="markdown-tooltip-content">
									<div class="markdown-example"><code>**vet**</code> → <strong>vet</strong></div>
									<div class="markdown-example"><code>*cursief*</code> → <em>cursief</em></div>
									<div class="markdown-example"><code>[link](https://url.nl)</code> → link</div>
								</div>
							</div>
						{/if}

						<textarea
							placeholder="Schrijf je tekst..."
							bind:value={block.content.text[0]}
							oninput={() => dispatch('save')}
							class="block-textarea"
							rows="6"
						></textarea>

						{#if canBeLead(block.id)}
							<label class="lead-toggle">
								<input
									type="checkbox"
									bind:checked={block.content.isLead}
									onchange={() => dispatch('save')}
								/>
								<span>Dit is een inleiding</span>
							</label>
						{/if}
					</div>
				{:else if block.type === 'image'}
					<input
						type="url"
						placeholder="Afbeeldings-URL..."
						bind:value={block.content.url}
						oninput={() => dispatch('save')}
						class="block-input"
					/>
					{#if block.content.url}
						<img src={block.content.url} alt="" class="block-preview" />
					{/if}
					<textarea
						placeholder="Bijschrift..."
						bind:value={block.content.caption}
						oninput={() => dispatch('save')}
						class="block-textarea"
						rows="2"
					></textarea>
					<input
						type="text"
						placeholder="Bron..."
						bind:value={block.content.source}
						oninput={() => dispatch('save')}
						class="block-input"
					/>
					<label class="parallax-toggle">
						<input
							type="checkbox"
							bind:checked={block.content.parallax}
							onchange={() => dispatch('save')}
						/>
						<span>Parallax-effect toepassen</span>
					</label>
				{:else if block.type === 'quote'}
					<textarea
						placeholder="Citaat tekst..."
						bind:value={block.content.text}
						oninput={() => dispatch('save')}
						class="block-textarea"
						rows="3"
					></textarea>
					<input
						type="text"
						placeholder="Auteur..."
						bind:value={block.content.author}
						oninput={() => dispatch('save')}
						class="block-input"
					/>
				{:else if block.type === 'video'}
					<div class="video-editor">
						<div class="input-row">
							<div class="input-col">
								<span class="input-label">Video URL (YouTube of .m3u8)</span>
								<input
									type="url"
									placeholder="https://..."
									bind:value={block.content.url}
									oninput={() => dispatch('save')}
								/>
							</div>
							<div class="input-col">
								<span class="input-label">Poster (optioneel)</span>
								<input
									type="url"
									placeholder="https://..."
									bind:value={block.content.poster}
									oninput={() => dispatch('save')}
								/>
							</div>
						</div>

						{#if block.content.url || block.content.poster}
							<div class="input-row">
								{#if block.content.url}
									<div class="preview-col">
										<video
											id="video-{block.id}"
											poster={block.content.poster || ''}
											controls
											class="media-preview"
										>
											<track kind="captions" />
										</video>
									</div>
								{/if}
								{#if block.content.poster}
									<div class="preview-col">
										<img src={block.content.poster} alt="Poster" class="media-preview" />
									</div>
								{/if}
							</div>
						{/if}
					</div>
				{:else if block.type === 'embed'}
					<div class="embed-editor">
						<label class="input-label" for="embed-code-{block.id}">Embed Code</label>
						<textarea
							id="embed-code-{block.id}"
							placeholder="Plak hier je embed code (iframe, script, blockquote) of URL...

Voorbeelden:
• YouTube: https://youtube.com/watch?v=xxx
• Twitter: https://twitter.com/user/status/xxx
• Datawrapper: Plak de embed code
• Spotify: https://open.spotify.com/track/xxx
• Iframe: Plak de iframe code"
							bind:value={block.content.code}
							oninput={() => dispatch('save')}
							class="block-textarea"
							rows="6"
						></textarea>

						<div class="control-group">
							<label class="input-label" for="aspect-ratio-{block.id}">Aspect Ratio</label>
							<select
								id="aspect-ratio-{block.id}"
								bind:value={block.content.aspectRatio}
								onchange={() => dispatch('save')}
								class="type-select"
							>
								<option value="auto">Auto (geen ratio)</option>
								<option value="16:9">16:9 (standaard video)</option>
								<option value="4:3">4:3 (klassiek)</option>
								<option value="1:1">1:1 (vierkant)</option>
								<option value="3:2">3:2 (foto)</option>
								<option value="21:9">21:9 (ultrawide)</option>
							</select>
							<span class="hint">Voor YouTube/Twitter/Spotify wordt aspect ratio genegeerd</span>
						</div>

						<input
							type="text"
							placeholder="Bijschrift (optioneel)..."
							bind:value={block.content.caption}
							oninput={() => dispatch('save')}
							class="block-input"
						/>

						<input
							type="text"
							placeholder="Bron (optioneel)..."
							bind:value={block.content.source}
							oninput={() => dispatch('save')}
							class="block-input"
						/>

						{#if block.content.code}
							<div class="embed-preview-notice">
								<svg width="16" height="16" viewBox="0 0 16 16" fill="none">
									<circle cx="8" cy="8" r="7" stroke="currentColor" stroke-width="1.5" />
									<path
										d="M8 7V11M8 5V5.5"
										stroke="currentColor"
										stroke-width="1.5"
										stroke-linecap="round"
									/>
								</svg>
								<span
									>Preview beschikbaar na publicatie (YouTube, Twitter en Spotify worden automatisch
									gedetecteerd)</span
								>
							</div>
						{/if}
					</div>
				{:else if block.type === 'slider'}
					<div class="slider-editor">
						<h4>Fotoslider ({block.content.images.length} foto's)</h4>
						<div class="splide-container">
							<div id="splide-{block.id}" class="splide">
								<div class="splide__track">
									<ul class="splide__list">
										{#each block.content.images as slide, i (i)}
											<li class="splide__slide">
												<div class="slide-item">
													<div class="slide-header">
														<span class="editor-item-number">{i + 1}</span>
														<button
															type="button"
															class="move-btn"
															data-direction="prev"
															disabled={i === 0}
															onclick={() =>
																dispatch('splide', {
																	type: 'move',
																	blockId: block.id,
																	index: i,
																	direction: 'prev'
																})}
														>
															&lt;
														</button>
														<button
															type="button"
															class="move-btn"
															data-direction="next"
															disabled={i === block.content.images.length - 1}
															onclick={() =>
																dispatch('splide', {
																	type: 'move',
																	blockId: block.id,
																	index: i,
																	direction: 'next'
																})}
														>
															&gt;
														</button>
													</div>
													<button
														type="button"
														class="remove-slide-btn"
														onclick={() =>
															dispatch('splide', { type: 'remove', blockId: block.id, index: i })}
													>
														×
													</button>
													<img
														src={slide.url || 'https://placehold.co/150x100'}
														alt=""
														class="slide-preview"
													/>
													<input
														type="url"
														placeholder="Afbeeldings-URL"
														bind:value={slide.url}
														oninput={() => dispatch('save')}
														class="slide-input"
													/>
													<textarea
														placeholder="Bijschrift (optioneel)"
														bind:value={slide.caption}
														oninput={() => dispatch('save')}
														class="slide-textarea"
														rows="2"
													></textarea>
													<input
														type="text"
														placeholder="Bron (verplicht)"
														bind:value={slide.source}
														oninput={() => dispatch('save')}
														class="slide-input"
													/>
												</div>
											</li>
										{/each}
									</ul>
								</div>
							</div>
						</div>
						<button
							type="button"
							class="add-slide-btn"
							onclick={() => dispatch('splide', { type: 'add', blockId: block.id })}
						>
							Voeg slide toe
						</button>
					</div>
				{:else if block.type === 'gallery'}
					<div class="gallery-editor">
						<div class="gallery-controls">
							<div class="layout-picker">
								<span class="input-label">Layout:</span>
								<div class="layout-options">
									<label class:active={block.content.columns === 2}>
										<input
											type="radio"
											bind:group={block.content.columns}
											value={2}
											onchange={() => dispatch('save')}
										/>
										<div class="layout-icon cols-2">
											<div></div>
											<div></div>
										</div>
									</label>
									<label class:active={block.content.columns === 3}>
										<input
											type="radio"
											bind:group={block.content.columns}
											value={3}
											onchange={() => dispatch('save')}
										/>
										<div class="layout-icon cols-3">
											<div></div>
											<div></div>
											<div></div>
										</div>
									</label>
									<label class:active={block.content.columns === 4}>
										<input
											type="radio"
											bind:group={block.content.columns}
											value={4}
											onchange={() => dispatch('save')}
										/>
										<div class="layout-icon cols-4">
											<div></div>
											<div></div>
											<div></div>
											<div></div>
										</div>
									</label>
								</div>
							</div>
							<span class="gallery-info">{getGalleryLayoutInfo(block)}</span>
						</div>

						<div class="splide-container">
							<div id="splide-{block.id}" class="splide">
								<div class="splide__track">
									<ul class="splide__list">
										{#each block.content.images as image, i (i)}
											<li class="splide__slide">
												<div class="slide-item">
													<div class="slide-header">
														<span class="editor-item-number">{i + 1}</span>
														<button
															type="button"
															class="move-btn"
															data-direction="prev"
															disabled={i === 0}
															onclick={() =>
																dispatch('splide', {
																	type: 'move',
																	blockId: block.id,
																	index: i,
																	direction: 'prev'
																})}
														>
															&lt;
														</button>
														<button
															type="button"
															class="move-btn"
															data-direction="next"
															disabled={i === block.content.images.length - 1}
															onclick={() =>
																dispatch('splide', {
																	type: 'move',
																	blockId: block.id,
																	index: i,
																	direction: 'next'
																})}
														>
															&gt;
														</button>
													</div>
													<button
														type="button"
														class="remove-slide-btn"
														onclick={() =>
															dispatch('splide', { type: 'remove', blockId: block.id, index: i })}
													>
														×
													</button>
													<img
														src={image.url || 'https://placehold.co/150x100'}
														alt=""
														class="slide-preview"
													/>
													<input
														type="url"
														placeholder="Afbeeldings-URL"
														bind:value={image.url}
														oninput={() => dispatch('save')}
														class="slide-input"
													/>
													<textarea
														placeholder="Bijschrift (optioneel)"
														bind:value={image.caption}
														oninput={() => dispatch('save')}
														class="slide-textarea"
														rows="2"
													></textarea>
													<input
														type="text"
														placeholder="Bron (verplicht)"
														bind:value={image.source}
														oninput={() => dispatch('save')}
														class="slide-input"
													/>
												</div>
											</li>
										{/each}
									</ul>
								</div>
							</div>
						</div>

						<button
							type="button"
							class="add-slide-btn"
							onclick={() => dispatch('splide', { type: 'add', blockId: block.id })}
							disabled={isGalleryAddDisabled(block)}
						>
							Voeg afbeelding toe
						</button>
					</div>
				{:else if block.type === 'textframe'}
					<div class="textframe-editor">
						<div class="control-group">
							<label class="control-label" for="textframe-heading-{block.id}">
								Kop (optioneel)
								<span class="label-hint">(wordt boven de tekst getoond)</span>
							</label>
							<input
								id="textframe-heading-{block.id}"
								type="text"
								bind:value={block.content.heading}
								oninput={() => dispatch('save')}
								placeholder="Voer een titel in..."
							/>
						</div>

						<div class="control-group">
							<label class="control-label" for="textframe-text-{block.id}">
								Tekst
								<span class="label-hint">(Markdown: **vet**, *cursief*, __onderstreept__)</span>
							</label>
							<textarea
								id="textframe-text-{block.id}"
								bind:value={block.content.text}
								oninput={() => dispatch('save')}
								rows="8"
								placeholder="Schrijf je tekst hier...&#10;&#10;Markdown wordt ondersteund:&#10;**vet**, *cursief*, __onderstreept__"
							></textarea>
						</div>

						<div class="control-group">
							<label class="checkbox-label">
								<input
									type="checkbox"
									checked={!!block.content.image && !block.content.image.hidden}
									onchange={(e) => {
										if (e.currentTarget.checked) {
											if (!block.content.image) {
												block.content.image = {
													url: '',
													alt: '',
													caption: '',
													source: '',
													layout: 'top-rect',
													rounded: false,
													hidden: false
												};
											} else {
												block.content.image.hidden = false;
											}
										} else {
											if (block.content.image) {
												block.content.image.hidden = true;
											}
										}
										dispatch('save');
									}}
								/>
								<span>Afbeelding toevoegen</span>
							</label>

							{#if block.content.image?.hidden}
								<p class="warning-hint">
									💡 Afbeelding verborgen (data bewaard). Vink opnieuw aan om te herstellen.
								</p>
							{/if}
						</div>

						{#if block.content.image && !block.content.image.hidden}
							<div class="image-controls">
								<div class="control-group">
									<label class="control-label" for="textframe-image-url-{block.id}">
										Afbeelding URL
									</label>
									<input
										id="textframe-image-url-{block.id}"
										type="url"
										bind:value={block.content.image.url}
										oninput={() => dispatch('save')}
										placeholder="https://example.com/image.jpg"
									/>
								</div>

								<div class="control-group">
									<label class="control-label" for="textframe-image-alt-{block.id}">
										Alt-tekst
										<span class="label-hint">(beschrijving voor screenreaders)</span>
									</label>
									<input
										id="textframe-image-alt-{block.id}"
										type="text"
										bind:value={block.content.image.alt}
										oninput={() => dispatch('save')}
										placeholder="Beschrijving van de afbeelding"
									/>
								</div>

								<div class="control-group">
									<label class="control-label" id="width-layout-label" for="width-layout-row"
										>Breedte + Layout</label
									>
									<div
										class="width-layout-row"
										id="width-layout-row"
										aria-labelledby="width-layout-label"
									>
										<div class="width-controls">
											<IconButton
												icon="icon-width-narrow"
												label="Smalle layout (700px)"
												active={block.content.width === 'narrow'}
												onclick={() => {
													block.content.width = 'narrow';
													dispatch('save');
												}}
											/>
											<IconButton
												icon="icon-width-wide"
												label="Brede layout (1200px)"
												active={block.content.width === 'wide'}
												onclick={() => {
													block.content.width = 'wide';
													dispatch('save');
												}}
											/>
										</div>

										<div class="divider"></div>

										<div class="layout-controls">
											<IconButton
												icon="icon-layout-top-rect"
												label="Foto boven, kop + tekst onder"
												active={block.content.image?.layout === 'top-rect'}
												onclick={() => {
													if (block.content.image) {
														block.content.image.layout = 'top-rect';
														dispatch('save');
													}
												}}
											/>
											<IconButton
												icon="icon-layout-top-rect-bottom"
												label="Kop + tekst boven, foto onderaan"
												active={block.content.image?.layout === 'top-rect-bottom'}
												onclick={() => {
													if (block.content.image) {
														block.content.image.layout = 'top-rect-bottom';
														dispatch('save');
													}
												}}
											/>
											<IconButton
												icon="icon-layout-inline-left"
												label="Kop boven, foto links (50%)"
												active={block.content.image?.layout === 'inline-square-left'}
												onclick={() => {
													if (block.content.image) {
														block.content.image.layout = 'inline-square-left';
														dispatch('save');
													}
												}}
											/>
											<IconButton
												icon="icon-layout-inline-right"
												label="Kop boven, foto rechts (50%)"
												active={block.content.image?.layout === 'inline-square-right'}
												onclick={() => {
													if (block.content.image) {
														block.content.image.layout = 'inline-square-right';
														dispatch('save');
													}
												}}
											/>
										</div>
									</div>
								</div>

								<div class="control-group">
									<label class="checkbox-label">
										<input
											type="checkbox"
											bind:checked={block.content.image.rounded}
											onchange={() => dispatch('save')}
										/>
										<span>Toon afbeelding rond</span>
									</label>
								</div>

								<div class="control-group">
									<label
										class="control-label"
										for="textframe-image-caption-{block.id}"
										class:disabled={block.content.image.layout.startsWith('inline') &&
											block.content.image.rounded}
									>
										Onderschrift (optioneel)
										{#if block.content.image.layout.startsWith('inline') && block.content.image.rounded}
											<span class="label-hint disabled-hint"
												>(niet zichtbaar bij ronde inline afbeelding)</span
											>
										{/if}
									</label>
									<input
										id="textframe-image-caption-{block.id}"
										type="text"
										bind:value={block.content.image.caption}
										oninput={() => dispatch('save')}
										placeholder="Onderschrift bij de afbeelding"
										disabled={block.content.image.layout.startsWith('inline') &&
											block.content.image.rounded}
									/>
								</div>

								<div class="control-group">
									<label
										class="control-label"
										for="textframe-image-source-{block.id}"
										class:disabled={block.content.image.layout.startsWith('inline') &&
											block.content.image.rounded}
									>
										Bron (optioneel)
										{#if block.content.image.layout.startsWith('inline') && block.content.image.rounded}
											<span class="label-hint disabled-hint"
												>(niet zichtbaar bij ronde inline afbeelding)</span
											>
										{/if}
									</label>
									<input
										id="textframe-image-source-{block.id}"
										type="text"
										bind:value={block.content.image.source}
										oninput={() => dispatch('save')}
										placeholder="Foto: Naam fotograaf"
										disabled={block.content.image.layout.startsWith('inline') &&
											block.content.image.rounded}
									/>
								</div>
							</div>
						{/if}
					</div>
				{:else if block.type === 'timeline'}
					<div class="timeline-editor">
						<h4>Tijdlijn ({block.content.timelines.length} items)</h4>

						<div class="splide-container">
							<div id="splide-{block.id}" class="splide">
								<div class="splide__track">
									<ul class="splide__list">
										{#each block.content.timelines as item, i (i)}
											<li class="splide__slide">
												<div class="slide-item">
													<div class="slide-header">
														<span class="editor-item-number">{i + 1}</span>
														<button
															type="button"
															class="move-btn"
															data-direction="prev"
															disabled={i === 0}
															onclick={() =>
																dispatch('splide', {
																	type: 'move',
																	blockId: block.id,
																	index: i,
																	direction: 'prev'
																})}
														>
															&lt;
														</button>
														<button
															type="button"
															class="move-btn"
															data-direction="next"
															disabled={i === block.content.timelines.length - 1}
															onclick={() =>
																dispatch('splide', {
																	type: 'move',
																	blockId: block.id,
																	index: i,
																	direction: 'next'
																})}
														>
															&gt;
														</button>
													</div>
													<button
														type="button"
														class="remove-slide-btn"
														onclick={() =>
															dispatch('splide', { type: 'remove', blockId: block.id, index: i })}
													>
														×
													</button>
													<input
														type="text"
														placeholder="Jaar / Datum"
														bind:value={item.year}
														oninput={() => dispatch('save')}
														class="slide-input"
													/>
													<input
														type="text"
														placeholder="Titel (optioneel)"
														bind:value={item.title}
														oninput={() => dispatch('save')}
														class="slide-input"
													/>
													<textarea
														placeholder="Omschrijving"
														bind:value={item.description}
														oninput={() => dispatch('save')}
														class="slide-textarea"
														rows="3"
													></textarea>
													<input
														type="url"
														placeholder="Afbeelding URL (optioneel)"
														bind:value={item.imageSrc}
														oninput={() => dispatch('save')}
														class="slide-input"
													/>
													{#if item.imageSrc}
														<img
															src={item.imageSrc}
															alt=""
															class="slide-preview"
															style="margin-top: 0.5rem;"
														/>
													{/if}
													<input
														type="text"
														placeholder="ALT-tekst voor afbeelding"
														bind:value={item.imageAlt}
														oninput={() => dispatch('save')}
														class="slide-input"
													/>
												</div>
											</li>
										{/each}
									</ul>
								</div>
							</div>
						</div>
						<button
							type="button"
							class="add-slide-btn"
							onclick={() => dispatch('splide', { type: 'add', blockId: block.id })}
						>
							Voeg tijdlijn-item toe
						</button>
					</div>
				{:else if block.type === 'mediaPair'}
					<div class="mediapaar-editor">
						<div class="mediapaar-controls">
							<button
								type="button"
								class="swap-btn"
								onclick={() => dispatch('media', { type: 'swap', blockId: block.id })}
							>
								<svg
									width="20"
									height="20"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="2"
								>
									<path d="M8 7h12M8 7l4-4M8 7l4 4M16 17H4M16 17l-4 4M16 17l-4-4" />
								</svg>
								Wissel
							</button>

							<div class="valign-picker">
								<span class="input-label">Uitlijning:</span>
								<div class="valign-options">
									<label class:active={block.content.verticalAlign === 'top'}>
										<input
											type="radio"
											bind:group={block.content.verticalAlign}
											value="top"
											onchange={() => dispatch('save')}
										/>
										<div class="valign-icon top">
											<div></div>
											<div></div>
										</div>
									</label>
									<label class:active={block.content.verticalAlign === 'center'}>
										<input
											type="radio"
											bind:group={block.content.verticalAlign}
											value="center"
											onchange={() => dispatch('save')}
										/>
										<div class="valign-icon center">
											<div></div>
											<div></div>
										</div>
									</label>
									<label class:active={block.content.verticalAlign === 'bottom'}>
										<input
											type="radio"
											bind:group={block.content.verticalAlign}
											value="bottom"
											onchange={() => dispatch('save')}
										/>
										<div class="valign-icon bottom">
											<div></div>
											<div></div>
										</div>
									</label>
									<label class:active={block.content.verticalAlign === 'bottom-alt'}>
										<input
											type="radio"
											bind:group={block.content.verticalAlign}
											value="bottom-alt"
											onchange={() => dispatch('save')}
										/>
										<div class="valign-icon bottom-alt">
											<div></div>
											<div></div>
										</div>
									</label>
								</div>
							</div>
						</div>

						<div class="mediapaar-items">
							{#each block.content.items as item, idx (idx)}
								<div class="mediapaar-item">
									<h5>{item.type === 'image' ? 'Afbeelding' : 'Video'}</h5>
									<select
										class="type-select"
										value={item.type}
										onchange={() =>
											dispatch('media', { type: 'toggle', blockId: block.id, itemIndex: idx })}
									>
										<option value="image">Afbeelding</option>
										<option value="video">Video</option>
									</select>

									<input
										type="url"
										placeholder="URL"
										bind:value={item.url}
										oninput={() => dispatch('save')}
										class="slide-input"
									/>

									{#if item.type === 'video'}
										<input
											type="url"
											placeholder="Poster URL (voor video)"
											bind:value={item.poster}
											oninput={() => dispatch('save')}
											class="slide-input"
										/>
									{/if}

									<textarea
										placeholder="Bijschrift"
										bind:value={item.caption}
										oninput={() => dispatch('save')}
										class="slide-textarea"
										rows="2"
									></textarea>

									{#if item.type === 'image'}
										<input
											type="text"
											placeholder="Bron"
											bind:value={item.source}
											oninput={() => dispatch('save')}
											class="slide-input"
										/>
									{/if}

									{#if item.url}
										<div class="media-preview-container">
											{#if item.type === 'image'}
												<img src={item.url} alt="" class="media-preview-small" />
											{:else}
												<video
													src={item.url}
													poster={item.poster || ''}
													autoplay
													muted
													loop
													class="media-preview-small"
												>
													<track kind="captions" />
												</video>
											{/if}
										</div>
									{/if}
								</div>
							{/each}
						</div>
					</div>
				{:else if block.type === 'audio'}
					<div class="audio-editor">
						<input
							type="url"
							placeholder="Afbeelding URL (optioneel)"
							bind:value={block.content.image}
							oninput={() => dispatch('save')}
							class="block-input"
						/>
						{#if block.content.image}
							<img src={block.content.image} alt="" class="audio-image-preview" />
						{/if}
						<input
							type="text"
							placeholder="Titel van de audio"
							bind:value={block.content.title}
							oninput={() => dispatch('save')}
							class="block-input"
						/>
						<textarea
							placeholder="Beschrijving (optioneel)"
							bind:value={block.content.description}
							oninput={() => dispatch('save')}
							class="block-textarea"
							rows="2"
						></textarea>
						<input
							type="url"
							placeholder="Audio URL (.mp3)"
							bind:value={block.content.url}
							oninput={() => dispatch('save')}
							class="block-input"
						/>
						{#if block.content.url}
							<audio controls src={block.content.url} class="audio-player"></audio>
						{/if}
					</div>
				{:else if block.type === 'colofon'}
					<div class="colofon-editor">
						<h4>Colofon</h4>
						<div class="colofon-items">
							{#each block.content.items as item, i (i)}
								<div class="colofon-item">
									<input
										type="text"
										placeholder="Functie"
										bind:value={item.functie}
										oninput={() => dispatch('save')}
										class="colofon-input"
									/>
									<input
										type="text"
										placeholder="Naam/Namen"
										bind:value={item.namen}
										oninput={() => dispatch('save')}
										class="colofon-input"
									/>
									<button
										type="button"
										class="remove-colofon-btn"
										onclick={() =>
											dispatch('colofon', { type: 'remove', blockId: block.id, index: i })}
									>
										×
									</button>
								</div>
							{/each}
						</div>
						<button
							type="button"
							class="add-colofon-btn"
							onclick={() => dispatch('colofon', { type: 'add', blockId: block.id })}
						>
							Voeg rij toe
						</button>
					</div>
				{/if}
			</div>
		</div>
	{/each}
</div>

{#if blocks.length === 0}
	<div class="empty-canvas">
		<p>Sleep hier je blokken om te beginnen...</p>
	</div>
{/if}

<style>
	.canvas-wrapper {
		max-width: 800px;
		margin: 0 auto;
		min-height: 400px;
		background: white;
		border: 2px dashed #e5e7eb;
		border-radius: 8px;
		padding: 20px;
		position: relative; /* Nodig voor de 'empty-canvas' overlay */
		padding-bottom: 40vh;
	}

	.empty-canvas {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		min-height: 360px;
		color: #9ca3af;
		font-style: italic;
		font-size: 0.9375rem;
		pointer-events: none;
	}

	.empty-canvas p {
		pointer-events: auto;
	}

	.canvas-block {
		background: #f9fafb;
		border: 1px solid #e5e7eb;
		border-radius: 8px;
		padding: 20px;
		margin-bottom: 15px;
		position: relative;
		transition: box-shadow 0.2s;
	}

	.canvas-block:hover {
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
	}

	.drag-handle {
		position: absolute;
		top: 50%;
		left: 8px;
		transform: translateY(-50%);
		color: #d1d5db;
		cursor: grab;
		font-size: 1.25em;
		user-select: none;
	}

	.drag-handle:active {
		cursor: grabbing;
	}

	.remove-btn {
		position: absolute;
		top: 10px;
		right: 10px;
		background: #ef4444;
		color: white;
		border: none;
		border-radius: 50%;
		width: 24px;
		height: 24px;
		cursor: pointer;
		font-weight: bold;
		opacity: 0;
		transition: opacity 0.2s;
		font-size: 16px;
		line-height: 1;
	}

	.canvas-block:hover .remove-btn {
		opacity: 1;
	}

	.remove-btn:hover {
		background: #dc2626;
	}

	.content {
		margin-left: 30px;
	}

	.block-input,
	.block-textarea {
		width: 100%;
		padding: 0.75rem;
		border: 1px solid #e5e7eb;
		border-radius: 6px;
		font-family: inherit;
		font-size: 0.9375rem;
		margin-bottom: 0.5rem;
		box-sizing: border-box;
		transition: all 0.15s;
	}

	.block-textarea {
		resize: vertical;
		min-height: 80px;
	}

	.block-input:focus,
	.block-textarea:focus {
		outline: none;
		border-color: #667eea;
		box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
	}

	/* ============================================
   HEADING HIERARCHY IN EDITOR CANVAS
   ============================================ */

	/* H2 Input - Hoofdkop (imposant, urgent, zwaar) */
	.block-input:not(.block-input-subheading) {
		font-size: 1.5rem !important; /* 32px - Groot! */
		font-weight: 700 !important; /* Extra bold */
		color: #000000 !important; /* Zwart */
		line-height: 1.2 !important;
		padding: 0.75rem !important;
		letter-spacing: -0.02em; /* Tighter spacing */
	}
	.block-input-subheading-medium {
		font-size: 1.25rem !important; /* Tussen H2 (1.5rem) en H4 (1.125rem) */
		font-weight: 650 !important; /* Tussen H2 (700) en H4 (600) */
		color: #4b5563 !important; /* Zelfde als H4 */
		line-height: 1.3 !important;
		padding: 0.75rem !important;
	}

	/* H4 Input - Tussenkop (bescheiden, ondersteunend) */
	.block-input-subheading {
		font-size: 1.125rem !important; /* 18px - Kleiner dan H2 */
		font-weight: 500 !important; /* Semi-bold */
		color: #4c4d4e !important; /* Grijs */
		line-height: 1.3 !important;
		padding: 0.75rem !important;
	}

	.block-preview {
		width: 100%;
		max-height: 300px;
		object-fit: cover;
		border-radius: 6px;
		margin-top: 0.5rem;
	}

	.lead-toggle,
	.parallax-toggle {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		margin-top: 0.5rem;
		font-size: 0.875rem;
		cursor: pointer;
		user-select: none;
		color: #6b7280;
	}

	.lead-toggle input,
	.parallax-toggle input {
		width: auto;
		margin: 0;
		cursor: pointer;
	}

	.hero-video-editor,
	.image-hero-editor {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.input-row {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 0.75rem;
	}

	.input-row-split {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 0.75rem;
	}

	.input-col,
	.input-col-left,
	.input-col-right {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.input-col-left {
		gap: 0.75rem;
	}

	.input-group {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.preview-col {
		width: 100%;
	}

	.media-preview {
		width: 100%;
		height: 150px;
		object-fit: cover;
		border-radius: 6px;
		background: #000;
	}

	.hero-video-editor label,
	.image-hero-editor label {
		font-weight: 600;
		font-size: 0.6875rem;
		color: #6b7280;
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.hero-video-editor input,
	.image-hero-editor input,
	.video-editor input {
		padding: 0.5rem;
		border: 1px solid #e5e7eb;
		border-radius: 6px;
		font-size: 0.875rem;
	}

	.hero-align-picker {
		display: flex;
		gap: 5px;
		background: white;
		padding: 4px;
		border-radius: 6px;
		border: 1px solid #e5e7eb;
		margin-top: 0.25rem;
	}

	.hero-align-picker input[type='radio'] {
		display: none;
	}

	.hero-align-picker label {
		cursor: pointer;
		padding: 6px;
		border-radius: 4px;
		transition: all 0.15s;
		display: flex;
		align-items: center;
		justify-content: center;
		border: 2px solid transparent;
		flex: 1;
		text-transform: none;
		letter-spacing: normal;
	}

	.hero-align-picker label.active {
		border-color: #d10a10;
		background: #fef2f2;
	}

	.hero-align-icon {
		width: 40px;
		height: 30px;
		border: 1px solid #e5e7eb;
		border-radius: 4px;
		display: flex;
		align-items: center;
		justify-content: center;
		background: white;
	}

	.hero-align-icon svg {
		width: 100%;
		height: 100%;
		opacity: 0.3;
		transition: opacity 0.2s;
		color: #6b7280;
	}

	.hero-align-picker label.active .hero-align-icon svg {
		opacity: 1;
		color: #d10a10;
	}

	.video-editor {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.slider-editor,
	.gallery-editor,
	.timeline-editor {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.slider-editor h4,
	.timeline-editor h4 {
		margin: 0;
		color: #111827;
		font-size: 0.9375rem;
	}

	.splide-container {
		overflow: visible;
	}

	.splide {
		overflow: visible;
	}

	.splide__track {
		overflow-x: auto;
		overflow-y: visible;
	}

	.splide__list {
		display: flex !important;
	}

	.slide-item {
		background: white;
		border: 1px solid #e5e7eb;
		padding: 15px;
		border-radius: 6px;
		position: relative;
		width: 380px;
		min-width: 380px;
		max-width: 380px;
		margin-right: 10px;
		box-sizing: border-box;
	}

	.slide-header {
		display: flex;
		align-items: center;
		gap: 8px;
		margin-bottom: 10px;
		padding-bottom: 10px;
		border-bottom: 1px solid #e5e7eb;
	}

	.editor-item-number {
		font-weight: 700;
		color: #d10a10;
		font-size: 16px;
		min-width: 25px;
	}

	.move-btn {
		background: #f9fafb;
		border: 1px solid #e5e7eb;
		padding: 4px 10px;
		cursor: pointer;
		border-radius: 4px;
		font-size: 13px;
		font-weight: 600;
		transition: all 0.15s;
	}

	.move-btn:disabled {
		opacity: 0.3;
		cursor: not-allowed;
	}

	.move-btn:hover:not(:disabled) {
		background: #f3f4f6;
		border-color: #d1d5db;
	}

	.remove-slide-btn {
		position: absolute;
		top: 10px;
		right: 10px;
		background: #ef4444;
		color: white;
		border: none;
		border-radius: 50%;
		width: 26px;
		height: 26px;
		cursor: pointer;
		font-weight: bold;
		font-size: 16px;
		z-index: 10;
		line-height: 1;
	}

	.remove-slide-btn:hover {
		background: #dc2626;
	}

	.slide-preview {
		width: 100%;
		max-height: 200px;
		object-fit: cover;
		margin-bottom: 10px;
		border-radius: 6px;
	}

	.slide-input,
	.slide-textarea {
		width: 100%;
		padding: 0.5rem;
		border: 1px solid #e5e7eb;
		border-radius: 6px;
		font-family: inherit;
		font-size: 0.875rem;
		margin-bottom: 0.5rem;
		box-sizing: border-box;
	}

	.slide-textarea {
		resize: vertical;
		min-height: 60px;
	}

	.add-slide-btn {
		padding: 10px 20px;
		background: #d10a10;
		color: white;
		border: none;
		border-radius: 6px;
		cursor: pointer;
		font-weight: 600;
		font-size: 0.875rem;
		align-self: center;
		transition: all 0.15s;
	}

	.add-slide-btn:hover {
		background: #b00909;
	}

	.add-slide-btn:disabled {
		background: #d1d5db;
		cursor: not-allowed;
		opacity: 0.6;
	}

	.gallery-controls {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 10px;
		flex-wrap: wrap;
		margin-bottom: 1rem;
	}

	.layout-picker {
		display: flex;
		align-items: center;
		gap: 10px;
	}

	.layout-options {
		display: flex;
		gap: 6px;
		background: white;
		padding: 4px;
		border-radius: 6px;
		border: 1px solid #e5e7eb;
	}

	.layout-options input[type='radio'] {
		display: none;
	}

	.layout-options label {
		cursor: pointer;
		padding: 6px;
		border-radius: 4px;
		transition: all 0.15s;
		border: 2px solid transparent;
	}

	.layout-options label.active {
		border-color: #d10a10;
		background: #fef2f2;
	}

	.layout-icon {
		display: grid;
		gap: 2px;
		width: 40px;
		height: 30px;
	}

	.layout-icon div {
		background: #6b7280;
		opacity: 0.3;
		border-radius: 2px;
		transition: opacity 0.2s;
	}

	.layout-options label.active .layout-icon div {
		opacity: 1;
	}

	.layout-icon.cols-2 {
		grid-template-columns: 1fr 1fr;
	}

	.layout-icon.cols-3 {
		grid-template-columns: 1fr 1fr 1fr;
	}

	.layout-icon.cols-4 {
		grid-template-columns: 1fr 1fr 1fr 1fr;
	}

	.gallery-info {
		font-size: 0.8125rem;
		color: #6b7280;
		flex: 1;
	}

	.mediapaar-editor {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.mediapaar-controls {
		display: flex;
		gap: 15px;
		align-items: center;
		padding: 12px;
		background: #f9fafb;
		border-radius: 6px;
		border: 1px solid #e5e7eb;
	}

	.swap-btn {
		padding: 8px 14px;
		background: white;
		border: 1px solid #e5e7eb;
		border-radius: 6px;
		cursor: pointer;
		font-size: 0.875rem;
		font-weight: 600;
		transition: all 0.15s;
		display: flex;
		align-items: center;
		gap: 8px;
		color: #374151;
	}

	.swap-btn:hover {
		border-color: #d10a10;
		background: #fef2f2;
		color: #d10a10;
	}

	.swap-btn svg {
		width: 16px;
		height: 16px;
	}

	.valign-picker {
		display: flex;
		align-items: center;
		gap: 10px;
	}

	.valign-options {
		display: flex;
		gap: 5px;
		background: white;
		padding: 4px;
		border-radius: 6px;
		border: 1px solid #e5e7eb;
	}

	.valign-options input[type='radio'] {
		display: none;
	}

	.valign-options label {
		cursor: pointer;
		padding: 6px;
		border-radius: 4px;
		transition: all 0.15s;
		border: 2px solid transparent;
	}

	.valign-options label.active {
		border-color: #d10a10;
		background: #fef2f2;
	}

	.valign-icon {
		display: grid;
		grid-template-columns: 1fr 1fr;
		grid-template-rows: 1fr 1fr;
		gap: 2px;
		width: 40px;
		height: 30px;
	}

	.valign-icon div {
		background: #6b7280;
		opacity: 0.3;
		border-radius: 2px;
		transition: opacity 0.2s;
	}

	.valign-options label.active .valign-icon div {
		opacity: 1;
	}

	.valign-icon.top div:nth-child(1) {
		grid-row: 1 / 3;
		grid-column: 1;
	}
	.valign-icon.top div:nth-child(2) {
		grid-row: 1;
		grid-column: 2;
	}

	.valign-icon.center div:nth-child(1) {
		grid-row: 1 / 3;
		grid-column: 1;
	}
	.valign-icon.center div:nth-child(2) {
		grid-row: 2;
		grid-column: 2;
	}

	.valign-icon.bottom div:nth-child(1) {
		grid-row: 1;
		grid-column: 1;
	}
	.valign-icon.bottom div:nth-child(2) {
		grid-row: 1 / 3;
		grid-column: 2;
	}

	.valign-icon.bottom-alt div:nth-child(1) {
		grid-row: 2;
		grid-column: 1;
	}
	.valign-icon.bottom-alt div:nth-child(2) {
		grid-row: 1 / 3;
		grid-column: 2;
	}

	.mediapaar-items {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 15px;
	}

	.mediapaar-item {
		border: 1px solid #e5e7eb;
		padding: 15px;
		border-radius: 6px;
		background: #f9fafb;
	}

	.mediapaar-item h5 {
		margin-top: 0;
		margin-bottom: 0.5rem;
		color: #111827;
		font-size: 0.9375rem;
	}

	.type-select {
		width: 100%;
		padding: 0.5rem;
		border: 1px solid #e5e7eb;
		border-radius: 6px;
		margin-bottom: 0.5rem;
		font-size: 0.875rem;
	}

	.media-preview-container {
		margin-top: 0.5rem;
	}

	.media-preview-small {
		width: 100%;
		height: auto;
		max-height: 150px;
		object-fit: cover;
		border-radius: 6px;
		background: #000;
	}

	.audio-editor {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.audio-image-preview {
		width: 128px;
		height: 128px;
		object-fit: cover;
		border-radius: 6px;
		margin-bottom: 0.5rem;
	}

	.audio-player {
		width: 100%;
		margin-top: 0.5rem;
	}

	.colofon-editor {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.colofon-editor h4 {
		margin: 0;
		color: #111827;
		font-size: 0.9375rem;
	}

	.colofon-items {
		display: flex;
		flex-direction: column;
		gap: 10px;
	}

	.colofon-item {
		display: flex;
		gap: 10px;
		align-items: center;
	}

	.colofon-input {
		flex: 1;
		padding: 0.5rem;
		border: 1px solid #e5e7eb;
		border-radius: 6px;
		font-size: 0.875rem;
	}

	.remove-colofon-btn {
		background: #ef4444;
		color: white;
		border: none;
		border-radius: 50%;
		width: 30px;
		height: 30px;
		cursor: pointer;
		font-weight: bold;
		flex-shrink: 0;
		font-size: 16px;
		line-height: 1;
	}

	.remove-colofon-btn:hover {
		background: #dc2626;
	}

	.add-colofon-btn {
		padding: 10px 20px;
		background: #d10a10;
		color: white;
		border: none;
		border-radius: 6px;
		cursor: pointer;
		font-weight: 600;
		font-size: 0.875rem;
		align-self: flex-start;
		transition: all 0.15s;
	}

	.add-colofon-btn:hover {
		background: #b00909;
	}

	/* ✅ GOED: Dit is de placeholder (het "gat") */
	:global(.sortable-ghost) {
		opacity: 1 !important; /* Maak het 'gat' 100% zichtbaar */
		background: #d1fae5 !important; /* Lichtgroen */
		border: 2px dashed #065f46 !important; /* Donkergroene rand */
		border-radius: 8px;

		/* Belangrijk: verberg de *inhoud* van het 'gat' */
		overflow: hidden;
	}

	/* Deze regel (voor het element dat je vasthoudt) kun je laten staan 
  zoals hij was, of je kunt hem aanpassen. 
  Ik laat hem hier even weg voor de duidelijkheid.
*/
	:global(.dragging-preview) {
		opacity: 0.9 !important;
		background: #f9fafb !important; /* Maak het element dat je sleept juist weer wit */
		border: 1px solid #d1d5db !important;
		border-radius: 8px;
		box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
	}

	.input-label {
		font-weight: 600;
		font-size: 0.6875rem;
		color: #6b7280;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		display: block;
		margin-bottom: 0.25rem;
	}
	.subheading-soccer-editor {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.style-preview {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.preview-box {
		padding: 0.5rem 1rem;
		border-radius: 4px;
		width: fit-content;
		font-size: 1rem;
		font-weight: 600;
		text-transform: uppercase;
	}

	.preview-hint {
		margin: 0;
		font-size: 0.75rem;
		color: #6b7280;
		font-style: italic;
	}

	.textblock-editor {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.textframe-editor {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.control-group {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.control-label {
		font-size: 0.875rem;
		font-weight: 600;
		color: #374151;
		display: flex;
		align-items: baseline;
		gap: 0.5rem;
	}

	.label-hint {
		font-size: 0.75rem;
		font-weight: 400;
		color: #6b7280;
	}

	.textframe-editor textarea {
		font-family: inherit;
		font-size: inherit;
		line-height: 1.5;
	}

	.width-layout-row {
		display: flex;
		align-items: center;
		gap: 1rem;
		flex-wrap: wrap;
	}

	.width-controls {
		display: flex;
		gap: 0.5rem;
	}
	.layout-controls {
		display: flex;
		gap: 0.5rem;
		flex-wrap: wrap;
		flex: 1;
	}

	@media (max-width: 768px) {
		.width-layout-row {
			flex-direction: column;
			align-items: stretch;
		}

		.divider {
			width: 100%;
			height: 1px;
		}

		.layout-controls {
			display: grid;
			grid-template-columns: repeat(2, 1fr);
		}
	}

	.checkbox-label {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		cursor: pointer;
		user-select: none;
		font-size: 0.875rem;
		color: #374151;
		padding: 0.5rem 0;
		transition: color 0.15s ease;
	}

	.checkbox-label:hover {
		color: #111827;
	}

	.checkbox-label input[type='checkbox'] {
		width: 18px;
		height: 18px;
		margin: 0;
		cursor: pointer;
		accent-color: #d10a10;
	}

	.image-controls {
		display: flex;
		flex-direction: column;
		gap: 1.25rem;
		padding: 1.5rem;
		background: #f9fafb;
		border: 1px solid #e5e7eb;
		border-radius: 8px;
		margin-top: 0.25rem;
	}

	.textframe-editor input[type='text'],
	.textframe-editor input[type='url'],
	.textframe-editor textarea {
		transition:
			border-color 0.15s ease,
			box-shadow 0.15s ease;
	}

	.textframe-editor input[type='text']:focus,
	.textframe-editor input[type='url']:focus,
	.textframe-editor textarea:focus {
		border-color: #d10a10;
		box-shadow: 0 0 0 3px rgba(209, 10, 16, 0.1);
		outline: none;
	}

	.control-label.disabled {
		color: #9ca3af;
	}

	.disabled-hint {
		color: #9ca3af;
		font-style: italic;
	}

	.textframe-editor input:disabled {
		background-color: #f3f4f6;
		color: #9ca3af;
		cursor: not-allowed;
		opacity: 0.6;
	}
	.warning-hint {
		margin: 0.5rem 0 0 0;
		padding: 0.5rem 0.75rem;
		background: #fef3c7;
		border-left: 3px solid #f59e0b;
		border-radius: 4px;
		font-size: 0.8125rem;
		color: #92400e;
		line-height: 1.4;
	}

	/* ============================================
	   HEADING HIERARCHY IN EDITOR CANVAS
	   ============================================ */

	/* H2 - Hoofdkop (imposant, urgent, zwaar) */
	.canvas-block :global(h2) {
		font-size: 2rem; /* Groot */
		font-weight: 800; /* Extra bold */
		color: #000000; /* Zwart */
		line-height: 1.2;
		margin: 0 0 0.5rem 0;
		letter-spacing: -0.02em; /* Tighter voor impact */
	}

	/* H4 - Tussenkop (bescheiden, ondersteunend) */
	.canvas-block :global(h4) {
		font-size: 1.125rem; /* Kleiner */
		font-weight: 600; /* Semi-bold */
		color: #6b7280; /* Grijs */
		line-height: 1.3;
		margin: 0 0 0.5rem 0;
	}

	/* Tekstblok paragrafen - Normaal */
	.canvas-block :global(p) {
		font-size: 1rem;
		font-weight: 400;
		color: #374151;
		line-height: 1.6;
		margin: 0 0 0.5rem 0;
	}

	/* Strong/Bold in tekstblokken */
	.canvas-block :global(strong) {
		font-weight: 700;
		color: #111827;
	}

	/* Italic in tekstblokken */
	.canvas-block :global(em) {
		font-style: italic;
		color: #4b5563;
	}
	/* Markdown info button */
	.editor-header-row {
		display: flex;
		align-items: flex-start;
		margin-bottom: 0.5rem;
	}

	.input-label {
		display: flex;
		align-items: center;
		gap: 0.25rem;
	}

	.info-button {
		background: none;
		border: none;
		padding: 2px;
		cursor: pointer;
		color: #9ca3af;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		border-radius: 4px;
		transition: all 0.15s;
		vertical-align: middle;
	}

	.info-button:hover {
		background: #f3f4f6;
		color: #6b7280;
	}

	.info-button svg {
		width: 14px;
		height: 14px;
	}

	.markdown-tooltip {
		margin-bottom: 0.75rem;
	}

	.markdown-tooltip-content {
		background: #f9fafb;
		border: 1px solid #e5e7eb;
		border-radius: 6px;
		padding: 0.75rem;
		font-size: 0.8125rem;
		line-height: 1.6;
		animation: slideDown 0.2s ease;
	}

	.markdown-example {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		margin-bottom: 0.375rem;
		color: #6b7280;
	}

	.markdown-example:last-child {
		margin-bottom: 0;
	}

	.markdown-example code {
		background: white;
		padding: 0.125rem 0.375rem;
		border-radius: 3px;
		font-family: 'SF Mono', Monaco, monospace;
		color: #d10a10;
		font-size: 0.75rem;
		white-space: nowrap;
		flex-shrink: 0;
	}

	.markdown-example strong {
		font-weight: 700;
		color: #111827;
	}

	.markdown-example em {
		font-style: italic;
		color: #111827;
	}

	@keyframes slideDown {
		from {
			opacity: 0;
			transform: translateY(-4px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
	.embed-editor {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.embed-preview-notice {
		display: flex;
		align-items: flex-start;
		gap: 0.5rem;
		padding: 0.75rem;
		background: #dbeafe;
		border-left: 3px solid #3b82f6;
		border-radius: 4px;
		font-size: 0.8125rem;
		color: #1e40af;
		line-height: 1.4;
	}

	.embed-preview-notice svg {
		flex-shrink: 0;
		color: #3b82f6;
		margin-top: 2px;
	}
</style>
