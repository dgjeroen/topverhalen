<!-- src/lib/components/cms/editors/GeneralStyleEditor.svelte -->
<script lang="ts">
	import type { Theme } from '$lib/types';

	let { theme = $bindable(), onsave } = $props<{
		theme: Theme;
		onsave: () => Promise<void>;
	}>();

	const defaults = {
		'color-background-light': '#ffffff',
		'font-family-quote': "'acumin-pro-extra-condensed', sans-serif",
		'font-family-base': "'Inter', sans-serif"
	};

	// ✅ Ensure theme exists
	$effect(() => {
		if (!theme) theme = {};
	});

	// ✅ Gebruik lokale state met fallback
	let backgroundColor = $state(
		theme['color-background-light'] || defaults['color-background-light']
	);
	let fontQuote = $state(theme['font-family-quote'] || defaults['font-family-quote']);
	let fontBase = $state(theme['font-family-base'] || defaults['font-family-base']);

	// ✅ Sync changes terug naar theme
	function updateBackgroundColor(value: string) {
		backgroundColor = value;
		theme['color-background-light'] = value;
	}

	function updateFontQuote(value: string) {
		fontQuote = value;
		theme['font-family-quote'] = value;
	}

	function updateFontBase(value: string) {
		fontBase = value;
		theme['font-family-base'] = value;
	}
</script>

<div class="style-editor">
	<div class="editor-header">
		<h3>Algemene Instellingen</h3>
		<p class="editor-description">Pas de globale stijl van je verhaal aan</p>
	</div>

	<div class="controls">
		<!-- Body Achtergrond -->
		<div class="control-group">
			<label for="body-bg">Body Achtergrond</label>
			<div class="color-control">
				<input
					id="body-bg"
					type="color"
					value={backgroundColor}
					oninput={(e) => updateBackgroundColor(e.currentTarget.value)}
					onchange={onsave}
				/>
				<input
					type="text"
					class="color-value"
					value={backgroundColor}
					oninput={(e) => updateBackgroundColor(e.currentTarget.value)}
					onchange={onsave}
					placeholder={defaults['color-background-light']}
				/>
			</div>
		</div>

		<!-- Lettertype Koppen -->
		<div class="control-group">
			<label for="font-heading">Lettertype Koppen</label>
			<p class="control-hint">Gebruikt voor H2, H4 en TextFrame koppen</p>
			<select
				id="font-heading"
				value={fontQuote}
				onchange={(e) => {
					updateFontQuote(e.currentTarget.value);
					onsave();
				}}
			>
				<option value="'acumin-pro-extra-condensed', sans-serif">Acumin Pro (standaard)</option>
				<option value="'Inter', sans-serif">Inter</option>
				<option value="'Georgia', serif">Georgia</option>
				<option value="'Arial', sans-serif">Arial</option>
				<option value="'Courier New', monospace">Courier New</option>
			</select>
		</div>

		<!-- Lettertype Body -->
		<div class="control-group">
			<label for="font-body">Lettertype Body</label>
			<p class="control-hint">Gebruikt voor tekstblokken en quote auteur</p>
			<select
				id="font-body"
				value={fontBase}
				onchange={(e) => {
					updateFontBase(e.currentTarget.value);
					onsave();
				}}
			>
				<option value="'Inter', sans-serif">Inter (standaard)</option>
				<option value="'Georgia', serif">Georgia</option>
				<option value="'Arial', sans-serif">Arial</option>
				<option value="'Courier New', monospace">Courier New</option>
			</select>
		</div>
	</div>
</div>

<!-- Styles blijven hetzelfde -->

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

	.control-hint {
		font-size: 0.8125rem;
		color: #6b7280;
		margin: -0.25rem 0 0.5rem 0;
		font-style: italic;
		line-height: 1.4;
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

	.color-value {
		flex: 1;
		padding: 0.5rem 0.75rem;
		border: 1px solid #e5e7eb;
		border-radius: 6px;
		font-family: 'SF Mono', Monaco, monospace;
		font-size: 0.875rem;
		color: #374151;
	}

	.color-value:focus {
		outline: none;
		border-color: #667eea;
		box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
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

	select:hover {
		border-color: #d1d5db;
	}
</style>
