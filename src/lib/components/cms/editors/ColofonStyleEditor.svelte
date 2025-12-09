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
	<!-- SECTIE: Container -->
	<div class="section">
		<h3>Container</h3>

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
	</div>

	<!-- SECTIE: Functie (dt) -->
	<div class="section">
		<h3>Functie (Links)</h3>

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
				<option value="right">Rechts</option>
			</select>
		</div>
	</div>

	<!-- SECTIE: Namen (dd) -->
	<div class="section">
		<h3>Namen (Rechts)</h3>

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
	</div>

	<!-- SECTIE: Layout -->
	<div class="section">
		<h3>Layout</h3>

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

	label {
		display: block;
		font-size: 0.8125rem;
		font-weight: 600;
		color: #4b5563;
		margin-bottom: 0.375rem;
	}

	.color-control {
		display: flex;
		gap: 0.5rem;
		align-items: center;
	}

	input[type='color'] {
		width: 40px;
		height: 38px;
		border: 1px solid #d1d5db;
		border-radius: 4px;
		cursor: pointer;
		padding: 0;
		background: none;
		flex-shrink: 0;
	}

	.color-value,
	.text-input {
		width: 100%;
		padding: 0.5rem;
		border: 1px solid #d1d5db;
		border-radius: 4px;
		font-size: 0.875rem;
		background: white;
		box-sizing: border-box;
		color: #374151;
	}

	.color-value {
		font-family: 'SF Mono', Monaco, monospace;
		flex: 1;
	}

	.text-input:focus,
	.color-value:focus {
		outline: none;
		border-color: #d10a10;
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
</style>
