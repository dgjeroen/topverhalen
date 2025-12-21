<!--src\lib\components\cms\editors\TextFrameStyleEditor.svelte-->
<script lang="ts">
	import type { Theme } from '$lib/types';

	let { theme = $bindable(), onsave } = $props<{
		theme: Theme;
		onsave: () => Promise<void>;
	}>();

	$effect(() => {
		if (!theme) theme = {};

		// Set default colors if not explicitly set
		if (!theme['textframe-bg-color'] || theme['textframe-bg-color'] === '') {
			theme['textframe-bg-color'] = '#f7f7f7';
		}
		if (!theme['textframe-border-color'] || theme['textframe-border-color'] === '') {
			theme['textframe-border-color'] = '#E1DEE0';
		}
		if (!theme['textframe-heading-color'] || theme['textframe-heading-color'] === '') {
			theme['textframe-heading-color'] = '#000000';
		}
		if (!theme['textframe-text-color'] || theme['textframe-text-color'] === '') {
			theme['textframe-text-color'] = '#32302c';
		}
	});
</script>

<div class="style-editor">
	<!-- SECTIE: Frame Container -->
	<div class="section">
		<h3>Frame Container</h3>

		<div class="control-group">
			<label for="frame-bg">Achtergrondkleur</label>
			<div class="color-control">
				<input
					id="frame-bg"
					type="color"
					bind:value={theme['textframe-bg-color']}
					onchange={onsave}
				/>
				<input
					type="text"
					class="color-value"
					bind:value={theme['textframe-bg-color']}
					onchange={onsave}
					placeholder="#f7f7f7"
				/>
			</div>
		</div>

		<div class="control-group">
			<label for="frame-border">Randkleur</label>
			<div class="color-control">
				<input
					id="frame-border"
					type="color"
					bind:value={theme['textframe-border-color']}
					onchange={onsave}
				/>
				<input
					type="text"
					class="color-value"
					bind:value={theme['textframe-border-color']}
					onchange={onsave}
					placeholder="#E1DEE0"
				/>
			</div>
		</div>

		<div class="control-group">
			<label for="frame-radius">Border Radius</label>
			<input
				id="frame-radius"
				type="text"
				bind:value={theme['textframe-border-radius']}
				onchange={onsave}
				placeholder="8px"
				class="text-input"
			/>
			<span class="hint">Bijv: 8px, 12px, 1rem</span>
		</div>

		<div class="control-group">
			<label for="frame-padding">Padding</label>
			<input
				id="frame-padding"
				type="text"
				bind:value={theme['textframe-padding']}
				onchange={onsave}
				placeholder="2rem"
				class="text-input"
			/>
			<span class="hint">Bijv: 1.5rem, 2rem, 32px</span>
		</div>
	</div>

	<!-- SECTIE: Kop (H3) -->
	<div class="section">
		<h3>Kop (H3)</h3>

		<div class="control-group">
			<label for="frame-heading-color">Tekstkleur</label>
			<div class="color-control">
				<input
					id="frame-heading-color"
					type="color"
					bind:value={theme['textframe-heading-color']}
					onchange={onsave}
				/>
				<input
					type="text"
					class="color-value"
					bind:value={theme['textframe-heading-color']}
					onchange={onsave}
					placeholder="#000000"
				/>
			</div>
		</div>

		<div class="control-group">
			<label for="frame-heading-size">Lettergrootte</label>
			<input
				id="frame-heading-size"
				type="text"
				bind:value={theme['textframe-heading-size']}
				onchange={onsave}
				placeholder="1.875rem"
				class="text-input"
			/>
			<span class="hint">Bijv: 1.5rem, 1.875rem, 2rem</span>
		</div>

		<div class="control-group">
			<label for="frame-heading-weight">Letterdikte</label>
			<select
				id="frame-heading-weight"
				bind:value={theme['textframe-heading-weight']}
				onchange={onsave}
			>
				<option value="">Standaard (700)</option>
				<option value="500">Medium (500)</option>
				<option value="600">Semi-bold (600)</option>
				<option value="700">Bold (700)</option>
				<option value="800">Extra-bold (800)</option>
			</select>
		</div>
	</div>

	<!-- SECTIE: Tekst -->
	<div class="section">
		<h3>Tekst</h3>

		<div class="control-group">
			<label for="frame-text-color">Tekstkleur</label>
			<div class="color-control">
				<input
					id="frame-text-color"
					type="color"
					bind:value={theme['textframe-text-color']}
					onchange={onsave}
				/>
				<input
					type="text"
					class="color-value"
					bind:value={theme['textframe-text-color']}
					onchange={onsave}
					placeholder="#32302c"
				/>
			</div>
		</div>

		<div class="control-group">
			<label for="frame-line-height">Regelafstand</label>
			<input
				id="frame-line-height"
				type="text"
				bind:value={theme['textframe-line-height']}
				onchange={onsave}
				placeholder="1.7"
				class="text-input"
			/>
			<span class="hint">Bijv: 1.5, 1.7, 1.8</span>
		</div>

		<div class="control-group">
			<label for="frame-text-size">Lettergrootte</label>
			<input
				id="frame-text-size"
				type="text"
				bind:value={theme['textframe-text-size']}
				onchange={onsave}
				placeholder="1rem"
				class="text-input"
			/>
			<span class="hint">Bijv: 0.875rem, 1rem, 1.125rem</span>
		</div>
	</div>

	<!-- SECTIE: Caption (Bijschrift) & Afbeelding -->
	<div class="section">
		<h3>Caption & Afbeelding</h3>

		<div class="control-group">
			<label for="frame-caption-color">Caption Tekstkleur</label>
			<div class="color-control">
				<input
					id="frame-caption-color"
					type="color"
					bind:value={theme['textframe-caption-color']}
					onchange={onsave}
				/>
				<input
					type="text"
					class="color-value"
					bind:value={theme['textframe-caption-color']}
					onchange={onsave}
					placeholder="#6b7280"
				/>
			</div>
		</div>

		<div class="control-group">
			<label for="frame-caption-size">Caption Lettergrootte</label>
			<input
				id="frame-caption-size"
				type="text"
				bind:value={theme['textframe-caption-size']}
				onchange={onsave}
				placeholder="0.875rem"
				class="text-input"
			/>
			<span class="hint">Bijv: 0.75rem, 0.875rem, 1rem</span>
		</div>

		<div class="control-group">
			<label for="frame-img-radius">Afbeelding Border Radius</label>
			<input
				id="frame-img-radius"
				type="text"
				bind:value={theme['textframe-img-radius']}
				onchange={onsave}
				placeholder="6px"
				class="text-input"
			/>
			<span class="hint">Voor rechthoekige afbeeldingen</span>
		</div>

		<div class="control-group">
			<label for="frame-inline-img-width">Inline Afbeelding Breedte</label>
			<input
				id="frame-inline-img-width"
				type="text"
				bind:value={theme['textframe-inline-img-width']}
				onchange={onsave}
				placeholder="50%"
				class="text-input"
			/>
			<span class="hint">Bijv: 40%, 50%, 60%, 300px</span>
		</div>
	</div>

	<!-- SECTIE: Inklapbaar Toggle -->
	<div class="section">
		<h3>Inklapbaar Toggle</h3>

		<div class="control-group">
			<label for="toggle-size">Icoon grootte</label>
			<input
				id="toggle-size"
				type="text"
				bind:value={theme['textframe-toggle-size']}
				onchange={onsave}
				placeholder="1rem"
				class="text-input"
			/>
			<span class="hint">Bijv: 0.875rem, 1rem, 1.25rem</span>
		</div>

		<div class="control-group">
			<label for="toggle-color">Icoon kleur</label>
			<div class="color-control">
				<input
					id="toggle-color"
					type="color"
					bind:value={theme['textframe-toggle-color']}
					onchange={onsave}
				/>
				<input
					type="text"
					class="color-value"
					bind:value={theme['textframe-toggle-color']}
					onchange={onsave}
					placeholder="#d10a10"
				/>
			</div>
		</div>

		<div class="control-group">
			<label for="toggle-bg">Achtergrond (hover)</label>
			<div class="color-control">
				<input
					id="toggle-bg"
					type="color"
					bind:value={theme['textframe-toggle-hover-bg']}
					onchange={onsave}
				/>
				<input
					type="text"
					class="color-value"
					bind:value={theme['textframe-toggle-hover-bg']}
					onchange={onsave}
					placeholder="rgba(0,0,0,0.02)"
				/>
			</div>
			<span class="hint">Zeer lichte tint aanbevolen (bijv: rgba(209, 10, 16, 0.05))</span>
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
