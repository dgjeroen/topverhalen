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
	<section class="editor-section">
		<h3>Titel (Desktop + Mobiel)</h3>

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
	<!-- ===== DESKTOP (VERTICAL) ===== -->
	<section class="editor-section">
		<h3>Desktop (Verticaal)</h3>
		<div class="control-group">
			<label for="vertical-line-color">Lijnkleur</label>
			<input
				id="vertical-line-color"
				type="color"
				bind:value={theme['timeline-vertical-line-color']}
				oninput={handleChange}
			/>
			<input
				type="text"
				bind:value={theme['timeline-vertical-line-color']}
				oninput={handleChange}
				placeholder="#f59e0b"
			/>
		</div>

		<div class="control-group">
			<label for="vertical-marker-bg">Marker achtergrond</label>
			<input
				id="vertical-marker-bg"
				type="color"
				bind:value={theme['timeline-vertical-marker-bg']}
				oninput={handleChange}
			/>
			<input
				type="text"
				bind:value={theme['timeline-vertical-marker-bg']}
				oninput={handleChange}
				placeholder="#fdf6e9"
			/>
		</div>

		<div class="control-group">
			<label for="vertical-marker-border">Marker rand</label>
			<input
				id="vertical-marker-border"
				type="color"
				bind:value={theme['timeline-vertical-marker-border']}
				oninput={handleChange}
			/>
			<input
				type="text"
				bind:value={theme['timeline-vertical-marker-border']}
				oninput={handleChange}
				placeholder="#2c5599"
			/>
		</div>

		<div class="control-group">
			<label for="vertical-card-bg">Kaart achtergrond</label>
			<input
				id="vertical-card-bg"
				type="color"
				bind:value={theme['timeline-vertical-card-bg']}
				oninput={handleChange}
			/>
			<input
				type="text"
				bind:value={theme['timeline-vertical-card-bg']}
				oninput={handleChange}
				placeholder="#fdf6e9"
			/>
		</div>

		<div class="control-group">
			<label for="vertical-year-color">Jaarkleur</label>
			<input
				id="vertical-year-color"
				type="color"
				bind:value={theme['timeline-vertical-year-color']}
				oninput={handleChange}
			/>
			<input
				type="text"
				bind:value={theme['timeline-vertical-year-color']}
				oninput={handleChange}
				placeholder="#f59e0b"
			/>
		</div>

		<div class="control-group">
			<label for="vertical-text-color">Tekstkleur</label>
			<input
				id="vertical-text-color"
				type="color"
				bind:value={theme['timeline-vertical-text-color']}
				oninput={handleChange}
			/>
			<input
				type="text"
				bind:value={theme['timeline-vertical-text-color']}
				oninput={handleChange}
				placeholder="#111827"
			/>
		</div>

		<div class="control-group">
			<label for="vertical-card-shadow">Kaart schaduw</label>
			<input
				type="text"
				id="vertical-card-shadow"
				bind:value={theme['timeline-vertical-card-shadow']}
				oninput={handleChange}
				placeholder="0 4px 6px rgba(0, 0, 0, 0.1)"
				class="full-width"
			/>
		</div>
	</section>

	<!-- ===== MOBILE (HORIZONTAL) ===== -->
	<section class="editor-section">
		<h3>Mobiel (Horizontaal)</h3>
		<div class="control-group">
			<label for="horizontal-line-color">Lijnkleur</label>
			<input
				id="horizontal-line-color"
				type="color"
				bind:value={theme['timeline-horizontal-line-color']}
				oninput={handleChange}
			/>
			<input
				type="text"
				bind:value={theme['timeline-horizontal-line-color']}
				oninput={handleChange}
				placeholder="#f59e0b"
			/>
		</div>

		<div class="control-group">
			<label for="horizontal-marker-bg">Marker achtergrond</label>
			<input
				id="horizontal-marker-bg"
				type="color"
				bind:value={theme['timeline-horizontal-marker-bg']}
				oninput={handleChange}
			/>
			<input
				type="text"
				bind:value={theme['timeline-horizontal-marker-bg']}
				oninput={handleChange}
				placeholder="#f59e0b"
			/>
		</div>

		<div class="control-group">
			<label for="horizontal-marker-border">Marker rand</label>
			<input
				id="horizontal-marker-border"
				type="color"
				bind:value={theme['timeline-horizontal-marker-border']}
				oninput={handleChange}
			/>
			<input
				type="text"
				bind:value={theme['timeline-horizontal-marker-border']}
				oninput={handleChange}
				placeholder="#ffffff"
			/>
		</div>

		<div class="control-group">
			<label for="horizontal-card-bg">Kaart achtergrond</label>
			<input
				id="horizontal-card-bg"
				type="color"
				bind:value={theme['timeline-horizontal-card-bg']}
				oninput={handleChange}
			/>
			<input
				type="text"
				bind:value={theme['timeline-horizontal-card-bg']}
				oninput={handleChange}
				placeholder="#fdf6e9"
			/>
		</div>

		<div class="control-group">
			<label for="horizontal-card-border">Kaart rand</label>
			<input
				id="horizontal-card-border"
				type="color"
				bind:value={theme['timeline-horizontal-card-border']}
				oninput={handleChange}
			/>
			<input
				type="text"
				bind:value={theme['timeline-horizontal-card-border']}
				oninput={handleChange}
				placeholder="#e4b483"
			/>
		</div>

		<div class="control-group">
			<label for="horizontal-year-color">Jaarkleur</label>
			<input
				id="horizontal-year-color"
				type="color"
				bind:value={theme['timeline-horizontal-year-color']}
				oninput={handleChange}
			/>
			<input
				type="text"
				bind:value={theme['timeline-horizontal-year-color']}
				oninput={handleChange}
				placeholder="#78350f"
			/>
		</div>

		<div class="control-group">
			<label for="horizontal-year-bg">Jaar achtergrond</label>
			<input
				id="horizontal-year-bg"
				type="color"
				bind:value={theme['timeline-horizontal-year-bg']}
				oninput={handleChange}
			/>
			<input
				type="text"
				bind:value={theme['timeline-horizontal-year-bg']}
				oninput={handleChange}
				placeholder="#fdf6e9"
			/>
		</div>

		<div class="control-group">
			<label for="horizontal-connector-color">Connector lijn</label>
			<input
				id="horizontal-connector-color"
				type="color"
				bind:value={theme['timeline-horizontal-connector-color']}
				oninput={handleChange}
			/>
			<input
				type="text"
				bind:value={theme['timeline-horizontal-connector-color']}
				oninput={handleChange}
				placeholder="#f59e0b"
			/>
		</div>

		<div class="control-group">
			<label for="horizontal-card-shadow">Kaart schaduw</label>
			<input
				type="text"
				id="horizontal-card-shadow"
				bind:value={theme['timeline-horizontal-card-shadow']}
				oninput={handleChange}
				placeholder="0 4px 10px rgba(0, 0, 0, 0.2)"
				class="full-width"
			/>
		</div>
	</section>

	<!-- ===== SCROLL BUTTONS ===== -->
	<section class="editor-section">
		<h3>Scroll Knoppen (Mobiel)</h3>

		<div class="control-group">
			<label for="scroll-btn-bg">Achtergrond</label>
			<input
				id="scroll-btn-bg"
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
			<label for="scroll-btn-border">Rand</label>
			<input
				id="scroll-btn-border"
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
			<label for="scroll-btn-color">Icoontje kleur</label>
			<input
				id="scroll-btn-color"
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
			<label for="scroll-btn-hover-bg">Hover achtergrond</label>
			<input
				id="scroll-btn-hover-bg"
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
	</section>
</div>

<style>
	.style-editor {
		padding: 2rem;
		max-width: 800px;
	}

	h2 {
		margin: 0 0 2rem 0;
		font-size: 1.5rem;
		color: #111827;
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
