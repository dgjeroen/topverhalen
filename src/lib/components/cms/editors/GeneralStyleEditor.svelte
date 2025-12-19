<!-- src/lib/components/cms/editors/GeneralStyleEditor.svelte -->
<script lang="ts">
	import type { Theme } from '$lib/types';

	let { theme = $bindable(), onsave } = $props<{
		theme: Theme;
		onsave: () => Promise<void>;
	}>();

	const defaults = {
		'font-family-quote':
			"'Flama Semi Condensed', 'Arial Narrow', sans-serif, 'acumin-pro-extra-condensed'",
		'font-family-base': "'Arial', sans-serif",
		'color-background-light': '#ffffff'
	};

	$effect(() => {
		if (!theme) theme = {};
	});

	let backgroundColor = $state(
		theme['color-background-light'] || defaults['color-background-light']
	);
	let fontQuote = $state(theme['font-family-quote'] || defaults['font-family-quote']);
	let fontBase = $state(theme['font-family-base'] || defaults['font-family-base']);

	// Achtergrond state
	let backgroundImage = $state(theme['background-image'] || '');
	let backgroundRepeat = $state(theme['background-repeat'] || 'repeat');
	let backgroundPosition = $state(theme['background-position'] || 'center');
	let backgroundSize = $state(theme['background-size'] || 'auto');
	let backgroundOpacity = $state(theme['background-opacity'] ?? 100);
	let backgroundAttachment = $state(theme['background-attachment'] || 'scroll');

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
	<!-- SECTIE: Body Achtergrond -->
	<div class="section">
		<h3>Body Achtergrond Kleur</h3>

		<div class="control-group">
			<label for="body-bg">Tekstkleur</label>
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
			<span class="hint">
				<strong>Tip:</strong> Raadpleeg de
				<a href="https://adr-brand-guide.web.app/kleuren.html" target="_blank">Brand Guide</a> voor aanbevolen
				kleuren.
			</span>
		</div>
	</div>

	<!-- SECTIE: Achtergrond Afbeelding (Desktop) -->
	<div class="section">
		<h3>Achtergrond Afbeelding (Desktop)</h3>

		<div class="control-group">
			<label for="bg-image">Afbeelding URL</label>
			<span class="hint">
				Voeg een subtiel patroon of textuur toe. Alleen zichtbaar op desktop (mobiel krijgt alleen
				de kleur).
			</span>
			<input
				id="bg-image"
				type="url"
				class="url-input"
				placeholder="https://example.com/pattern.png"
				value={backgroundImage}
				oninput={(e) => updateBackgroundImage(e.currentTarget.value)}
				onchange={onsave}
			/>
			<span class="hint">
				<strong>Tip:</strong> Gebruik kleine afbeeldingen (&lt; 100KB) voor betere performance.<br
				/>
				<strong>Gratis patronen:</strong>
				<a href="https://www.toptal.com/designers/subtlepatterns/" target="_blank"
					>Subtle Patterns</a
				>,
				<a href="https://heropatterns.com/" target="_blank">Hero Patterns</a>,
				<a href="https://www.transparenttextures.com/" target="_blank">Transparent Textures</a>
			</span>
		</div>

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
			<div class="control-group">
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
			<div class="control-group">
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
			<div class="control-group">
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
			<div class="control-group">
				<label for="bg-opacity">Doorzichtigheid: {backgroundOpacity}%</label>
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
			<div class="control-group">
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

	<!-- SECTIE: Lettertypes -->
	<div class="section">
		<h3>Lettertypes</h3>

		<div class="control-group">
			<label for="font-heading">Lettertype Koppen</label>
			<span class="hint">Gebruikt voor H2, H4 en TextFrame koppen</span>
			<select
				id="font-heading"
				value={fontQuote}
				onchange={(e) => {
					updateFontQuote(e.currentTarget.value);
					onsave();
				}}
			>
				<option value="'Flama Semi Condensed', 'Arial Narrow', sans-serif">
					Flama Semi Condensed (standaard)
				</option>
				<option value="'Arial', sans-serif">Arial</option>
				<option value="'Inter', sans-serif">Inter</option>
				<option value="'Georgia', serif">Georgia</option>
				<option value="'Courier New', monospace">Courier New</option>
				<option value="'acumin-pro-extra-condensed', sans-serif">Acumin Pro Extra Condensed</option>
			</select>
		</div>

		<!-- Lettertype Body -->
		<div class="control-group">
			<label for="font-body">Lettertype Body</label>
			<span class="hint">Gebruikt voor tekstblokken en quote auteur</span>
			<select
				id="font-body"
				value={fontBase}
				onchange={(e) => {
					updateFontBase(e.currentTarget.value);
					onsave();
				}}
			>
				<option value="'Arial', sans-serif">Arial (standaard)</option>
				<option value="'Inter', sans-serif">Inter</option>
				<option value="'Georgia', serif">Georgia</option>
				<option value="'Courier New', monospace">Courier New</option>
			</select>
		</div>
	</div>

	<!-- SECTIE: Bijschriften & Bronnen -->
	<div class="section">
		<h3>Bijschriften & Bronnen</h3>
		<p class="hint" style="margin-bottom: 1rem;">
			Styling voor afbeelding/video bijschriften en bronvermeldingen (geldt voor alle componenten)
		</p>

		<!-- Bijschrift (Caption) -->
		<h4 style="margin: 1.5rem 0 0.75rem; font-size: 0.8125rem; font-weight: 600; color: #6b7280;">
			Bijschrift
		</h4>

		<div class="control-group">
			<label for="caption-font-family">Lettertype</label>
			<select
				id="caption-font-family"
				value={theme['caption-font-family'] || "'Arial', sans-serif"}
				onchange={(e) => {
					theme['caption-font-family'] = e.currentTarget.value;
					onsave();
				}}
			>
				<option value="'Arial', sans-serif">Arial (standaard)</option>
				<option value="'Inter', sans-serif">Inter</option>
				<option value="'Georgia', serif">Georgia</option>
				<option value="'Courier New', monospace">Courier New</option>
			</select>
		</div>

		<div class="control-group">
			<label for="caption-font-size">Tekstgrootte</label>
			<input
				id="caption-font-size"
				type="text"
				placeholder="bijv. 0.875rem"
				value={theme['caption-font-size'] || ''}
				oninput={(e) => {
					theme['caption-font-size'] = e.currentTarget.value;
					onsave();
				}}
			/>
		</div>

		<div class="control-group">
			<label for="caption-color">Tekstkleur</label>
			<div class="color-control">
				<input
					id="caption-color"
					type="color"
					value={theme['caption-color'] || '#6b7280'}
					oninput={(e) => {
						theme['caption-color'] = e.currentTarget.value;
						onsave();
					}}
				/>
				<input
					type="text"
					placeholder="#6b7280"
					value={theme['caption-color'] || ''}
					oninput={(e) => {
						theme['caption-color'] = e.currentTarget.value;
						onsave();
					}}
				/>
			</div>
		</div>

		<div class="control-group">
			<label for="caption-font-weight">Lettergewicht</label>
			<select
				id="caption-font-weight"
				value={theme['caption-font-weight'] || '400'}
				onchange={(e) => {
					theme['caption-font-weight'] = e.currentTarget.value;
					onsave();
				}}
			>
				<option value="300">Light (300)</option>
				<option value="400">Normal (400)</option>
				<option value="500">Medium (500)</option>
				<option value="600">Semi-bold (600)</option>
				<option value="700">Bold (700)</option>
			</select>
		</div>

		<div class="control-group">
			<label for="caption-font-style">Cursief</label>
			<select
				id="caption-font-style"
				value={theme['caption-font-style'] || 'normal'}
				onchange={(e) => {
					theme['caption-font-style'] = e.currentTarget.value;
					onsave();
				}}
			>
				<option value="normal">Normaal</option>
				<option value="italic">Cursief</option>
			</select>
		</div>

		<!-- Bron (Source) -->
		<h4 style="margin: 1.5rem 0 0.75rem; font-size: 0.8125rem; font-weight: 600; color: #6b7280;">
			Bron
		</h4>

		<div class="control-group">
			<label for="source-font-family">Lettertype</label>
			<select
				id="source-font-family"
				value={theme['source-font-family'] || "'Arial', sans-serif"}
				onchange={(e) => {
					theme['source-font-family'] = e.currentTarget.value;
					onsave();
				}}
			>
				<option value="'Arial', sans-serif">Arial (standaard)</option>
				<option value="'Inter', sans-serif">Inter</option>
				<option value="'Georgia', serif">Georgia</option>
				<option value="'Courier New', monospace">Courier New</option>
			</select>
		</div>

		<div class="control-group">
			<label for="source-font-size">Tekstgrootte</label>
			<input
				id="source-font-size"
				type="text"
				placeholder="bijv. 0.75rem"
				value={theme['source-font-size'] || ''}
				oninput={(e) => {
					theme['source-font-size'] = e.currentTarget.value;
					onsave();
				}}
			/>
		</div>

		<div class="control-group">
			<label for="source-color">Tekstkleur</label>
			<div class="color-control">
				<input
					id="source-color"
					type="color"
					value={theme['source-color'] || '#9ca3af'}
					oninput={(e) => {
						theme['source-color'] = e.currentTarget.value;
						onsave();
					}}
				/>
				<input
					type="text"
					placeholder="#9ca3af"
					value={theme['source-color'] || ''}
					oninput={(e) => {
						theme['source-color'] = e.currentTarget.value;
						onsave();
					}}
				/>
			</div>
		</div>

		<div class="control-group">
			<label for="source-font-weight">Lettergewicht</label>
			<select
				id="source-font-weight"
				value={theme['source-font-weight'] || '400'}
				onchange={(e) => {
					theme['source-font-weight'] = e.currentTarget.value;
					onsave();
				}}
			>
				<option value="300">Light (300)</option>
				<option value="400">Normal (400)</option>
				<option value="500">Medium (500)</option>
				<option value="600">Semi-bold (600)</option>
				<option value="700">Bold (700)</option>
			</select>
		</div>

		<div class="control-group">
			<label for="source-font-style">Cursief</label>
			<select
				id="source-font-style"
				value={theme['source-font-style'] || 'normal'}
				onchange={(e) => {
					theme['source-font-style'] = e.currentTarget.value;
					onsave();
				}}
			>
				<option value="normal">Normaal</option>
				<option value="italic">Cursief</option>
			</select>
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

	.hint {
		font-size: 0.75rem;
		color: #9ca3af;
		font-style: italic;
		display: block;
		margin-top: 0.25rem;
	}

	.hint a {
		color: #667eea;
		text-decoration: none;
	}

	.hint a:hover {
		text-decoration: underline;
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

	.color-value {
		flex: 1;
		padding: 0.5rem;
		border: 1px solid #d1d5db;
		border-radius: 4px;
		font-family: 'SF Mono', Monaco, monospace;
		font-size: 0.875rem;
		background: white;
		box-sizing: border-box;
		color: #374151;
	}

	.url-input {
		width: 100%;
		padding: 0.5rem;
		border: 1px solid #d1d5db;
		border-radius: 4px;
		font-size: 0.875rem;
		background: white;
		box-sizing: border-box;
		color: #374151;
	}

	.color-value:focus,
	.url-input:focus {
		outline: none;
		border-color: #d10a10;
	}

	.background-preview {
		position: relative;
		width: 100%;
		height: 150px;
		border: 1px solid #d1d5db;
		border-radius: 4px;
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

	input[type='range'] {
		width: 100%;
		height: 6px;
		border-radius: 3px;
		background: #d1d5db;
		outline: none;
		-webkit-appearance: none;
		appearance: none;
	}

	input[type='range']::-webkit-slider-thumb {
		-webkit-appearance: none;
		appearance: none;
		width: 18px;
		height: 18px;
		border-radius: 50%;
		background: #d10a10;
		cursor: pointer;
	}

	input[type='range']::-moz-range-thumb {
		width: 18px;
		height: 18px;
		border-radius: 50%;
		background: #d10a10;
		cursor: pointer;
		border: none;
	}

	.button-remove {
		margin-top: 1rem;
		padding: 0.5rem 0.75rem;
		background: #fee;
		color: #c00;
		border: 1px solid #fcc;
		border-radius: 4px;
		font-size: 0.875rem;
		font-weight: 600;
		cursor: pointer;
	}

	.button-remove:hover {
		background: #fcc;
		border-color: #c00;
	}
</style>
