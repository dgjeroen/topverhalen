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

	// ✅ Lokale state met fallback
	let backgroundColor = $state(
		theme['color-background-light'] || defaults['color-background-light']
	);
	let fontQuote = $state(theme['font-family-quote'] || defaults['font-family-quote']);
	let fontBase = $state(theme['font-family-base'] || defaults['font-family-base']);

	// ✅ NIEUW: Achtergrond state
	let backgroundImage = $state(theme['background-image'] || '');
	let backgroundRepeat = $state(theme['background-repeat'] || 'repeat');
	let backgroundPosition = $state(theme['background-position'] || 'center');
	let backgroundSize = $state(theme['background-size'] || 'auto');
	let backgroundOpacity = $state(theme['background-opacity'] ?? 100);
	let backgroundAttachment = $state(theme['background-attachment'] || 'scroll');

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

	// ✅ NIEUW: Achtergrond updates
	function updateBackgroundImage(value: string) {
		backgroundImage = value;
		theme['background-image'] = value || undefined;
	}

	function updateBackgroundRepeat(value: string) {
		backgroundRepeat = value as any;
		theme['background-repeat'] = value as any;
	}

	function updateBackgroundPosition(value: string) {
		backgroundPosition = value;
		theme['background-position'] = value;
	}

	function updateBackgroundSize(value: string) {
		backgroundSize = value as any;
		theme['background-size'] = value as any;
	}

	function updateBackgroundOpacity(value: number) {
		backgroundOpacity = value;
		theme['background-opacity'] = value;
	}

	function updateBackgroundAttachment(value: string) {
		backgroundAttachment = value as any;
		theme['background-attachment'] = value as any;
	}

	function removeBackground() {
		backgroundImage = '';
		theme['background-image'] = undefined;
		theme['background-repeat'] = undefined;
		theme['background-position'] = undefined;
		theme['background-size'] = undefined;
		theme['background-opacity'] = undefined;
		theme['background-attachment'] = undefined;
		onsave();
	}
</script>

<div class="style-editor">
	<div class="editor-header">
		<h3>Algemene Instellingen</h3>
		<p class="editor-description">Pas de globale stijl van je verhaal aan</p>
	</div>

	<div class="controls">
		<!-- Body Achtergrond Kleur -->
		<div class="control-group">
			<label for="body-bg">Body Achtergrond Kleur</label>
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

		<!-- ✅ NIEUW: Achtergrond Afbeelding -->
		<div class="control-group section-divider">
			<label for="bg-image">Achtergrond Afbeelding (Desktop)</label>
			<p class="control-hint">
				Voeg een subtiel patroon of textuur toe. Alleen zichtbaar op desktop (mobiel krijgt alleen
				de kleur).
			</p>
			<input
				id="bg-image"
				type="url"
				class="url-input"
				placeholder="https://example.com/pattern.png"
				value={backgroundImage}
				oninput={(e) => updateBackgroundImage(e.currentTarget.value)}
				onchange={onsave}
			/>
			<p class="control-hint small">
				<strong>Tip:</strong> Gebruik kleine afbeeldingen (&lt; 100KB) voor betere performance.<br
				/>
				<strong>Gratis patronen:</strong>
				<a href="https://www.toptal.com/designers/subtlepatterns/" target="_blank"
					>Subtle Patterns</a
				>,
				<a href="https://heropatterns.com/" target="_blank">Hero Patterns</a>,
				<a href="https://www.transparenttextures.com/" target="_blank">Transparent Textures</a>
			</p>

			{#if backgroundImage}
				<!-- Preview -->
				<div class="background-preview">
					<div
						class="preview-content"
						style="
							background-image: url({backgroundImage});
							background-repeat: {backgroundRepeat};
							background-position: {backgroundPosition};
							background-size: {backgroundSize};
							opacity: {backgroundOpacity / 100};
						"
					></div>
					<p class="preview-text">Voorbeeld tekst op achtergrond</p>
				</div>

				<!-- Herhaling -->
				<div class="control-subgroup">
					<label for="bg-repeat">Herhaling</label>
					<select
						id="bg-repeat"
						value={backgroundRepeat}
						onchange={(e) => {
							updateBackgroundRepeat(e.currentTarget.value);
							onsave();
						}}
					>
						<option value="repeat">Herhalen (beide richtingen)</option>
						<option value="repeat-x">Horizontaal herhalen</option>
						<option value="repeat-y">Verticaal herhalen</option>
						<option value="no-repeat">Niet herhalen</option>
					</select>
				</div>

				<!-- Positie -->
				<div class="control-subgroup">
					<label for="bg-position">Positie</label>
					<select
						id="bg-position"
						value={backgroundPosition}
						onchange={(e) => {
							updateBackgroundPosition(e.currentTarget.value);
							onsave();
						}}
					>
						<option value="center">Midden</option>
						<option value="top">Boven</option>
						<option value="bottom">Onder</option>
						<option value="left">Links</option>
						<option value="right">Rechts</option>
						<option value="top left">Linksboven</option>
						<option value="top right">Rechtsboven</option>
						<option value="bottom left">Linksonder</option>
						<option value="bottom right">Rechtsonder</option>
					</select>
				</div>

				<!-- Grootte -->
				<div class="control-subgroup">
					<label for="bg-size">Grootte</label>
					<select
						id="bg-size"
						value={backgroundSize}
						onchange={(e) => {
							updateBackgroundSize(e.currentTarget.value);
							onsave();
						}}
					>
						<option value="auto">Origineel</option>
						<option value="cover">Bedekken (cover)</option>
						<option value="contain">Passen (contain)</option>
					</select>
				</div>

				<!-- Doorzichtigheid -->
				<div class="control-subgroup">
					<label for="bg-opacity"> Doorzichtigheid: {backgroundOpacity}% </label>
					<input
						id="bg-opacity"
						type="range"
						min="0"
						max="100"
						step="5"
						value={backgroundOpacity}
						oninput={(e) => updateBackgroundOpacity(parseInt(e.currentTarget.value))}
						onchange={onsave}
					/>
				</div>

				<!-- Effect -->
				<div class="control-subgroup">
					<label for="bg-attachment">Effect</label>
					<select
						id="bg-attachment"
						value={backgroundAttachment}
						onchange={(e) => {
							updateBackgroundAttachment(e.currentTarget.value);
							onsave();
						}}
					>
						<option value="scroll">Scrolt mee</option>
						<option value="fixed">Vast (parallax)</option>
					</select>
				</div>

				<!-- Verwijder knop -->
				<button type="button" class="button-remove" onclick={removeBackground}>
					Verwijder achtergrond
				</button>
			{/if}
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

	.section-divider {
		padding-top: 1.5rem;
		border-top: 2px solid #e5e7eb;
	}

	.control-subgroup {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		margin-top: 0.75rem;
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

	.control-hint.small {
		font-size: 0.75rem;
		margin-top: 0.5rem;
	}

	.control-hint a {
		color: #667eea;
		text-decoration: none;
	}

	.control-hint a:hover {
		text-decoration: underline;
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
	.url-input {
		flex: 1;
		padding: 0.5rem 0.75rem;
		border: 1px solid #e5e7eb;
		border-radius: 6px;
		font-family: 'SF Mono', Monaco, monospace;
		font-size: 0.875rem;
		color: #374151;
	}

	.url-input {
		width: 100%;
	}

	.color-value:focus,
	.url-input:focus {
		outline: none;
		border-color: #667eea;
		box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
	}

	.background-preview {
		position: relative;
		width: 100%;
		height: 150px;
		border: 1px solid #e5e7eb;
		border-radius: 6px;
		overflow: hidden;
		margin: 1rem 0;
		background-color: var(--color-background-light, #ffffff);
	}

	.preview-content {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
	}

	.preview-text {
		position: relative;
		z-index: 1;
		display: flex;
		align-items: center;
		justify-content: center;
		height: 100%;
		margin: 0;
		padding: 1rem;
		background: rgba(255, 255, 255, 0.9);
		border-radius: 4px;
		max-width: 200px;
		margin: auto;
		text-align: center;
		font-size: 0.875rem;
		color: #374151;
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

	input[type='range'] {
		width: 100%;
		height: 6px;
		border-radius: 3px;
		background: #e5e7eb;
		outline: none;
		-webkit-appearance: none;
	}

	input[type='range']::-webkit-slider-thumb {
		-webkit-appearance: none;
		appearance: none;
		width: 18px;
		height: 18px;
		border-radius: 50%;
		background: #667eea;
		cursor: pointer;
	}

	input[type='range']::-moz-range-thumb {
		width: 18px;
		height: 18px;
		border-radius: 50%;
		background: #667eea;
		cursor: pointer;
		border: none;
	}

	.button-remove {
		margin-top: 1rem;
		padding: 0.75rem 1rem;
		background: #fee;
		color: #c00;
		border: 1px solid #fcc;
		border-radius: 6px;
		font-size: 0.875rem;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.15s;
	}

	.button-remove:hover {
		background: #fcc;
		border-color: #c00;
	}

	.button-remove:active {
		transform: scale(0.98);
	}
</style>
