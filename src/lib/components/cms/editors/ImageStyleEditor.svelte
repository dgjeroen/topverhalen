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

	function handleChange() {
		onsave();
	}
</script>

<div class="style-editor">
	<!-- SECTIE: Afbeelding -->
	<div class="section">
		<h3>Afbeelding</h3>

		<div class="control-group">
			<label class="input-label" for="image-radius">Afronding Hoeken</label>
			<input
				id="image-radius"
				type="text"
				bind:value={theme['image-border-radius']}
				onchange={handleChange}
				placeholder="8px"
				class="input-field"
			/>
			<span class="hint">Bijv: 8px, 1rem, 0 (geen), 16px</span>
		</div>

		<div class="control-group">
			<label class="input-label" for="image-shadow">Schaduw</label>
			<input
				id="image-shadow"
				type="text"
				bind:value={theme['image-box-shadow']}
				onchange={handleChange}
				placeholder="none"
				class="input-field"
			/>
			<span class="hint">Bijv: 0 4px 6px rgba(0,0,0,0.1) of none</span>
		</div>
	</div>

	<!-- SECTIE: Hover Effect -->
	<div class="section">
		<h3>Hover Effect</h3>

		<div class="control-group">
			<span class="input-label">Hover Effect</span>
			<select
				id="hover-effect"
				bind:value={theme['image-hover-effect']}
				onchange={handleChange}
				class="input-field"
			>
				<option value="lift">Omhoog bewegen (container)</option>
				<option value="zoom">Inzoomen (afbeelding vergroot)</option>
				<option value="none">Geen effect</option>
			</select>
			<span class="hint"
				>Omhoog = hele foto beweegt. Zoom = foto wordt groter binnen kader. Werkt alleen als
				parallax uitstaat.</span
			>
		</div>

		<div class="control-group">
			<label class="input-label" for="hover-shadow">Hover Schaduw</label>
			<input
				id="hover-shadow"
				type="text"
				bind:value={theme['image-hover-shadow']}
				onchange={handleChange}
				placeholder="0 4px 12px rgba(0,0,0,0.15)"
				class="input-field"
			/>
			<span class="hint">Bijv: 0 8px 16px rgba(0,0,0,0.2)</span>
		</div>
	</div>
	<p
		class="control-hint"
		style="margin: 0; font-size: 0.75rem; color: #6b7280; white-space: nowrap;"
	>
		💡 Tip: Styling van bijschrift en bron zijn verhuisd naar Algemeen.
	</p>
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

	.input-label {
		display: block;
		font-size: 0.8125rem;
		font-weight: 600;
		color: #4b5563;
		margin-bottom: 0.375rem;
	}

	.input-field {
		width: 100%;
		padding: 0.5rem;
		border: 1px solid #d1d5db;
		border-radius: 4px;
		font-size: 0.875rem;
		background: white;
		box-sizing: border-box;
		color: #374151;
	}

	.input-field:focus {
		border-color: #d10a10;
		outline: none;
	}

	.color-input-group {
		display: flex;
		gap: 0.5rem;
		align-items: center;
	}

	.color-picker {
		width: 40px;
		height: 38px;
		border: 1px solid #d1d5db;
		border-radius: 4px;
		cursor: pointer;
		padding: 0;
		background: none;
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
