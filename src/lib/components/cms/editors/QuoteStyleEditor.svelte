<!-- src/lib/components/cms/editors/QuoteStyleEditor.svelte -->
<script lang="ts">
	import type { Theme } from '$lib/types';

	let { theme = $bindable(), onsave } = $props<{
		theme: Theme;
		onsave: () => Promise<void>;
	}>();

	$effect(() => {
		if (!theme) theme = {};

		// Initialize with defaults if not set
		if (!theme['quote-color']) theme['quote-color'] = '#000000';
		if (!theme['quote-background']) theme['quote-background'] = '#EDEAEC';
		if (!theme['quote-border-color']) theme['quote-border-color'] = '#D10A10';
		if (!theme['quote-mark-color']) theme['quote-mark-color'] = '#6E757C';
		if (!theme['quote-author-color']) theme['quote-author-color'] = '#6E757C';
	});

	const fontOptions = [
		{ value: '', label: 'Gebruik standaard (Heading font)' },
		{ value: "'Acumin Pro Extra Condensed', sans-serif", label: 'Acumin Pro Extra Condensed' },
		{ value: "'Georgia', serif", label: 'Georgia' },
		{ value: "'Inter', sans-serif", label: 'Inter' },
		{ value: 'var(--font-family-base)', label: 'Body Font' },
		{ value: "'Courier New', monospace", label: 'Courier New' }
	];

	const fontWeightOptions = [
		{ value: '', label: 'Standaard (800)' },
		{ value: '400', label: '400 (Normal)' },
		{ value: '500', label: '500 (Medium)' },
		{ value: '600', label: '600 (Semibold)' },
		{ value: '700', label: '700 (Bold)' },
		{ value: '800', label: '800 (Extra Bold)' }
	];

	const quoteFontOptions = [
		{ value: '', label: 'Gebruik standaard (Heading font)' },
		{ value: "'Catamaran', sans-serif", label: 'Catamaran (Modern)' },
		{ value: "'Playfair Display', serif", label: 'Playfair Display (Elegant)' },
		{ value: "'Abril Fatface', serif", label: 'Abril Fatface (Dik & Sierlijk)' },
		{ value: "'Georgia', serif", label: 'Georgia' },
		{ value: "'Inter', sans-serif", label: 'Inter' },
		{ value: 'var(--font-family-base)', label: 'Body Font' },
		{ value: "'Arial Black', sans-serif", label: 'Arial Black' }
	];

	function handleChange() {
		onsave();
	}
</script>

<div class="style-editor">
	<!-- SECTIE: Tekst -->
	<div class="section">
		<h3>Tekst</h3>

		<div class="control-group">
			<span class="input-label">Lettertype</span>
			<select
				id="quote-font"
				bind:value={theme['quote-font-family']}
				onchange={handleChange}
				class="input-field"
			>
				{#each fontOptions as option}
					<option value={option.value}>{option.label}</option>
				{/each}
			</select>
		</div>

		<div class="control-group">
			<label class="input-label" for="quote-size">Lettergrootte</label>
			<input
				id="quote-size"
				type="text"
				bind:value={theme['quote-font-size']}
				onchange={handleChange}
				placeholder="2rem"
				class="input-field"
			/>
			<span class="hint">Bijv: 2rem, 32px, 1.5em</span>
		</div>

		<div class="control-group">
			<span class="input-label">Letterdikte</span>
			<select
				id="quote-weight"
				bind:value={theme['quote-font-weight']}
				onchange={handleChange}
				class="input-field"
			>
				{#each fontWeightOptions as option}
					<option value={option.value}>{option.label}</option>
				{/each}
			</select>
		</div>

		<div class="control-group">
			<span class="input-label">Tekstkleur</span>
			<div class="color-input-group">
				<input
					type="color"
					bind:value={theme['quote-color']}
					oninput={handleChange}
					class="color-picker"
				/>
				<input
					type="text"
					bind:value={theme['quote-color']}
					oninput={handleChange}
					class="input-field"
					placeholder="#000000"
				/>
			</div>
		</div>
	</div>

	<!-- SECTIE: Kader -->
	<div class="section">
		<h3>Kader</h3>

		<div class="control-group">
			<span class="input-label">Achtergrondkleur</span>
			<div class="color-input-group">
				<input
					type="color"
					bind:value={theme['quote-background']}
					oninput={handleChange}
					class="color-picker"
				/>
				<input
					type="text"
					bind:value={theme['quote-background']}
					oninput={handleChange}
					class="input-field"
					placeholder="#EDEAEC"
				/>
			</div>
		</div>

		<div class="control-group">
			<span class="input-label">Rand Kleur</span>
			<div class="color-input-group">
				<input
					type="color"
					bind:value={theme['quote-border-color']}
					oninput={handleChange}
					class="color-picker"
				/>
				<input
					type="text"
					bind:value={theme['quote-border-color']}
					oninput={handleChange}
					class="input-field"
					placeholder="#D10A10"
				/>
			</div>
		</div>

		<div class="control-group">
			<label class="input-label" for="quote-border-width">Rand Dikte</label>
			<input
				id="quote-border-width"
				type="text"
				bind:value={theme['quote-border-width']}
				onchange={handleChange}
				placeholder="10px"
				class="input-field"
			/>
			<span class="hint">Bijv: 10px, 0.5rem</span>
		</div>

		<div class="control-group">
			<label class="input-label" for="quote-radius">Afronding Hoeken</label>
			<input
				id="quote-radius"
				type="text"
				bind:value={theme['quote-border-radius']}
				onchange={handleChange}
				placeholder="8px"
				class="input-field"
			/>
			<span class="hint">Bijv: 8px, 0.5rem, 0 (geen)</span>
		</div>
	</div>

	<!-- SECTIE: Aanhalingsteken -->
	<div class="section">
		<h3>Aanhalingsteken (")</h3>

		<div class="control-group">
			<label class="input-label" for="quote-mark-top">Verticale Positie</label>
			<div class="range-control-wrapper">
				<input
					id="quote-mark-top"
					type="range"
					class="range-input"
					min="-1.0"
					max="0.5"
					step="0.1"
					bind:value={theme['quote-mark-top']}
					oninput={handleChange}
					style="flex: 1;"
				/>
				<input
					type="text"
					bind:value={theme['quote-mark-top']}
					onchange={handleChange}
					placeholder="-0.2em"
					class="input-field"
					style="width: 80px;"
				/>
			</div>
			<span class="hint">Afstand tot bovenkant (default: -0.2em)</span>
		</div>

		<div class="control-group">
			<span class="input-label">Kleur</span>
			<div class="color-input-group">
				<input
					type="color"
					bind:value={theme['quote-mark-color']}
					oninput={handleChange}
					class="color-picker"
				/>
				<input
					type="text"
					bind:value={theme['quote-mark-color']}
					oninput={handleChange}
					class="input-field"
					placeholder="#6E757C"
				/>
			</div>
		</div>

		<div class="control-group">
			<span class="input-label">Lettertype</span>
			<select
				id="quote-mark-font"
				bind:value={theme['quote-mark-font-family']}
				onchange={handleChange}
				class="input-field"
			>
				{#each quoteFontOptions as option}
					<option value={option.value}>{option.label}</option>
				{/each}
			</select>
		</div>

		<div class="control-group">
			<label class="input-label" for="quote-mark-size">Grootte</label>
			<input
				id="quote-mark-size"
				type="text"
				bind:value={theme['quote-mark-size']}
				onchange={handleChange}
				placeholder="10em"
				class="input-field"
			/>
			<span class="hint">Bijv: 10em, 8em, 5em</span>
		</div>
	</div>

	<!-- SECTIE: Auteur -->
	<div class="section">
		<h3>Auteur</h3>

		<div class="control-group">
			<span class="input-label">Tekstkleur</span>
			<div class="color-input-group">
				<input
					type="color"
					bind:value={theme['quote-author-color']}
					oninput={handleChange}
					class="color-picker"
				/>
				<input
					type="text"
					bind:value={theme['quote-author-color']}
					oninput={handleChange}
					class="input-field"
					placeholder="#6E757C"
				/>
			</div>
		</div>

		<div class="control-group">
			<label class="input-label" for="quote-author-size">Lettergrootte</label>
			<input
				id="quote-author-size"
				type="text"
				bind:value={theme['quote-author-font-size']}
				onchange={handleChange}
				placeholder="1.5rem"
				class="input-field"
			/>
			<span class="hint">Bijv: 1.5rem, 24px</span>
		</div>

		<div class="control-group">
			<span class="input-label">Uitlijning</span>
			<select
				id="quote-author-align"
				bind:value={theme['quote-author-align']}
				onchange={handleChange}
				class="input-field"
			>
				<option value="">Standaard (rechts)</option>
				<option value="left">Links</option>
				<option value="center">Midden</option>
				<option value="right">Rechts</option>
			</select>
		</div>
	</div>
</div>

<style>
	.style-editor {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
		padding: 2rem;
		max-width: 800px;
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

	.control-group:last-child {
		margin-bottom: 0;
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

	.hint {
		font-size: 0.75rem;
		color: #9ca3af;
		font-style: italic;
		display: block;
		margin-top: 0.25rem;
	}

	select {
		width: 100%;
		padding: 0.5rem;
		border: 1px solid #d1d5db;
		border-radius: 4px;
		font-size: 0.875rem;
		color: #374151;
		background: white;
		cursor: pointer;
	}

	select:focus {
		outline: none;
		border-color: #d10a10;
	}

	.range-control-wrapper {
		display: flex;
		align-items: center;
		gap: 10px;
	}

	.range-input {
		flex: 1;
		accent-color: #d10a10;
		cursor: pointer;
	}
</style>
