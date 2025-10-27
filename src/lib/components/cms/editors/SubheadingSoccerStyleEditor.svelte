<!-- src/lib/components/cms/editors/SubheadingSoccerStyleEditor.svelte -->
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
		<h3>Tussenkop Voetbal ⚽</h3>
		<p class="editor-description">Pas de stijl aan van tussenkoppen met rollende bal animatie</p>
	</div>

	<div class="controls">
		<!-- SECTIE: Balkje -->
		<div class="section-header">Balkje Styling</div>

		<div class="control-group">
			<label for="soccer-bg">Achtergrondkleur</label>
			<div class="color-control">
				<input
					id="soccer-bg"
					type="color"
					bind:value={theme['subheading-soccer-bg']}
					onchange={onsave}
				/>
				<input
					type="text"
					class="color-value"
					bind:value={theme['subheading-soccer-bg']}
					onchange={onsave}
					placeholder="linear-gradient(to right, #0b1320 100%, transparent)"
				/>
			</div>
			<span class="hint">
				Tip: Gebruik gradient voor fade-out effect, bijv: linear-gradient(to right, #000 80%,
				transparent)
			</span>
		</div>

		<div class="control-group">
			<label for="soccer-color">Tekstkleur</label>
			<div class="color-control">
				<input
					id="soccer-color"
					type="color"
					bind:value={theme['subheading-soccer-color']}
					onchange={onsave}
				/>
				<input
					type="text"
					class="color-value"
					bind:value={theme['subheading-soccer-color']}
					onchange={onsave}
					placeholder="#ffffff"
				/>
			</div>
		</div>

		<div class="control-group">
			<label for="soccer-padding">Padding</label>
			<input
				id="soccer-padding"
				type="text"
				bind:value={theme['subheading-soccer-padding']}
				onchange={onsave}
				placeholder="0 8px"
				class="text-input"
			/>
			<span class="hint">Bijv: 0 8px, 4px 12px</span>
		</div>

		<div class="control-group">
			<label for="soccer-radius">Afronding Hoeken</label>
			<input
				id="soccer-radius"
				type="text"
				bind:value={theme['subheading-soccer-border-radius']}
				onchange={onsave}
				placeholder="0"
				class="text-input"
			/>
			<span class="hint">Bijv: 0, 4px, 8px</span>
		</div>

		<!-- SECTIE: Typografie -->
		<div class="section-header">Typografie</div>

		<div class="control-group">
			<label for="soccer-font-size">Lettergrootte</label>
			<input
				id="soccer-font-size"
				type="text"
				bind:value={theme['subheading-soccer-font-size']}
				onchange={onsave}
				placeholder="22px"
				class="text-input"
			/>
			<span class="hint">Bijv: 22px, 1.5rem</span>
		</div>

		<div class="control-group">
			<label for="soccer-font-weight">Letterdikte</label>
			<select
				id="soccer-font-weight"
				bind:value={theme['subheading-soccer-font-weight']}
				onchange={onsave}
			>
				<option value="">Standaard (800)</option>
				<option value="600">Semi-bold (600)</option>
				<option value="700">Bold (700)</option>
				<option value="800">Extra-bold (800)</option>
				<option value="900">Black (900)</option>
			</select>
		</div>

		<!-- SECTIE: Bal Animatie -->
		<div class="section-header">Bal Animatie ⚽</div>

		<div class="control-group">
			<label for="ball-size">Bal Grootte</label>
			<input
				id="ball-size"
				type="text"
				bind:value={theme['subheading-soccer-ball-size']}
				onchange={onsave}
				placeholder="30px"
				class="text-input"
			/>
			<span class="hint">Bijv: 30px, 2rem, 40px</span>
		</div>

		<div class="control-group">
			<label for="container-height">Balkje Hoogte</label>
			<input
				id="container-height"
				type="text"
				bind:value={theme['subheading-soccer-height']}
				onchange={onsave}
				placeholder="30px"
				class="text-input"
			/>
			<span class="hint">Moet minimaal gelijk zijn aan bal grootte</span>
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
