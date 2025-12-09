<!-- src/lib/components/cms/editors/SubheadingSoccerStyleEditor.svelte -->
<script lang="ts">
	import type { Theme } from '$lib/types';

	let { theme = $bindable(), onsave } = $props<{
		theme: Theme;
		onsave: () => Promise<void>;
	}>();

	$effect(() => {
		if (!theme) theme = {};
		// Always ensure white is the default color if not explicitly set
		if (!theme['subheading-soccer-color'] || theme['subheading-soccer-color'] === '') {
			theme['subheading-soccer-color'] = '#ffffff';
		}
	});
</script>

<div class="style-editor">
	<!-- SECTIE: Balkje Styling -->
	<div class="section">
		<h3>Balkje Styling</h3>

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
					placeholder="#000000"
				/>
			</div>
			<span class="hint">
				Standaard: #000000. Je kunt ook een gradient gebruiken voor fade-out effect.
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
					placeholder="Standaard wit (#ffffff)"
				/>
			</div>
			<span class="hint">Standaardwaarde: wit (#ffffff)</span>
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
	</div>

	<!-- SECTIE: Typografie -->
	<div class="section">
		<h3>Typografie</h3>

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
	</div>

	<!-- SECTIE: Bal Animatie -->
	<div class="section">
		<h3>Bal Animatie ⚽</h3>

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

		<div class="control-group">
			<label for="soccer-margin-bottom">Witruimte onder</label>
			<input
				id="soccer-margin-bottom"
				type="text"
				bind:value={theme['subheading-soccer-margin-bottom']}
				onchange={onsave}
				placeholder="1.5rem"
				class="text-input"
			/>
			<span class="hint">Bijv: 1rem, 1.5rem, 2rem, 24px</span>
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
