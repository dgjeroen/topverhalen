<script lang="ts">
	import type { Theme } from '$lib/types';

	let { theme = $bindable({}), onsave = () => {} } = $props<{
		theme?: Theme;
		onsave?: () => void;
	}>();

	function handleChange() {
		onsave();
	}
</script>

<div class="style-editor">
	<h2>Timeline Styling</h2>
	<p class="editor-description">Eén styling voor zowel desktop als mobiel</p>

	<!-- ===== TITEL ===== -->
	<section class="editor-section">
		<h3>Titel (H2)</h3>

		<div class="control-group">
			<label for="timeline-title-size">Grootte</label>
			<input
				type="text"
				id="timeline-title-size"
				bind:value={theme['timeline-title-size']}
				oninput={handleChange}
				placeholder="2rem"
				class="full-width"
			/>
		</div>

		<div class="control-group">
			<label for="timeline-title-color">Kleur</label>
			<input
				id="timeline-title-color"
				type="color"
				bind:value={theme['timeline-title-color']}
				oninput={handleChange}
			/>
			<input
				type="text"
				bind:value={theme['timeline-title-color']}
				oninput={handleChange}
				placeholder="#111827"
			/>
		</div>
	</section>

	<!-- ===== TIJDLIJN LIJN ===== -->
	<section class="editor-section">
		<h3>Tijdlijn Lijn</h3>

		<div class="control-group">
			<label for="timeline-line-color">Kleur</label>
			<input
				id="timeline-line-color"
				type="color"
				bind:value={theme['timeline-line-color']}
				oninput={handleChange}
			/>
			<input
				type="text"
				bind:value={theme['timeline-line-color']}
				oninput={handleChange}
				placeholder="#f59e0b"
			/>
		</div>

		<div class="control-group">
			<label for="timeline-line-width">Dikte</label>
			<input
				type="text"
				id="timeline-line-width"
				bind:value={theme['timeline-line-width']}
				oninput={handleChange}
				placeholder="4px"
				class="full-width"
			/>
		</div>
	</section>

	<!-- ===== MARKERS ===== -->
	<section class="editor-section">
		<h3>Markers (Bolletjes)</h3>

		<div class="control-group">
			<label for="timeline-marker-bg">Achtergrond</label>
			<input
				id="timeline-marker-bg"
				type="color"
				bind:value={theme['timeline-marker-bg']}
				oninput={handleChange}
			/>
			<input
				type="text"
				bind:value={theme['timeline-marker-bg']}
				oninput={handleChange}
				placeholder="#fdf6e9"
			/>
		</div>

		<div class="control-group">
			<label for="timeline-marker-border-color">Randkleur</label>
			<input
				id="timeline-marker-border-color"
				type="color"
				bind:value={theme['timeline-marker-border-color']}
				oninput={handleChange}
			/>
			<input
				type="text"
				bind:value={theme['timeline-marker-border-color']}
				oninput={handleChange}
				placeholder="#2c5599"
			/>
		</div>

		<div class="control-group">
			<label for="timeline-marker-border-width">Randdikte</label>
			<input
				type="text"
				id="timeline-marker-border-width"
				bind:value={theme['timeline-marker-border-width']}
				oninput={handleChange}
				placeholder="4px"
				class="full-width"
			/>
		</div>

		<div class="control-group">
			<label for="timeline-marker-size">Grootte</label>
			<input
				type="text"
				id="timeline-marker-size"
				bind:value={theme['timeline-marker-size']}
				oninput={handleChange}
				placeholder="1rem"
				class="full-width"
			/>
		</div>
	</section>

	<!-- ===== JAAR/DATUM ===== -->
	<section class="editor-section">
		<h3>Jaar/Datum Badge</h3>

		<div class="control-group">
			<label for="timeline-year-color">Tekstkleur</label>
			<input
				id="timeline-year-color"
				type="color"
				bind:value={theme['timeline-year-color']}
				oninput={handleChange}
			/>
			<input
				type="text"
				bind:value={theme['timeline-year-color']}
				oninput={handleChange}
				placeholder="#f59e0b"
			/>
		</div>

		<div class="control-group">
			<label for="timeline-year-bg">Achtergrond</label>
			<input
				id="timeline-year-bg"
				type="color"
				bind:value={theme['timeline-year-bg']}
				oninput={handleChange}
			/>
			<input
				type="text"
				bind:value={theme['timeline-year-bg']}
				oninput={handleChange}
				placeholder="transparent"
			/>
		</div>

		<div class="control-group">
			<label for="timeline-year-font-size">Lettergrootte</label>
			<input
				type="text"
				id="timeline-year-font-size"
				bind:value={theme['timeline-year-font-size']}
				oninput={handleChange}
				placeholder="1.125rem"
				class="full-width"
			/>
		</div>

		<div class="control-group">
			<label for="timeline-year-font-weight">Letterdikte</label>
			<input
				type="text"
				id="timeline-year-font-weight"
				bind:value={theme['timeline-year-font-weight']}
				oninput={handleChange}
				placeholder="700"
				class="full-width"
			/>
		</div>

		<div class="control-group">
			<label for="timeline-year-padding">Padding</label>
			<input
				type="text"
				id="timeline-year-padding"
				bind:value={theme['timeline-year-padding']}
				oninput={handleChange}
				placeholder="0 0.5rem"
				class="full-width"
			/>
		</div>

		<div class="control-group">
			<label for="timeline-year-border-radius">Afronding</label>
			<input
				type="text"
				id="timeline-year-border-radius"
				bind:value={theme['timeline-year-border-radius']}
				oninput={handleChange}
				placeholder="4px"
				class="full-width"
			/>
		</div>
	</section>

	<!-- ===== KAARTEN ===== -->
	<section class="editor-section">
		<h3>Kaarten (Content Boxes)</h3>

		<div class="control-group">
			<label for="timeline-card-bg">Achtergrond</label>
			<input
				id="timeline-card-bg"
				type="color"
				bind:value={theme['timeline-card-bg']}
				oninput={handleChange}
			/>
			<input
				type="text"
				bind:value={theme['timeline-card-bg']}
				oninput={handleChange}
				placeholder="#fdf6e9"
			/>
		</div>

		<div class="control-group">
			<label for="timeline-card-border-color">Randkleur</label>
			<input
				id="timeline-card-border-color"
				type="color"
				bind:value={theme['timeline-card-border-color']}
				oninput={handleChange}
			/>
			<input
				type="text"
				bind:value={theme['timeline-card-border-color']}
				oninput={handleChange}
				placeholder="#e4b483"
			/>
		</div>

		<div class="control-group">
			<label for="timeline-card-border-width">Randdikte</label>
			<input
				type="text"
				id="timeline-card-border-width"
				bind:value={theme['timeline-card-border-width']}
				oninput={handleChange}
				placeholder="1px"
				class="full-width"
			/>
		</div>

		<div class="control-group">
			<label for="timeline-card-border-radius">Afronding</label>
			<input
				type="text"
				id="timeline-card-border-radius"
				bind:value={theme['timeline-card-border-radius']}
				oninput={handleChange}
				placeholder="0.5rem"
				class="full-width"
			/>
		</div>

		<div class="control-group">
			<label for="timeline-card-shadow">Schaduw</label>
			<input
				type="text"
				id="timeline-card-shadow"
				bind:value={theme['timeline-card-shadow']}
				oninput={handleChange}
				placeholder="0 4px 6px rgba(0, 0, 0, 0.1)"
				class="full-width"
			/>
		</div>

		<div class="control-group">
			<label for="timeline-card-padding">Padding</label>
			<input
				type="text"
				id="timeline-card-padding"
				bind:value={theme['timeline-card-padding']}
				oninput={handleChange}
				placeholder="1rem"
				class="full-width"
			/>
		</div>
	</section>

	<!-- ===== TEKST IN KAARTEN ===== -->
	<section class="editor-section">
		<h3>Tekst in Kaarten</h3>

		<div class="control-group">
			<label for="timeline-text-color">Tekstkleur</label>
			<input
				id="timeline-text-color"
				type="color"
				bind:value={theme['timeline-text-color']}
				oninput={handleChange}
			/>
			<input
				type="text"
				bind:value={theme['timeline-text-color']}
				oninput={handleChange}
				placeholder="#111827"
			/>
		</div>

		<div class="control-group">
			<label for="timeline-text-font-size">Lettergrootte</label>
			<input
				type="text"
				id="timeline-text-font-size"
				bind:value={theme['timeline-text-font-size']}
				oninput={handleChange}
				placeholder="0.875rem"
				class="full-width"
			/>
		</div>

		<div class="control-group">
			<label for="timeline-text-line-height">Regelafstand</label>
			<input
				type="text"
				id="timeline-text-line-height"
				bind:value={theme['timeline-text-line-height']}
				oninput={handleChange}
				placeholder="1.6"
				class="full-width"
			/>
		</div>

		<div class="control-group">
			<label for="timeline-heading-color">Titel kleur (H3)</label>
			<input
				id="timeline-heading-color"
				type="color"
				bind:value={theme['timeline-heading-color']}
				oninput={handleChange}
			/>
			<input
				type="text"
				bind:value={theme['timeline-heading-color']}
				oninput={handleChange}
				placeholder="#111827"
			/>
		</div>

		<div class="control-group">
			<label for="timeline-heading-font-size">Titel grootte</label>
			<input
				type="text"
				id="timeline-heading-font-size"
				bind:value={theme['timeline-heading-font-size']}
				oninput={handleChange}
				placeholder="1.125rem"
				class="full-width"
			/>
		</div>

		<div class="control-group">
			<label for="timeline-heading-font-weight">Titel dikte</label>
			<input
				type="text"
				id="timeline-heading-font-weight"
				bind:value={theme['timeline-heading-font-weight']}
				oninput={handleChange}
				placeholder="700"
				class="full-width"
			/>
		</div>
	</section>

	<!-- ===== AFBEELDINGEN ===== -->
	<section class="editor-section">
		<h3>Afbeeldingen</h3>

		<div class="control-group">
			<label for="timeline-image-border-radius">Afronding</label>
			<input
				type="text"
				id="timeline-image-border-radius"
				bind:value={theme['timeline-image-border-radius']}
				oninput={handleChange}
				placeholder="0.25rem"
				class="full-width"
			/>
		</div>

		<div class="control-group">
			<label for="timeline-image-shadow">Schaduw</label>
			<input
				type="text"
				id="timeline-image-shadow"
				bind:value={theme['timeline-image-shadow']}
				oninput={handleChange}
				placeholder="0 1px 3px rgba(0, 0, 0, 0.1)"
				class="full-width"
			/>
		</div>
	</section>

	<!-- ===== CONNECTOR (MOBIEL) ===== -->
	<section class="editor-section">
		<h3>Connector Lijn (Mobiel)</h3>

		<div class="control-group">
			<label for="timeline-connector-color">Kleur</label>
			<input
				id="timeline-connector-color"
				type="color"
				bind:value={theme['timeline-connector-color']}
				oninput={handleChange}
			/>
			<input
				type="text"
				bind:value={theme['timeline-connector-color']}
				oninput={handleChange}
				placeholder="#f59e0b"
			/>
		</div>

		<div class="control-group">
			<label for="timeline-connector-width">Dikte</label>
			<input
				type="text"
				id="timeline-connector-width"
				bind:value={theme['timeline-connector-width']}
				oninput={handleChange}
				placeholder="2px"
				class="full-width"
			/>
		</div>
	</section>

	<!-- ===== SCROLL BUTTONS (MOBIEL) ===== -->
	<section class="editor-section">
		<h3>Scroll Knoppen (Mobiel)</h3>

		<div class="control-group">
			<label for="timeline-scroll-btn-bg">Achtergrond</label>
			<input
				id="timeline-scroll-btn-bg"
				type="color"
				bind:value={theme['timeline-scroll-btn-bg']}
				oninput={handleChange}
			/>
			<input
				type="text"
				bind:value={theme['timeline-scroll-btn-bg']}
				oninput={handleChange}
				placeholder="rgba(255, 255, 255, 0.9)"
			/>
		</div>

		<div class="control-group">
			<label for="timeline-scroll-btn-border">Rand</label>
			<input
				id="timeline-scroll-btn-border"
				type="color"
				bind:value={theme['timeline-scroll-btn-border']}
				oninput={handleChange}
			/>
			<input
				type="text"
				bind:value={theme['timeline-scroll-btn-border']}
				oninput={handleChange}
				placeholder="#ddd"
			/>
		</div>

		<div class="control-group">
			<label for="timeline-scroll-btn-color">Icoon kleur</label>
			<input
				id="timeline-scroll-btn-color"
				type="color"
				bind:value={theme['timeline-scroll-btn-color']}
				oninput={handleChange}
			/>
			<input
				type="text"
				bind:value={theme['timeline-scroll-btn-color']}
				oninput={handleChange}
				placeholder="#78350f"
			/>
		</div>

		<div class="control-group">
			<label for="timeline-scroll-btn-hover-bg">Hover achtergrond</label>
			<input
				id="timeline-scroll-btn-hover-bg"
				type="color"
				bind:value={theme['timeline-scroll-btn-hover-bg']}
				oninput={handleChange}
			/>
			<input
				type="text"
				bind:value={theme['timeline-scroll-btn-hover-bg']}
				oninput={handleChange}
				placeholder="rgba(255, 255, 255, 1)"
			/>
		</div>

		<div class="control-group">
			<label for="timeline-scroll-btn-size">Grootte</label>
			<input
				type="text"
				id="timeline-scroll-btn-size"
				bind:value={theme['timeline-scroll-btn-size']}
				oninput={handleChange}
				placeholder="40px"
				class="full-width"
			/>
		</div>
	</section>
</div>

<style>
	.style-editor {
		padding: 2rem;
		max-width: 800px;
		margin: 0 auto;
	}

	h2 {
		margin: 0 0 0.5rem 0;
		font-size: 1.5rem;
		color: #111827;
	}

	.editor-description {
		margin: 0 0 2rem 0;
		color: #6b7280;
		font-size: 0.875rem;
	}

	.editor-section {
		margin-bottom: 2rem;
		padding: 1.5rem;
		background: #f9fafb;
		border-radius: 8px;
		border: 1px solid #e5e7eb;
	}

	h3 {
		margin: 0 0 1.5rem 0;
		font-size: 1.125rem;
		color: #374151;
		font-weight: 600;
		border-bottom: 2px solid #e5e7eb;
		padding-bottom: 0.75rem;
	}

	.control-group {
		display: grid;
		grid-template-columns: 180px 60px 1fr;
		gap: 0.75rem;
		align-items: center;
		margin-bottom: 1rem;
	}

	.control-group:has(.full-width) {
		grid-template-columns: 180px 1fr;
	}

	label {
		font-size: 0.875rem;
		font-weight: 500;
		color: #374151;
	}

	input[type='color'] {
		width: 50px;
		height: 40px;
		border: 1px solid #e5e7eb;
		border-radius: 6px;
		cursor: pointer;
		padding: 2px;
	}

	input[type='text'] {
		padding: 0.5rem;
		border: 1px solid #e5e7eb;
		border-radius: 6px;
		font-family: 'SF Mono', Monaco, monospace;
		font-size: 0.875rem;
		transition: all 0.15s ease;
	}

	input[type='text'].full-width {
		grid-column: 2 / -1;
	}

	input:focus {
		outline: none;
		border-color: #d10a10;
		box-shadow: 0 0 0 3px rgba(209, 10, 16, 0.1);
	}

	input[type='color']:hover {
		border-color: #d10a10;
	}
</style>
