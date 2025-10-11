<script lang="ts">
	import { onMount } from 'svelte';
	import type { PageData } from './$types';

	let { data } = $props<{ data: PageData }>();

	// ✅ State
	let canvasBlocks = $state<any[]>(data.project.data || []);
	let toolboxEl: HTMLElement;
	let canvasEl: HTMLElement;
	let canvasSortable: any;

	// ✅ Maak editable block (simpele versie voor nu)
	function createEditableBlock(type: string) {
		const blockId = `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

		return {
			id: blockId,
			type,
			content: getDefaultContent(type)
		};
	}

	// ✅ Default content per block type
	function getDefaultContent(type: string) {
		switch (type) {
			case 'heroVideo':
				return { url: '', poster: '', title: '', source: '', textAlign: 'center' };
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
			default:
				return {};
		}
	}

	// ✅ Verwijder block
	function removeBlock(blockId: string) {
		canvasBlocks = canvasBlocks.filter((b) => b.id !== blockId);
	}

	// ✅ Opslaan naar Gist
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

	// ✅ Initialiseer libraries na mount
	onMount(async () => {
		const Sortable = (await import('sortablejs')).default;

		// Toolbox (alleen clonen, niet sorteren)
		if (toolboxEl) {
			new Sortable(toolboxEl, {
				group: {
					name: 'shared',
					pull: 'clone',
					put: false
				},
				animation: 150,
				sort: false
			});
		}

		// Canvas (accepteer drops, sorteerbaar)
		if (canvasEl) {
			canvasSortable = new Sortable(canvasEl, {
				group: {
					name: 'shared',
					pull: true,
					put: true
				},
				animation: 150,
				handle: '.drag-handle',
				ghostClass: 'sortable-ghost',
				onAdd: (evt) => {
					const blockType = evt.item.dataset.type;

					if (!blockType) {
						evt.item.remove();
						return;
					}

					// Maak nieuw editable block
					const newBlock = createEditableBlock(blockType);

					// Voeg toe aan state op juiste positie
					const newIndex = evt.newIndex ?? canvasBlocks.length;
					canvasBlocks = [
						...canvasBlocks.slice(0, newIndex),
						newBlock,
						...canvasBlocks.slice(newIndex)
					];

					// Verwijder de geklonede toolbox knop
					evt.item.remove();
				},
				onUpdate: () => {
					// Herorder blocks in state
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
	});
</script>

<svelte:head>
	<title>Editor - {data.project.storyName}</title>
	<!-- ✅ Splide CSS -->
	<link
		rel="stylesheet"
		href="https://cdn.jsdelivr.net/npm/@splidejs/splide@4.1.4/dist/css/splide.min.css"
	/>
</svelte:head>

<div class="editor">
	<header class="editor-header">
		<div class="header-left">
			<a href="/cms" class="back-link">← Terug naar dashboard</a>
			<h1>{data.project.storyName}</h1>
		</div>
		<div class="header-right">
			<span class="gist-id">ID: {data.gistId.substring(0, 8)}...</span>

			{#if saveMessage}
				<span
					class="save-message"
					class:success={saveMessage.includes('✅')}
					class:error={saveMessage.includes('❌')}
				>
					{saveMessage}
				</span>
			{/if}

			<button class="btn-save" onclick={saveProject} disabled={saving}>
				{saving ? '💾 Bezig...' : '💾 Opslaan'}
			</button>
			<button class="btn-preview" disabled>👁️ Preview</button>
			<button class="btn-publish" disabled>🚀 Publiceren</button>
		</div>
	</header>

	<div class="editor-layout">
		<!-- ✅ TOOLBOX (Links) -->
		<aside class="toolbox" bind:this={toolboxEl}>
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
				<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M4 6h16M4 12h16M4 18h7"
					></path>
				</svg>
				<span>Kop</span>
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

			<!-- Voeg later meer blokken toe -->
		</aside>

		<!-- ✅ CANVAS (Midden) -->
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
								{#if block.type === 'heading'}
									<input
										type="text"
										placeholder="Tekst kop..."
										bind:value={block.content.text}
										class="block-input"
									/>
								{:else if block.type === 'textblock'}
									<textarea
										placeholder="Typ hier je tekst..."
										bind:value={block.content.text[0]}
										class="block-textarea"
										rows="4"
									></textarea>
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
								{:else}
									<p class="block-placeholder">Block type: <strong>{block.type}</strong></p>
									<p class="block-hint">Editor komt hier (volgende stap)</p>
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
	}

	.editor {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
		background: #f4f4f9;
	}

	.editor-header {
		background: #d10a10;
		color: white;
		padding: 1rem 2rem;
		display: flex;
		justify-content: space-between;
		align-items: center;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
		flex-shrink: 0;
	}

	.header-left {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.back-link {
		color: rgba(255, 255, 255, 0.8);
		text-decoration: none;
		font-size: 0.875rem;
		transition: color 0.2s;
	}

	.back-link:hover {
		color: white;
	}

	.editor-header h1 {
		margin: 0;
		font-size: 1.5rem;
	}

	.header-right {
		display: flex;
		gap: 1rem;
		align-items: center;
	}

	.gist-id {
		font-family: monospace;
		font-size: 0.875rem;
		opacity: 0.8;
	}

	.btn-save,
	.btn-preview,
	.btn-publish {
		padding: 0.5rem 1rem;
		border: none;
		border-radius: 4px;
		cursor: pointer;
		font-weight: 600;
		transition: all 0.2s;
	}

	.btn-save {
		background: white;
		color: #333;
	}

	.btn-preview {
		background: #667eea;
		color: white;
	}

	.btn-publish {
		background: #28a745;
		color: white;
	}

	.btn-save:hover {
		opacity: 0.9;
	}
	.btn-preview:hover {
		opacity: 0.9;
	}
	.btn-publish:hover {
		opacity: 0.9;
	}

	.btn-save:disabled,
	.btn-preview:disabled,
	.btn-publish:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.editor-layout {
		display: flex;
		flex: 1;
		overflow: hidden;
	}

	/* ===== TOOLBOX ===== */
	.toolbox {
		width: 250px;
		background: white;
		padding: 20px;
		border-right: 1px solid #dee2e6;
		overflow-y: auto;
		flex-shrink: 0;
	}

	.toolbox h3 {
		margin-top: 0;
		color: #333;
	}

	.toolbox hr {
		border: none;
		border-top: 1px solid #dee2e6;
		margin: 1rem 0;
	}

	.block {
		display: flex;
		align-items: center;
		gap: 12px;
		background: #f8f9fa;
		border: 1px solid #dee2e6;
		margin-bottom: 8px;
		border-radius: 6px;
		cursor: grab;
		padding: 12px;
		font-weight: 500;
		font-size: 0.9em;
		user-select: none;
		transition: all 0.2s;
	}

	.block:hover {
		background: #e9ecef;
		transform: translateX(4px);
	}

	.block:active {
		cursor: grabbing;
	}

	.block svg {
		width: 20px;
		height: 20px;
		stroke-width: 1.5;
		color: #6c757d;
		flex-shrink: 0;
	}

	/* ===== CANVAS ===== */
	.canvas {
		flex: 1;
		padding: 20px;
		overflow-y: auto;
	}

	.canvas-wrapper {
		max-width: 800px;
		margin: 0 auto;
		min-height: 400px;
		background: white;
		border: 2px dashed #d1d5db;
		border-radius: 8px;
		padding: 20px;
	}

	.empty-canvas {
		display: flex;
		align-items: center;
		justify-content: center;
		min-height: 360px;
		color: #999;
		font-style: italic;
	}

	.canvas-block {
		background: #f8f9fa;
		border: 1px solid #dee2e6;
		border-radius: 6px;
		padding: 20px;
		margin-bottom: 15px;
		position: relative;
		transition: box-shadow 0.2s;
	}

	.canvas-block:hover {
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
	}

	.drag-handle {
		position: absolute;
		top: 50%;
		left: 8px;
		transform: translateY(-50%);
		color: #aaa;
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
		background: #dc3545;
		color: white;
		border: none;
		border-radius: 50%;
		width: 24px;
		height: 24px;
		cursor: pointer;
		font-weight: bold;
		opacity: 0;
		transition: opacity 0.2s;
	}

	.canvas-block:hover .remove-btn {
		opacity: 1;
	}

	.content {
		margin-left: 30px;
	}

	pre {
		background: white;
		padding: 10px;
		border-radius: 4px;
		font-size: 0.75rem;
		overflow: auto;
	}

	/* ===== BLOCK INPUTS ===== */
	.block-input,
	.block-textarea {
		width: 100%;
		padding: 0.75rem;
		border: 1px solid #dee2e6;
		border-radius: 4px;
		font-family: inherit;
		font-size: 1rem;
		margin-bottom: 0.5rem;
		box-sizing: border-box;
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

	.block-preview {
		width: 100%;
		max-height: 300px;
		object-fit: cover;
		border-radius: 4px;
		margin-top: 0.5rem;
	}

	.block-placeholder {
		margin: 0;
		color: #666;
	}

	.block-hint {
		margin: 0.5rem 0 0;
		color: #999;
		font-size: 0.875rem;
		font-style: italic;
	}

	/* ===== SORTABLE GHOST ===== */
	.sortable-ghost {
		opacity: 0.4;
		background: #e9ecef;
	}

	.save-message {
		font-size: 0.875rem;
		font-weight: 600;
		padding: 0.5rem 1rem;
		border-radius: 4px;
		animation: fadeIn 0.3s;
	}

	.save-message.success {
		background: rgba(40, 167, 69, 0.1);
		color: #28a745;
	}

	.save-message.error {
		background: rgba(220, 53, 69, 0.1);
		color: #dc3545;
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
			transform: translateY(-10px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
</style>
