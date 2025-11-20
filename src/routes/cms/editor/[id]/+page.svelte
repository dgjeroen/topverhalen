<!--src/routes/cms/editor/[id]/+page.svelte-->
<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { tick } from 'svelte';
	import type { PageData } from './$types';
	import type { ContentBlock } from '$lib/types';
	import BlockIcons from '$lib/assets/icons/BlockIcons.svelte';
	import TextFrameIcons from '$lib/assets/icons/TextFrameIcons.svelte';
	import IconButton from '$lib/components/ui/IconButton.svelte';
	import SortableCanvas from '$lib/components/cms/SortableCanvas.svelte';
	import StyleComponentList from '$lib/components/cms/StyleComponentList.svelte';
	import HeroVideoStyleEditor from '$lib/components/cms/editors/HeroVideoStyleEditor.svelte';
	import GeneralStyleEditor from '$lib/components/cms/editors/GeneralStyleEditor.svelte';
	import HeadingStyleEditor from '$lib/components/cms/editors/HeadingStyleEditor.svelte';
	import TextStyleEditor from '$lib/components/cms/editors/TextStyleEditor.svelte';
	import TextFrameStyleEditor from '$lib/components/cms/editors/TextFrameStyleEditor.svelte';
	import QuoteStyleEditor from '$lib/components/cms/editors/QuoteStyleEditor.svelte';
	import ColofonStyleEditor from '$lib/components/cms/editors/ColofonStyleEditor.svelte';
	import AudioStyleEditor from '$lib/components/cms/editors/AudioStyleEditor.svelte';
	import ImageStyleEditor from '$lib/components/cms/editors/ImageStyleEditor.svelte';
	import SliderStyleEditor from '$lib/components/cms/editors/SliderStyleEditor.svelte';
	import SubheadingSoccerStyleEditor from '$lib/components/cms/editors/SubheadingSoccerStyleEditor.svelte';
	import TimelineStyleEditor from '$lib/components/cms/editors/TimelineStyleEditor.svelte';

	// ✅ NIEUW: Import save manager en localStorage utils
	import { saveManager, rateLimitWarning } from '$lib/stores/saveManager';
	import {
		saveBackup,
		getBackup,
		clearBackup,
		hasBackup,
		clearExpiredBackups
	} from '$lib/utils/localStorage';

	let { data } = $props<{ data: PageData }>();

	let currentTheme = $state(data.project.theme || {});

	// ✅ Sync data → lokale state
	$effect(() => {
		currentTheme = data.project.theme || {};
	});

	// ✅ Sync lokale state → data (voor save)
	$effect(() => {
		data.project.theme = currentTheme;
	});

	let canvasBlocks = $state<ContentBlock[]>(data.project.data || []);
	let splideInstances = new Map<string, any>();
	let activeTab = $state<'blocks' | 'styling'>('blocks');
	let selectedStyleComponent = $state<string>('general');
	let toolboxEl = $state<HTMLElement>();
	let toolboxSortable = $state<any>(null);

	// ✅ NIEUW: Save management state
	let saveTimeout: ReturnType<typeof setTimeout> | undefined;
	let showBackupDialog = $state(false);
	let backupData = $state<any>(null);

	function handleSave() {
		debouncedSave();
	}

	function handleBlockAdd(event: CustomEvent<{ blockType: string; newIndex: number }>) {
		const { blockType, newIndex } = event.detail;

		// 'createEditableBlock' is je bestaande functie in +page.svelte
		const newBlock = createEditableBlock(blockType);

		canvasBlocks = [...canvasBlocks.slice(0, newIndex), newBlock, ...canvasBlocks.slice(newIndex)];

		debouncedSave();

		// Roep je bestaande init-functies aan (die nog in +page.svelte staan)
	}

	function handleBlockMove(event: CustomEvent<{ oldIndex: number; newIndex: number }>) {
		const { oldIndex, newIndex } = event.detail;

		const newOrder = [...canvasBlocks];
		const [movedItem] = newOrder.splice(oldIndex, 1);
		newOrder.splice(newIndex, 0, movedItem);

		canvasBlocks = newOrder;
		debouncedSave();
	}

	function handleBlockRemove(event: CustomEvent<string>) {
		const blockId = event.detail;
		// 'removeBlock' is je bestaande functie in +page.svelte
		removeBlock(blockId);
	}

	function handleSplideEvent(
		event: CustomEvent<{
			type: 'add' | 'remove' | 'move';
			blockId: string;
			index?: number;
			direction?: 'prev' | 'next';
		}>
	) {
		const { type, blockId, index, direction } = event.detail;
		const block = canvasBlocks.find((b) => b.id === blockId);
		if (!block) return;

		// 'addSlide', 'removeSlide', 'moveSlide' zijn je bestaande functies
		if (type === 'add') {
			addSlide(block);
		} else if (type === 'remove' && index !== undefined) {
			removeSlide(block, index);
		} else if (type === 'move' && index !== undefined && direction) {
			moveSlide(block, index, direction);
		}
	}

	function handleMediaEvent(
		event: CustomEvent<{
			type: 'swap' | 'toggle';
			blockId: string;
			itemIndex?: number;
		}>
	) {
		const { type, blockId, itemIndex } = event.detail;
		const block = canvasBlocks.find((b) => b.id === blockId);
		if (!block) return;

		// 'swapMediaPairItems' & 'toggleMediaPairType' zijn je bestaande functies
		if (type === 'swap') {
			swapMediaPairItems(block);
		} else if (type === 'toggle' && itemIndex !== undefined) {
			toggleMediaPairType(block, itemIndex);
		}
	}

	function handleColofonEvent(
		event: CustomEvent<{
			type: 'add' | 'remove';
			blockId: string;
			index?: number;
		}>
	) {
		const { type, blockId, index } = event.detail;
		const block = canvasBlocks.find((b) => b.id === blockId);
		if (!block) return;

		// 'addColofonItem' & 'removeColofonItem' zijn je bestaande functies
		if (type === 'add') {
			addColofonItem(block);
		} else if (type === 'remove' && index !== undefined) {
			removeColofonItem(block, index);
		}
	}

	$effect(() => {
		// Dit $effect runt zodra 'activeTab' of 'toolboxEl' verandert
		if (activeTab === 'blocks' && toolboxEl) {
			let isCancelled = false;
			let localSortable: any;

			(async () => {
				const Sortable = (await import('sortablejs')).default;
				if (isCancelled) return;

				localSortable = new Sortable(toolboxEl, {
					group: { name: 'shared', pull: 'clone', put: false },
					animation: 150,
					sort: false
				});
				toolboxSortable = localSortable;
			})();

			// De cleanup: runt als we naar de 'styling' tab gaan
			return () => {
				isCancelled = true;
				if (localSortable) {
					localSortable.destroy();
				}
				toolboxSortable = null;
			};
		}
	});

	// ✅ NIEUW: Debounced save met adaptive delay
	function debouncedSave() {
		saveManager.setUnsavedChanges(true);

		// Immediate backup to localStorage
		saveBackup(data.gistId, {
			storyName: data.project.storyName,
			theme: data.project.theme,
			data: canvasBlocks
		});

		if (saveTimeout) clearTimeout(saveTimeout);

		// Use adaptive delay from saveManager
		const delay = $saveManager.currentDebounceDelay;

		saveTimeout = setTimeout(() => {
			saveToServer();
		}, delay);
	}

	async function handleStyleSave() {
		debouncedSave();
		return Promise.resolve();
	}

	// ✅ NIEUW: Manual save (bypasses debounce)
	async function forceSave() {
		if (saveTimeout) clearTimeout(saveTimeout);
		await saveToServer();
	}

	// ✅ NIEUW: Server save met retry + rate limit monitoring
	async function saveToServer() {
		saveManager.setSaving(true);

		const maxRetries = 5;
		const baseDelay = 2000;
		let lastError: Error | null = null;

		for (let attempt = 0; attempt < maxRetries; attempt++) {
			try {
				const response = await fetch(`/cms/api/projects/${data.gistId}`, {
					method: 'PATCH',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({
						version: data.project.version + 1,
						storyName: data.project.storyName,
						gistId: data.gistId,
						theme: data.project.theme || {},
						data: canvasBlocks
					})
				});

				const result = await response.json();

				// ✅ Update rate limit info
				if (result.rateLimit) {
					saveManager.setRateLimitInfo(
						result.rateLimit.remaining,
						result.rateLimit.limit,
						result.rateLimit.reset
					);
				}

				// ✅ Handle rate limit errors
				if (response.status === 403 || response.status === 429) {
					const delay = Math.max(baseDelay * Math.pow(2, attempt), 60000);

					console.warn(`⚠️ Rate limited, retry ${attempt + 1}/${maxRetries} in ${delay}ms`);

					if (attempt < maxRetries - 1) {
						await new Promise((resolve) => setTimeout(resolve, delay));
						continue;
					} else {
						throw new Error('Rate limit bereikt. Probeer over enkele minuten opnieuw.');
					}
				}

				if (!response.ok) {
					throw new Error(result.error || 'Opslaan mislukt');
				}

				// ✅ Success!
				data.project.version++;
				saveManager.setSaved();
				clearBackup(data.gistId);

				if (attempt > 0) {
					console.log(`✅ Saved successfully after ${attempt + 1} attempts`);
				}

				return;
			} catch (error) {
				console.error(`Attempt ${attempt + 1} failed:`, error);
				lastError = error as Error;

				if (attempt === maxRetries - 1) {
					saveManager.setError(lastError.message);
					throw error;
				}

				// Retry met exponential backoff
				const delay = baseDelay * Math.pow(2, attempt);
				await new Promise((resolve) => setTimeout(resolve, delay));
			}
		}
	}

	// ✅ DEPRECATED: Oude saveProject functie (niet meer gebruikt)
	async function saveProject() {
		await saveToServer();
	}

	// ✅ Check for backup on mount
	onMount(() => {
		clearExpiredBackups();

		if (hasBackup(data.gistId)) {
			backupData = getBackup(data.gistId);

			// Check if backup is newer than current data
			if (backupData && backupData.timestamp > Date.now() - 300000) {
				// 5 min threshold
				showBackupDialog = true;
			}
		}
	});

	// ✅ Restore from backup
	function restoreBackup() {
		if (backupData) {
			data.project.storyName = backupData.storyName;
			data.project.theme = backupData.theme;
			canvasBlocks = backupData.data;

			showBackupDialog = false;
			saveManager.setUnsavedChanges(true);

			// Save restored data
			forceSave();
		}
	}

	// ✅ Discard backup
	function discardBackup() {
		clearBackup(data.gistId);
		showBackupDialog = false;
	}

	async function switchToBlocksTab() {
		activeTab = 'blocks';
	}

	function createEditableBlock(type: string): ContentBlock {
		const blockId = `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

		return { id: blockId, type, content: getDefaultContent(type) } as ContentBlock;
	}

	function getDefaultContent(type: string) {
		switch (type) {
			case 'heroVideo':
				return { url: '', poster: '', label: '', title: '', source: '', textAlign: 'center' };
			case 'imageHero':
				return { url: '', label: '', title: 'Hero titel', source: '', textAlign: 'center' };
			case 'heading':
				return { text: '', level: 2 };
			case 'subheadingMedium':
				return { text: '', level: 3 };
			case 'subheading':
				return { text: '', level: 4 };
			case 'subheadingSoccer':
				return { text: '', level: 4 };
			case 'textblock':
				return { text: [''], isLead: false };
			case 'quote':
				return { text: '', author: '', typewriter: true, italic: true };
			case 'image':
				return { url: '', caption: '', source: '', parallax: false };
			case 'video':
				return { url: '', poster: '' };
			case 'embed':
				return {
					code: '',
					aspectRatio: 'auto',
					caption: '',
					source: ''
				};
			case 'slider':
				return { images: [{ url: '', caption: '', source: '' }] };
			case 'gallery':
				return { columns: 2, images: [] };
			case 'timeline':
				return {
					title: 'Tijdlijn',
					timelines: [
						{
							year: '2020',
							title: 'Start',
							imageSrc: null,
							imageAlt: '',
							description: 'Beschrijving van gebeurtenis in 2020'
						}
					]
				};
			case 'mediaPair':
				return {
					verticalAlign: 'top',
					items: [
						{ type: 'image', orientation: 'portrait', url: '', caption: '', source: '' },
						{ type: 'video', orientation: 'landscape', url: '', poster: '', caption: '' }
					]
				};
			case 'audio':
				return {
					url: '',
					title: '',
					description: '',
					image: '',
					imageLayout: 'stamp',
					imageScale: 100,
					imageFocusX: 50,
					imageFocusY: 50
				};
			case 'textframe':
				return { width: 'narrow', heading: '', text: '', image: null };
			case 'colofon':
				return {
					items: [{ functie: '', namen: '' }],
					showLogo: true,
					logoVariant: 'dia'
				};
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

		debouncedSave();
	}

	function addSlide(block: any) {
		if (block.type === 'slider') {
			block.content.images.push({ url: '', caption: '', source: '' });
			canvasBlocks = [...canvasBlocks];
		} else if (block.type === 'gallery') {
			block.content.images.push({ url: '', caption: '', source: '' });
			canvasBlocks = [...canvasBlocks];
		} else if (block.type === 'timeline') {
			block.content.timelines.push({
				year: '',
				title: '',
				description: '',
				imageSrc: '',
				imageAlt: ''
			});
			canvasBlocks = [...canvasBlocks];
		}
		debouncedSave();
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

		debouncedSave();
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

		// ✅ Trigger debounced save
		debouncedSave();
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

	function swapMediaPairItems(block: any) {
		const items = block.content.items;
		block.content.items = [items[1], items[0]];
		canvasBlocks = [...canvasBlocks];
		debouncedSave();
	}

	function toggleMediaPairType(block: any, itemIndex: number) {
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
		debouncedSave();
	}

	function addColofonItem(block: any) {
		block.content.items.push({ functie: '', namen: '' });
		canvasBlocks = [...canvasBlocks];
		debouncedSave();
	}

	function removeColofonItem(block: any, index: number) {
		block.content.items.splice(index, 1);
		canvasBlocks = [...canvasBlocks];
		debouncedSave();
	}

	// ===== PREVIEW & PUBLISH (ongewijzigd) =====

	let previewing = $state(false);
	let publishStatus = $state<'idle' | 'pending' | 'building' | 'completed' | 'failed'>('idle');
	let jobId = $state<string | null>(null);
	let downloadUrl = $state<string | null>(null);
	let publishError = $state<string | null>(null);
	let pollInterval: ReturnType<typeof setInterval> | null = null;

	async function handlePreview() {
		if (!data.gistId) {
			alert('⚠️ Sla eerst je project op voordat je een preview maakt!');
			return;
		}

		previewing = true;

		try {
			await forceSave(); // ✅ Force save voor preview

			const previewUrl = new URL('/test-env', window.location.origin);
			previewUrl.searchParams.set('id', data.gistId);
			previewUrl.searchParams.set('t', Date.now().toString());

			window.open(previewUrl.toString(), '_blank');
		} catch (err) {
			alert(`❌ ${err instanceof Error ? err.message : 'Fout'}`);
		} finally {
			previewing = false;
		}
	}

	async function handlePublish() {
		publishStatus = 'pending';
		publishError = null;

		try {
			await forceSave(); // ✅ Force save voor publish

			const response = await fetch('/api/publish/start', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ gistId: data.gistId })
			});

			if (!response.ok) {
				throw new Error('Kon publish niet starten');
			}

			const result = await response.json();
			jobId = result.jobId;

			startPolling();
		} catch (err) {
			publishStatus = 'failed';
			publishError = err instanceof Error ? err.message : 'Onbekende fout';
		}
	}

	function startPolling() {
		pollInterval = setInterval(checkStatus, 3000);
	}

	async function checkStatus() {
		if (!jobId) return;

		try {
			const response = await fetch(`/api/publish/status/${jobId}`);

			if (!response.ok) {
				throw new Error('Kon status niet ophalen');
			}

			const job = await response.json();
			publishStatus = job.status;

			if (job.status === 'completed') {
				downloadUrl = job.downloadUrl;
				stopPolling();
			} else if (job.status === 'failed') {
				publishError = job.error || 'Build gefaald';
				stopPolling();
			}
		} catch (err) {
			console.error('Status check fout:', err);
		}
	}

	function stopPolling() {
		if (pollInterval) {
			clearInterval(pollInterval);
			pollInterval = null;
		}
	}

	function resetPublish() {
		publishStatus = 'idle';
		jobId = null;
		downloadUrl = null;
		publishError = null;
	}

	onDestroy(() => {
		stopPolling();
		if (saveTimeout) clearTimeout(saveTimeout);
	});
</script>

<!-- ✅ NIEUW: Backup Restore Dialog -->
{#if showBackupDialog}
	<dialog
		class="backup-dialog-overlay"
		open
		onclick={(e) => {
			if (e.target === e.currentTarget) discardBackup();
		}}
		onkeydown={(e) => {
			if (e.key === 'Escape') discardBackup();
		}}
	>
		<div class="backup-dialog" role="document">
			<h3>🔄 Niet-opgeslagen wijzigingen gevonden</h3>
			<p>
				Er zijn lokale wijzigingen gevonden van {new Date(backupData?.timestamp).toLocaleString()}.
			</p>
			<p>Wil je deze herstellen?</p>

			<div class="dialog-actions">
				<button type="button" class="btn-primary" onclick={restoreBackup}> ✅ Herstellen </button>
				<button type="button" class="btn-secondary" onclick={discardBackup}> ❌ Negeren </button>
			</div>
		</div>
	</dialog>
{/if}

<!-- ✅ NIEUW: Rate Limit Warning Banner -->
{#if $rateLimitWarning}
	<div
		class="rate-limit-banner"
		class:caution={$rateLimitWarning.level === 'caution'}
		class:warning={$rateLimitWarning.level === 'warning'}
		class:critical={$rateLimitWarning.level === 'critical'}
	>
		<span class="banner-message">{$rateLimitWarning.message}</span>
		<span class="banner-reset">
			Reset: {$rateLimitWarning.resetTime.toLocaleTimeString()}
		</span>
	</div>
{/if}
<BlockIcons />
<TextFrameIcons />
<svelte:head>
	<title>Editor - {data.project.storyName}</title>
	<link
		rel="stylesheet"
		href="https://cdn.jsdelivr.net/npm/@splidejs/splide@4.1.4/dist/css/splide.min.css"
	/>
	<script src="https://cdn.jsdelivr.net/npm/hls.js@latest"></script>
</svelte:head>

<div class="editor">
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
			<!-- ✅ NIEUW: Enhanced save status -->
			<div class="save-status-indicator">
				{#if $saveManager.isSaving}
					<span class="status-badge status-saving">💾 Opslaan...</span>
				{:else if $saveManager.hasUnsavedChanges}
					<span class="status-badge status-unsaved">
						⏳ Niet opgeslagen
						<span class="countdown">
							(over {Math.ceil($saveManager.currentDebounceDelay / 1000)}s)
						</span>
					</span>
				{:else if $saveManager.lastSaved}
					<span class="status-badge status-saved">
						✅ {new Date($saveManager.lastSaved).toLocaleTimeString()}
					</span>
				{/if}

				{#if $saveManager.lastError}
					<span class="status-badge status-error">❌ {$saveManager.lastError}</span>
				{/if}
			</div>

			<!-- ✅ NIEUW: Manual save button -->
			<button
				class="btn-header btn-save"
				onclick={forceSave}
				disabled={$saveManager.isSaving || !$saveManager.hasUnsavedChanges}
			>
				{$saveManager.isSaving ? '💾 Bezig...' : '💾 Opslaan'}
			</button>

			<button class="btn-header btn-preview" onclick={handlePreview} disabled={previewing}>
				{previewing ? '🔄 Preview...' : '👁️ Preview'}
			</button>

			{#if publishStatus === 'idle'}
				<button class="btn-header btn-publish" onclick={handlePublish}> 🚀 Publiceren </button>
			{:else if publishStatus === 'pending' || publishStatus === 'building'}
				<button class="btn-header btn-publish" disabled> ⏳ Build bezig... </button>
			{:else if publishStatus === 'completed'}
				<a href={downloadUrl} download class="btn-header btn-download"> ⬇️ Download </a>
				<button class="btn-header btn-reset" onclick={resetPublish}> 🔄 Nieuw </button>
			{:else if publishStatus === 'failed'}
				<button class="btn-header btn-publish" onclick={resetPublish}> ❌ Opnieuw </button>
			{/if}

			<a href="/cms/logout" class="btn-header btn-logout">Uitloggen</a>
		</div>
	</header>

	<div class="editor-layout">
		<aside class="toolbox">
			<div class="toolbox-tabs">
				<button class="tab-btn" class:active={activeTab === 'blocks'} onclick={switchToBlocksTab}>
					Blokken
				</button>
				<button
					class="tab-btn"
					class:active={activeTab === 'styling'}
					onclick={() => (activeTab = 'styling')}
				>
					Styling
				</button>
			</div>

			<div class="toolbox-content">
				{#if activeTab === 'blocks'}
					<div bind:this={toolboxEl}>
						<h3>Blokken</h3>

						<div class="block" data-type="heroVideo">
							<svg class="block-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
								<use href="#icon-block-hero-video" />
							</svg>
							<span>Hero video</span>
						</div>

						<div class="block" data-type="imageHero">
							<svg class="block-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
								<use href="#icon-block-image-hero" />
							</svg>
							<span>Hero afbeelding</span>
						</div>

						<hr />

						<div class="block" data-type="heading">
							<svg class="block-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
								<use href="#icon-block-h2" />
							</svg>
							<span>Kop</span>
						</div>
						<div class="block" data-type="subheading">
							<svg class="block-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
								<use href="#icon-block-h4" />
							</svg>
							<span>Tussenkop</span>
						</div>
						<div class="block" data-type="textblock">
							<svg class="block-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
								<use href="#icon-block-text" />
							</svg>
							<span>Tekstblok</span>
						</div>

						<div class="block" data-type="quote">
							<svg class="block-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
								<use href="#icon-block-quote" />
							</svg>
							<span>Citaat</span>
						</div>

						<hr />

						<div class="block" data-type="image">
							<svg class="block-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
								<use href="#icon-block-image" />
							</svg>
							<span>Afbeelding</span>
						</div>

						<div class="block" data-type="video">
							<svg class="block-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
								<use href="#icon-block-video" />
							</svg>
							<span>Video</span>
						</div>

						<div class="block" data-type="slider">
							<svg class="block-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
								<use href="#icon-block-slider" />
							</svg>
							<span>Fotoslider</span>
						</div>

						<div class="block" data-type="gallery">
							<svg class="block-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
								<use href="#icon-block-gallery" />
							</svg>
							<span>Fotogrid</span>
						</div>

						<div class="block" data-type="mediaPair">
							<svg class="block-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
								<use href="#icon-block-media-pair" />
							</svg>
							<span>Mediapaar</span>
						</div>

						<hr />

						<div class="block" data-type="textframe">
							<svg class="block-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
								<use href="#icon-block-text-frame" />
							</svg>
							<span>Tekstkader</span>
						</div>

						<div class="block" data-type="embed">
							<svg class="block-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
								<use href="#icon-block-embed" />
							</svg>
							<span>Embed</span>
						</div>

						<div class="block" data-type="timeline">
							<svg class="block-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
								<use href="#icon-block-timeline" />
							</svg>
							<span>Tijdlijn</span>
						</div>

						<div class="block" data-type="audio">
							<svg class="block-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
								<use href="#icon-block-audio" />
							</svg>
							<span>Audiospeler</span>
						</div>

						<div class="block" data-type="colofon">
							<svg class="block-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
								<use href="#icon-block-colofon" />
							</svg>
							<span>Colofon</span>
						</div>

						<hr />
						<div class="block" data-type="subheadingMedium">
							<svg class="block-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
								<use href="#icon-block-h3" />
							</svg>
							<span>Extra tussenkop</span>
						</div>
						<div class="block" data-type="subheadingSoccer">
							<svg class="block-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
								<use href="#icon-block-soccer" />
							</svg>
							<span>Tussenkop voetbal</span>
						</div>
					</div>
				{:else}
					<StyleComponentList bind:selected={selectedStyleComponent} />
				{/if}
			</div>
		</aside>
		<main class="canvas">
			{#if activeTab === 'blocks'}
				<SortableCanvas
					bind:blocks={canvasBlocks}
					theme={data.project.theme}
					on:save={debouncedSave}
					on:remove={handleBlockRemove}
					on:add={handleBlockAdd}
					on:move={handleBlockMove}
					on:splide={handleSplideEvent}
					on:media={handleMediaEvent}
					on:colofon={handleColofonEvent}
					toolbox={toolboxSortable}
				/>
			{:else}
				<div class="styling-canvas">
					{#if selectedStyleComponent === 'general'}
						<GeneralStyleEditor bind:theme={currentTheme} onsave={handleStyleSave} />
					{:else if selectedStyleComponent === 'heroVideo'}
						<HeroVideoStyleEditor bind:theme={currentTheme} onsave={handleStyleSave} />
					{:else if selectedStyleComponent === 'heading'}
						<HeadingStyleEditor bind:theme={currentTheme} onsave={handleStyleSave} level="h2" />
					{:else if selectedStyleComponent === 'subheading'}
						<HeadingStyleEditor bind:theme={currentTheme} onsave={handleStyleSave} level="h4" />
					{:else if selectedStyleComponent === 'subheadingMedium'}
						<HeadingStyleEditor bind:theme={currentTheme} onsave={handleStyleSave} level="h3" />
					{:else if selectedStyleComponent === 'subheadingSoccer'}
						<SubheadingSoccerStyleEditor bind:theme={currentTheme} onsave={handleStyleSave} />
					{:else if selectedStyleComponent === 'text'}
						<TextStyleEditor bind:theme={currentTheme} onsave={handleStyleSave} />
					{:else if selectedStyleComponent === 'textframe'}
						<TextFrameStyleEditor bind:theme={currentTheme} onsave={handleStyleSave} />
					{:else if selectedStyleComponent === 'quote'}
						<QuoteStyleEditor bind:theme={currentTheme} onsave={handleStyleSave} />
					{:else if selectedStyleComponent === 'image'}
						<ImageStyleEditor bind:theme={currentTheme} onsave={handleStyleSave} />
					{:else if selectedStyleComponent === 'slider'}
						<SliderStyleEditor bind:theme={currentTheme} onsave={handleStyleSave} />
					{:else if selectedStyleComponent === 'audio'}
						<AudioStyleEditor bind:theme={currentTheme} onsave={handleStyleSave} />
					{:else if selectedStyleComponent === 'colofon'}
						<ColofonStyleEditor bind:theme={currentTheme} onsave={handleStyleSave} />
					{:else if selectedStyleComponent === 'timeline'}
						<TimelineStyleEditor bind:theme={currentTheme} onsave={handleStyleSave} />
					{/if}
				</div>
			{/if}
		</main>
	</div>
</div>

<style>
	:global(body) {
		margin: 0;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
		overflow: visible;
	}

	.editor {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
		background: #f4f4f9;
	}

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
		position: sticky;
		top: 0;
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

	.block-icon {
		width: 20px;
		height: 20px;
		flex-shrink: 0;
		color: currentColor;
	}

	.divider {
		color: #d10a10;
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

	.save-status-indicator {
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		gap: 0.25rem;
	}

	.status-badge {
		font-size: 0.8125rem;
		font-weight: 600;
		padding: 0.375rem 0.75rem;
		border-radius: 6px;
		white-space: nowrap;
		animation: fadeIn 0.3s;
	}

	.status-saving {
		background: #dbeafe;
		color: #1e40af;
	}

	.status-unsaved {
		background: #fef3c7;
		color: #92400e;
	}

	.status-saved {
		background: #d1fae5;
		color: #065f46;
	}

	.status-error {
		background: #fee2e2;
		color: #991b1b;
	}

	.countdown {
		font-size: 0.75rem;
		opacity: 0.8;
		font-weight: 400;
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

	.btn-save:hover:not(:disabled) {
		background: #fef2f2;
	}

	.btn-preview {
		border-color: #667eea;
		color: #667eea;
	}

	.btn-preview:hover:not(:disabled) {
		background: #eef2ff;
	}

	.btn-publish {
		border-color: #059669;
		color: #059669;
	}

	.btn-publish:hover:not(:disabled) {
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

	.btn-download {
		background: #28a745 !important;
		color: white;
		border-color: #28a745 !important;
	}

	.btn-download:hover {
		background: #218838 !important;
	}

	.btn-reset {
		background: #6c757d;
		color: white;
		border-color: #6c757d;
	}

	.btn-reset:hover {
		background: #5a6268;
	}

	.backup-dialog-overlay {
		position: fixed;
		inset: 0;
		background: rgba(0, 0, 0, 0.6);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 9999;
		backdrop-filter: blur(4px);
		animation: fadeIn 0.2s;
	}

	.backup-dialog {
		background: white;
		padding: 2rem;
		border-radius: 12px;
		max-width: 500px;
		box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.2);
		animation: slideUp 0.3s ease;
	}

	@keyframes slideUp {
		from {
			opacity: 0;
			transform: translateY(20px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.backup-dialog h3 {
		margin: 0 0 1rem 0;
		color: #111827;
		font-size: 1.25rem;
	}

	.backup-dialog p {
		margin: 0 0 0.75rem 0;
		color: #6b7280;
		line-height: 1.6;
	}

	.dialog-actions {
		display: flex;
		gap: 0.75rem;
		margin-top: 1.5rem;
	}

	.btn-primary,
	.btn-secondary {
		flex: 1;
		padding: 0.75rem 1.5rem;
		border: none;
		border-radius: 8px;
		cursor: pointer;
		font-weight: 600;
		font-size: 0.9375rem;
		transition: all 0.15s;
	}

	.btn-primary {
		background: #d10a10;
		color: white;
	}

	.btn-primary:hover {
		background: #b00909;
	}

	.btn-secondary {
		background: #f3f4f6;
		color: #374151;
	}

	.btn-secondary:hover {
		background: #e5e7eb;
	}

	.rate-limit-banner {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		padding: 1rem 2rem;
		background: #dbeafe;
		border-bottom: 2px solid #3b82f6;
		display: flex;
		align-items: center;
		justify-content: space-between;
		z-index: 9998;
		animation: slideDown 0.3s ease;
		box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
	}

	@keyframes slideDown {
		from {
			transform: translateY(-100%);
		}
		to {
			transform: translateY(0);
		}
	}

	.rate-limit-banner.caution {
		background: #e0e7ff;
		border-color: #6366f1;
	}

	.rate-limit-banner.warning {
		background: #fef3c7;
		border-color: #f59e0b;
	}

	.rate-limit-banner.critical {
		background: #fee2e2;
		border-color: #ef4444;
	}

	.banner-message {
		font-weight: 600;
		font-size: 0.875rem;
		color: inherit;
	}

	.banner-reset {
		font-size: 0.75rem;
		opacity: 0.8;
		font-weight: 500;
	}

	.editor-layout {
		display: flex;
		flex: 1;
		min-height: calc(100vh - 60px);
	}

	.toolbox {
		width: 250px;
		background: white;
		border-right: 1px solid #e5e7eb;
		flex-shrink: 0;
		overflow-y: auto;
		max-height: calc(100vh - 60px);
		position: sticky;
		top: 60px;
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
		border-top: 1px solid #d10a10;
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

	.toolbox-tabs {
		display: flex;
		gap: 0;
		padding: 12px 12px 0 12px;
		background: white;
		border-bottom: 1px solid #e5e7eb;
	}

	.tab-btn {
		flex: 1;
		padding: 10px 16px;
		border: none;
		background: transparent;
		color: #6b7280;
		font-weight: 600;
		font-size: 0.875rem;
		cursor: pointer;
		border-bottom: 2px solid transparent;
		transition: all 0.15s;
		position: relative;
		bottom: -1px;
	}

	.tab-btn:hover {
		color: #374151;
		background: #f9fafb;
	}

	.tab-btn.active {
		color: #d10a10;
		border-bottom-color: #d10a10;
		background: white;
	}

	.styling-canvas {
		background: white;
		min-height: 100%;
		border-radius: 8px;
		margin: 0 20px;
	}

	main.canvas {
		position: relative;
		flex: 1;
		overflow-x: hidden !important;
		overflow-y: visible !important;
		padding: 40px 20px;
		height: auto !important;
	}
</style>
