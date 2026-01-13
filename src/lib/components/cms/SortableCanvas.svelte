<!--src\lib\components\cms\SortableCanvas.svelte-->
<script lang="ts">
	import { onDestroy, tick, createEventDispatcher, untrack } from 'svelte';
	import type { ContentBlock, Theme } from '$lib/types';
	import Sortable from 'sortablejs';
	import IconButton from '$lib/components/ui/IconButton.svelte';
	import TextBlock from '$lib/components/TextBlock.svelte';
	import MediaPairIcons from '$lib/assets/icons/MediaPairIcons.svelte';

	// === PROPS ===
	let {
		blocks = $bindable([]),
		theme = {},
		toolbox = null,
		allCollapsed = $bindable(false)
	} = $props<{
		blocks?: ContentBlock[];
		theme?: Theme;
		toolbox?: Sortable | null;
		allCollapsed?: boolean;
	}>();

	// === STATE ===
	let canvasEl!: HTMLElement;
	let canvasSortable: Sortable | null = null;

	// per-gallery portrait flags and scroll handler registry for editor previews
	let galleryPortraits = $state<Record<string, boolean[]>>({});
	const galleryScrollHandlers: Map<string, { onDown: any; onMove: any; onUp: any }> = new Map();
	const dispatch = createEventDispatcher();

	// ✅ COLLAPSE STATE with localStorage persistence
	const STORAGE_KEY = 'topverhalen-collapsed-blocks';

	// Load from localStorage
	function loadCollapsedState(): Set<string> {
		if (typeof window === 'undefined') return new Set();
		try {
			const stored = localStorage.getItem(STORAGE_KEY);
			return stored ? new Set(JSON.parse(stored)) : new Set();
		} catch {
			return new Set();
		}
	}

	// Save to localStorage
	function saveCollapsedState(collapsed: Set<string>) {
		if (typeof window === 'undefined') return;
		try {
			localStorage.setItem(STORAGE_KEY, JSON.stringify([...collapsed]));
		} catch (e) {
			console.warn('Failed to save collapsed state:', e);
		}
	}

	let collapsedBlocks = $state<Set<string>>(loadCollapsedState());

	// ✅ All block types are collapsible
	const COLLAPSIBLE_TYPES = [
		'heroVideo',
		'imageHero',
		'heading',
		'subheading',
		'subheadingMedium',
		'subheadingSoccer',
		'textblock',
		'image',
		'quote',
		'video',
		'embed',
		'slider',
		'gallery',
		'textframe',
		'timeline',
		'mediaPair',
		'audio',
		'colofon'
	];

	// ✅ Expliciet type toevoegen aan (b)
	const hasActiveLead = $derived(
		blocks.some((b: ContentBlock) => b.type === 'textblock' && b.content.isLead)
	);

	function toggleCollapse(blockId: string) {
		if (collapsedBlocks.has(blockId)) {
			collapsedBlocks.delete(blockId);
		} else {
			collapsedBlocks.add(blockId);
		}
		// ✅ Force reactivity by reassigning
		collapsedBlocks = new Set(collapsedBlocks);
		saveCollapsedState(collapsedBlocks);
	}

	// Track previous value to prevent infinite loop
	let previousAllCollapsed = allCollapsed;

	// Watch for allCollapsed changes from parent
	$effect(() => {
		// Only act if value actually changed
		if (allCollapsed === previousAllCollapsed) return;
		previousAllCollapsed = allCollapsed;

		const collapsibleBlockIds = blocks
			.filter((b: ContentBlock) => isCollapsible(b.type))
			.map((b: ContentBlock) => b.id);

		if (allCollapsed) {
			// Collapse all
			collapsibleBlockIds.forEach((id: string) => collapsedBlocks.add(id));
		} else {
			// Expand all
			collapsibleBlockIds.forEach((id: string) => collapsedBlocks.delete(id));
		}

		collapsedBlocks = new Set(collapsedBlocks);
		saveCollapsedState(collapsedBlocks);
	});

	// Ensure all image blocks have aspectRatio property
	$effect(() => {
		untrack(() => {
			blocks.forEach((block: ContentBlock) => {
				if (block.type === 'image' && !block.content.aspectRatio) {
					block.content.aspectRatio = 'original';
				}

				// Ensure gallery blocks have a default aspectRatio
				if (block.type === 'gallery' && !block.content.aspectRatio) {
					block.content.aspectRatio = 'original';
				}
				// Initialize portrait flags for gallery blocks so editor preview can mark portraits
				if (block.type === 'gallery') {
					const existing = galleryPortraits[block.id] || [];
					const arr = (block.content.images || []).map((_, i) => existing[i] || false);
					galleryPortraits = { ...galleryPortraits, [block.id]: arr };
				}
			});
		});
	});

	function isCollapsible(blockType: string): boolean {
		return COLLAPSIBLE_TYPES.includes(blockType);
	}

	function getBlockLabel(type: string): string {
		const labels: Record<string, string> = {
			heroVideo: 'Hero Video',
			imageHero: 'Hero Afbeelding',
			heading: 'Kop',
			subheading: 'Tussenkop',
			subheadingMedium: 'Tussenkop (H3)',
			subheadingSoccer: 'Tussenkop Voetbal',
			textblock: 'Tekstblok',
			image: 'Afbeelding',
			quote: 'Citaat',
			video: 'Video',
			embed: 'Embed',
			slider: 'Fotoslider',
			gallery: 'Fotogrid',
			textframe: 'Tekstkader',
			timeline: 'Tijdlijn',
			mediaPair: 'Mediapaar',
			audio: 'Audiospeler',
			colofon: 'Colofon'
		};
		return labels[type] || type;
	}

	// ✅ Generate content preview for collapsed blocks
	function getContentPreview(block: ContentBlock): string {
		const maxLength = 60;
		const truncate = (text: string) =>
			text.length > maxLength ? text.substring(0, maxLength) + '...' : text;

		switch (block.type) {
			case 'heading':
			case 'subheading':
			case 'subheadingMedium':
			case 'subheadingSoccer':
				return truncate((block.content as any).text || '');

			case 'textblock':
				const text = Array.isArray((block.content as any).text)
					? (block.content as any).text[0] || ''
					: (block.content as any).text || '';
				const leadLabel = (block.content as any).isLead ? '[Inleiding] ' : '';
				return leadLabel + truncate(text.replace(/[#*_~`]/g, '').trim());

			case 'quote':
				return truncate((block.content as any).text || '');

			case 'image':
				return truncate((block.content as any).caption || 'Geen bijschrift');

			case 'textframe':
				return truncate((block.content as any).heading || (block.content as any).text || '');

			case 'audio':
				return truncate((block.content as any).title || 'Geen titel');

			case 'video':
				return truncate((block.content as any).url || '');

			case 'heroVideo':
			case 'imageHero':
				return truncate((block.content as any).title || '');

			case 'timeline':
				const itemCount = (block.content as any).timelines?.length || 0;
				return `${itemCount} item${itemCount === 1 ? '' : 's'}`;

			case 'slider':
			case 'gallery':
				const imageCount = (block.content as any).images?.length || 0;
				return `${imageCount} afbeelding${imageCount === 1 ? '' : 'en'}`;

			case 'embed':
				return truncate((block.content as any).code ? 'Embed code aanwezig' : 'Geen code');

			case 'colofon':
				const items = (block.content as any).items;
				const firstItem = items?.[0];
				return firstItem ? truncate(firstItem.functie + ': ' + firstItem.namen) : '';

			default:
				return '';
		}
	}

	// ✅ MediaPair Layout Helpers
	function is3ItemLayout(layout: string): boolean {
		return ['3col-left', '3col-right'].includes(layout);
	}

	function adjustMediaPairItems(block: any) {
		const needs3Items = is3ItemLayout(block.content.verticalAlign || 'top');
		const currentCount = block.content.items?.length || 0;

		if (needs3Items && currentCount === 2) {
			// Add third item
			block.content.items.push({
				type: 'image',
				orientation: 'landscape',
				url: '',
				caption: '',
				source: ''
			});
		} else if (!needs3Items && currentCount === 3) {
			// Remove third item
			block.content.items = block.content.items.slice(0, 2);
		}
		dispatch('save');
	}

	function handleFocusClick(event: MouseEvent, block: ContentBlock) {
		const target = event.currentTarget as HTMLElement;
		const rect = target.getBoundingClientRect();
		const x = ((event.clientX - rect.left) / rect.width) * 100;
		const y = ((event.clientY - rect.top) / rect.height) * 100;

		// ✅ FIX: We casten naar 'any' zodat TypeScript niet klaagt
		(block.content as any).focusX = Math.round(x * 10) / 10;
		(block.content as any).focusY = Math.round(y * 10) / 10;

		dispatch('save');
	}

	function handleGalleryImageFocusClick(event: MouseEvent, image: any) {
		const target = event.currentTarget as HTMLElement;
		const rect = target.getBoundingClientRect();
		const x = ((event.clientX - rect.left) / rect.width) * 100;
		const y = ((event.clientY - rect.top) / rect.height) * 100;

		image.focusX = Math.round(x * 10) / 10;
		image.focusY = Math.round(y * 10) / 10;

		dispatch('save');
	}

	function handleTextFrameImageFocusClick(event: MouseEvent, image: any) {
		const target = event.currentTarget as HTMLElement;
		const rect = target.getBoundingClientRect();
		const x = ((event.clientX - rect.left) / rect.width) * 100;
		const y = ((event.clientY - rect.top) / rect.height) * 100;

		image.focusX = Math.round(x * 10) / 10;
		image.focusY = Math.round(y * 10) / 10;

		dispatch('save');
	}

	// === HULPFUNCTIES ===
	let splideInstances = new Map<string, any>();
	let gallerySortables = new Map<string, Sortable>();
	let markdownInfoOpen = $state<Record<string, boolean>>({});

	const themeStyles = $derived.by(() => {
		if (!theme) return '';

		return Object.entries(theme)
			.map(([key, value]) => {
				// Filter lege waardes eruit
				if (value === '' || value === null || value === undefined) return '';
				return `--${key}: ${value}`;
			})
			.join(';');
	});

	function toggleMarkdownInfo(blockId: string) {
		markdownInfoOpen[blockId] = !markdownInfoOpen[blockId];
	}

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
			splide.mount();

			// If this is a gallery block, create a Sortable instance on the slide list
			if (blockType === 'gallery') {
				const listEl = splideEl.querySelector('.splide__list') as HTMLElement | null;
				if (listEl) {
					// destroy existing if present
					if (gallerySortables.has(blockId)) {
						gallerySortables.get(blockId)?.destroy();
						gallerySortables.delete(blockId);
					}

					// also clean up any scroll handlers for this block
					if (galleryScrollHandlers.has(blockId)) {
						const h = galleryScrollHandlers.get(blockId)!;
						const container = splideEl.closest('.splide-container') as HTMLElement | null;
						if (container) {
							container.removeEventListener('mousedown', h.onDown);
							container.removeEventListener('mousemove', h.onMove);
							container.removeEventListener('mouseup', h.onUp);
							container.removeEventListener('mouseleave', h.onUp);
							container.removeEventListener('touchstart', h.onDown);
							container.removeEventListener('touchmove', h.onMove);
							container.removeEventListener('touchend', h.onUp);
						}
						galleryScrollHandlers.delete(blockId);
					}

					const gs = new Sortable(listEl, {
						animation: 150,
						draggable: '.splide__slide',
						onEnd: (evt) => {
							const oldIndex = evt.oldIndex;
							const newIndex = evt.newIndex;
							if (oldIndex == null || newIndex == null) return;
							const block = blocks.find((b: ContentBlock) => b.id === blockId);
							if (block) {
								const item = (block.content.images as any).splice(oldIndex, 1)[0];
								(block.content.images as any).splice(newIndex, 0, item);

								// reorder portrait flags for this gallery as well
								const portraits = galleryPortraits[blockId] || [];
								const flag = portraits.splice(oldIndex, 1)[0];
								portraits.splice(newIndex, 0, flag);
								galleryPortraits = { ...galleryPortraits, [blockId]: [...portraits] };

								dispatch('save');
								updateSlideNumbers(blockId);
							}
						}
					});
					gallerySortables.set(blockId, gs);

					// make the outer container show a horizontal scrollbar and allow click-drag scrolling
					const container = splideEl.closest('.splide-container') as HTMLElement | null;
					if (container) {
						container.style.overflowX = 'auto';
						container.style.setProperty('-webkit-overflow-scrolling', 'touch');

						let isDown = false;
						let startX = 0;
						let scrollLeft = 0;

						const onDown = (e: any) => {
							isDown = true;
							container.classList.add('dragging');
							startX = (e.pageX ?? e.touches?.[0]?.pageX) + 0;
							scrollLeft = container.scrollLeft;
						};

						const onMove = (e: any) => {
							if (!isDown) return;
							e.preventDefault();
							const x = (e.pageX ?? e.touches?.[0]?.pageX) + 0;
							const walk = startX - x;
							container.scrollLeft = scrollLeft + walk;
						};

						const onUp = () => {
							isDown = false;
							container.classList.remove('dragging');
						};

						container.addEventListener('mousedown', onDown);
						container.addEventListener('mousemove', onMove);
						container.addEventListener('mouseup', onUp);
						container.addEventListener('mouseleave', onUp);
						container.addEventListener('touchstart', onDown, { passive: false } as any);
						container.addEventListener('touchmove', onMove, { passive: false } as any);
						container.addEventListener('touchend', onUp);

						galleryScrollHandlers.set(blockId, { onDown, onMove, onUp });
					}
				}
			}

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
		const count = block.content.images.length;
		const cols = block.content.columns;

		// Speciale melding voor 4 foto's in 2x2 grid
		if (count === 4 && cols === 2) {
			return "2x2 Grid • 4 foto's";
		}

		const layoutMap: Record<number, string> = {
			2: '2 Kolommen',
			3: '3 Kolommen',
			4: '4 Kolommen'
		};
		return `${layoutMap[cols] || `${cols} kolommen`} • ${count} foto's`;
	}

	function isGalleryAddDisabled(block: ContentBlock): boolean {
		if (block.type !== 'gallery') return true;
		const count = block.content.images.length;

		// Maximum 4 foto's voor alle layouts (2, 3, of 4 naast elkaar / 2x2)
		return count >= 4;
	}

	// ✅ GOED (Stabiel & Waterdicht)
	$effect(() => {
		if (typeof window === 'undefined') return;

		const currentBlockIds = new Set(blocks.map((b: ContentBlock) => b.id));

		for (const blockId of splideInstances.keys()) {
			if (!currentBlockIds.has(blockId)) {
				const instance = splideInstances.get(blockId);
				if (instance) {
					instance.destroy();
				}
				splideInstances.delete(blockId);
				// destroy gallery sortable if present
				if (gallerySortables.has(blockId)) {
					const s = gallerySortables.get(blockId);
					if (s) s.destroy();
					gallerySortables.delete(blockId);
				}
			}
		}

		blocks.forEach((block: ContentBlock) => {
			if ((block.type === 'heroVideo' || block.type === 'video') && block.content.url) {
				setTimeout(() => initHlsPlayer(block), 50);
			}

			if (['slider', 'gallery', 'timeline'].includes(block.type)) {
				if (!splideInstances.has(block.id)) {
					setTimeout(() => initSplideForBlock(block.id, block.type), 100);
				}
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
				// ✅ FIX: Don't prevent clicks on non-drag elements
				preventOnFilter: false,
				filter: '.no-drag',

				onAdd: async (evt) => {
					canvasSortable?.option('disabled', true);
					// ✅ FIX: Use untrack to prevent toolbox from being tracked as dependency
					untrack(() => {
						if (toolbox) toolbox.option('disabled', true);
					});

					const blockType = evt.item.dataset.type;
					const newIndex = evt.newIndex;
					if (blockType && newIndex !== undefined) {
						dispatch('add', { blockType, newIndex });
					}
					evt.item.remove();

					await tick();

					canvasSortable?.option('disabled', false);
					untrack(() => {
						if (toolbox) toolbox.option('disabled', false);
					});
				},

				onUpdate: async (evt) => {
					canvasSortable?.option('disabled', true);
					untrack(() => {
						if (toolbox) toolbox.option('disabled', true);
					});

					const { oldIndex, newIndex } = evt;
					if (oldIndex !== undefined && newIndex !== undefined) {
						dispatch('move', { oldIndex, newIndex });
					}

					await tick();

					canvasSortable?.option('disabled', false);
					untrack(() => {
						if (toolbox) toolbox.option('disabled', false);
					});
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

		// destroy any gallery sortables
		gallerySortables.forEach((s) => s.destroy());
	});
</script>

<div class="canvas-wrapper" bind:this={canvasEl} style={themeStyles}>
	{#each blocks as block (block.id)}
		<div class="canvas-block" data-type={block.type} data-block-id={block.id}>
			<div class="block-header">
				<div class="drag-handle">⋮⋮</div>

				<!-- ✅ Only show collapse button for collapsible types -->
				{#if isCollapsible(block.type)}
					<button
						type="button"
						class="collapse-toggle"
						onclick={() => toggleCollapse(block.id)}
						aria-label={collapsedBlocks.has(block.id) ? 'Uitklappen' : 'Inklappen'}
					>
						<!-- ✅ Direct check on Set -->
						<svg
							class="collapse-icon"
							class:collapsed={collapsedBlocks.has(block.id)}
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
						>
							<polyline points="6 9 12 15 18 9"></polyline>
						</svg>
					</button>
				{/if}

				<div class="block-label-container">
					<span class="block-label">{getBlockLabel(block.type)}</span>
					{#if collapsedBlocks.has(block.id)}
						<span class="block-preview">{getContentPreview(block)}</span>
					{/if}
				</div>

				<button type="button" class="remove-btn" onclick={() => dispatch('remove', block.id)}>
					×
				</button>
			</div>

			<!-- ✅ Only collapse if type is collapsible AND is collapsed -->
			<div
				class="content"
				class:collapsed={isCollapsible(block.type) && collapsedBlocks.has(block.id)}
			>
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
							<div
								class="focus-controls"
								style="background: #f9fafb; padding: 1rem; border-radius: 8px; border: 1px solid #e5e7eb; margin-top: 0.5rem;"
							>
								<div
									style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;"
								>
									<h5 style="margin: 0; font-size: 0.875rem; font-weight: 600; color: #374151;">
										Focuspunt Instellen
									</h5>
									<span style="font-size: 0.75rem; color: #6b7280; font-family: monospace;">
										X: {block.content.focusX || 50}% Y: {block.content.focusY || 50}%
									</span>
								</div>

								<div
									role="button"
									tabindex="0"
									class="focus-interactive-wrapper"
									onclick={(e) => handleFocusClick(e, block)}
									onkeydown={(e) => {
										if (e.key === 'Enter' || e.key === ' ') e.preventDefault();
									}}
									style="position: relative; cursor: crosshair; display: block; width: 100%; border-radius: 6px; overflow: hidden;"
								>
									{#if block.content.poster}
										<img
											src={block.content.poster}
											alt="Focus preview"
											style="width: 100%; height: auto; display: block; object-fit: contain;"
										/>
									{:else}
										<video
											src={block.content.url}
											muted
											loop
											playsinline
											autoplay
											style="width: 100%; height: auto; display: block;"
										></video>
									{/if}

									<div
										class="focus-dot"
										style:left="{block.content.focusX || 50}%"
										style:top="{block.content.focusY || 50}%"
									></div>
								</div>
								<p
									class="control-hint"
									style="font-size: 0.75rem; color: #6b7280; margin-top: 0.5rem; text-align: center;"
								>
									Klik op het focuspunt (toegepast op zowel video als poster)
								</p>
							</div>
						{/if}

						<div
							class="input-row-split"
							style="margin-top: 1rem; display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem;"
						>
							<div
								class="input-col-left"
								style="display: flex; flex-direction: column; gap: 0.75rem; width: 100%; grid-column: span 2;"
							>
								<div class="input-group">
									<span class="input-label">Label</span>
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
									<span class="input-label">Bron</span>
									<input
										type="text"
										placeholder="Bronvermelding"
										bind:value={block.content.source}
										oninput={() => dispatch('save')}
									/>
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
							<div
								class="focus-controls"
								style="background: #f9fafb; padding: 1rem; border-radius: 8px; border: 1px solid #e5e7eb; margin-top: 0.5rem;"
							>
								<div
									style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;"
								>
									<h5 style="margin: 0; font-size: 0.875rem; font-weight: 600; color: #374151;">
										Focuspunt Instellen
									</h5>
									<span style="font-size: 0.75rem; color: #6b7280; font-family: monospace;">
										X: {block.content.focusX || 50}% Y: {block.content.focusY || 50}%
									</span>
								</div>
								<div
									role="button"
									tabindex="0"
									class="focus-interactive-wrapper"
									onclick={(e) => handleFocusClick(e, block)}
									onkeydown={(e) => {
										if (e.key === 'Enter' || e.key === ' ') e.preventDefault();
									}}
									style="position: relative; cursor: crosshair; display: block; width: 100%; border-radius: 6px; overflow: hidden;"
								>
									<img
										src={block.content.url}
										alt="Focus preview"
										style="width: 100%; height: auto; display: block; object-fit: contain;"
									/>
									<div
										class="focus-dot"
										style:left="{block.content.focusX || 50}%"
										style:top="{block.content.focusY || 50}%"
									></div>
								</div>
								<p
									class="control-hint"
									style="font-size: 0.75rem; color: #6b7280; margin-top: 0.5rem; text-align: center;"
								>
									Klik op het belangrijkste deel van de foto
								</p>
							</div>
						{/if}

						<div
							class="input-row-split"
							style="margin-top: 1rem; display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem;"
						>
							<div
								class="input-col-left"
								style="display: flex; flex-direction: column; gap: 0.75rem; width: 100%; grid-column: span 2;"
							>
								<div class="input-group">
									<span class="input-label">Label</span>
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
									<span class="input-label">Bron</span>
									<input
										type="text"
										placeholder="Foto: Naam Fotograaf"
										bind:value={block.content.source}
										oninput={() => dispatch('save')}
									/>
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
						{#if block.content.isLead || !hasActiveLead}
							<div class="control-group" style="margin-bottom: 1rem;">
								<label class="checkbox-label lead-toggle">
									<input
										type="checkbox"
										bind:checked={block.content.isLead}
										onchange={() => dispatch('save')}
									/>
									<span style="font-weight: 600; color: var(--color-accent);">
										Markeer als inleiding (Lead)
									</span>
								</label>
								{#if block.content.isLead}
									<p class="control-hint">Dit blok wordt groter weergegeven.</p>
								{/if}
							</div>
						{/if}
						<div class="editor-header-row">
							<label class="input-label">
								Tekst (Markdown)
								<button
									type="button"
									class="info-button"
									onclick={() => toggleMarkdownInfo(block.id)}
									aria-label="Markdown hulp"
									aria-expanded={!!markdownInfoOpen[block.id]}
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

						{#if markdownInfoOpen[block.id]}
							<div class="markdown-tooltip">
								<div class="markdown-tooltip-content">
									<div class="markdown-section">
										<div class="markdown-section-title">Tekst opmaak</div>
										<div class="markdown-example"><code>**vet**</code> → <strong>vet</strong></div>
										<div class="markdown-example"><code>*cursief*</code> → <em>cursief</em></div>
										<div class="markdown-example">
											<code>__onderstreept__</code> → <u>onderstreept</u>
										</div>
										<div class="markdown-example">
											<code>~~doorgehaald~~</code> → <del>doorgehaald</del>
										</div>
									</div>

									<div class="markdown-section">
										<div class="markdown-section-title">Links & Code</div>
										<div class="markdown-example"><code>[link](https://url.nl)</code> → link</div>
										<div class="markdown-example"><code>`code`</code> → <code>code</code></div>
									</div>

									<div class="markdown-section">
										<div class="markdown-section-title">Lijsten</div>
										<div class="markdown-example"><code>- item</code> → • item</div>
										<div class="markdown-example"><code>1. item</code> → 1. item</div>
										<div class="markdown-example">
											<code> - sub-item</code> → indent voor nesting
										</div>
									</div>

									<div class="markdown-section">
										<div class="markdown-section-title">Quote</div>
										<div class="markdown-example"><code>&gt; citaat</code> → blockquote</div>
									</div>
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
					</div>
				{:else if block.type === 'image'}
					<input
						type="url"
						placeholder="Afbeeldings-URL..."
						bind:value={block.content.url}
						oninput={() => dispatch('save')}
						class="slide-input"
					/>
					{#if block.content.url}
						{#if block.content.parallax || (block.content.aspectRatio && block.content.aspectRatio !== 'original')}
							<div class="focus-point-controls">
								<div
									style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;"
								>
									<h5 style="margin: 0; font-size: 0.875rem; font-weight: 600; color: #374151;">
										Focuspunt Instellen
									</h5>
									<span style="font-size: 0.75rem; color: #6b7280; font-family: monospace;">
										X: {block.content.focusX ?? 50}% Y: {block.content.focusY ?? 50}%
									</span>
								</div>
								<div
									role="button"
									tabindex="0"
									class="focus-interactive-wrapper"
									onclick={(e) => handleFocusClick(e, block)}
									onkeydown={(e) => {
										if (e.key === 'Enter' || e.key === ' ') e.preventDefault();
									}}
									style="position: relative; cursor: crosshair; display: block; width: 100%; border-radius: 6px; overflow: hidden;"
								>
									<img
										src={block.content.url}
										alt="Focus preview"
										style="width: 100%; height: auto; display: block; object-fit: contain;"
									/>
									<div
										class="focus-dot"
										style:left="{block.content.focusX ?? 50}%"
										style:top="{block.content.focusY ?? 50}%"
									></div>
								</div>
								<p
									class="control-hint"
									style="font-size: 0.75rem; color: #6b7280; margin-top: 0.5rem; text-align: center;"
								>
									{#if block.content.parallax}
										Klik op het focuspunt (voor parallax effect en uitsnede)
									{:else}
										Klik op het focuspunt (voor uitsnede)
									{/if}
								</p>
							</div>
						{:else}
							<img src={block.content.url} alt="" class="block-preview" />
						{/if}
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
						class="slide-input"
					/>
					<div class="image-controls">
						<div class="image-controls-row">
							<div class="control-group">
								<div class="control-label">Breedte:</div>
								<div class="width-controls" role="toolbar" aria-label="Breedte selectie">
									<IconButton
										icon="icon-width-narrow"
										label="Normaal"
										active={block.content.width === 'normal'}
										onclick={() => {
											block.content.width = 'normal';
											dispatch('save');
										}}
									/>
									<IconButton
										icon="icon-width-wide"
										label="Breed"
										active={block.content.width === 'wide'}
										onclick={() => {
											block.content.width = 'wide';
											dispatch('save');
										}}
									/>
									<IconButton
										icon="icon-width-full"
										label="Volledige breedte"
										active={block.content.width === 'full'}
										onclick={() => {
											block.content.width = 'full';
											dispatch('save');
										}}
									/>
								</div>
							</div>

							<div class="control-group">
								<div class="control-label">Beeldverhouding:</div>
								<div class="aspect-controls" role="toolbar" aria-label="Beeldverhouding selectie">
									{#if !block.content.parallax}
										<IconButton
											icon="icon-aspect-original"
											label="Origineel (volledig)"
											active={block.content.aspectRatio === 'original'}
											onclick={() => {
												block.content.aspectRatio = 'original';
												dispatch('save');
											}}
										/>
									{/if}
									<IconButton
										icon="icon-aspect-4-3"
										label="4:3 (landschap)"
										active={block.content.aspectRatio === '4:3'}
										onclick={() => {
											block.content.aspectRatio = '4:3';
											dispatch('save');
										}}
									/>
									<IconButton
										icon="icon-aspect-16-9"
										label="16:9 (breed landschap)"
										active={block.content.aspectRatio === '16:9'}
										onclick={() => {
											block.content.aspectRatio = '16:9';
											dispatch('save');
										}}
									/>
									<IconButton
										icon="icon-aspect-4-5"
										label="4:5 (portret)"
										active={block.content.aspectRatio === '4:5'}
										onclick={() => {
											block.content.aspectRatio = '4:5';
											dispatch('save');
										}}
									/>
									<IconButton
										icon="icon-aspect-1-1"
										label="1:1 (vierkant)"
										active={block.content.aspectRatio === '1:1'}
										onclick={() => {
											block.content.aspectRatio = '1:1';
											dispatch('save');
										}}
									/>
								</div>
							</div>
						</div>

						<label class="parallax-toggle">
							<input
								type="checkbox"
								bind:checked={block.content.parallax}
								onchange={() => {
									if (block.content.parallax && block.content.aspectRatio === 'original') {
										block.content.aspectRatio = '16:9';
									} else if (!block.content.parallax) {
										block.content.aspectRatio = 'original';
									}
									dispatch('save');
								}}
							/>
							<span>Parallax-effect</span>
						</label>
					</div>
				{:else if block.type === 'quote'}
					<div class="quote-editor">
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
							class="slide-input"
						/>

						<div class="control-group-row" style="display: flex; gap: 1.5rem; margin-top: 0.75rem;">
							<label class="checkbox-label">
								<input
									type="checkbox"
									bind:checked={block.content.typewriter}
									onchange={() => dispatch('save')}
								/>
								<span>Typewriter effect</span>
							</label>

							<label class="checkbox-label">
								<input
									type="checkbox"
									bind:checked={block.content.italic}
									onchange={() => dispatch('save')}
								/>
								<span>Cursief</span>
							</label>
						</div>
					</div>
				{:else if block.type === 'video'}
					<div class="video-editor">
						<div class="video-width-control">
							<div class="control-label">Breedte:</div>
							<div class="width-controls" role="toolbar" aria-label="Breedte selectie">
								<IconButton
									icon="icon-width-narrow"
									label="Normaal"
									active={block.content.width === 'normal'}
									onclick={() => {
										block.content.width = 'normal';
										dispatch('save');
									}}
								/>
								<IconButton
									icon="icon-width-wide"
									label="Breed"
									active={block.content.width === 'wide'}
									onclick={() => {
										block.content.width = 'wide';
										dispatch('save');
									}}
								/>
								<IconButton
									icon="icon-width-full"
									label="Volledige breedte"
									active={block.content.width === 'full'}
									onclick={() => {
										block.content.width = 'full';
										dispatch('save');
									}}
								/>
							</div>
						</div>

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
						<div class="embed-width-control">
							<div class="control-label">Breedte:</div>
							<div class="width-controls" role="toolbar" aria-label="Breedte selectie">
								<IconButton
									icon="icon-width-narrow"
									label="Normaal"
									active={block.content.width === 'normal'}
									onclick={() => {
										block.content.width = 'normal';
										dispatch('save');
									}}
								/>
								<IconButton
									icon="icon-width-wide"
									label="Breed"
									active={block.content.width === 'wide'}
									onclick={() => {
										block.content.width = 'wide';
										dispatch('save');
									}}
								/>
							</div>
						</div>

						<label class="input-label" for="embed-code-{block.id}">Embed Code</label>
						<textarea
							id="embed-code-{block.id}"
							placeholder="Plak hier je embed code (iframe, script, blockquote) of URL...

Voorbeelden:

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

						<div class="control-group">
							<label class="input-label" for="embed-caption-{block.id}">Bijschrift</label>
							<input
								id="embed-caption-{block.id}"
								type="text"
								placeholder="Bijschrift..."
								bind:value={block.content.caption}
								oninput={() => dispatch('save')}
								class="slide-input"
							/>
						</div>

						<div class="control-group">
							<label class="input-label" for="embed-source-{block.id}">Bron</label>
							<input
								id="embed-source-{block.id}"
								type="text"
								placeholder="Bron..."
								bind:value={block.content.source}
								oninput={() => dispatch('save')}
								class="slide-input"
							/>
						</div>
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
						<div class="slider-controls">
							<div class="control-label">Breedte:</div>
							<div class="width-controls" role="toolbar" aria-label="Breedte selectie">
								<IconButton
									icon="icon-width-narrow"
									label="Normaal"
									active={block.content.width === 'normal'}
									onclick={() => {
										block.content.width = 'normal';
										dispatch('save');
									}}
								/>
								<IconButton
									icon="icon-width-wide"
									label="Breed"
									active={block.content.width === 'wide'}
									onclick={() => {
										block.content.width = 'wide';
										dispatch('save');
									}}
								/>
							</div>
						</div>

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
														class:is-portrait={galleryPortraits[block.id] &&
															galleryPortraits[block.id][i]}
														onload={(e) => {
															const img = e.currentTarget as HTMLImageElement;
															const portrait = img.naturalHeight > img.naturalWidth;
															const existing = galleryPortraits[block.id] || [];
															existing[i] = portrait;
															galleryPortraits = { ...galleryPortraits, [block.id]: [...existing] };
														}}
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
							<div class="control-group">
								<div class="control-label">Breedte:</div>
								<div class="width-controls" role="toolbar" aria-label="Breedte selectie">
									<IconButton
										icon="icon-width-narrow"
										label="Normaal"
										active={block.content.width === 'normal'}
										onclick={() => {
											block.content.width = 'normal';
											dispatch('save');
										}}
									/>
									<IconButton
										icon="icon-width-wide"
										label="Breed"
										active={block.content.width === 'wide'}
										onclick={() => {
											block.content.width = 'wide';
											dispatch('save');
										}}
									/>
								</div>
							</div>

							<div class="control-group">
								<div class="control-label">Layout:</div>
								<div class="layout-options">
									<!-- Button 1: 2 naast elkaar - precies 2 foto's -->
									<label
										class:active={block.content.columns === 2 && block.content.images.length === 2}
										class:disabled={block.content.images.length !== 2}
										title={block.content.images.length !== 2
											? "Alleen beschikbaar met precies 2 foto's"
											: "2 foto's naast elkaar"}
									>
										<input
											type="radio"
											bind:group={block.content.columns}
											value={2}
											disabled={block.content.images.length !== 2}
											onchange={() => dispatch('save')}
										/>
										<div class="layout-icon cols-2">
											<div></div>
											<div></div>
										</div>
									</label>

									<!-- Button 2: 3 naast elkaar - precies 3 foto's -->
									<label
										class:active={block.content.columns === 3 && block.content.images.length === 3}
										class:disabled={block.content.images.length !== 3}
										title={block.content.images.length !== 3
											? "Alleen beschikbaar met precies 3 foto's"
											: "3 foto's naast elkaar"}
									>
										<input
											type="radio"
											bind:group={block.content.columns}
											value={3}
											disabled={block.content.images.length !== 3}
											onchange={() => dispatch('save')}
										/>
										<div class="layout-icon cols-3">
											<div></div>
											<div></div>
											<div></div>
										</div>
									</label>

									<!-- Button 3: 4 naast elkaar - precies 4 foto's -->
									<label
										class:active={block.content.columns === 4 && block.content.images.length === 4}
										class:disabled={block.content.images.length !== 4}
										title={block.content.images.length !== 4
											? "Alleen beschikbaar met precies 4 foto's"
											: "4 foto's naast elkaar"}
									>
										<input
											type="radio"
											bind:group={block.content.columns}
											value={4}
											disabled={block.content.images.length !== 4}
											onchange={() => dispatch('save')}
										/>
										<div class="layout-icon cols-4">
											<div></div>
											<div></div>
											<div></div>
											<div></div>
										</div>
									</label>

									<!-- Button 4: 2x2 Grid - precies 4 foto's -->
									<label
										class:active={block.content.columns === 2 && block.content.images.length === 4}
										class:disabled={block.content.images.length !== 4}
										title={block.content.images.length !== 4
											? "Alleen beschikbaar met precies 4 foto's"
											: '2x2 Grid layout'}
									>
										<input
											type="radio"
											bind:group={block.content.columns}
											value={2}
											disabled={block.content.images.length !== 4}
											onchange={() => dispatch('save')}
										/>
										<div class="layout-icon grid-2x2">
											<div></div>
											<div></div>
											<div></div>
											<div></div>
										</div>
									</label>
								</div>
							</div>

							<div class="control-group">
								<div class="control-label">Beeldverhouding:</div>
								<div class="aspect-controls" role="toolbar" aria-label="Beeldverhouding selectie">
									<IconButton
										icon="icon-aspect-original"
										label="Origineel (volledig)"
										active={block.content.aspectRatio === 'original'}
										onclick={() => {
											block.content.aspectRatio = 'original';
											dispatch('save');
										}}
									/>
									<IconButton
										icon="icon-aspect-4-3"
										label="4:3 (landschap)"
										active={block.content.aspectRatio === '4:3'}
										onclick={() => {
											block.content.aspectRatio = '4:3';
											dispatch('save');
										}}
									/>
									<IconButton
										icon="icon-aspect-16-9"
										label="16:9 (breed landschap)"
										active={block.content.aspectRatio === '16:9'}
										onclick={() => {
											block.content.aspectRatio = '16:9';
											dispatch('save');
										}}
									/>
									<IconButton
										icon="icon-aspect-4-5"
										label="4:5 (portret)"
										active={block.content.aspectRatio === '4:5'}
										onclick={() => {
											block.content.aspectRatio = '4:5';
											dispatch('save');
										}}
									/>
									<IconButton
										icon="icon-aspect-1-1"
										label="1:1 (vierkant)"
										active={block.content.aspectRatio === '1:1'}
										onclick={() => {
											block.content.aspectRatio = '1:1';
											dispatch('save');
										}}
									/>
								</div>
							</div>
						</div>

						<div
							style="display: flex; justify-content: space-between; align-items: center; margin-top: 0.75rem; gap: 1rem; flex-wrap: nowrap;"
						>
							<span class="gallery-info">{getGalleryLayoutInfo(block)}</span>
							<p
								class="control-hint"
								style="margin: 0; font-size: 0.75rem; color: #6b7280; white-space: nowrap;"
							>
								💡 Tip: Gebruik Shift+scroll of touchpad om tussen foto's te navigeren.
							</p>
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
													<div class="slide-preview-wrapper">
														<div
															role="button"
															tabindex="0"
															class="focus-interactive-wrapper"
															onclick={(e) => handleGalleryImageFocusClick(e, image)}
															onkeydown={(e) => {
																if (e.key === 'Enter' || e.key === ' ') e.preventDefault();
															}}
															style="position: relative; cursor: crosshair; display: block; width: 100%; border-radius: 6px; overflow: hidden;"
														>
															<img
																src={image.url || 'https://placehold.co/150x100'}
																alt=""
																class="slide-preview"
																class:is-portrait={galleryPortraits[block.id] &&
																	galleryPortraits[block.id][i]}
																onload={(e) => {
																	const img = e.currentTarget as HTMLImageElement;
																	const portrait = img.naturalHeight > img.naturalWidth;
																	const existing = galleryPortraits[block.id] || [];
																	existing[i] = portrait;
																	galleryPortraits = {
																		...galleryPortraits,
																		[block.id]: [...existing]
																	};
																}}
															/>
															<div
																class="focus-dot"
																style:left="{image.focusX ?? 50}%"
																style:top="{image.focusY ?? 50}%"
															></div>
														</div>
														<p
															class="control-hint"
															style="font-size: 0.7rem; color: #6b7280; margin: 0.25rem 0 0.5rem; text-align: center;"
														>
															Klik op foto voor focuspunt • X: {image.focusX ?? 50}% Y: {image.focusY ??
																50}%
														</p>
													</div>
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
							<label class="checkbox-label">
								<input
									type="checkbox"
									bind:checked={block.content.collapsible}
									onchange={() => dispatch('save')}
								/>
								<span>Maak tekstkader inklapbaar</span>
							</label>

							{#if block.content.collapsible}
								<div class="sub-control">
									<label class="checkbox-label checkbox-label-sub">
										<input
											type="checkbox"
											bind:checked={block.content.defaultOpen}
											onchange={() => dispatch('save')}
										/>
										<span>Standaard open tonen</span>
									</label>
									<p class="control-hint">
										💡 Als inklapbaar: bezoeker kan het kader open/dicht klappen.
										{block.content.defaultOpen ? 'Start open.' : 'Start dichtgeklapt.'}
									</p>
								</div>
							{/if}
						</div>

						<div class="control-group">
							<div class="editor-header-row">
								<label class="control-label" for="textframe-text-{block.id}">
									Tekst (Markdown)
									<button
										type="button"
										class="info-button"
										onclick={() => toggleMarkdownInfo(block.id)}
										aria-label="Markdown hulp"
										aria-expanded={!!markdownInfoOpen[block.id]}
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

							{#if markdownInfoOpen[block.id]}
								<div class="markdown-tooltip">
									<div class="markdown-tooltip-content">
										<div class="markdown-section">
											<div class="markdown-section-title">Tekst opmaak</div>
											<div class="markdown-example">
												<code>**vet**</code> → <strong>vet</strong>
											</div>
											<div class="markdown-example"><code>*cursief*</code> → <em>cursief</em></div>
											<div class="markdown-example">
												<code>__onderstreept__</code> → <u>onderstreept</u>
											</div>
											<div class="markdown-example">
												<code>~~doorgehaald~~</code> → <del>doorgehaald</del>
											</div>
										</div>

										<div class="markdown-section">
											<div class="markdown-section-title">Links & Code</div>
											<div class="markdown-example"><code>[link](https://url.nl)</code> → link</div>
											<div class="markdown-example"><code>`code`</code> → <code>code</code></div>
										</div>

										<div class="markdown-section">
											<div class="markdown-section-title">Lijsten</div>
											<div class="markdown-example"><code>- item</code> → • item</div>
											<div class="markdown-example"><code>1. item</code> → 1. item</div>
											<div class="markdown-example">
												<code> - sub-item</code> → indent voor nesting
											</div>
										</div>

										<div class="markdown-section">
											<div class="markdown-section-title">Quote</div>
											<div class="markdown-example"><code>&gt; citaat</code> → blockquote</div>
										</div>
									</div>
								</div>
							{/if}

							<textarea
								id="textframe-text-{block.id}"
								bind:value={block.content.text}
								oninput={() => dispatch('save')}
								rows="8"
								placeholder="Schrijf je tekst hier..."
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

								{#if block.content.image.url}
									<div class="control-group">
										<div
											style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;"
										>
											<h5 style="margin: 0; font-size: 0.875rem; font-weight: 600; color: #374151;">
												Focuspunt Instellen
											</h5>
											<span style="font-size: 0.75rem; color: #6b7280; font-family: monospace;">
												X: {block.content.image.focusX ?? 50}% Y: {block.content.image.focusY ?? 50}%
											</span>
										</div>
										<div
											role="button"
											tabindex="0"
											class="focus-interactive-wrapper"
											onclick={(e) => handleTextFrameImageFocusClick(e, block.content.image)}
											onkeydown={(e) => {
												if (e.key === 'Enter' || e.key === ' ') e.preventDefault();
											}}
											style="position: relative; cursor: crosshair; display: block; width: 100%; border-radius: 6px; overflow: hidden;"
										>
											<img
												src={block.content.image.url}
												alt="Focus preview"
												style="width: 100%; height: auto; display: block; object-fit: contain;"
											/>
											<div
												class="focus-dot"
												style:left="{block.content.image.focusX ?? 50}%"
												style:top="{block.content.image.focusY ?? 50}%"
											></div>
										</div>
										<p
											class="control-hint"
											style="font-size: 0.75rem; color: #6b7280; margin-top: 0.5rem; text-align: center;"
										>
											Klik op het belangrijkste deel van de foto
										</p>
									</div>

									<div class="control-group">
										<div class="control-label">Beeldverhouding:</div>
										<div class="aspect-controls" role="toolbar" aria-label="Beeldverhouding selectie">
											<IconButton
												icon="icon-aspect-original"
												label="Origineel (volledig)"
												active={(block.content.image.aspectRatio ?? 'original') === 'original'}
												onclick={() => {
													if (block.content.image) {
														block.content.image.aspectRatio = 'original';
														dispatch('save');
													}
												}}
											/>
											<IconButton
												icon="icon-aspect-4-3"
												label="4:3 (landschap)"
												active={block.content.image.aspectRatio === '4:3'}
												onclick={() => {
													if (block.content.image) {
														block.content.image.aspectRatio = '4:3';
														dispatch('save');
													}
												}}
											/>
											<IconButton
												icon="icon-aspect-16-9"
												label="16:9 (breed landschap)"
												active={block.content.image.aspectRatio === '16:9'}
												onclick={() => {
													if (block.content.image) {
														block.content.image.aspectRatio = '16:9';
														dispatch('save');
													}
												}}
											/>
											<IconButton
												icon="icon-aspect-4-5"
												label="4:5 (portret)"
												active={block.content.image.aspectRatio === '4:5'}
												onclick={() => {
													if (block.content.image) {
														block.content.image.aspectRatio = '4:5';
														dispatch('save');
													}
												}}
											/>
											<IconButton
												icon="icon-aspect-1-1"
												label="1:1 (vierkant)"
												active={block.content.image.aspectRatio === '1:1'}
												onclick={() => {
													if (block.content.image) {
														block.content.image.aspectRatio = '1:1';
														dispatch('save');
													}
												}}
											/>
										</div>
									</div>
								{/if}

								<div class="control-group">
									<label class="control-label" id="width-layout-label" for="width-layout-row">
										Breedte + Layout
									</label>
									<div
										class="width-layout-row"
										id="width-layout-row"
										aria-labelledby="width-layout-label"
									>
										<div class="width-controls">
											<IconButton
												icon="icon-width-narrow"
												label="Normale breedte (700px)"
												active={block.content.width === 'normal'}
												onclick={() => {
													block.content.width = 'normal';
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
											<span class="label-hint disabled-hint">
												(niet zichtbaar bij ronde inline afbeelding)
											</span>
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
											<span class="label-hint disabled-hint">
												(niet zichtbaar bij ronde inline afbeelding)
											</span>
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

						<div style="margin-bottom: 1.5rem;">
							<label
								for="timeline-title-{block.id}"
								style="display: block; font-weight: 600; font-size: 0.875rem; margin-bottom: 0.5rem; color: #374151;"
							>
								Titel van de tijdlijn
							</label>
							<input
								id="timeline-title-{block.id}"
								type="text"
								placeholder="Tijdlijn"
								bind:value={block.content.title}
								oninput={() => dispatch('save')}
								class="slide-input"
							/>
							<span
								style="display: block; font-size: 0.75rem; color: #9ca3af; margin-top: 0.25rem;"
							>
								Deze titel wordt getoond boven de tijdlijn
							</span>
						</div>

						<div style="margin-bottom: 1.5rem;">
							<label class="checkbox-label">
								<input
									type="checkbox"
									bind:checked={block.content.useHorizontalLayout}
									onchange={() => dispatch('save')}
								/>
								<span>Gebruik horizontale layout op desktop</span>
							</label>
							<p class="control-hint" style="margin-top: 0.5rem; font-size: 0.75rem; color: #6b7280;">
								💡 Handig voor tijdlijnen met veel items. Op mobiel wordt altijd de horizontale
								carousel getoond.
							</p>
						</div>

						<!-- TIMELINE ITEMS -->
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
														placeholder="Kopje (optioneel)"
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
														<div style="margin-top: 1rem;">
															<div
																style="display: block; font-size: 0.875rem; font-weight: 500; margin-bottom: 0.5rem; color: #374151;"
															>
																Focus punt
															</div>
															<div
																role="button"
																tabindex="0"
																onclick={(e) => {
																	const rect = e.currentTarget.getBoundingClientRect();
																	const x = ((e.clientX - rect.left) / rect.width) * 100;
																	const y = ((e.clientY - rect.top) / rect.height) * 100;
																	item.focusX = Math.round(x);
																	item.focusY = Math.round(y);
																	dispatch('save');
																}}
																onkeydown={(e) => {
																	if (e.key === 'Enter' || e.key === ' ') {
																		e.preventDefault();
																		e.currentTarget.click();
																	}
																}}
																style="position: relative; cursor: crosshair; display: block; width: 100%; border-radius: 6px; overflow: hidden;"
															>
																<img
																	src={item.imageSrc}
																	alt="Focus preview"
																	style="width: 100%; height: auto; display: block; object-fit: contain;"
																/>
																<div
																	class="focus-dot"
																	style:left="{item.focusX || 50}%"
																	style:top="{item.focusY || 50}%"
																></div>
															</div>
															<p
																class="control-hint"
																style="font-size: 0.75rem; color: #6b7280; margin-top: 0.5rem; text-align: center;"
															>
																Klik op het belangrijkste deel van de foto
															</p>
														</div>
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
						<div class="mediapaar-controls-row">
							<div class="control-group">
								<div class="control-label">Breedte:</div>
								<div class="width-controls" role="toolbar" aria-label="Breedte selectie">
									<IconButton
										icon="icon-width-narrow"
										label="Normaal"
										active={block.content.width === 'normal'}
										onclick={() => {
											block.content.width = 'normal';
											dispatch('save');
										}}
									/>
									<IconButton
										icon="icon-width-wide"
										label="Breed"
										active={block.content.width === 'wide'}
										onclick={() => {
											block.content.width = 'wide';
											dispatch('save');
										}}
									/>
								</div>
							</div>

							<div class="control-group">
								<div class="control-label">Layout:</div>
								<div class="layout-buttons-grid">
									<!-- 2-item layouts -->
									<IconButton
										icon="icon-mediapair-top"
										label="Top"
										active={block.content.verticalAlign === 'top'}
										onclick={() => {
											block.content.verticalAlign = 'top';
											adjustMediaPairItems(block);
										}}
									/>
									<IconButton
										icon="icon-mediapair-center"
										label="Center"
										active={block.content.verticalAlign === 'center'}
										onclick={() => {
											block.content.verticalAlign = 'center';
											adjustMediaPairItems(block);
										}}
									/>
									<IconButton
										icon="icon-mediapair-bottom"
										label="Bottom"
										active={block.content.verticalAlign === 'bottom'}
										onclick={() => {
											block.content.verticalAlign = 'bottom';
											adjustMediaPairItems(block);
										}}
									/>
									<IconButton
										icon="icon-mediapair-bottom-alt"
										label="Bottom Alt"
										active={block.content.verticalAlign === 'bottom-alt'}
										onclick={() => {
											block.content.verticalAlign = 'bottom-alt';
											adjustMediaPairItems(block);
										}}
									/>

									<!-- 3-item layouts -->
									<IconButton
										icon="icon-mediapair-3col-left"
										label="3 Col Left"
										active={block.content.verticalAlign === '3col-left'}
										onclick={() => {
											block.content.verticalAlign = '3col-left';
											adjustMediaPairItems(block);
										}}
									/>
									<IconButton
										icon="icon-mediapair-3col-right"
										label="3 Col Right"
										active={block.content.verticalAlign === '3col-right'}
										onclick={() => {
											block.content.verticalAlign = '3col-right';
											adjustMediaPairItems(block);
										}}
									/>
								</div>
							</div>
						</div>

						<div class="mediapaar-items">
							{#each block.content.items as item, idx (idx)}
								<div class="mediapaar-item" data-item-index={idx}>
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

									<label style="display: block; margin-top: 0.75rem;">
										<span
											style="display: block; font-size: 0.875rem; font-weight: 500; margin-bottom: 0.25rem; color: #374151;"
										>
											Oriëntatie:
										</span>
										<select
											class="type-select"
											bind:value={item.orientation}
											onchange={() => dispatch('save')}
										>
											<option value="landscape">Liggend (landscape)</option>
											<option value="portrait">Staand (portrait)</option>
										</select>
									</label>

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

									{#if item.url && item.type === 'image'}
										<div style="margin-top: 1rem;">
											<div
												style="display: block; font-size: 0.875rem; font-weight: 500; margin-bottom: 0.5rem; color: #374151;"
											>
												Focuspunt
											</div>
											<div
												role="button"
												tabindex="0"
												onclick={(e) => {
													const rect = e.currentTarget.getBoundingClientRect();
													const x = ((e.clientX - rect.left) / rect.width) * 100;
													const y = ((e.clientY - rect.top) / rect.height) * 100;
													item.focusX = Math.round(x);
													item.focusY = Math.round(y);
													dispatch('save');
												}}
												onkeydown={(e) => {
													if (e.key === 'Enter' || e.key === ' ') {
														e.preventDefault();
														e.currentTarget.click();
													}
												}}
												style="position: relative; cursor: crosshair; display: block; width: 100%; border-radius: 6px; overflow: hidden;"
											>
												<img
													src={item.url}
													alt="Focus preview"
													style="width: 100%; height: auto; display: block; object-fit: contain;"
												/>
												<div
													class="focus-dot"
													style:left="{item.focusX || 50}%"
													style:top="{item.focusY || 50}%"
												></div>
											</div>
											<p
												class="control-hint"
												style="font-size: 0.75rem; color: #6b7280; margin-top: 0.5rem; text-align: center;"
											>
												Klik op het belangrijkste deel • X: {item.focusX || 50}% Y: {item.focusY ||
													50}%
											</p>
										</div>
									{:else if item.url && item.type === 'video'}
										<div class="media-preview-container">
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
										</div>
									{/if}
								</div>
							{/each}
						</div>

						<!-- Gezamenlijk bijschrift voor hele MediaPair -->
						<div
							style="margin-top: 1.5rem; padding: 1rem; background: #f9fafb; border-radius: 6px; border: 1px solid #e5e7eb;"
						>
							<h5 style="margin-top: 0; margin-bottom: 0.75rem; color: #111827;">
								Gezamenlijk bijschrift
							</h5>
							<textarea
								placeholder="Bijschrift voor alle items"
								bind:value={block.content.caption}
								oninput={() => dispatch('save')}
								class="slide-textarea"
								rows="2"
								style="margin-bottom: 0.5rem;"
							></textarea>
							<input
								type="text"
								placeholder="Bron (fotograaf/agency)"
								bind:value={block.content.source}
								oninput={() => dispatch('save')}
								class="slide-input"
							/>
						</div>
					</div>
				{:else if block.type === 'audio'}
					<div class="audio-editor">
						<!-- Width selector -->
						<div class="control-group">
							<div class="control-label">Breedte:</div>
							<div class="width-controls" role="toolbar" aria-label="Breedte selectie">
								<IconButton
									icon="icon-width-narrow"
									label="Normaal"
									active={block.content.width === 'normal'}
									onclick={() => {
										block.content.width = 'normal';
										dispatch('save');
									}}
								/>
								<IconButton
									icon="icon-width-wide"
									label="Breed"
									active={block.content.width === 'wide'}
									onclick={() => {
										block.content.width = 'wide';
										dispatch('save');
									}}
								/>
							</div>
						</div>

						<!-- Layout selector -->
						<div class="control-group">
							<label class="control-label" for="audio-layout-{block.id}"> Afbeelding layout </label>
							<select
								id="audio-layout-{block.id}"
								bind:value={block.content.imageLayout}
								onchange={() => dispatch('save')}
								class="type-select"
							>
								<option value="none">Geen afbeelding</option>
								<option value="stamp">Postzegel (rond, 80x80px)</option>
								<option value="portrait">Staand (rechthoek, vult hoogte)</option>
							</select>
						</div>

						{#if block.content.imageLayout !== 'none'}
							<div class="control-group">
								<label class="control-label" for="audio-image-{block.id}"> Afbeelding URL </label>
								<input
									id="audio-image-{block.id}"
									type="url"
									placeholder="https://..."
									bind:value={block.content.image}
									oninput={() => dispatch('save')}
									class="slide-input"
								/>
							</div>

							{#if block.content.image}
								<div class="audio-live-preview">
									<p class="preview-label">Live preview:</p>

									<!-- Render actual Audio component -->
									<div
										class="audio-widget-container preview-mode"
										class:layout-none={block.content.imageLayout === 'none'}
										class:layout-stamp={block.content.imageLayout === 'stamp'}
										class:layout-portrait={block.content.imageLayout === 'portrait'}
									>
										<div
											class="audio-widget-image"
											style="
          background-image: url({block.content.image});
          background-position: {block.content.imageFocusX || 50}% {block.content.imageFocusY ||
												50}%;
          background-size: {block.content.imageScale || 100}%;
          background-repeat: no-repeat;
        "
											role="img"
											aria-label="Preview"
										></div>

										<div class="audio-widget-content">
											<div class="audio-widget-info">
												<h3>{block.content.title || 'Titel'}</h3>
												<p>{block.content.description || 'Beschrijving'}</p>
											</div>
											<div class="audio-widget-controls">
												<button class="audio-widget-play-btn" disabled aria-label="Play audio">
													<svg
														viewBox="0 0 24 24"
														fill="none"
														stroke="currentColor"
														stroke-width="2"
													>
														<polygon points="5 3 19 12 5 21 5 3"></polygon>
													</svg>
												</button>
												<div class="audio-widget-progress-wrapper">
													<div class="audio-widget-progress-bar">
														<div class="audio-widget-progress-fill" style="width: 0%"></div>
													</div>
													<span class="audio-widget-time">0:00 / 0:00</span>
												</div>
											</div>
										</div>
									</div>
								</div>

								<!-- Focus controls -->
								<div class="image-focus-controls">
									<div class="control-group">
										<label for="audio-scale-{block.id}">
											Zoom: <span class="value-display">{block.content.imageScale || 100}%</span>
										</label>
										<input
											id="audio-scale-{block.id}"
											type="range"
											class="range-input"
											min="10"
											max="300"
											bind:value={block.content.imageScale}
											oninput={() => dispatch('save')}
										/>
									</div>

									<div class="control-group">
										<label for="audio-focus-x-{block.id}">
											Focus X: <span class="value-display">{block.content.imageFocusX || 50}%</span>
										</label>
										<input
											id="audio-focus-x-{block.id}"
											type="range"
											class="range-input"
											min="0"
											max="100"
											bind:value={block.content.imageFocusX}
											oninput={() => dispatch('save')}
										/>
									</div>

									<div class="control-group">
										<label for="audio-focus-y-{block.id}">
											Focus Y: <span class="value-display">{block.content.imageFocusY || 50}%</span>
										</label>
										<input
											id="audio-focus-y-{block.id}"
											type="range"
											class="range-input"
											min="0"
											max="100"
											bind:value={block.content.imageFocusY}
											oninput={() => dispatch('save')}
										/>
									</div>
								</div>
							{/if}
						{/if}
					</div>

					<!-- Audio file -->
					<div class="control-group">
						<label class="control-label" for="audio-file-{block.id}"> Audio URL (.mp3) </label>
						<input
							id="audio-file-{block.id}"
							type="url"
							placeholder="https://..."
							bind:value={block.content.url}
							oninput={() => dispatch('save')}
							class="slide-input"
						/>
					</div>

					{#if block.content.url}
						<audio controls src={block.content.url} class="audio-player"></audio>
					{/if}

					<!-- Title -->
					<div class="control-group">
						<label class="control-label" for="audio-title-{block.id}"> Titel </label>
						<input
							id="audio-title-{block.id}"
							type="text"
							placeholder="Naam van de audio"
							bind:value={block.content.title}
							oninput={() => dispatch('save')}
							class="slide-input"
						/>
					</div>

					<!-- Description -->
					<div class="control-group">
						<label class="control-label" for="audio-desc-{block.id}"> Beschrijving </label>
						<textarea
							id="audio-desc-{block.id}"
							placeholder="Korte beschrijving..."
							bind:value={block.content.description}
							oninput={() => dispatch('save')}
							class="block-textarea"
							rows="2"
						></textarea>
					</div>
				{:else if block.type === 'colofon'}
					<div class="colofon-editor">
						<h4>Colofon</h4>

						<!-- ✅ NEW: Logo controls -->
						<div class="control-group">
							<label class="checkbox-label">
								<input
									type="checkbox"
									bind:checked={block.content.showLogo}
									onchange={() => dispatch('save')}
								/>
								<span>Toon logo onder colofon</span>
							</label>
						</div>

						{#if block.content.showLogo}
							<div class="control-group logo-options">
								<label class="control-label" for="logo-variant">Logo weergave</label>
								<div class="radio-group" id="logo-variant">
									<label class="radio-label">
										<input
											type="radio"
											bind:group={block.content.logoVariant}
											value="color"
											onchange={() => dispatch('save')}
										/>
										<span>Kleur</span>
									</label>
									<label class="radio-label">
										<input
											type="radio"
											bind:group={block.content.logoVariant}
											value="dia"
											onchange={() => dispatch('save')}
										/>
										<span>Diapositief (wit)</span>
									</label>
								</div>
							</div>
						{/if}

						<!-- Layout controls -->
						<div class="control-group">
							<div class="control-label">Layout:</div>
							<div class="width-controls" role="toolbar" aria-label="Layout selectie">
								<IconButton
									icon="icon-colofon-inline"
									label="Onder elkaar"
									active={block.content.layout === 'inline'}
									onclick={() => {
										block.content.layout = 'inline';
										dispatch('save');
									}}
								/>
								<IconButton
									icon="icon-colofon-columns"
									label="Naast elkaar"
									active={block.content.layout === 'columns'}
									onclick={() => {
										block.content.layout = 'columns';
										dispatch('save');
									}}
								/>
							</div>
						</div>

						<!-- Existing colofon items -->
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

	{#if blocks.length === 0}
		<div class="empty-canvas">
			<p>Sleep hier je blokken om te beginnen...</p>
		</div>
	{/if}
</div>

<MediaPairIcons />

<style>
	.canvas-wrapper {
		max-width: 800px;
		margin: 0 auto;
		min-height: 400px;
		background: white;
		border-radius: 8px;
		padding: 2rem;
		position: relative;
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

	/* ✅ FIXED: No padding, overflow hidden */
	.canvas-block {
		background: #f9fafb;
		border: 1px solid #e5e7eb;
		border-radius: 8px;
		margin-bottom: 15px;
		position: relative;
		transition: box-shadow 0.2s;
		overflow: hidden;
	}

	.canvas-block:hover {
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
	}

	/* ===== COLLAPSIBLE HEADER ===== */
	.block-header {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.75rem 1rem;
		background-color: #f3f4f6; /* ✅ Slightly darker than block */
		border-bottom: 1px solid #e5e7eb;
		cursor: default;
		min-height: 48px; /* Consistent height */
	}

	.drag-handle {
		cursor: grab;
		color: #9ca3af;
		font-size: 1.2rem;
		user-select: none;
		padding: 0 0.25rem;
		flex-shrink: 0;
		line-height: 1;
		display: flex;
		align-items: center;
	}

	.drag-handle:active {
		cursor: grabbing;
	}

	.collapse-toggle {
		background: none;
		border: none;
		padding: 0.25rem;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		color: #6b7280;
		transition: color 0.2s;
		flex-shrink: 0;
		height: 28px; /* Match icon + padding */
		width: 28px;
	}

	.collapse-toggle:hover {
		color: #111827;
	}

	.collapse-icon {
		width: 20px;
		height: 20px;
		transition: transform 0.2s ease;
	}

	.collapse-icon.collapsed {
		transform: rotate(-90deg);
	}

	.block-label-container {
		flex: 1;
		display: flex;
		align-items: center; /* Center vertically */
		gap: 0.5rem;
		min-width: 0; /* Allow flex children to shrink */
		overflow: hidden;
	}

	.block-label {
		font-weight: 600;
		font-size: 0.875rem;
		color: #d10a10;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		white-space: nowrap;
		flex-shrink: 0; /* Don't shrink the label */
		line-height: 1;
	}

	.block-preview {
		font-size: 0.875rem; /* Same as label for alignment */
		color: #000000;
		font-weight: 400;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		font-style: italic;
		flex: 1; /* Take remaining space */
		min-width: 0; /* Allow text-overflow to work */
		line-height: 1;
		transform: translateY(-3.75px); /* Optical adjustment for uppercase vs normal text */
	}

	/* ✅ FIXED: Remove button (in header, no absolute positioning) */
	.remove-btn {
		background: none;
		border: none;
		font-size: 1.5rem;
		color: #ef4444;
		cursor: pointer;
		padding: 0.25rem 0.5rem;
		line-height: 1;
		transition: color 0.2s;
		flex-shrink: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		height: 32px;
	}

	.remove-btn:hover {
		color: #dc2626; /* ✅ FIXED: Was green, now red */
	}

	/* ✅ Collapsible content */
	.canvas-block .content {
		padding: 1rem;
		max-height: 5000px;
		overflow: hidden;
		transition:
			max-height 0.3s ease,
			padding 0.3s ease;
	}

	.canvas-block .content.collapsed {
		max-height: 0 !important;
		padding: 0 1rem !important;
		overflow: hidden !important;
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
	.input-col-left {
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

	.hero-video-editor input,
	.image-hero-editor input,
	.video-editor input {
		padding: 0.5rem;
		border: 1px solid #e5e7eb;
		border-radius: 6px;
		font-size: 0.875rem;
	}

	/* Focus Controls */
	/* Voeg dit toe aan je <style> blok in SortableCanvas.svelte */

	.focus-dot {
		position: absolute;
		width: 20px;
		height: 20px;
		background-color: #ff0000;
		border: 3px solid white;
		border-radius: 50%;
		pointer-events: none;
		z-index: 10;
		/* De transform zorgt voor centrering op de coördinaten */
		transform: translate(-50%, -50%);
		/* De animatie: rustig pulseren (2 seconden loop) */
		animation: focus-pulse 2s infinite ease-in-out;
	}

	@keyframes focus-pulse {
		0% {
			transform: translate(-50%, -50%) scale(1);
			box-shadow: 0 0 0 0 rgba(255, 0, 0, 0.7);
		}
		70% {
			transform: translate(-50%, -50%) scale(1.1);
			box-shadow: 0 0 0 10px rgba(255, 0, 0, 0);
		}
		100% {
			transform: translate(-50%, -50%) scale(1);
			box-shadow: 0 0 0 0 rgba(255, 0, 0, 0);
		}
	}
	.focus-controls {
		margin-top: 1.5rem;
		padding: 1rem;
		background: #f9fafb;
		border: 1px solid #e5e7eb;
		border-radius: 8px;
	}

	.focus-controls h5 {
		margin: 0 0 0.5rem 0;
		font-size: 0.875rem;
		font-weight: 600;
		color: #374151;
	}

	.value-display {
		float: right;
		color: #d10a10;
		font-weight: 600;
	}

	.control-hint {
		font-size: 0.75rem;
		color: #6b7280;
		margin: 0 0 1rem 0;
		line-height: 1.4;
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
		overflow-x: auto;
		-webkit-overflow-scrolling: touch;
	}

	.splide {
		overflow: visible;
	}

	.splide__track {
		overflow: visible;
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

	/* make the scrollbar visually obvious */
	.splide-container::-webkit-scrollbar {
		height: 10px;
	}

	.splide-container::-webkit-scrollbar-thumb {
		background: #d1d5db;
		border-radius: 6px;
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

	.slide-preview.is-portrait {
		width: auto;
		height: 200px;
		object-fit: contain;
		background: var(--color-background-light, #fff);
		display: block;
		margin-left: auto;
		margin-right: auto;
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
		gap: 5rem;
		margin-bottom: 1rem;
		align-items: start;
	}

	.control-group {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		min-width: 0;
	}

	/* Beeldverhouding krijgt meer ruimte voor 5 buttons */
	.gallery-controls .control-group:has(.aspect-controls) {
		flex: 2;
	}

	/* Layout krijgt meer ruimte voor 4 buttons */
	.gallery-controls .control-group:has(.layout-options) {
		flex: 1.4;
	}

	.gallery-controls .control-group:not(:has(.aspect-controls)):not(:has(.layout-options)) {
		flex: 1;
	}

	.layout-options {
		display: flex;
		gap: 6px;
		background: white;
		padding: 4px;
		border-radius: 6px;
		border: 1px solid #e5e7eb;
		width: fit-content;
		flex-shrink: 0;
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

	.layout-options label.disabled {
		opacity: 0.4;
		cursor: not-allowed;
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

	.layout-icon.grid-2x2 {
		grid-template-columns: 1fr 1fr;
		grid-template-rows: 1fr 1fr;
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

	.mediapaar-controls-row {
		display: flex;
		align-items: flex-start;
		gap: 24px;
		flex-wrap: wrap;
	}

	.control-group {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	.control-group .control-label {
		font-size: 0.875rem;
		font-weight: 600;
		color: #374151;
	}

	.width-controls {
		display: flex;
		gap: 8px;
	}

	.layout-buttons-grid {
		display: grid;
		grid-template-columns: repeat(8, 1fr);
		gap: 8px;
	}

	.mediapaar-items {
		display: flex;
		gap: 15px;
		overflow-x: auto;
		overflow-y: visible;
	}

	.mediapaar-item {
		flex: 0 0 320px;
		border: 1px solid #e5e7eb;
		padding: 15px;
		border-radius: 6px;
		background: #f9fafb;
	}

	/* Grayscale gradients for visual identification */
	.mediapaar-item[data-item-index='0'] {
		background: linear-gradient(135deg, #d1d5db 0%, #e5e7eb 100%);
		border-color: #6b7280;
	}

	.mediapaar-item[data-item-index='1'] {
		background: linear-gradient(135deg, #e5e7eb 0%, #f3f4f6 100%);
		border-color: #9ca3af;
	}

	.mediapaar-item[data-item-index='2'] {
		background: linear-gradient(135deg, #f3f4f6 0%, #f9fafb 100%);
		border-color: #d1d5db;
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

	.image-focus-controls {
		padding: 1rem;
		background: #f9fafb;
		border: 1px solid #e5e7eb;
		border-radius: 6px;
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.value-display {
		font-weight: 700;
		color: #d10a10;
		font-family: 'SF Mono', Monaco, monospace;
	}

	.range-input {
		width: 100%;
		height: 6px;
		background: #e5e7eb;
		border-radius: 3px;
		outline: none;
		-webkit-appearance: none;
		appearance: none;
		cursor: pointer;
	}

	.range-input::-webkit-slider-thumb {
		-webkit-appearance: none;
		appearance: none;
		width: 18px;
		height: 18px;
		background: #d10a10;
		border-radius: 50%;
		cursor: pointer;
		transition: all 0.15s;
	}

	.range-input::-webkit-slider-thumb:hover {
		transform: scale(1.2);
		box-shadow: 0 0 0 4px rgba(209, 10, 16, 0.1);
	}

	.range-input::-moz-range-thumb {
		width: 18px;
		height: 18px;
		background: #d10a10;
		border-radius: 50%;
		cursor: pointer;
		border: none;
		transition: all 0.15s;
	}

	.range-input::-moz-range-thumb:hover {
		transform: scale(1.2);
		box-shadow: 0 0 0 4px rgba(209, 10, 16, 0.1);
	}

	.audio-player {
		width: 100%;
		margin-top: 0.5rem;
	}

	.audio-live-preview {
		margin: 1rem 0;
		padding: 1rem;
		background: #f0f9ff;
		border-radius: 8px;
	}

	.preview-label {
		margin: 0 0 0.75rem 0;
		font-size: 0.75rem;
		font-weight: 600;
		color: #1e40af;
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	/* Preview mode styling (matches Audio.svelte) */
	.audio-widget-container.preview-mode {
		font-family: var(--font-family-base, system-ui);
		background-color: #f8f9fa;
		border-radius: 8px;
		padding: 1rem;
		display: flex;
		gap: 1rem;
		width: 100%;
		align-items: center;
		box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
		pointer-events: none; /* Preview only */
	}

	.preview-mode.layout-none {
		flex-direction: column;
		align-items: stretch;
		gap: 12px;
	}

	.preview-mode.layout-portrait {
		align-items: stretch;
	}

	.preview-mode .audio-widget-image {
		flex-shrink: 0;
		border-radius: 6px;
		background-repeat: no-repeat;
		border: 2px dashed #9a9b9e;
	}

	.preview-mode.layout-stamp .audio-widget-image {
		width: 80px;
		height: 80px;
		border-radius: 50%;
	}

	.preview-mode.layout-portrait .audio-widget-image {
		width: 120px;
		height: 150px; /* Fixed height voor preview */
		border-radius: 6px;
	}

	.preview-mode .audio-widget-content {
		width: 100%;
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	.preview-mode .audio-widget-info h3 {
		margin: 0;
		font-size: 1.1rem;
		font-weight: 600;
		color: #111827;
	}

	.preview-mode .audio-widget-info p {
		margin: 4px 0 0;
		font-size: 0.9rem;
		color: #4b5563;
	}

	.preview-mode .audio-widget-controls {
		display: flex;
		align-items: center;
		gap: 12px;
	}

	.preview-mode .audio-widget-play-btn {
		background-color: transparent;
		border: 2px solid #d1d5db;
		border-radius: 50%;
		width: 40px;
		height: 40px;
		display: flex;
		justify-content: center;
		align-items: center;
		opacity: 0.5;
	}

	.preview-mode .audio-widget-play-btn svg {
		width: 20px;
		height: 20px;
		fill: #111827;
	}

	.preview-mode .audio-widget-progress-wrapper {
		width: 100%;
		display: flex;
		align-items: center;
		gap: 8px;
	}

	.preview-mode .audio-widget-progress-bar {
		background-color: #e5e7eb;
		height: 6px;
		border-radius: 3px;
		width: 100%;
	}

	.preview-mode .audio-widget-progress-fill {
		background-color: #d10a10;
		height: 100%;
		border-radius: 3px;
	}

	.preview-mode .audio-widget-time {
		font-size: 0.8rem;
		color: #6b7280;
		white-space: nowrap;
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
	.logo-options {
		margin-left: 1.75rem;
		padding: 0.75rem;
		background: #f9fafb;
		border-left: 3px solid #d10a10;
		border-radius: 4px;
	}

	.control-label {
		font-size: 0.875rem;
		font-weight: 600;
		color: #374151;
		margin-bottom: 0.5rem;
		display: block;
	}

	.radio-group {
		display: flex;
		gap: 1rem;
	}

	.radio-label {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		cursor: pointer;
		font-size: 0.875rem;
		color: #374151;
	}

	.radio-label input[type='radio'] {
		width: 18px;
		height: 18px;
		cursor: pointer;
		accent-color: #d10a10;
	}

	.radio-label:hover {
		color: #111827;
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
		font-size: 0.875rem;
		color: #374151;
		display: block;
		margin-bottom: 0.5rem;
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

	.aspect-controls {
		display: flex;
		gap: 0.5rem;
		flex-wrap: nowrap;
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

	.image-controls-row {
		display: grid;
		grid-template-columns: auto 1fr;
		gap: 5rem;
		align-items: start;
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
   COLLAPSIBLE TEXTFRAME CONTROLS
   ============================================ */

	.sub-control {
		margin-left: 1.75rem;
		margin-top: 0.75rem;
		padding: 0.75rem;
		background: #f9fafb;
		border-left: 3px solid #d10a10;
		border-radius: 4px;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.checkbox-label-sub {
		font-size: 0.8125rem;
		color: #6b7280;
	}

	.control-hint {
		margin: 0;
		font-size: 0.75rem;
		color: #6b7280;
		line-height: 1.4;
		font-style: italic;
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

	.lead-toggle {
		background-color: #f0fdf4; /* Lichtgroen achtergrondje om op te vallen */
		padding: 0.5rem;
		border-radius: 4px;
		border: 1px solid #bbf7d0;
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
</style>
