<!-- src/lib/components/cms/editors/SliderStyleEditor.svelte -->
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
		<h3>Slider Styling</h3>
		<p class="editor-description">Pas de stijl van fotosliders aan</p>
	</div>

	<div class="controls">
		<!-- SECTIE: Navigatie Knoppen -->
		<div class="section-header">Navigatie Knoppen (‹ ›)</div>

		<div class="control-group">
			<label for="btn-bg">Achtergrondkleur</label>
			<div class="color-control">
				<input id="btn-bg" type="color" bind:value={theme['slider-btn-bg']} onchange={onsave} />
				<input
					type="text"
					class="color-value"
					bind:value={theme['slider-btn-bg']}
					onchange={onsave}
					placeholder="rgba(255,255,255,0.5)"
				/>
			</div>
		</div>

		<div class="control-group">
			<label for="btn-hover-bg">Hover Achtergrond</label>
			<div class="color-control">
				<input
					id="btn-hover-bg"
					type="color"
					bind:value={theme['slider-btn-hover-bg']}
					onchange={onsave}
				/>
				<input
					type="text"
					class="color-value"
					bind:value={theme['slider-btn-hover-bg']}
					onchange={onsave}
					placeholder="rgba(255,255,255,0.7)"
				/>
			</div>
		</div>

		<div class="control-group">
			<label for="btn-color">Icoon Kleur</label>
			<div class="color-control">
				<input
					id="btn-color"
					type="color"
					bind:value={theme['slider-btn-color']}
					onchange={onsave}
				/>
				<input
					type="text"
					class="color-value"
					bind:value={theme['slider-btn-color']}
					onchange={onsave}
					placeholder="Gebruik standaard"
				/>
			</div>
		</div>

		<div class="control-group">
			<label for="btn-size">Knop Grootte</label>
			<input
				id="btn-size"
				type="text"
				bind:value={theme['slider-btn-size']}
				onchange={onsave}
				placeholder="40px"
				class="text-input"
			/>
			<span class="hint">Bijv: 40px, 3rem</span>
		</div>

		<!-- SECTIE: Dots Navigatie Container -->
		<div class="section-header">Dots Container</div>

		<div class="control-group">
			<label for="dots-bg">Achtergrondkleur</label>
			<div class="color-control">
				<input id="dots-bg" type="color" bind:value={theme['slider-dots-bg']} onchange={onsave} />
				<input
					type="text"
					class="color-value"
					bind:value={theme['slider-dots-bg']}
					onchange={onsave}
					placeholder="rgba(255,255,255,0.5)"
				/>
			</div>
		</div>

		<div class="control-group">
			<label for="dots-radius">Afronding</label>
			<input
				id="dots-radius"
				type="text"
				bind:value={theme['slider-dots-border-radius']}
				onchange={onsave}
				placeholder="12px"
				class="text-input"
			/>
			<span class="hint">Bijv: 12px, 1rem, 50px (pill)</span>
		</div>

		<div class="control-group">
			<label for="dots-padding">Padding</label>
			<input
				id="dots-padding"
				type="text"
				bind:value={theme['slider-dots-padding']}
				onchange={onsave}
				placeholder="4px 8px"
				class="text-input"
			/>
			<span class="hint">Bijv: 4px 8px, 0.5rem 1rem</span>
		</div>

		<div class="control-group">
			<label for="dots-gap">Afstand tussen Dots</label>
			<input
				id="dots-gap"
				type="text"
				bind:value={theme['slider-dots-gap']}
				onchange={onsave}
				placeholder="8px"
				class="text-input"
			/>
			<span class="hint">Bijv: 8px, 0.5rem</span>
		</div>

		<!-- SECTIE: Individuele Dots -->
		<div class="section-header">Dots (Inactief)</div>

		<div class="control-group">
			<label for="dot-size">Grootte</label>
			<input
				id="dot-size"
				type="text"
				bind:value={theme['slider-dot-size']}
				onchange={onsave}
				placeholder="16px"
				class="text-input"
			/>
			<span class="hint">Bijv: 16px, 1rem</span>
		</div>

		<div class="control-group">
			<label for="dot-bg">Achtergrondkleur</label>
			<div class="color-control">
				<input id="dot-bg" type="color" bind:value={theme['slider-dot-bg']} onchange={onsave} />
				<input
					type="text"
					class="color-value"
					bind:value={theme['slider-dot-bg']}
					onchange={onsave}
					placeholder="transparent"
				/>
			</div>
		</div>

		<div class="control-group">
			<label for="dot-border-color">Rand Kleur</label>
			<div class="color-control">
				<input
					id="dot-border-color"
					type="color"
					bind:value={theme['slider-dot-border-color']}
					onchange={onsave}
				/>
				<input
					type="text"
					class="color-value"
					bind:value={theme['slider-dot-border-color']}
					onchange={onsave}
					placeholder="Gebruik standaard"
				/>
			</div>
		</div>

		<div class="control-group">
			<label for="dot-border-width">Rand Dikte</label>
			<input
				id="dot-border-width"
				type="text"
				bind:value={theme['slider-dot-border-width']}
				onchange={onsave}
				placeholder="1px"
				class="text-input"
			/>
			<span class="hint">Bijv: 1px, 2px</span>
		</div>

		<!-- SECTIE: Actieve Dot -->
		<div class="section-header">Dots (Actief)</div>

		<div class="control-group">
			<label for="dot-active-bg">Achtergrondkleur</label>
			<div class="color-control">
				<input
					id="dot-active-bg"
					type="color"
					bind:value={theme['slider-dot-active-bg']}
					onchange={onsave}
				/>
				<input
					type="text"
					class="color-value"
					bind:value={theme['slider-dot-active-bg']}
					onchange={onsave}
					placeholder="#ffd302"
				/>
			</div>
		</div>

		<div class="control-group">
			<label for="dot-active-border-color">Rand Kleur</label>
			<div class="color-control">
				<input
					id="dot-active-border-color"
					type="color"
					bind:value={theme['slider-dot-active-border-color']}
					onchange={onsave}
				/>
				<input
					type="text"
					class="color-value"
					bind:value={theme['slider-dot-active-border-color']}
					onchange={onsave}
					placeholder="#000000"
				/>
			</div>
		</div>

		<div class="control-group">
			<label for="dot-active-border-width">Rand Dikte</label>
			<input
				id="dot-active-border-width"
				type="text"
				bind:value={theme['slider-dot-active-border-width']}
				onchange={onsave}
				placeholder="0.5px"
				class="text-input"
			/>
			<span class="hint">Bijv: 0.5px, 1px, 2px</span>
		</div>
	</div>
</div>

<style>
	/* Same styles as other editors */
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
</style>
