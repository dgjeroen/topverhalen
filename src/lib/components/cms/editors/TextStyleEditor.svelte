<!-- src/lib/components/cms/editors/TextStyleEditor.svelte -->
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
	<!-- SECTIE: Normale Tekst -->
	<div class="section">
		<h3>Normale Tekst</h3>

		<div class="control-group">
			<label for="text-color">Tekstkleur</label>
			<div class="color-control">
				<input id="text-color" type="color" bind:value={theme['text-color']} onchange={onsave} />
				<input
					type="text"
					class="color-value"
					bind:value={theme['text-color']}
					onchange={onsave}
					placeholder="Gebruik standaard"
				/>
			</div>
		</div>

		<div class="control-group">
			<label for="text-size">Lettergrootte</label>
			<input
				id="text-size"
				type="text"
				bind:value={theme['text-font-size']}
				onchange={onsave}
				placeholder="1rem"
				class="text-input"
			/>
			<span class="hint">Bijv: 1rem, 16px, 1.125em</span>
		</div>

		<div class="control-group">
			<label for="text-weight">Letterdikte</label>
			<select id="text-weight" bind:value={theme['text-font-weight']} onchange={onsave}>
				<option value="">Standaard (400)</option>
				<option value="300">Light (300)</option>
				<option value="400">Normal (400)</option>
				<option value="500">Medium (500)</option>
				<option value="600">Semi-bold (600)</option>
			</select>
		</div>

		<div class="control-group">
			<label for="line-height">Regelafstand</label>
			<input
				id="line-height"
				type="text"
				bind:value={theme['text-line-height']}
				onchange={onsave}
				placeholder="1.6"
				class="text-input"
			/>
			<span class="hint">Bijv: 1.5, 1.6, 1.75</span>
		</div>
	</div>

	<!-- SECTIE: Inleiding (Lead) -->
	<div class="section">
		<h3>Inleiding (Lead Tekst)</h3>

		<div class="control-group">
			<label for="lead-size">Lettergrootte</label>
			<input
				id="lead-size"
				type="text"
				bind:value={theme['text-lead-font-size']}
				onchange={onsave}
				placeholder="1.2rem"
				class="text-input"
			/>
			<span class="hint">Groter dan normale tekst</span>
		</div>

		<div class="control-group">
			<label for="lead-weight">Letterdikte</label>
			<select id="lead-weight" bind:value={theme['text-lead-font-weight']} onchange={onsave}>
				<option value="">Standaard (500)</option>
				<option value="400">Normal (400)</option>
				<option value="500">Medium (500)</option>
				<option value="600">Semi-bold (600)</option>
				<option value="700">Bold (700)</option>
			</select>
		</div>

		<div class="control-group">
			<label for="lead-color">Tekstkleur</label>
			<div class="color-control">
				<input
					id="lead-color"
					type="color"
					bind:value={theme['text-lead-color']}
					onchange={onsave}
				/>
				<input
					type="text"
					class="color-value"
					bind:value={theme['text-lead-color']}
					onchange={onsave}
					placeholder="Gebruik standaard"
				/>
			</div>
		</div>
	</div>

	<!-- SECTIE: Markdown Elementen -->
	<div class="section">
		<h3>Markdown Elementen</h3>

		<!-- Vetgedrukt -->
		<div class="subsection">
			<h4>Vetgedrukt (**tekst**)</h4>

			<div class="control-group">
				<label class="checkbox-label">
					<input
						type="checkbox"
						checked={theme['text-bold-weight'] !== '400'}
						onchange={(e) => {
							theme['text-bold-weight'] = e.currentTarget.checked ? '700' : '400';
							onsave();
						}}
					/>
					<span>Vetgedrukt weergeven</span>
				</label>
			</div>

			<div class="control-group">
				<label for="bold-color">Kleur</label>
				<div class="color-control">
					<input
						id="bold-color"
						type="color"
						bind:value={theme['text-bold-color']}
						onchange={onsave}
					/>
					<input
						type="text"
						class="color-value"
						bind:value={theme['text-bold-color']}
						onchange={onsave}
						placeholder="Gebruik standaard tekstkleur"
					/>
				</div>
			</div>
		</div>

		<!-- Links -->
		<div class="subsection">
			<h4>Links ([tekst](url))</h4>

			<div class="control-group">
				<label for="link-color">Kleur</label>
				<div class="color-control">
					<input
						id="link-color"
						type="color"
						bind:value={theme['text-link-color']}
						onchange={onsave}
					/>
					<input
						type="text"
						class="color-value"
						bind:value={theme['text-link-color']}
						onchange={onsave}
						placeholder="Gebruik accent kleur"
					/>
				</div>
			</div>

			<div class="control-group">
				<label for="link-decoration">Decoratie</label>
				<select id="link-decoration" bind:value={theme['text-link-decoration']} onchange={onsave}>
					<option value="">Standaard (underline)</option>
					<option value="underline">Onderstreept</option>
					<option value="none">Geen onderstreping</option>
				</select>
			</div>

			<div class="control-group">
				<label for="link-thickness">Lijndikte</label>
				<input
					id="link-thickness"
					type="text"
					bind:value={theme['text-link-thickness']}
					onchange={onsave}
					placeholder="1px"
					class="text-input"
				/>
				<span class="hint">Bijv: 1px, 2px, 0.1em</span>
			</div>
		</div>

		<!-- Underline -->
		<div class="subsection">
			<h4>Onderstreept (__tekst__)</h4>

			<div class="control-group">
				<label for="underline-thickness">Lijndikte</label>
				<input
					id="underline-thickness"
					type="text"
					bind:value={theme['text-underline-thickness']}
					onchange={onsave}
					placeholder="1px"
					class="text-input"
				/>
				<span class="hint">Bijv: 1px, 2px, 0.1em</span>
			</div>

			<div class="control-group">
				<label for="underline-color">Kleur</label>
				<div class="color-control">
					<input
						id="underline-color"
						type="color"
						bind:value={theme['text-underline-color']}
						onchange={onsave}
					/>
					<input
						type="text"
						class="color-value"
						bind:value={theme['text-underline-color']}
						onchange={onsave}
						placeholder="Gebruik tekstkleur"
					/>
				</div>
			</div>
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

	.subsection {
		padding: 1rem;
		background: white;
		border-radius: 6px;
		margin-bottom: 1rem;
		border: 1px solid #e5e7eb;
	}

	.subsection:last-child {
		margin-bottom: 0;
	}

	h4 {
		margin: 0 0 0.75rem 0;
		font-size: 0.8125rem;
		font-weight: 600;
		color: #6b7280;
	}

	.checkbox-label {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		cursor: pointer;
		user-select: none;
	}

	.checkbox-label input[type='checkbox'] {
		width: 18px;
		height: 18px;
		cursor: pointer;
		accent-color: #d10a10;
	}

	.checkbox-label span {
		font-size: 0.875rem;
		color: #374151;
		font-weight: 500;
	}

	.control-group {
		display: flex;
		flex-direction: column;
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
