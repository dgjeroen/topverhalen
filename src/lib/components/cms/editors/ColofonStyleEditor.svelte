<!-- src/lib/components/cms/editors/ColofonStyleEditor.svelte -->
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
		<h3>Colofon Styling</h3>
		<p class="editor-description">Pas de stijl van het colofon blok aan</p>
	</div>

	<div class="controls">
		<!-- SECTIE: Container -->
		<div class="section-header">Container</div>

		<div class="control-group">
			<label for="colofon-padding">Padding (boven/onder)</label>
			<input
				id="colofon-padding"
				type="text"
				bind:value={theme['colofon-padding-block']}
				onchange={onsave}
				placeholder="2rem"
				class="text-input"
			/>
			<span class="hint">Bijv: 1.5rem, 2rem, 3rem</span>
		</div>

		<div class="control-group">
			<label for="colofon-border-color">Randkleur</label>
			<div class="color-control">
				<input
					id="colofon-border-color"
					type="color"
					bind:value={theme['colofon-border-color']}
					onchange={onsave}
				/>
				<input
					type="text"
					class="color-value"
					bind:value={theme['colofon-border-color']}
					onchange={onsave}
					placeholder="#e5e7eb"
				/>
			</div>
		</div>

		<div class="control-group">
			<label for="colofon-font-size">Lettergrootte</label>
			<input
				id="colofon-font-size"
				type="text"
				bind:value={theme['colofon-font-size']}
				onchange={onsave}
				placeholder="1rem"
				class="text-input"
			/>
			<span class="hint">Bijv: 0.875rem, 1rem, 1.125rem</span>
		</div>

		<!-- SECTIE: Functie (dt) -->
		<div class="section-header">Functie (Links)</div>

		<div class="control-group">
			<label for="colofon-dt-color">Tekstkleur</label>
			<div class="color-control">
				<input
					id="colofon-dt-color"
					type="color"
					bind:value={theme['colofon-dt-color']}
					onchange={onsave}
				/>
				<input
					type="text"
					class="color-value"
					bind:value={theme['colofon-dt-color']}
					onchange={onsave}
					placeholder="#111827"
				/>
			</div>
		</div>

		<div class="control-group">
			<label for="colofon-dt-weight">Letterdikte</label>
			<select id="colofon-dt-weight" bind:value={theme['colofon-dt-weight']} onchange={onsave}>
				<option value="">Standaard (600)</option>
				<option value="400">Normal (400)</option>
				<option value="500">Medium (500)</option>
				<option value="600">Semi-bold (600)</option>
				<option value="700">Bold (700)</option>
			</select>
		</div>

		<div class="control-group">
			<label for="colofon-dt-align">Tekstuitlijning</label>
			<select id="colofon-dt-align" bind:value={theme['colofon-dt-align']} onchange={onsave}>
				<option value="">Standaard (rechts)</option>
				<option value="left">Links</option>
				<option value="center">Midden</option>
				<option value="right">Rechts</option>
			</select>
		</div>

		<!-- SECTIE: Namen (dd) -->
		<div class="section-header">Namen (Rechts)</div>

		<div class="control-group">
			<label for="colofon-dd-color">Tekstkleur</label>
			<div class="color-control">
				<input
					id="colofon-dd-color"
					type="color"
					bind:value={theme['colofon-dd-color']}
					onchange={onsave}
				/>
				<input
					type="text"
					class="color-value"
					bind:value={theme['colofon-dd-color']}
					onchange={onsave}
					placeholder="#6b7280"
				/>
			</div>
		</div>

		<div class="control-group">
			<label for="colofon-dd-weight">Letterdikte</label>
			<select id="colofon-dd-weight" bind:value={theme['colofon-dd-weight']} onchange={onsave}>
				<option value="">Standaard (400)</option>
				<option value="400">Normal (400)</option>
				<option value="500">Medium (500)</option>
				<option value="600">Semi-bold (600)</option>
			</select>
		</div>

		<!-- SECTIE: Layout -->
		<div class="section-header">Layout</div>

		<div class="control-group">
			<label for="colofon-gap">Ruimte tussen rijen</label>
			<input
				id="colofon-gap"
				type="text"
				bind:value={theme['colofon-gap']}
				onchange={onsave}
				placeholder="0.75rem"
				class="text-input"
			/>
			<span class="hint">Bijv: 0.5rem, 0.75rem, 1rem</span>
		</div>

		<div class="control-group">
			<label for="colofon-column-gap">Ruimte tussen kolommen</label>
			<input
				id="colofon-column-gap"
				type="text"
				bind:value={theme['colofon-column-gap']}
				onchange={onsave}
				placeholder="2rem"
				class="text-input"
			/>
			<span class="hint">Bijv: 1.5rem, 2rem, 3rem</span>
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
