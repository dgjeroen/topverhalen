<script lang="ts">
	import { onMount } from 'svelte';
	import type { PageData } from './$types';

	let { data } = $props<{ data: PageData }>();

	let canvasBlocks = $state<any[]>(data.project.data || []);
	let toolboxEl: HTMLElement;
	let canvasEl: HTMLElement;
	let canvasSortable: any;
	let splideInstances = new Map<string, any>();

	function createEditableBlock(type: string) {
		const blockId = `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
		return { id: blockId, type, content: getDefaultContent(type) };
	}

	function getDefaultContent(type: string) {
		switch (type) {
			case 'heroVideo':
				return { url: '', poster: '', label: '', title: '', source: '', textAlign: 'center' };
			case 'heading':
				return { text: '', level: 2 };
			case 'subheading':
				return { text: '', level: 4 };
			case 'textblock':
				return { text: [''], isLead: false };
			case 'quote':
				return { text: '', author: '' };
			case 'image':
				return { url: '', caption: '', source: '', parallax: false };
			case 'video':
				return { url: '', poster: '' };
			case 'slider':
				return { images: [{ url: '', caption: '', source: '' }] };
			case 'gallery':
				return { columns: 2, images: [] };
			case 'timeline':
				return { timelines: [] };
			case 'mediaPaar':
				return {
					verticalAlign: 'top',
					items: [
						{ type: 'image', orientation: 'portrait', url: '', caption: '', source: '' },
						{ type: 'video', orientation: 'landscape', url: '', poster: '', caption: '' }
					]
				};
			case 'audio':
				return { url: '', title: '', description: '', image: '' };
			case 'colofon':
				return { items: [{ functie: '', namen: '' }] };
			default:
				return {};
		}
	}

	function removeBlock(blockId: string) {
		if (splideInstances.has(blockId)) {
			splideInstances.get(blockId).destroy();
			splideInstances.delete(blockId);
		}
		canvasBlocks = canvasBlocks.filter((b) => b.id !== blockId);
	}

	function initHlsPlayer(block: any) {
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
				drag: 'free',
				autoWidth: true,
				focus: 'center'
			});

			splide.mount();
			splideInstances.set(blockId, splide);

			const slidesList = splideEl.querySelector('.splide__list');
			if (slidesList) {
				const SortableLib = (await import('sortablejs')).default;
				new SortableLib(slidesList as HTMLElement, {
					animation: 150,
					onEnd: () => {
						splide.refresh();
						updateSlideNumbers(blockId);
					}
				});
			}

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

	function addSlide(block: any) {
		if (block.type === 'slider') {
			block.content.images.push({ url: '', caption: '', source: '' });
			canvasBlocks = [...canvasBlocks];
			setTimeout(() => {
				initSplideForBlock(block.id, block.type);
				const splide = splideInstances.get(block.id);
				if (splide) splide.go(block.content.images.length - 1);
			}, 150);
		} else if (block.type === 'gallery') {
			block.content.images.push({ url: '', caption: '', source: '' });
			canvasBlocks = [...canvasBlocks];
			setTimeout(() => {
				initSplideForBlock(block.id, block.type);
				const splide = splideInstances.get(block.id);
				if (splide) splide.go(block.content.images.length - 1);
			}, 150);
		} else if (block.type === 'timeline') {
			block.content.timelines.push({
				year: '',
				title: '',
				description: '',
				imageSrc: '',
				imageAlt: ''
			});
			canvasBlocks = [...canvasBlocks];
			setTimeout(() => {
				initSplideForBlock(block.id, block.type);
				const splide = splideInstances.get(block.id);
				if (splide) splide.go(block.content.timelines.length - 1);
			}, 150);
		}
	}

	function removeSlide(block: any, index: number) {
		if (block.type === 'slider') {
			block.content.images.splice(index, 1);
		} else if (block.type === 'gallery') {
			block.content.images.splice(index, 1);
		} else if (block.type === 'timeline') {
			block.content.timelines.splice(index, 1);
		}
		canvasBlocks = [...canvasBlocks];
		setTimeout(() => initSplideForBlock(block.id, block.type), 100);
	}

	function moveSlide(block: any, index: number, direction: 'prev' | 'next') {
		let items: any[];
		if (block.type === 'slider') items = block.content.images;
		else if (block.type === 'gallery') items = block.content.images;
		else if (block.type === 'timeline') items = block.content.timelines;
		else return;

		const newIndex = direction === 'prev' ? index - 1 : index + 1;
		if (newIndex < 0 || newIndex >= items.length) return;

		[items[index], items[newIndex]] = [items[newIndex], items[index]];
		canvasBlocks = [...canvasBlocks];

		setTimeout(() => {
			initSplideForBlock(block.id, block.type);
			const splide = splideInstances.get(block.id);
			if (splide) splide.go(newIndex);
		}, 100);
	}

	function getGalleryLayoutInfo(block: any) {
		const layoutMap: Record<number, string> = {
			2: '2 Kolommen',
			3: '3 Kolommen',
			4: '4 Kolommen'
		};
		const count = block.content.images.length;
		const cols = block.content.columns;
		return `${layoutMap[cols] || `${cols} kolommen`} • ${count} foto's`;
	}

	function isGalleryAddDisabled(block: any): boolean {
		const cols = block.content.columns;
		const count = block.content.images.length;

		if ([2, 3, 4].includes(cols)) return count >= cols;
		if (cols === 2 && count >= 4) return true;
		if (cols === 3 && count >= 6) return true;

		return false;
	}

	function swapMediaPaarItems(block: any) {
		const items = block.content.items;
		block.content.items = [items[1], items[0]];
		canvasBlocks = [...canvasBlocks];
	}

	function toggleMediaPaarType(block: any, itemIndex: number) {
		const item = block.content.items[itemIndex];
		if (item.type === 'image') {
			item.type = 'video';
			item.orientation = 'landscape';
			item.poster = '';
			delete item.source;
		} else {
			item.type = 'image';
			item.orientation = 'portrait';
			item.source = '';
			delete item.poster;
		}
		canvasBlocks = [...canvasBlocks];
	}

	function addColofonItem(block: any) {
		block.content.items.push({ functie: '', namen: '' });
		canvasBlocks = [...canvasBlocks];
	}

	function removeColofonItem(block: any, index: number) {
		block.content.items.splice(index, 1);
		canvasBlocks = [...canvasBlocks];
	}

	$effect(() => {
		if (typeof window !== 'undefined') {
			canvasBlocks.forEach((block) => {
				if ((block.type === 'heroVideo' || block.type === 'video') && block.content.url) {
					setTimeout(() => initHlsPlayer(block), 50);
				}

				if (['slider', 'gallery', 'timeline'].includes(block.type)) {
					setTimeout(() => initSplideForBlock(block.id, block.type), 100);
				}
			});
		}
	});

	let saving = $state(false);
	let saveMessage = $state('');

	async function saveProject() {
		saving = true;
		saveMessage = '';

		try {
			const response = await fetch(`/cms/api/projects/${data.gistId}`, {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					version: data.project.version + 1,
					storyName: data.project.storyName,
					gistId: data.gistId,
					theme: data.project.theme || {},
					data: canvasBlocks
				})
			});

			if (!response.ok) throw new Error('Opslaan mislukt');

			data.project.version++;
			saveMessage = '✅ Opgeslagen!';
			setTimeout(() => {
				saveMessage = '';
			}, 3000);
		} catch (err) {
			saveMessage = '❌ Fout bij opslaan';
			console.error('Save error:', err);
		} finally {
			saving = false;
		}
	}

	onMount(async () => {
		const Sortable = (await import('sortablejs')).default;

		if (toolboxEl) {
			new Sortable(toolboxEl, {
				group: { name: 'shared', pull: 'clone', put: false },
				animation: 150,
				sort: false
			});
		}

		if (canvasEl) {
			canvasSortable = new Sortable(canvasEl, {
				group: { name: 'shared', pull: true, put: true },
				animation: 150,
				handle: '.drag-handle',
				ghostClass: 'sortable-ghost',
				onAdd: (evt) => {
					const blockType = evt.item.dataset.type;
					if (!blockType) {
						evt.item.remove();
						return;
					}
					const newBlock = createEditableBlock(blockType);
					const newIndex = evt.newIndex ?? canvasBlocks.length;
					canvasBlocks = [
						...canvasBlocks.slice(0, newIndex),
						newBlock,
						...canvasBlocks.slice(newIndex)
					];
					evt.item.remove();

					if (blockType === 'heroVideo' || blockType === 'video') {
						setTimeout(() => initHlsPlayer(newBlock), 100);
					}

					if (['slider', 'gallery', 'timeline'].includes(blockType)) {
						setTimeout(() => initSplideForBlock(newBlock.id, blockType), 150);
					}
				},
				onUpdate: () => {
					const newOrder: any[] = [];
					Array.from(canvasEl.children).forEach((el) => {
						const blockId = (el as HTMLElement).dataset.blockId;
						const block = canvasBlocks.find((b) => b.id === blockId);
						if (block) newOrder.push(block);
					});
					canvasBlocks = newOrder;
				}
			});
		}

		canvasBlocks.forEach((block) => {
			if (block.type === 'heroVideo' || block.type === 'video') {
				setTimeout(() => initHlsPlayer(block), 100);
			}
			if (['slider', 'gallery', 'timeline'].includes(block.type)) {
				setTimeout(() => initSplideForBlock(block.id, block.type), 150);
			}
		});
	});
</script>

<svelte:head>
	<title>Editor - {data.project.storyName}</title>
	<link
		rel="stylesheet"
		href="https://cdn.jsdelivr.net/npm/@splidejs/splide@4.1.4/dist/css/splide.min.css"
	/>
	<script src="https://cdn.jsdelivr.net/npm/hls.js@latest"></script>
</svelte:head>

<div class="editor">
	<!-- ===== UNIFIED HEADER ===== -->
	<header class="editor-header">
		<div class="header-left">
			<a href="/cms" class="logo-link">
				<span class="logo-text">Topverhalen CMS</span>
			</a>
			<span class="divider">|</span>
			<span class="project-name">{data.project.storyName}</span>
			<span class="gist-id">({data.gistId.substring(0, 8)}...)</span>
		</div>

		<div class="header-right">
			{#if saveMessage}
				<span
					class="save-message"
					class:success={saveMessage.includes('✅')}
					class:error={saveMessage.includes('❌')}
				>
					{saveMessage}
				</span>
			{/if}
			<button class="btn-header btn-save" onclick={saveProject} disabled={saving}>
				{saving ? '💾 Bezig...' : '💾 Opslaan'}
			</button>
			<button class="btn-header btn-preview" disabled>👁️ Preview</button>
			<button class="btn-header btn-publish" disabled>🚀 Publiceren</button>
			<a href="/cms/logout" class="btn-header btn-logout">Uitloggen</a>
		</div>
	</header>

	<div class="editor-layout">
		<!-- ===== FIXED TOOLBOX ===== -->
		<aside class="toolbox" bind:this={toolboxEl}>
			<div class="toolbox-content">
				<h3>Blokken</h3>

				<div class="block" data-type="heroVideo">
					<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
						></path>
					</svg>
					<span>Hero Video</span>
				</div>

				<hr />

				<div class="block" data-type="heading">
					<svg aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<text x="3" y="19" font-family="sans-serif" font-size="16" fill="currentColor">H2</text>
					</svg>
					<span>Kop</span>
				</div>

				<div class="block" data-type="subheading">
					<svg aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<text x="3" y="19" font-family="sans-serif" font-size="16" fill="currentColor">H4</text>
					</svg>
					<span>Tussenkop</span>
				</div>

				<div class="block" data-type="textblock">
					<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M4 6h16M4 12h16M4 18h16"
						></path>
					</svg>
					<span>Tekstblok</span>
				</div>

				<div class="block" data-type="quote">
					<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
						></path>
					</svg>
					<span>Citaat</span>
				</div>

				<hr />

				<div class="block" data-type="image">
					<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
						></path>
					</svg>
					<span>Afbeelding</span>
				</div>

				<div class="block" data-type="video">
					<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
						></path>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
						></path>
					</svg>
					<span>Video</span>
				</div>

				<div class="block" data-type="slider">
					<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
						></path>
					</svg>
					<span>Fotoslider</span>
				</div>

				<div class="block" data-type="gallery">
					<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M4 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-3zM14 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1h-4a1 1 0 01-1-1v-3z"
						></path>
					</svg>
					<span>Fotogrid</span>
				</div>

				<div class="block" data-type="mediaPaar">
					<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2"
						></path>
					</svg>
					<span>Mediapaar</span>
				</div>

				<hr />

				<div class="block" data-type="timeline">
					<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
						></path>
					</svg>
					<span>Tijdlijn</span>
				</div>

				<div class="block" data-type="audio">
					<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
						></path>
					</svg>
					<span>Audiospeler</span>
				</div>

				<div class="block" data-type="colofon">
					<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
						></path>
					</svg>
					<span>Colofon</span>
				</div>
			</div>
		</aside>

		<!-- ===== SCROLLABLE CANVAS ===== -->
		<main class="canvas">
			<div class="canvas-wrapper" bind:this={canvasEl}>
				{#if canvasBlocks.length === 0}
					<div class="empty-canvas">
						<p>Sleep hier je blokken om te beginnen...</p>
					</div>
				{:else}
					{#each canvasBlocks as block (block.id)}
						<div class="canvas-block" data-type={block.type} data-block-id={block.id}>
							<div class="drag-handle">⋮⋮</div>
							<button class="remove-btn" onclick={() => removeBlock(block.id)}>×</button>
							<div class="content">
								{#if block.type === 'heroVideo'}
									<div class="hero-video-editor">
										<div class="input-row">
											<div class="input-col">
												<label>Video URL (.m3u8)</label>
												<input
													type="url"
													placeholder="https://..."
													bind:value={block.content.url}
												/>
											</div>
											<div class="input-col">
												<label>Poster Afbeelding</label>
												<input
													type="url"
													placeholder="https://..."
													bind:value={block.content.poster}
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
														></video>
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
													<label>Label (optioneel)</label>
													<input
														type="text"
														placeholder="SPECIAL"
														bind:value={block.content.label}
													/>
												</div>
												<div class="input-group">
													<label>Titel</label>
													<input
														type="text"
														placeholder="Hoofdtitel"
														bind:value={block.content.title}
													/>
												</div>
												<div class="input-group">
													<label>Bron (verplicht)</label>
													<input type="text" placeholder="ANP" bind:value={block.content.source} />
												</div>
											</div>

											<div class="input-col-right">
												<label>Tekstpositie</label>
												<div class="hero-align-picker">
													<label class:active={block.content.textAlign === 'top'}>
														<input type="radio" bind:group={block.content.textAlign} value="top" />
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
										class="block-input"
									/>
								{:else if block.type === 'subheading'}
									<input
										type="text"
										placeholder="Tekst tussenkop..."
										bind:value={block.content.text}
										class="block-input block-input-subheading"
									/>
								{:else if block.type === 'textblock'}
									<textarea
										placeholder="Typ hier je tekst..."
										bind:value={block.content.text[0]}
										class="block-textarea"
										rows="4"
									></textarea>
									<label class="lead-toggle">
										<input type="checkbox" bind:checked={block.content.isLead} />
										<span>Dit is een inleiding</span>
									</label>
								{:else if block.type === 'image'}
									<input
										type="url"
										placeholder="Afbeeldings-URL..."
										bind:value={block.content.url}
										class="block-input"
									/>
									{#if block.content.url}
										<img src={block.content.url} alt="" class="block-preview" />
									{/if}
									<textarea
										placeholder="Bijschrift..."
										bind:value={block.content.caption}
										class="block-textarea"
										rows="2"
									></textarea>
									<input
										type="text"
										placeholder="Bron..."
										bind:value={block.content.source}
										class="block-input"
									/>
									<label class="parallax-toggle">
										<input type="checkbox" bind:checked={block.content.parallax} />
										<span>Parallax-effect toepassen</span>
									</label>
								{:else if block.type === 'quote'}
									<textarea
										placeholder="Citaat tekst..."
										bind:value={block.content.text}
										class="block-textarea"
										rows="3"
									></textarea>
									<input
										type="text"
										placeholder="Auteur..."
										bind:value={block.content.author}
										class="block-input"
									/>
								{:else if block.type === 'video'}
									<div class="video-editor">
										<div class="input-row">
											<div class="input-col">
												<label>Video URL (YouTube of .m3u8)</label>
												<input
													type="url"
													placeholder="https://..."
													bind:value={block.content.url}
												/>
											</div>
											<div class="input-col">
												<label>Poster (optioneel)</label>
												<input
													type="url"
													placeholder="https://..."
													bind:value={block.content.poster}
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
														></video>
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
																			onclick={() => moveSlide(block, i, 'prev')}
																		>
																			&lt;
																		</button>
																		<button
																			type="button"
																			class="move-btn"
																			data-direction="next"
																			disabled={i === block.content.images.length - 1}
																			onclick={() => moveSlide(block, i, 'next')}
																		>
																			&gt;
																		</button>
																	</div>
																	<button
																		type="button"
																		class="remove-slide-btn"
																		onclick={() => removeSlide(block, i)}
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
																		class="slide-input"
																	/>
																	<textarea
																		placeholder="Bijschrift (optioneel)"
																		bind:value={slide.caption}
																		class="slide-textarea"
																		rows="2"
																	></textarea>
																	<input
																		type="text"
																		placeholder="Bron (verplicht)"
																		bind:value={slide.source}
																		class="slide-input"
																	/>
																</div>
															</li>
														{/each}
													</ul>
												</div>
											</div>
										</div>
										<button type="button" class="add-slide-btn" onclick={() => addSlide(block)}>
											Voeg slide toe
										</button>
									</div>
								{:else if block.type === 'gallery'}
									<div class="gallery-editor">
										<div class="gallery-controls">
											<div class="layout-picker">
												<label>Layout:</label>
												<div class="layout-options">
													<label class:active={block.content.columns === 2}>
														<input type="radio" bind:group={block.content.columns} value={2} />
														<div class="layout-icon cols-2">
															<div></div>
															<div></div>
														</div>
													</label>
													<label class:active={block.content.columns === 3}>
														<input type="radio" bind:group={block.content.columns} value={3} />
														<div class="layout-icon cols-3">
															<div></div>
															<div></div>
															<div></div>
														</div>
													</label>
													<label class:active={block.content.columns === 4}>
														<input type="radio" bind:group={block.content.columns} value={4} />
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
																			onclick={() => moveSlide(block, i, 'prev')}
																		>
																			&lt;
																		</button>
																		<button
																			type="button"
																			class="move-btn"
																			data-direction="next"
																			disabled={i === block.content.images.length - 1}
																			onclick={() => moveSlide(block, i, 'next')}
																		>
																			&gt;
																		</button>
																	</div>
																	<button
																		type="button"
																		class="remove-slide-btn"
																		onclick={() => removeSlide(block, i)}
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
																		class="slide-input"
																	/>
																	<textarea
																		placeholder="Bijschrift (optioneel)"
																		bind:value={image.caption}
																		class="slide-textarea"
																		rows="2"
																	></textarea>
																	<input
																		type="text"
																		placeholder="Bron (verplicht)"
																		bind:value={image.source}
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
											onclick={() => addSlide(block)}
											disabled={isGalleryAddDisabled(block)}
										>
											Voeg afbeelding toe
										</button>
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
																			onclick={() => moveSlide(block, i, 'prev')}
																		>
																			&lt;
																		</button>
																		<button
																			type="button"
																			class="move-btn"
																			data-direction="next"
																			disabled={i === block.content.timelines.length - 1}
																			onclick={() => moveSlide(block, i, 'next')}
																		>
																			&gt;
																		</button>
																	</div>
																	<button
																		type="button"
																		class="remove-slide-btn"
																		onclick={() => removeSlide(block, i)}
																	>
																		×
																	</button>
																	<input
																		type="text"
																		placeholder="Jaar / Datum"
																		bind:value={item.year}
																		class="slide-input"
																	/>
																	<input
																		type="text"
																		placeholder="Titel (optioneel)"
																		bind:value={item.title}
																		class="slide-input"
																	/>
																	<textarea
																		placeholder="Omschrijving"
																		bind:value={item.description}
																		class="slide-textarea"
																		rows="3"
																	></textarea>
																	<input
																		type="url"
																		placeholder="Afbeelding URL (optioneel)"
																		bind:value={item.imageSrc}
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
																		class="slide-input"
																	/>
																</div>
															</li>
														{/each}
													</ul>
												</div>
											</div>
										</div>

										<button type="button" class="add-slide-btn" onclick={() => addSlide(block)}>
											Voeg tijdlijn-item toe
										</button>
									</div>
								{:else if block.type === 'mediaPaar'}
									<div class="mediapaar-editor">
										<div class="mediapaar-controls">
											<button
												type="button"
												class="swap-btn"
												onclick={() => swapMediaPaarItems(block)}
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
												<label>Uitlijning:</label>
												<div class="valign-options">
													<label class:active={block.content.verticalAlign === 'top'}>
														<input
															type="radio"
															bind:group={block.content.verticalAlign}
															value="top"
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
											{#each block.content.items as item, idx}
												<div class="mediapaar-item">
													<h5>{item.type === 'image' ? 'Afbeelding' : 'Video'}</h5>
													<select
														class="type-select"
														value={item.type}
														onchange={(e) => toggleMediaPaarType(block, idx)}
													>
														<option value="image">Afbeelding</option>
														<option value="video">Video</option>
													</select>

													<input
														type="url"
														placeholder="URL"
														bind:value={item.url}
														class="slide-input"
													/>

													{#if item.type === 'video'}
														<input
															type="url"
															placeholder="Poster URL (voor video)"
															bind:value={item.poster}
															class="slide-input"
														/>
													{/if}

													<textarea
														placeholder="Bijschrift"
														bind:value={item.caption}
														class="slide-textarea"
														rows="2"
													></textarea>

													{#if item.type === 'image'}
														<input
															type="text"
															placeholder="Bron"
															bind:value={item.source}
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
																></video>
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
											class="block-input"
										/>
										{#if block.content.image}
											<img src={block.content.image} alt="" class="audio-image-preview" />
										{/if}
										<input
											type="text"
											placeholder="Titel van de audio"
											bind:value={block.content.title}
											class="block-input"
										/>
										<textarea
											placeholder="Beschrijving (optioneel)"
											bind:value={block.content.description}
											class="block-textarea"
											rows="2"
										></textarea>
										<input
											type="url"
											placeholder="Audio URL (.mp3)"
											bind:value={block.content.url}
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
											{#each block.content.items as item, i}
												<div class="colofon-item">
													<input
														type="text"
														placeholder="Functie"
														bind:value={item.functie}
														class="colofon-input"
													/>
													<input
														type="text"
														placeholder="Naam/Namen"
														bind:value={item.namen}
														class="colofon-input"
													/>
													<button
														type="button"
														class="remove-colofon-btn"
														onclick={() => removeColofonItem(block, i)}
													>
														×
													</button>
												</div>
											{/each}
										</div>
										<button
											type="button"
											class="add-colofon-btn"
											onclick={() => addColofonItem(block)}
										>
											Voeg rij toe
										</button>
									</div>
								{/if}
							</div>
						</div>
					{/each}
				{/if}
			</div>
		</main>
	</div>
</div>

<style>
	:global(body) {
		margin: 0;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
		overflow: hidden;
	}

	.editor {
		height: 100vh;
		display: flex;
		flex-direction: column;
		background: #f4f4f9;
	}

	/* ===== UNIFIED HEADER ===== */
	.editor-header {
		background: white;
		border-bottom: 1px solid #e5e7eb;
		padding: 0.75rem 2rem;
		display: flex;
		justify-content: space-between;
		align-items: center;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
		flex-shrink: 0;
		z-index: 100;
	}

	.header-left {
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	.logo-link {
		text-decoration: none;
		color: inherit;
		display: flex;
		align-items: center;
	}

	.logo-text {
		font-weight: 700;
		font-size: 1.125rem;
		color: #111827;
		letter-spacing: -0.025em;
	}

	.divider {
		color: #d1d5db;
		font-weight: 300;
	}

	.project-name {
		font-weight: 600;
		color: #374151;
		font-size: 0.9375rem;
	}

	.gist-id {
		font-family: 'SF Mono', Monaco, 'Cascadia Code', monospace;
		font-size: 0.75rem;
		color: #9ca3af;
		background: #f3f4f6;
		padding: 0.25rem 0.5rem;
		border-radius: 4px;
	}

	.header-right {
		display: flex;
		gap: 0.75rem;
		align-items: center;
	}

	.save-message {
		font-size: 0.8125rem;
		font-weight: 600;
		padding: 0.375rem 0.75rem;
		border-radius: 6px;
		animation: fadeIn 0.3s;
	}

	.save-message.success {
		background: #d1fae5;
		color: #065f46;
	}

	.save-message.error {
		background: #fee2e2;
		color: #991b1b;
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
			transform: translateY(-4px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.btn-header {
		padding: 0.5rem 1rem;
		border: 1px solid #e5e7eb;
		border-radius: 6px;
		cursor: pointer;
		font-weight: 500;
		font-size: 0.875rem;
		transition: all 0.15s;
		background: white;
		color: #374151;
		text-decoration: none;
		display: inline-flex;
		align-items: center;
		gap: 0.375rem;
	}

	.btn-header:hover {
		background: #f9fafb;
		border-color: #d1d5db;
	}

	.btn-save {
		border-color: #d10a10;
		color: #d10a10;
	}

	.btn-save:hover {
		background: #fef2f2;
	}

	.btn-preview {
		border-color: #667eea;
		color: #667eea;
	}

	.btn-preview:hover {
		background: #eef2ff;
	}

	.btn-publish {
		border-color: #059669;
		color: #059669;
	}

	.btn-publish:hover {
		background: #ecfdf5;
	}

	.btn-logout {
		border-color: #9ca3af;
		color: #6b7280;
	}

	.btn-logout:hover {
		background: #f3f4f6;
	}

	.btn-header:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	/* ===== LAYOUT ===== */
	.editor-layout {
		display: flex;
		flex: 1;
		overflow: hidden;
		height: calc(100vh - 60px);
	}

	/* ===== FIXED TOOLBOX ===== */
	.toolbox {
		width: 250px;
		background: white;
		border-right: 1px solid #e5e7eb;
		flex-shrink: 0;
		overflow-y: auto;
		height: 100%;
	}

	.toolbox-content {
		padding: 20px;
	}

	.toolbox h3 {
		margin-top: 0;
		margin-bottom: 1rem;
		color: #111827;
		font-size: 0.875rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.toolbox hr {
		border: none;
		border-top: 1px solid #e5e7eb;
		margin: 1rem 0;
	}

	.block {
		display: flex;
		align-items: center;
		gap: 12px;
		background: #f9fafb;
		border: 1px solid #e5e7eb;
		margin-bottom: 8px;
		border-radius: 6px;
		cursor: grab;
		padding: 10px 12px;
		font-weight: 500;
		font-size: 0.875rem;
		user-select: none;
		transition: all 0.15s;
		color: #374151;
	}

	.block:hover {
		background: #f3f4f6;
		border-color: #d1d5db;
		transform: translateX(2px);
	}

	.block:active {
		cursor: grabbing;
	}

	.block svg {
		width: 18px;
		height: 18px;
		stroke-width: 2;
		color: #6b7280;
		flex-shrink: 0;
	}

	/* ===== SCROLLABLE CANVAS ===== */
	.canvas {
		flex: 1;
		overflow-y: auto;
		overflow-x: hidden;
		padding: 20px;
		height: 100%;
	}

	.canvas-wrapper {
		max-width: 800px;
		margin: 0 auto;
		min-height: 400px;
		background: white;
		border: 2px dashed #e5e7eb;
		border-radius: 8px;
		padding: 20px;
	}

	.empty-canvas {
		display: flex;
		align-items: center;
		justify-content: center;
		min-height: 360px;
		color: #9ca3af;
		font-style: italic;
		font-size: 0.9375rem;
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

	.sortable-ghost {
		opacity: 0.4;
		background: #f3f4f6;
	}

	/* ===== BLOCK INPUTS ===== */
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

	.block-input-subheading {
		font-size: 1.0625rem;
		font-weight: 600;
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

	/* ===== HERO VIDEO ===== */
	.hero-video-editor {
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
	.video-editor label {
		font-weight: 600;
		font-size: 0.6875rem;
		color: #6b7280;
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.hero-video-editor input,
	.video-editor input {
		padding: 0.5rem;
		border: 1px solid #e5e7eb;
		border-radius: 6px;
		font-size: 0.875rem;
	}

	/* ===== HERO ALIGN PICKER ===== */
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

	/* ===== VIDEO EDITOR ===== */
	.video-editor {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	/* ===== SLIDER / GALLERY / TIMELINE EDITOR ===== */
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

	/* ===== GALLERY CONTROLS ===== */
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

	.layout-picker > label {
		font-weight: 600;
		font-size: 0.8125rem;
		color: #6b7280;
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

	/* ===== MEDIAPAAR EDITOR ===== */
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

	.valign-picker > label {
		font-weight: 600;
		font-size: 0.8125rem;
		color: #6b7280;
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

	/* ===== AUDIO EDITOR ===== */
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

	/* ===== COLOFON EDITOR ===== */
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
</style>
