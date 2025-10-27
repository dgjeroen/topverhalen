<!-- src/lib/components/cms/editors/QuoteStyleEditor.svelte -->
<script lang="ts">
	import type { Theme } from '$lib/types';

	let { theme = $bindable(), onsave } = $props<{
		theme: Theme;
		onsave: () => Promise<void>;
	}>();

	$effect(() => {
		if (!theme) theme = {};
	});
</script>

<div class="style-editor">
	<div class="editor-header">
		<h3>Citaat Styling</h3>
		<p class="editor-description">Pas de stijl van citaten aan</p>
	</div>

	<div class="controls">
		<!-- SECTIE: Tekst -->
		<div class="section-header">Tekst</div>

		<div class="control-group">
			<label for="quote-color">Tekstkleur</label>
			<div class="color-control">
				<input id="quote-color" type="color" bind:value={theme['quote-color']} onchange={onsave} />
				<input
					type="text"
					class="color-value"
					bind:value={theme['quote-color']}
					onchange={onsave}
					placeholder="Gebruik standaard"
				/>
			</div>
		</div>

		<div class="control-group">
			<label for="quote-font">Lettertype</label>
			<select id="quote-font" bind:value={theme['quote-font-family']} onchange={onsave}>
				<option value="">Gebruik standaard (Heading font)</option>
				<option value="'Georgia', serif">Georgia</option>
				<option value="'Inter', sans-serif">Inter</option>
				<option value="var(--font-family-base)">Body Font</option>
				<option value="'Courier New', monospace">Courier New</option>
			</select>
		</div>

		<div class="control-group">
			<label for="quote-size">Lettergrootte</label>
			<input
				id="quote-size"
				type="text"
				bind:value={theme['quote-font-size']}
				onchange={onsave}
				placeholder="2rem"
				class="text-input"
			/>
			<span class="hint">Bijv: 2rem, 32px, 1.5em</span>
		</div>

		<div class="control-group">
			<label for="quote-weight">Letterdikte</label>
			<select id="quote-weight" bind:value={theme['quote-font-weight']} onchange={onsave}>
				<option value="">Standaard (800)</option>
				<option value="400">Normal (400)</option>
				<option value="500">Medium (500)</option>
				<option value="600">Semi-bold (600)</option>
				<option value="700">Bold (700)</option>
				<option value="800">Extra-bold (800)</option>
			</select>
		</div>

		<!-- SECTIE: Kader -->
		<div class="section-header">Kader</div>

		<div class="control-group">
			<label for="quote-bg">Achtergrondkleur</label>
			<div class="color-control">
				<input
					id="quote-bg"
					type="color"
					bind:value={theme['quote-background']}
					onchange={onsave}
				/>
				<input
					type="text"
					class="color-value"
					bind:value={theme['quote-background']}
					onchange={onsave}
					placeholder="#ffffff"
				/>
			</div>
		</div>

		<div class="control-group">
			<label for="quote-border">Rand Kleur</label>
			<div class="color-control">
				<input
					id="quote-border"
					type="color"
					bind:value={theme['quote-border-color']}
					onchange={onsave}
				/>
				<input
					type="text"
					class="color-value"
					bind:value={theme['quote-border-color']}
					onchange={onsave}
					placeholder="#ffd302"
				/>
			</div>
		</div>

		<div class="control-group">
			<label for="quote-border-width">Rand Dikte</label>
			<input
				id="quote-border-width"
				type="text"
				bind:value={theme['quote-border-width']}
				onchange={onsave}
				placeholder="10px"
				class="text-input"
			/>
			<span class="hint">Bijv: 10px, 0.5rem</span>
		</div>

		<div class="control-group">
			<label for="quote-radius">Afronding Hoeken</label>
			<input
				id="quote-radius"
				type="text"
				bind:value={theme['quote-border-radius']}
				onchange={onsave}
				placeholder="8px"
				class="text-input"
			/>
			<span class="hint">Bijv: 8px, 0.5rem, 0 (geen)</span>
		</div>

		<!-- SECTIE: Aanhalingsteken -->
		<div class="section-header">Aanhalingsteken (")</div>

		<div class="control-group">
			<label for="quote-mark-color">Kleur</label>
			<div class="color-control">
				<input
					id="quote-mark-color"
					type="color"
					bind:value={theme['quote-mark-color']}
					onchange={onsave}
				/>
				<input
					type="text"
					class="color-value"
					bind:value={theme['quote-mark-color']}
					onchange={onsave}
					placeholder="black"
				/>
			</div>
		</div>

		<div class="control-group">
			<label for="quote-mark-font">Lettertype</label>
			<select id="quote-mark-font" bind:value={theme['quote-mark-font-family']} onchange={onsave}>
				<option value="">Gebruik standaard (Heading font)</option>
				<option value="'Georgia', serif">Georgia</option>
				<option value="'Inter', sans-serif">Inter</option>
				<option value="var(--font-family-base)">Body Font</option>
				<option value="'Courier New', monospace">Courier New</option>
				<option value="'Times New Roman', serif">Times New Roman</option>
				<option value="'Arial Black', sans-serif">Arial Black</option>
			</select>
		</div>

		<div class="control-group">
			<label for="quote-mark-size">Grootte</label>
			<input
				id="quote-mark-size"
				type="text"
				bind:value={theme['quote-mark-size']}
				onchange={onsave}
				placeholder="10em"
				class="text-input"
			/>
			<span class="hint">Bijv: 10em, 8em, 5em</span>
		</div>

		<!-- SECTIE: Auteur -->
		<div class="section-header">Auteur</div>

		<div class="control-group">
			<label for="quote-author-color">Tekstkleur</label>
			<div class="color-control">
				<input
					id="quote-author-color"
					type="color"
					bind:value={theme['quote-author-color']}
					onchange={onsave}
				/>
				<input
					type="text"
					class="color-value"
					bind:value={theme['quote-author-color']}
					onchange={onsave}
					placeholder="Gebruik muted color"
				/>
			</div>
		</div>

		<div class="control-group">
			<label for="quote-author-size">Lettergrootte</label>
			<input
				id="quote-author-size"
				type="text"
				bind:value={theme['quote-author-font-size']}
				onchange={onsave}
				placeholder="1.5rem"
				class="text-input"
			/>
			<span class="hint">Bijv: 1.5rem, 24px</span>
		</div>

		<div class="control-group">
			<label for="quote-author-align">Uitlijning</label>
			<select id="quote-author-align" bind:value={theme['quote-author-align']} onchange={onsave}>
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
		padding: 2rem;
		max-width: 600px;
		margin: 0 auto;
	}

	.editor-header {
		margin-bottom: 2rem;
		padding-bottom: 1rem;
		border-bottom: 2px solid #e5e7eb;
	}

	h3 {
		margin: 0 0 0.5rem 0;
		color: #111827;
		font-size: 1.5rem;
		font-weight: 700;
	}

	.editor-description {
		margin: 0;
		color: #6b7280;
		font-size: 0.875rem;
	}

	.section-header {
		font-weight: 700;
		font-size: 0.75rem;
		color: #9ca3af;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		margin-top: 2rem;
		margin-bottom: 1rem;
		padding-top: 1rem;
		border-top: 1px solid #e5e7eb;
	}

	.section-header:first-of-type {
		margin-top: 0;
		padding-top: 0;
		border-top: none;
	}

	.controls {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.control-group {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	label {
		font-weight: 600;
		font-size: 0.875rem;
		color: #374151;
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.color-control {
		display: flex;
		gap: 0.75rem;
		align-items: center;
	}

	input[type='color'] {
		width: 60px;
		height: 40px;
		border: 1px solid #e5e7eb;
		border-radius: 6px;
		cursor: pointer;
		flex-shrink: 0;
	}

	.color-value,
	.text-input {
		flex: 1;
		padding: 0.5rem 0.75rem;
		border: 1px solid #e5e7eb;
		border-radius: 6px;
		font-size: 0.875rem;
		color: #374151;
	}

	.color-value {
		font-family: 'SF Mono', Monaco, monospace;
	}

	.text-input:focus,
	.color-value:focus {
		outline: none;
		border-color: #667eea;
		box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
	}

	.hint {
		font-size: 0.75rem;
		color: #9ca3af;
		font-style: italic;
	}

	select {
		width: 100%;
		padding: 0.75rem;
		border: 1px solid #e5e7eb;
		border-radius: 6px;
		font-size: 0.9375rem;
		color: #374151;
		background: white;
		cursor: pointer;
		transition: all 0.15s;
	}

	select:focus {
		outline: none;
		border-color: #667eea;
		box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
	}
</style>
