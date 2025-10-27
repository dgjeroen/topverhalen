<!-- src/lib/components/cms/editors/TextStyleEditor.svelte -->
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
		<h3>Tekst Styling</h3>
		<p class="editor-description">Pas de stijl van tekstblokken aan (ondersteunt Markdown)</p>
	</div>

	<div class="controls">
		<!-- SECTIE: Normale Tekst -->
		<div class="section-header">Normale Tekst</div>

		<div class="control-group">
			<label for="text-color">Tekstkleur</label>
			<div class="color-control">
				<input id="text-color" type="color" bind:value={theme['text-color']} onchange={onsave} />
				<input
					type="text"
					class="color-value"
					bind:value={theme['text-color']}
					onchange={onsave}
					placeholder="Gebruik standaard"
				/>
			</div>
		</div>

		<div class="control-group">
			<label for="text-size">Lettergrootte</label>
			<input
				id="text-size"
				type="text"
				bind:value={theme['text-font-size']}
				onchange={onsave}
				placeholder="1rem"
				class="text-input"
			/>
			<span class="hint">Bijv: 1rem, 16px, 1.125em</span>
		</div>

		<div class="control-group">
			<label for="text-weight">Letterdikte</label>
			<select id="text-weight" bind:value={theme['text-font-weight']} onchange={onsave}>
				<option value="">Standaard (400)</option>
				<option value="300">Light (300)</option>
				<option value="400">Normal (400)</option>
				<option value="500">Medium (500)</option>
				<option value="600">Semi-bold (600)</option>
			</select>
		</div>

		<div class="control-group">
			<label for="line-height">Regelafstand</label>
			<input
				id="line-height"
				type="text"
				bind:value={theme['text-line-height']}
				onchange={onsave}
				placeholder="1.6"
				class="text-input"
			/>
			<span class="hint">Bijv: 1.5, 1.6, 1.75</span>
		</div>

		<!-- SECTIE: Inleiding (Lead) -->
		<div class="section-header">Inleiding (Lead Tekst)</div>

		<div class="control-group">
			<label for="lead-size">Lettergrootte</label>
			<input
				id="lead-size"
				type="text"
				bind:value={theme['text-lead-font-size']}
				onchange={onsave}
				placeholder="1.2rem"
				class="text-input"
			/>
			<span class="hint">Groter dan normale tekst</span>
		</div>

		<div class="control-group">
			<label for="lead-weight">Letterdikte</label>
			<select id="lead-weight" bind:value={theme['text-lead-font-weight']} onchange={onsave}>
				<option value="">Standaard (500)</option>
				<option value="400">Normal (400)</option>
				<option value="500">Medium (500)</option>
				<option value="600">Semi-bold (600)</option>
				<option value="700">Bold (700)</option>
			</select>
		</div>

		<div class="control-group">
			<label for="lead-color">Tekstkleur</label>
			<div class="color-control">
				<input
					id="lead-color"
					type="color"
					bind:value={theme['text-lead-color']}
					onchange={onsave}
				/>
				<input
					type="text"
					class="color-value"
					bind:value={theme['text-lead-color']}
					onchange={onsave}
					placeholder="Gebruik standaard"
				/>
			</div>
		</div>

		<!-- SECTIE: Markdown Elementen -->
		<div class="section-header">Markdown Elementen</div>

		<div class="control-group">
			<label for="bold-weight">Vetgedrukt (**tekst**)</label>
			<select id="bold-weight" bind:value={theme['text-bold-weight']} onchange={onsave}>
				<option value="">Standaard (700)</option>
				<option value="600">Semi-bold (600)</option>
				<option value="700">Bold (700)</option>
				<option value="800">Extra-bold (800)</option>
			</select>
		</div>

		<div class="control-group">
			<label for="link-color">Link Kleur ([tekst](url))</label>
			<div class="color-control">
				<input
					id="link-color"
					type="color"
					bind:value={theme['text-link-color']}
					onchange={onsave}
				/>
				<input
					type="text"
					class="color-value"
					bind:value={theme['text-link-color']}
					onchange={onsave}
					placeholder="Gebruik accent kleur"
				/>
			</div>
		</div>

		<div class="control-group">
			<label for="link-decoration">Link Decoratie</label>
			<select id="link-decoration" bind:value={theme['text-link-decoration']} onchange={onsave}>
				<option value="">Standaard (underline)</option>
				<option value="underline">Onderstreept</option>
				<option value="none">Geen onderstreping</option>
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
