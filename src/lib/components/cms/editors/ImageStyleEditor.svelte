<script lang="ts">
	import type { Theme, ContentBlock } from '$lib/types';
	import projectLogo from '$lib/assets/dgLogo-dia.svg?url';

	let {
		theme = $bindable(),
		activeBlock,
		onsave
	} = $props<{
		theme: Theme;
		activeBlock?: ContentBlock;
		onsave: () => Promise<void>;
	}>();

	const fontOptions = [
		{ value: 'var(--font-family-base)', label: 'Standaard (Algemeen)' },
		{ value: 'var(--font-family-quote)', label: 'Quote Font (Algemeen)' },
		{
			value: '"Acumin Pro", "Acumin", "Helvetica Neue", Helvetica, Arial, sans-serif',
			label: 'Acumin'
		},
		{ value: '"Flama Semi Condensed", "Verdana", sans-serif', label: 'Flama' },
		{ value: 'Georgia, serif', label: 'Georgia' },
		{ value: '"Courier New", monospace', label: 'Courier New' }
	];

	function getSize(val: string | undefined, defaultVal: number): number {
		if (!val) return defaultVal;
		return parseFloat(val);
	}

	function setSize(key: string, val: number) {
		theme[key] = `${val}rem`;
		handleChange();
	}

	// ✅ TOEGEVOEGD: Ontbrekende handler
	function handleSizeInput(key: string, event: Event) {
		const input = event.currentTarget as HTMLInputElement;
		setSize(key, parseFloat(input.value));
	}

	function handleChange() {
		onsave();
	}

	// --- DRAG LOGIC ---
	let isDragging = $state(false);
	let dragPreviewX = $state(50);
	let dragPreviewY = $state(50);
	let containerRect: DOMRect | null = null;

	function handleMouseDown(event: MouseEvent) {
		isDragging = true;
		const target = event.currentTarget as HTMLElement;
		const container = target.closest('.preview-box');
		if (container) {
			containerRect = container.getBoundingClientRect();
		}
		event.preventDefault();
	}

	// Accessibility: allow keyboard users to start dragging with Enter or Space
	function handleKeyDown(event: KeyboardEvent) {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			isDragging = true;
			const target = event.currentTarget as HTMLElement;
			const container = target.closest('.preview-box');
			if (container) {
				containerRect = container.getBoundingClientRect();
			}
		}
	}

	function handleMouseMove(event: MouseEvent) {
		if (!isDragging || !containerRect) return;

		const x = event.clientX - containerRect.left;
		const y = event.clientY - containerRect.top;

		dragPreviewX = Math.max(0, Math.min(100, (x / containerRect.width) * 100));
		dragPreviewY = Math.max(0, Math.min(100, (y / containerRect.height) * 100));
	}

	function handleMouseUp() {
		if (!isDragging) return;
		isDragging = false;

		let justify = 'center';
		let align = 'center';

		// Y-As
		if (dragPreviewY < 33) justify = 'flex-start';
		else if (dragPreviewY > 66) justify = 'flex-end';

		// X-As
		if (dragPreviewX < 33) align = 'flex-start';
		else if (dragPreviewX > 66) align = 'flex-end';

		theme['hero-justify-content'] = justify;
		theme['hero-align-items'] = align;

		handleChange();
	}

	function onWindowMouseMove(e: MouseEvent) {
		if (isDragging) handleMouseMove(e);
	}
	function onWindowMouseUp() {
		if (isDragging) handleMouseUp();
	}

	const previewContent = $derived({
		url:
			activeBlock?.content?.url ||
			activeBlock?.content?.poster ||
			'https://picsum.photos/1920/1080',
		title: activeBlock?.content?.title || 'Hero Titel',
		label: activeBlock?.content?.label || 'LABEL',
		source: activeBlock?.content?.source || 'Bronvermelding'
	});
</script>

<svelte:window onmousemove={onWindowMouseMove} onmouseup={onWindowMouseUp} />

<div class="style-editor">
	<div class="section">
		<h3>Titel Styling</h3>

		<div class="control-group">
			<span class="input-label">Uitlijning (Tekst)</span>
			<div class="align-buttons">
				<button
					class:active={theme['hero-text-align'] === 'left'}
					onclick={() => {
						theme['hero-text-align'] = 'left';
						handleChange();
					}}>Links</button
				>
				<button
					class:active={!theme['hero-text-align'] || theme['hero-text-align'] === 'center'}
					onclick={() => {
						theme['hero-text-align'] = 'center';
						handleChange();
					}}>Midden</button
				>
				<button
					class:active={theme['hero-text-align'] === 'right'}
					onclick={() => {
						theme['hero-text-align'] = 'right';
						handleChange();
					}}>Rechts</button
				>
			</div>
		</div>

		<div class="control-row-grid">
			<div class="control-group">
				<label class="input-label" for="hero-title-font">Font</label>
				<select
					id="hero-title-font"
					bind:value={theme['hero-title-font']}
					onchange={handleChange}
					class="input-field"
				>
					{#each fontOptions as option}
						<option value={option.value}>{option.label}</option>
					{/each}
				</select>
			</div>

			<div class="control-group">
				<label class="input-label" for="hero-title-size">Grootte (rem)</label>
				<input
					id="hero-title-size"
					type="number"
					step="0.1"
					value={getSize(theme['hero-title-size'], 3)}
					oninput={(e) => handleSizeInput('hero-title-size', e)}
					class="input-field"
				/>
			</div>
		</div>

		<div class="control-group">
			<label class="input-label" for="hero-title-color">Kleur</label>
			<div class="color-input-group">
				<input
					type="color"
					bind:value={theme['hero-title-color']}
					oninput={handleChange}
					class="color-picker"
				/>
				<input
					type="text"
					bind:value={theme['hero-title-color']}
					oninput={handleChange}
					class="input-field"
				/>
			</div>
		</div>

		<div class="checkbox-row">
			<label class="checkbox-label">
				<input
					type="checkbox"
					checked={theme['hero-title-transform'] === 'uppercase'}
					onchange={(e) => {
						theme['hero-title-transform'] = e.currentTarget.checked ? 'uppercase' : 'none';
						handleChange();
					}}
				/>
				<span>Hoofdletters</span>
			</label>
			<label class="checkbox-label">
				<input
					type="checkbox"
					checked={theme['hero-title-style'] === 'italic'}
					onchange={(e) => {
						theme['hero-title-style'] = e.currentTarget.checked ? 'italic' : 'normal';
						handleChange();
					}}
				/>
				<span>Cursief</span>
			</label>
		</div>
	</div>

	<div class="section">
		<h3>Label Styling</h3>

		<div class="control-group">
			<span class="input-label">Uitlijning t.o.v. Kop</span>
			<div class="align-buttons">
				<button
					class:active={theme['hero-label-align'] === 'flex-start'}
					onclick={() => {
						theme['hero-label-align'] = 'flex-start';
						handleChange();
					}}>Links</button
				>
				<button
					class:active={!theme['hero-label-align'] || theme['hero-label-align'] === 'center'}
					onclick={() => {
						theme['hero-label-align'] = 'center';
						handleChange();
					}}>Midden</button
				>
				<button
					class:active={theme['hero-label-align'] === 'flex-end'}
					onclick={() => {
						theme['hero-label-align'] = 'flex-end';
						handleChange();
					}}>Rechts</button
				>
			</div>
		</div>

		<div class="control-row-grid">
			<div class="control-group">
				<label class="input-label" for="hero-label-font">Font</label>
				<select
					id="hero-label-font"
					bind:value={theme['hero-label-font']}
					onchange={handleChange}
					class="input-field"
				>
					{#each fontOptions as option}
						<option value={option.value}>{option.label}</option>
					{/each}
				</select>
			</div>

			<div class="control-group">
				<label class="input-label" for="hero-label-size">Grootte (rem)</label>
				<input
					id="hero-label-size"
					type="number"
					step="0.1"
					value={getSize(theme['hero-label-size'], 1.5)}
					oninput={(e) => handleSizeInput('hero-label-size', e)}
					class="input-field"
				/>
			</div>
		</div>

		<div class="control-group">
			<label class="input-label" for="hero-label-color">Kleur</label>
			<div class="color-input-group">
				<input
					type="color"
					bind:value={theme['hero-label-color']}
					oninput={handleChange}
					class="color-picker"
				/>
				<input
					type="text"
					bind:value={theme['hero-label-color']}
					oninput={handleChange}
					class="input-field"
				/>
			</div>
		</div>

		<div class="checkbox-row">
			<label class="checkbox-label">
				<input
					type="checkbox"
					checked={theme['hero-label-transform'] === 'uppercase'}
					onchange={(e) => {
						theme['hero-label-transform'] = e.currentTarget.checked ? 'uppercase' : 'none';
						handleChange();
					}}
				/>
				<span>Hoofdletters</span>
			</label>
			<label class="checkbox-label">
				<input
					type="checkbox"
					checked={theme['hero-label-style'] === 'italic'}
					onchange={(e) => {
						theme['hero-label-style'] = e.currentTarget.checked ? 'italic' : 'normal';
						handleChange();
					}}
				/>
				<span>Cursief</span>
			</label>
		</div>
	</div>

	<div class="section">
		<h3>Bron Styling</h3>

		<div class="control-group">
			<span class="input-label">Uitlijning t.o.v. Kop</span>
			<div class="align-buttons">
				<button
					class:active={theme['hero-source-align'] === 'flex-start'}
					onclick={() => {
						theme['hero-source-align'] = 'flex-start';
						handleChange();
					}}>Links</button
				>
				<button
					class:active={!theme['hero-source-align'] || theme['hero-source-align'] === 'center'}
					onclick={() => {
						theme['hero-source-align'] = 'center';
						handleChange();
					}}>Midden</button
				>
				<button
					class:active={theme['hero-source-align'] === 'flex-end'}
					onclick={() => {
						theme['hero-source-align'] = 'flex-end';
						handleChange();
					}}>Rechts</button
				>
			</div>
		</div>
	</div>

	<div class="section">
		<h3>Positie & Sfeer</h3>
		<div class="control-group">
			<label class="input-label" for="hero-overlay-opacity"
				>Overlay Opacity ({Math.round((theme['hero-overlay-opacity'] ?? 0.5) * 100)}%)</label
			>
			<input
				id="hero-overlay-opacity"
				type="range"
				min="0"
				max="1"
				step="0.01"
				bind:value={theme['hero-overlay-opacity']}
				oninput={handleChange}
				class="range-input"
			/>
		</div>
		<p class="info-text"></p>
		<div
			class="preview-content"
			role="button"
			tabindex="0"
			aria-label="Preview drag area"
			class:dragging={isDragging}
			onmousedown={handleMouseDown}
			onkeydown={handleKeyDown}
			style:justify-content={!isDragging ? theme['hero-justify-content'] || 'center' : 'center'}
			style:align-items={!isDragging ? theme['hero-align-items'] || 'center' : 'center'}
			style:left={isDragging ? `${dragPreviewX}%` : '0'}
			style:top={isDragging ? `${dragPreviewY}%` : '0'}
		>
			<img src={projectLogo} alt="Logo" class="preview-logo" />

			<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
			<div
				class="preview-content"
				role="group"
				aria-label="Preview drag area"
				class:dragging={isDragging}
				onmousedown={handleMouseDown}
				style:justify-content={!isDragging ? theme['hero-justify-content'] || 'center' : 'center'}
				style:align-items={!isDragging ? theme['hero-align-items'] || 'center' : 'center'}
				style:left={isDragging ? `${dragPreviewX}%` : '0'}
				style:top={isDragging ? `${dragPreviewY}%` : '0'}
			>
				<div
					class="preview-text-group"
					style:text-align={theme['hero-text-align'] || 'center'}
					style:transform={isDragging ? 'translate(-50%, -50%)' : 'none'}
				>
					{#if previewContent.label}
						<span
							class="preview-label"
							style:font-family={theme['hero-label-font']}
							style:color={theme['hero-label-color'] || theme['hero-title-color'] || '#ffffff'}
							style:text-transform={theme['hero-label-transform'] || 'uppercase'}
							style:font-style={theme['hero-label-style'] || 'normal'}
							style:font-size={theme['hero-label-size'] || '1.5rem'}
							style:align-self={theme['hero-label-align'] || 'center'}>{previewContent.label}</span
						>
					{/if}

					<h2
						class="preview-title"
						style:font-family={theme['hero-title-font']}
						style:color={theme['hero-title-color'] || '#ffffff'}
						style:text-transform={theme['hero-title-transform'] || 'uppercase'}
						style:font-style={theme['hero-title-style'] || 'normal'}
						style:font-size={theme['hero-title-size'] || '3rem'}
					>
						{previewContent.title}
					</h2>

					{#if previewContent.source}
						<span
							class="preview-source"
							style:font-family={theme['hero-label-font']}
							style:color={theme['hero-label-color'] || theme['hero-title-color'] || '#ffffff'}
							style:text-transform={theme['hero-label-transform'] || 'uppercase'}
							style:font-style={theme['hero-label-style'] || 'normal'}
							style:font-size="calc({theme['hero-label-size'] || '1.5rem'} * 0.8)"
							style:align-self={theme['hero-source-align'] || 'center'}
							>{previewContent.source}</span
						>
					{/if}
				</div>
			</div>
		</div>
	</div>

	<div class="preview-wrapper mobile-wrapper">
		<span class="preview-tag">Mobiel (9:16)</span>
		<div class="preview-box mobile-box">
			<img src={previewContent.url} alt="Preview" class="preview-bg" />
			<div class="preview-overlay" style:opacity={theme['hero-overlay-opacity'] ?? 0.5}></div>

			<img src={projectLogo} alt="Logo" class="preview-logo mobile-logo" />

			<div
				class="preview-content"
				style:justify-content={theme['hero-justify-content'] || 'center'}
				style:align-items={theme['hero-align-items'] || 'center'}
			>
				<div class="preview-text-group" style:text-align={theme['hero-text-align'] || 'center'}>
					{#if previewContent.label}
						<span
							class="preview-label"
							style:font-family={theme['hero-label-font']}
							style:color={theme['hero-label-color'] || theme['hero-title-color'] || '#ffffff'}
							style:text-transform={theme['hero-label-transform'] || 'uppercase'}
							style:font-style={theme['hero-label-style'] || 'normal'}
							style:font-size="calc({theme['hero-label-size'] || '1.5rem'} * 0.7)"
							style:align-self={theme['hero-label-align'] || 'center'}>{previewContent.label}</span
						>
					{/if}

					<h2
						class="preview-title"
						style:font-family={theme['hero-title-font']}
						style:color={theme['hero-title-color'] || '#ffffff'}
						style:text-transform={theme['hero-title-transform'] || 'uppercase'}
						style:font-style={theme['hero-title-style'] || 'normal'}
						style:font-size="calc({theme['hero-title-size'] || '3rem'} * 0.6)"
					>
						{previewContent.title}
					</h2>

					{#if previewContent.source}
						<span
							class="preview-source"
							style:font-family={theme['hero-label-font']}
							style:color={theme['hero-label-color'] || theme['hero-title-color'] || '#ffffff'}
							style:text-transform={theme['hero-label-transform'] || 'uppercase'}
							style:font-style={theme['hero-label-style'] || 'normal'}
							style:font-size="calc({theme['hero-label-size'] || '1.5rem'} * 0.6)"
							style:align-self={theme['hero-source-align'] || 'center'}
							>{previewContent.source}</span
						>
					{/if}
				</div>
			</div>
		</div>
	</div>
</div>

<style>
	/* ✅ AANGEPASTE BREEDTE */
	.style-editor {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
		padding: 2rem;
		max-width: 600px;
		margin: 0 auto;
		width: 100%;
	}

	.section {
		background: #f9fafb;
		border: 1px solid #e5e7eb;
		border-radius: 8px;
		padding: 1.25rem;
	}
	h3 {
		margin: 0 0 1rem 0;
		font-size: 0.875rem;
		font-weight: 700;
		color: #374151;
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.control-group {
		margin-bottom: 1rem;
	}
	.control-row-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 0.75rem;
	}

	.input-label {
		display: block;
		font-size: 0.8125rem;
		font-weight: 600;
		color: #4b5563;
		margin-bottom: 0.375rem;
	}

	.input-field {
		width: 100%;
		padding: 0.5rem;
		border: 1px solid #d1d5db;
		border-radius: 4px;
		font-size: 0.875rem;
		background: white;
		box-sizing: border-box;
	}
	.input-field:focus {
		border-color: #d10a10;
		outline: none;
	}

	.color-input-group {
		display: flex;
		gap: 0.5rem;
		align-items: center;
	}
	.color-picker {
		width: 40px;
		height: 38px;
		border: 1px solid #d1d5db;
		border-radius: 4px;
		cursor: pointer;
		padding: 0;
		background: none;
	}

	.checkbox-row {
		display: flex;
		gap: 1.5rem;
		margin-top: 0.5rem;
	}
	.checkbox-label {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		cursor: pointer;
		font-size: 0.875rem;
		user-select: none;
		color: #374151;
		font-weight: 400;
	}
	.checkbox-label input {
		accent-color: #d10a10;
		width: 16px;
		height: 16px;
	}

	.range-input {
		width: 100%;
		accent-color: #d10a10;
		cursor: pointer;
	}

	.info-text {
		font-size: 0.75rem;
		color: #6b7280;
		font-style: italic;
		margin-top: 0.5rem;
	}

	/* Align Buttons */
	.align-buttons {
		display: flex;
		background: white;
		border: 1px solid #d1d5db;
		border-radius: 4px;
		overflow: hidden;
		width: 100%;
	}
	.align-buttons button {
		flex: 1;
		padding: 0.5rem;
		border: none;
		background: white;
		cursor: pointer;
		border-right: 1px solid #d1d5db;
		font-size: 0.8rem;
		font-weight: 500;
		color: #6b7280;
		transition: all 0.1s;
	}
	.align-buttons button:last-child {
		border-right: none;
	}
	.align-buttons button:hover {
		background: #f3f4f6;
	}
	.align-buttons button.active {
		background: #fef2f2;
		color: #d10a10;
		font-weight: 700;
	}

	/* Previews */
	.preview-wrapper {
		width: 100%;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}
	.mobile-wrapper {
		align-items: center;
	}

	.preview-tag {
		font-size: 0.75rem;
		font-weight: 600;
		color: #6b7280;
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.preview-box {
		width: 100%;
		border-radius: 4px;
		overflow: hidden;
		position: relative;
		border: 1px solid #e5e7eb;
		background: #000;
		box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
	}

	.mobile-box {
		width: 160px;
		aspect-ratio: 9/16;
	}

	.preview-bg {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		object-fit: cover;
		z-index: 0;
	}
	.preview-overlay {
		position: absolute;
		inset: 0;
		background-color: black;
		z-index: 1;
	}

	/* ✅ Logo Styling */
	.preview-logo {
		position: absolute;
		top: 1.5rem;
		left: 2rem;
		width: 120px;
		height: auto;
		z-index: 2;
		pointer-events: none;
		opacity: 0.9;
	}
	.mobile-logo {
		top: 1rem;
		left: 1rem;
		width: 80px;
	}

	/* Content Container */
	.preview-content {
		position: absolute;
		inset: 0;
		padding: 2rem;
		z-index: 2;
		display: flex;
		flex-direction: column;
	}

	.preview-content.dragging {
		display: block;
		padding: 0;
	}

	.preview-text-group {
		display: flex;
		flex-direction: column;
		width: 100%;
		max-width: 900px;
		user-select: none;
	}

	.preview-label,
	.preview-source {
		display: block;
		opacity: 0.95;
		letter-spacing: 0.1em;
		line-height: 1.2;
		margin-bottom: 0.5rem;
	}

	.preview-source {
		margin-top: 0.75rem;
		margin-bottom: 0;
	}

	.preview-title {
		margin: 0;
		line-height: 1.1;
		text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
	}

	.mobile-box .preview-content {
		padding: 1rem;
	}
</style>
