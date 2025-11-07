<!--src\lib\components\cms\editors\TextFrameStyleEditor.svelte-->
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
		<h3>Tekstkader Styling</h3>
		<p class="editor-description">Pas de stijl van tekstkader blokken aan</p>
	</div>

	<div class="controls">
		<!-- SECTIE: Frame Container -->
		<div class="section-header">Frame Container</div>

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
					placeholder="#f9fafb"
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
					placeholder="#e5e7eb"
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

		<!-- SECTIE: Kop (H3) -->
		<div class="section-header">Kop (H3)</div>

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
					placeholder="#111827"
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

		<!-- SECTIE: Tekst -->
		<div class="section-header">Tekst</div>

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
					placeholder="#374151"
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

		<!-- SECTIE: Caption -->
		<div class="section-header">Caption (Bijschrift)</div>

		<div class="control-group">
			<label for="frame-caption-color">Tekstkleur</label>
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
			<label for="frame-caption-size">Lettergrootte</label>
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

		<!-- SECTIE: Afbeelding -->
		<div class="section-header">Afbeelding</div>

		<div class="control-group">
			<label for="frame-img-radius">Border Radius (normaal)</label>
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
		<!-- SECTIE: Inklapbaar Toggle -->
		<div class="section-header">Inklapbaar Toggle</div>

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
