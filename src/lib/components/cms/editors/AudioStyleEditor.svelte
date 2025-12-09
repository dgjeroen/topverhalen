<!-- src/lib/components/cms/editors/AudioStyleEditor.svelte -->
<script lang="ts">
	import type { Theme } from '$lib/types';

	let { theme = $bindable(), onsave } = $props<{
		theme: Theme;
		onsave: () => Promise<void>;
	}>();

	$effect(() => {
		if (!theme) theme = {};

		// Initialize with defaults if not set
		if (!theme['audio-bg-color']) theme['audio-bg-color'] = '#EDEAEC';
		if (!theme['audio-title-color']) theme['audio-title-color'] = '#000000';
		if (!theme['audio-description-color']) theme['audio-description-color'] = '#32302c';
		if (!theme['audio-button-border-color']) theme['audio-button-border-color'] = '#6E757C';
		if (!theme['audio-button-hover-bg']) theme['audio-button-hover-bg'] = '#E1DEE0';
		if (!theme['audio-button-icon-color']) theme['audio-button-icon-color'] = '#6E757C';
		if (!theme['audio-progress-bg']) theme['audio-progress-bg'] = '#6E757C';
		if (!theme['audio-progress-fill-color']) theme['audio-progress-fill-color'] = '#D10A10';
		if (!theme['audio-time-color']) theme['audio-time-color'] = '#000000';
	});
</script>

<div class="style-editor">
	<!-- SECTIE: Container -->
	<div class="section">
		<h3>Container</h3>

		<div class="control-group">
			<label for="audio-bg">Achtergrondkleur</label>
			<div class="color-control">
				<input id="audio-bg" type="color" bind:value={theme['audio-bg-color']} onchange={onsave} />
				<input
					type="text"
					class="color-value"
					bind:value={theme['audio-bg-color']}
					onchange={onsave}
					placeholder="#EDEAEC"
				/>
			</div>
		</div>

		<div class="control-group">
			<label for="audio-border-radius">Border Radius</label>
			<input
				id="audio-border-radius"
				type="text"
				bind:value={theme['audio-border-radius']}
				onchange={onsave}
				placeholder="8px"
				class="text-input"
			/>
			<span class="hint">Bijv: 6px, 8px, 12px</span>
		</div>

		<div class="control-group">
			<label for="audio-padding">Padding</label>
			<input
				id="audio-padding"
				type="text"
				bind:value={theme['audio-padding']}
				onchange={onsave}
				placeholder="1.5rem"
				class="text-input"
			/>
			<span class="hint">Bijv: 1rem, 1.5rem, 2rem</span>
		</div>

		<div class="control-group">
			<label for="audio-gap">Ruimte tussen afbeelding en content</label>
			<input
				id="audio-gap"
				type="text"
				bind:value={theme['audio-gap']}
				onchange={onsave}
				placeholder="1.5rem"
				class="text-input"
			/>
			<span class="hint">Bijv: 1rem, 1.5rem, 2rem</span>
		</div>
	</div>

	<!-- SECTIE: Afbeelding -->
	<div class="section">
		<h3>Afbeelding</h3>

		<div class="control-group">
			<label for="audio-image-size">Afbeelding grootte</label>
			<input
				id="audio-image-size"
				type="text"
				bind:value={theme['audio-image-size']}
				onchange={onsave}
				placeholder="80px"
				class="text-input"
			/>
			<span class="hint">Bijv: 60px, 80px, 100px</span>
		</div>

		<div class="control-group">
			<label for="audio-image-radius">Afbeelding border radius</label>
			<input
				id="audio-image-radius"
				type="text"
				bind:value={theme['audio-image-border-radius']}
				onchange={onsave}
				placeholder="6px"
				class="text-input"
			/>
			<span class="hint">Bijv: 4px, 6px, 50% (rond)</span>
		</div>
	</div>

	<!-- SECTIE: Titel & Beschrijving -->
	<div class="section">
		<h3>Titel & Beschrijving</h3>

		<div class="control-group">
			<label for="audio-title-color">Titel kleur</label>
			<div class="color-control">
				<input
					id="audio-title-color"
					type="color"
					bind:value={theme['audio-title-color']}
					onchange={onsave}
				/>
				<input
					type="text"
					class="color-value"
					bind:value={theme['audio-title-color']}
					onchange={onsave}
					placeholder="#000000"
				/>
			</div>
		</div>

		<div class="control-group">
			<label for="audio-title-size">Titel grootte</label>
			<input
				id="audio-title-size"
				type="text"
				bind:value={theme['audio-title-size']}
				onchange={onsave}
				placeholder="1.1rem"
				class="text-input"
			/>
			<span class="hint">Bijv: 1rem, 1.1rem, 1.25rem</span>
		</div>

		<div class="control-group">
			<label for="audio-title-weight">Titel dikte</label>
			<select id="audio-title-weight" bind:value={theme['audio-title-weight']} onchange={onsave}>
				<option value="">Standaard (600)</option>
				<option value="400">Normal (400)</option>
				<option value="500">Medium (500)</option>
				<option value="600">Semi-bold (600)</option>
				<option value="700">Bold (700)</option>
			</select>
		</div>

		<div class="control-group">
			<label for="audio-desc-color">Beschrijving kleur</label>
			<div class="color-control">
				<input
					id="audio-desc-color"
					type="color"
					bind:value={theme['audio-description-color']}
					onchange={onsave}
				/>
				<input
					type="text"
					class="color-value"
					bind:value={theme['audio-description-color']}
					onchange={onsave}
					placeholder="#32302c"
				/>
			</div>
		</div>

		<div class="control-group">
			<label for="audio-desc-size">Beschrijving grootte</label>
			<input
				id="audio-desc-size"
				type="text"
				bind:value={theme['audio-description-size']}
				onchange={onsave}
				placeholder="0.9rem"
				class="text-input"
			/>
			<span class="hint">Bijv: 0.8rem, 0.9rem, 1rem</span>
		</div>
	</div>

	<!-- SECTIE: Play Button -->
	<div class="section">
		<h3>Play Button</h3>

		<div class="control-group">
			<label for="audio-btn-size">Button grootte</label>
			<input
				id="audio-btn-size"
				type="text"
				bind:value={theme['audio-button-size']}
				onchange={onsave}
				placeholder="40px"
				class="text-input"
			/>
			<span class="hint">Bijv: 36px, 40px, 48px</span>
		</div>

		<div class="control-group">
			<label for="audio-btn-border">Button rand kleur</label>
			<div class="color-control">
				<input
					id="audio-btn-border"
					type="color"
					bind:value={theme['audio-button-border-color']}
					onchange={onsave}
				/>
				<input
					type="text"
					class="color-value"
					bind:value={theme['audio-button-border-color']}
					onchange={onsave}
					placeholder="#6E757C"
				/>
			</div>
		</div>

		<div class="control-group">
			<label for="audio-btn-hover">Button hover achtergrond</label>
			<div class="color-control">
				<input
					id="audio-btn-hover"
					type="color"
					bind:value={theme['audio-button-hover-bg']}
					onchange={onsave}
				/>
				<input
					type="text"
					class="color-value"
					bind:value={theme['audio-button-hover-bg']}
					onchange={onsave}
					placeholder="#E1DEE0"
				/>
			</div>
		</div>

		<div class="control-group">
			<label for="audio-btn-icon">Icoon kleur</label>
			<div class="color-control">
				<input
					id="audio-btn-icon"
					type="color"
					bind:value={theme['audio-button-icon-color']}
					onchange={onsave}
				/>
				<input
					type="text"
					class="color-value"
					bind:value={theme['audio-button-icon-color']}
					onchange={onsave}
					placeholder="#6E757C"
				/>
			</div>
		</div>
	</div>

	<!-- SECTIE: Progress Bar -->
	<div class="section">
		<h3>Progress Bar</h3>

		<div class="control-group">
			<label for="audio-progress-height">Hoogte</label>
			<input
				id="audio-progress-height"
				type="text"
				bind:value={theme['audio-progress-height']}
				onchange={onsave}
				placeholder="3px"
				class="text-input"
			/>
			<span class="hint">Bijv: 3px, 4px, 6px</span>
		</div>

		<div class="control-group">
			<label for="audio-progress-bg">Achtergrond kleur</label>
			<div class="color-control">
				<input
					id="audio-progress-bg"
					type="color"
					bind:value={theme['audio-progress-bg']}
					onchange={onsave}
				/>
				<input
					type="text"
					class="color-value"
					bind:value={theme['audio-progress-bg']}
					onchange={onsave}
					placeholder="#6E757C"
				/>
			</div>
		</div>

		<div class="control-group">
			<label for="audio-progress-fill">Vulkleur (accent)</label>
			<div class="color-control">
				<input
					id="audio-progress-fill"
					type="color"
					bind:value={theme['audio-progress-fill-color']}
					onchange={onsave}
				/>
				<input
					type="text"
					class="color-value"
					bind:value={theme['audio-progress-fill-color']}
					onchange={onsave}
					placeholder="#D10A10"
				/>
			</div>
		</div>

		<div class="control-group">
			<label for="audio-progress-radius">Border radius</label>
			<input
				id="audio-progress-radius"
				type="text"
				bind:value={theme['audio-progress-border-radius']}
				onchange={onsave}
				placeholder="0"
				class="text-input"
			/>
			<span class="hint">Bijv: 0, 2px, 3px</span>
		</div>
	</div>

	<!-- SECTIE: Tijd Display -->
	<div class="section">
		<h3>Tijd Display</h3>

		<div class="control-group">
			<label for="audio-time-color">Tekstkleur</label>
			<div class="color-control">
				<input
					id="audio-time-color"
					type="color"
					bind:value={theme['audio-time-color']}
					onchange={onsave}
				/>
				<input
					type="text"
					class="color-value"
					bind:value={theme['audio-time-color']}
					onchange={onsave}
					placeholder="#000000"
				/>
			</div>
		</div>

		<div class="control-group">
			<label for="audio-time-size">Lettergrootte</label>
			<input
				id="audio-time-size"
				type="text"
				bind:value={theme['audio-time-size']}
				onchange={onsave}
				placeholder="0.8rem"
				class="text-input"
			/>
			<span class="hint">Bijv: 0.75rem, 0.8rem, 0.875rem</span>
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
