<script lang="ts">
	import type { Theme } from '$lib/types';

	let { theme = $bindable(), onsave } = $props<{
		theme: Theme;
		onsave: () => Promise<void>;
	}>();

	// ✅ SIMPEL: Direct binden, geen lokale state
	const fontOptions = [
		{ value: 'var(--font-family-quote)', label: 'Quote Font (Standaard)' },
		{ value: 'var(--font-family-body)', label: 'Body Font' },
		{ value: 'Georgia, serif', label: 'Georgia (Serif)' },
		{ value: 'Arial, sans-serif', label: 'Arial (Sans-serif)' },
		{ value: '"Times New Roman", serif', label: 'Times New Roman' },
		{ value: '"Courier New", monospace', label: 'Courier New (Mono)' }
	];

	function handleChange() {
		onsave();
	}
</script>

<div class="style-editor">
	<div class="section">
		<h3>Titel Styling</h3>

		<div class="control-group">
			<label for="hero-title-color">Kleur Titel</label>
			<div class="color-input-group">
				<input
					id="hero-title-color"
					type="color"
					bind:value={theme['hero-video-title-color']}
					oninput={handleChange}
					class="color-picker"
				/>
				<input
					type="text"
					bind:value={theme['hero-video-title-color']}
					oninput={handleChange}
					class="color-text"
					placeholder="#ffffff"
				/>
			</div>
		</div>

		<div class="control-group">
			<label for="hero-title-font">Lettertype Titel</label>
			<select
				id="hero-title-font"
				bind:value={theme['hero-video-title-font']}
				onchange={handleChange}
				class="font-select"
			>
				{#each fontOptions as option}
					<option value={option.value}>{option.label}</option>
				{/each}
			</select>
		</div>

		<div class="control-group">
			<label class="checkbox-label">
				<input
					type="checkbox"
					bind:checked={theme['hero-video-uppercase-title']}
					onchange={handleChange}
				/>
				<span>Kop in hoofdletters weergeven</span>
			</label>
		</div>

		<div class="preview-box" style:background="linear-gradient(135deg, #667eea 0%, #764ba2 100%)">
			<h2
				class="preview-title"
				style:color={theme['hero-video-title-color'] || '#ffffff'}
				style:font-family={theme['hero-video-title-font'] || 'var(--font-family-quote)'}
				style:text-transform={theme['hero-video-uppercase-title'] ? 'uppercase' : 'none'}
			>
				Voorbeeldkop
			</h2>
		</div>
	</div>

	<div class="section">
		<h3>Styling label/bron</h3>

		<div class="control-group">
			<label for="hero-label-font">Lettertype label/bron</label>
			<select
				id="hero-label-font"
				bind:value={theme['hero-video-label-font']}
				onchange={handleChange}
				class="font-select"
			>
				{#each fontOptions as option}
					<option value={option.value}>{option.label}</option>
				{/each}
			</select>
		</div>

		<div class="preview-box" style:background="linear-gradient(135deg, #667eea 0%, #764ba2 100%)">
			<div
				class="preview-label"
				style:color={theme['hero-video-title-color'] || '#ffffff'}
				style:font-family={theme['hero-video-label-font'] || 'var(--font-family-quote)'}
			>
				SPECIAL
			</div>
			<div
				class="preview-source"
				style:color={theme['hero-video-title-color'] || '#ffffff'}
				style:font-family={theme['hero-video-label-font'] || 'var(--font-family-quote)'}
			>
				Foto: ANP
			</div>
		</div>
	</div>

	<div class="section">
		<h3>Overlay Styling</h3>

		<div class="control-group">
			<label for="hero-overlay-opacity">
				Overlay Opacity
				<span class="value-display">{theme['hero-video-overlay-opacity'] ?? 50}%</span>
			</label>
			<input
				id="hero-overlay-opacity"
				type="range"
				min="0"
				max="100"
				bind:value={theme['hero-video-overlay-opacity']}
				oninput={handleChange}
				class="range-input"
			/>
			<div class="range-labels">
				<span>Transparant (0%)</span>
				<span>Ondoorzichtig (100%)</span>
			</div>
		</div>

		<div class="preview-box overlay-demo">
			<div
				class="overlay-preview"
				style:opacity={(theme['hero-video-overlay-opacity'] ?? 50) / 100}
			></div>
			<p>Video achtergrond (gesimuleerd)</p>
		</div>
	</div>

	<div class="info-box">
		<svg width="16" height="16" viewBox="0 0 16 16" fill="none">
			<circle cx="8" cy="8" r="7" stroke="currentColor" stroke-width="1.5" />
			<path d="M8 7V11M8 5V5.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
		</svg>
		<p>
			💡 <strong>Tip:</strong> Wijzigingen worden automatisch opgeslagen na 30 seconden.
		</p>
	</div>
</div>

<!-- <style> blijft exact hetzelfde -->
<style>
	.style-editor {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.section {
		background: #f9fafb;
		border: 1px solid #e5e7eb;
		border-radius: 8px;
		padding: 1rem;
	}

	.section h3 {
		margin: 0 0 1rem 0;
		font-size: 0.875rem;
		font-weight: 600;
		color: #374151;
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.control-group {
		margin-bottom: 1rem;
	}

	.control-group:last-child {
		margin-bottom: 0;
	}

	label {
		display: block;
		font-size: 0.875rem;
		font-weight: 500;
		color: #374151;
		margin-bottom: 0.5rem;
	}

	.value-display {
		float: right;
		color: #d10a10;
		font-weight: 600;
	}

	.color-input-group {
		display: flex;
		gap: 0.5rem;
		align-items: center;
	}

	.color-picker {
		width: 60px;
		height: 40px;
		border: 2px solid #e5e7eb;
		border-radius: 6px;
		cursor: pointer;
	}

	.color-text {
		flex: 1;
		padding: 0.5rem;
		border: 1px solid #e5e7eb;
		border-radius: 6px;
		font-family: monospace;
		font-size: 0.875rem;
	}

	.font-select {
		width: 100%;
		padding: 0.5rem;
		border: 1px solid #e5e7eb;
		border-radius: 6px;
		font-size: 0.875rem;
		background: white;
		cursor: pointer;
	}

	.range-input {
		width: 100%;
		height: 6px;
		border-radius: 3px;
		background: #e5e7eb;
		outline: none;
		-webkit-appearance: none;
		appearance: none;
	}

	.range-input::-webkit-slider-thumb {
		appearance: none;
		-webkit-appearance: none;
		width: 18px;
		height: 18px;
		border-radius: 50%;
		background: #d10a10;
		cursor: pointer;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
	}

	.range-input::-moz-range-thumb {
		width: 18px;
		height: 18px;
		border-radius: 50%;
		background: #d10a10;
		cursor: pointer;
		border: none;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
	}

	.range-labels {
		display: flex;
		justify-content: space-between;
		margin-top: 0.5rem;
		font-size: 0.75rem;
		color: #6b7280;
	}

	.preview-box {
		margin-top: 1rem;
		padding: 2rem;
		border-radius: 8px;
		background: #1f2937;
		position: relative;
		overflow: hidden;
	}

	.preview-title {
		font-size: 2rem;
		font-weight: 700;
		text-align: center;
		margin: 0;
		line-height: 1.2;
	}

	.preview-label,
	.preview-source {
		font-size: 1rem;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		margin: 0.5rem 0;
		position: relative;
	}

	.preview-label::before {
		content: '';
		position: absolute;
		width: 40px;
		height: 1px;
		background: currentColor;
		opacity: 0.5;
		top: -0.5rem;
		left: 0;
	}

	.preview-source {
		text-align: right;
	}

	.preview-source::after {
		content: '';
		position: absolute;
		width: 40px;
		height: 1px;
		background: currentColor;
		opacity: 0.5;
		bottom: -0.5rem;
		right: 0;
	}

	.overlay-demo {
		background: url('https://picsum.photos/800/400') center/cover;
		min-height: 150px;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.overlay-preview {
		position: absolute;
		inset: 0;
		background: rgba(0, 0, 0, 1);
		pointer-events: none;
	}

	.overlay-demo p {
		position: relative;
		color: white;
		font-weight: 600;
		text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
		margin: 0;
	}

	.info-box {
		display: flex;
		gap: 0.75rem;
		padding: 1rem;
		background: #eff6ff;
		border: 1px solid #bfdbfe;
		border-radius: 6px;
		font-size: 0.875rem;
		color: #1e40af;
	}

	.info-box svg {
		flex-shrink: 0;
		margin-top: 0.125rem;
	}

	.info-box p {
		margin: 0;
		line-height: 1.5;
	}

	.checkbox-label {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		cursor: pointer;
		user-select: none;
	}

	.checkbox-label input[type='checkbox'] {
		width: 18px;
		height: 18px;
		cursor: pointer;
	}

	.checkbox-label span {
		font-size: 0.875rem;
		color: #374151;
	}
</style>
