<!-- src/lib/components/cms/editors/ImageStyleEditor.svelte -->
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
		<h3>Afbeelding Styling</h3>
		<p class="editor-description">
			Pas de stijl aan van alle afbeeldingen (standaard, parallax, grid, slider)
		</p>
	</div>

	<div class="controls">
		<!-- SECTIE: Afbeelding -->
		<div class="section-header">Afbeelding</div>

		<div class="control-group">
			<label for="image-radius">Afronding Hoeken</label>
			<input
				id="image-radius"
				type="text"
				bind:value={theme['image-border-radius']}
				onchange={onsave}
				placeholder="8px"
				class="text-input"
			/>
			<span class="hint">Bijv: 8px, 1rem, 0 (geen), 50% (rond)</span>
		</div>

		<div class="control-group">
			<label for="image-shadow">Schaduw</label>
			<input
				id="image-shadow"
				type="text"
				bind:value={theme['image-box-shadow']}
				onchange={onsave}
				placeholder="none"
				class="text-input"
			/>
			<span class="hint">Bijv: 0 4px 6px rgba(0,0,0,0.1) of none</span>
		</div>

		<!-- SECTIE: Hover Effect -->
		<div class="section-header">Hover Effect</div>

		<div class="control-group">
			<label for="hover-transform">Transform</label>
			<select id="hover-transform" bind:value={theme['image-hover-transform']} onchange={onsave}>
				<option value="">Standaard (omhoog)</option>
				<option value="translateY(-2px)">Omhoog (subtiel)</option>
				<option value="translateY(-4px)">Omhoog (meer)</option>
				<option value="scale(1.02)">Zoom (subtiel)</option>
				<option value="scale(1.05)">Zoom (meer)</option>
				<option value="none">Geen effect</option>
			</select>
		</div>

		<div class="control-group">
			<label for="hover-shadow">Hover Schaduw</label>
			<input
				id="hover-shadow"
				type="text"
				bind:value={theme['image-hover-shadow']}
				onchange={onsave}
				placeholder="0 4px 12px rgba(0,0,0,0.15)"
				class="text-input"
			/>
			<span class="hint">Bijv: 0 8px 16px rgba(0,0,0,0.2)</span>
		</div>

		<!-- SECTIE: Bijschrift -->
		<div class="section-header">Bijschrift</div>

		<div class="control-group">
			<label for="caption-color">Tekstkleur</label>
			<div class="color-control">
				<input
					id="caption-color"
					type="color"
					bind:value={theme['image-caption-color']}
					onchange={onsave}
				/>
				<input
					type="text"
					class="color-value"
					bind:value={theme['image-caption-color']}
					onchange={onsave}
					placeholder="Gebruik standaard"
				/>
			</div>
		</div>

		<div class="control-group">
			<label for="caption-size">Lettergrootte</label>
			<input
				id="caption-size"
				type="text"
				bind:value={theme['image-caption-font-size']}
				onchange={onsave}
				placeholder="0.9rem"
				class="text-input"
			/>
			<span class="hint">Bijv: 0.9rem, 14px</span>
		</div>

		<div class="control-group">
			<label for="caption-weight">Letterdikte</label>
			<select id="caption-weight" bind:value={theme['image-caption-font-weight']} onchange={onsave}>
				<option value="">Standaard (400)</option>
				<option value="300">Light (300)</option>
				<option value="400">Normal (400)</option>
				<option value="500">Medium (500)</option>
				<option value="600">Semi-bold (600)</option>
				<option value="700">Bold (700)</option>
			</select>
		</div>

		<div class="control-group">
			<label for="caption-align">Uitlijning</label>
			<select id="caption-align" bind:value={theme['image-caption-align']} onchange={onsave}>
				<option value="">Standaard (links)</option>
				<option value="left">Links</option>
				<option value="center">Midden</option>
				<option value="right">Rechts</option>
			</select>
		</div>

		<div class="control-group">
			<label for="caption-spacing">Afstand tot Afbeelding</label>
			<input
				id="caption-spacing"
				type="text"
				bind:value={theme['image-caption-spacing']}
				onchange={onsave}
				placeholder="0.5rem"
				class="text-input"
			/>
			<span class="hint">Bijv: 0.5rem, 8px, 1rem</span>
		</div>

		<!-- SECTIE: Bron -->
		<div class="section-header">Bron</div>

		<div class="control-group">
			<label for="source-color">Tekstkleur</label>
			<div class="color-control">
				<input
					id="source-color"
					type="color"
					bind:value={theme['image-source-color']}
					onchange={onsave}
				/>
				<input
					type="text"
					class="color-value"
					bind:value={theme['image-source-color']}
					onchange={onsave}
					placeholder="Gebruik muted color"
				/>
			</div>
		</div>

		<div class="control-group">
			<label for="source-size">Lettergrootte</label>
			<input
				id="source-size"
				type="text"
				bind:value={theme['image-source-font-size']}
				onchange={onsave}
				placeholder="0.8rem"
				class="text-input"
			/>
			<span class="hint">Bijv: 0.8rem, 12px</span>
		</div>

		<div class="control-group">
			<label for="source-style">Stijl</label>
			<select id="source-style" bind:value={theme['image-source-font-style']} onchange={onsave}>
				<option value="">Standaard (italic)</option>
				<option value="normal">Normaal</option>
				<option value="italic">Cursief</option>
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
