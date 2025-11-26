<script lang="ts">
	import type { Theme, ContentBlock } from '$lib/types';

	let { theme = $bindable(), onsave } = $props<{
		theme: Theme;
		activeBlock?: ContentBlock;
		onsave: () => Promise<void>;
	}>();

	const fontOptions = [
		{
			value: "var(--font-family-flama), 'Arial Narrow', sans-serif",
			label: 'Standaard Koppen (Flama SC)'
		},
		{ value: 'var(--font-family-acumin), sans-serif', label: 'Acumin Pro (Extra Condensed)' },
		{ value: 'Arial, sans-serif', label: 'Standaard Tekst (Arial)' },
		{ value: 'Inter, sans-serif', label: 'Inter' },
		{ value: 'Georgia, serif', label: 'Georgia' },
		{ value: '"Courier New", monospace', label: 'Courier New' }
	];

	const fontWeightOptions = [
		{ value: '300', label: '300 (Light)' },
		{ value: '400', label: '400 (Normal)' },
		{ value: '500', label: '500 (Medium)' },
		{ value: '600', label: '600 (Semibold)' },
		{ value: '700', label: '700 (Bold)' },
		{ value: '800', label: '800 (Extra Bold)' },
		{ value: '900', label: '900 (Black)' }
	];

	// --- HELPERS ---
	function getSize(val: string | undefined, defaultVal: number): number {
		if (!val) return defaultVal;
		return parseFloat(val);
	}

	// Reactive size getters
	let titleSize = $derived(getSize(theme['hero-title-size'], 4));
	let titleSizeMobile = $derived(getSize(theme['hero-title-size-mobile'], 2.0));
	let labelSize = $derived(getSize(theme['hero-label-size'], 1.5));
	let labelSizeMobile = $derived(getSize(theme['hero-label-size-mobile'], 1.0));

	function handleSizeInput(key: string, event: Event) {
		const input = event.currentTarget as HTMLInputElement;
		const val = parseFloat(input.value);
		if (!isNaN(val)) {
			theme[key] = `${val}rem`;
			handleChange();
		}
	}

	function handleOpacityInput(event: Event) {
		const input = event.currentTarget as HTMLInputElement;
		theme['hero-overlay-opacity'] = parseFloat(input.value);
		handleChange();
	}

	function handleChange() {
		onsave();
	}

	// ✅ NIEUW: Toggle mobiele kleur
	function toggleMobileColor(keyMobile: string, keyDesktop: string, isChecked: boolean) {
		if (isChecked) {
			// Als aangevinkt: kopieer desktop kleur als startpunt
			theme[keyMobile] = theme[keyDesktop] || '#ffffff';
		} else {
			// Als uitgevinkt: verwijder mobiele kleur (activeert fallback)
			theme[keyMobile] = undefined;
		}
		handleChange();
	}

	const icons = {
		alignLeft:
			'<path d="M21 6H3M15 12H3M17 18H3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
		alignCenter:
			'<path d="M21 6H3M17 12H7M19 18H5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
		alignRight:
			'<path d="M21 6H3M21 12H9M21 18H7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
		posTop:
			'<path d="M12 3V15M8 7L12 3L16 7M4 21H20" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
		posMiddle:
			'<path d="M12 3V21M4 12H20" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
		posBottom:
			'<path d="M12 21V9M16 17L12 21L8 17M4 3H20" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>'
	};
</script>

<div class="style-editor">
	<div class="section">
		<h3>Positie op het scherm</h3>
		<div class="control-group">
			<span class="input-label">Verticale Positie (Gehele blok)</span>
			<div class="icon-group">
				<button
					class:active={theme['hero-position-y'] === 'flex-start'}
					onclick={() => {
						theme['hero-position-y'] = 'flex-start';
						handleChange();
					}}
					title="Boven"
				>
					<svg viewBox="0 0 24 24" fill="none" style="transform: rotate(180deg);"
						>{@html icons.posBottom}</svg
					>
				</button>
				<button
					class:active={!theme['hero-position-y'] || theme['hero-position-y'] === 'center'}
					onclick={() => {
						theme['hero-position-y'] = 'center';
						handleChange();
					}}
					title="Midden"
				>
					<svg viewBox="0 0 24 24" fill="none">{@html icons.posMiddle}</svg>
				</button>
				<button
					class:active={theme['hero-position-y'] === 'flex-end'}
					onclick={() => {
						theme['hero-position-y'] = 'flex-end';
						handleChange();
					}}
					title="Onder"
				>
					<svg viewBox="0 0 24 24" fill="none">{@html icons.posBottom}</svg>
				</button>
			</div>
		</div>
	</div>

	<div class="section">
		<h3>Titel Styling</h3>

		<div class="control-group">
			<span class="input-label">Uitlijning (Tekst)</span>
			<div class="icon-group">
				<button
					class:active={theme['hero-text-align'] === 'left'}
					onclick={() => {
						theme['hero-text-align'] = 'left';
						theme['hero-align-items'] = 'flex-start';
						handleChange();
					}}
					title="Links"
				>
					<svg viewBox="0 0 24 24" fill="none">{@html icons.alignLeft}</svg>
				</button>
				<button
					class:active={!theme['hero-text-align'] || theme['hero-text-align'] === 'center'}
					onclick={() => {
						theme['hero-text-align'] = 'center';
						theme['hero-align-items'] = 'center';
						handleChange();
					}}
					title="Gecentreerd"
				>
					<svg viewBox="0 0 24 24" fill="none">{@html icons.alignCenter}</svg>
				</button>
				<button
					class:active={theme['hero-text-align'] === 'right'}
					onclick={() => {
						theme['hero-text-align'] = 'right';
						theme['hero-align-items'] = 'flex-end';
						handleChange();
					}}
					title="Rechts"
				>
					<svg viewBox="0 0 24 24" fill="none">{@html icons.alignRight}</svg>
				</button>
			</div>
		</div>

		<div class="control-row-grid">
			<div class="control-group">
				<span class="input-label">Font</span>
				<select
					id="hero-title-font"
					bind:value={theme['hero-title-font']}
					onchange={handleChange}
					class="input-field"
				>
					{#each fontOptions as option}
						<option value={option.value}>{option.label}</option>
					{/each}
				</select>
			</div>
			<div class="control-group">
				<span class="input-label">Font Weight</span>
				<select
					id="hero-title-weight"
					bind:value={theme['hero-title-weight']}
					onchange={handleChange}
					class="input-field"
				>
					{#each fontWeightOptions as option}
						<option value={option.value}>{option.label}</option>
					{/each}
				</select>
			</div>
		</div>

		<div class="control-row-grid">
			<div class="control-group">
				<label class="input-label" for="hero-title-size">Grootte desktop (rem)</label>
				<input
					id="hero-title-size"
					type="number"
					step="0.1"
					value={titleSize}
					oninput={(e) => handleSizeInput('hero-title-size', e)}
					class="input-field"
				/>
			</div>
			<div class="control-group">
				<label class="input-label" for="hero-title-size-mobile">Grootte mobiel (rem)</label>
				<input
					id="hero-title-size-mobile"
					type="number"
					step="0.1"
					value={titleSizeMobile}
					oninput={(e) => handleSizeInput('hero-title-size-mobile', e)}
					class="input-field"
				/>
			</div>
		</div>

		<div class="control-group">
			<span class="input-label">Kleur</span>
			<div class="color-input-group">
				<input
					type="color"
					bind:value={theme['hero-title-color']}
					oninput={handleChange}
					class="color-picker"
				/>
				<input
					type="text"
					bind:value={theme['hero-title-color']}
					oninput={handleChange}
					class="input-field"
				/>
			</div>
		</div>

		<div class="control-group" style="margin-top: 0.5rem;">
			<label class="checkbox-label">
				<input
					type="checkbox"
					checked={!!theme['hero-title-color-mobile']}
					onchange={(e) =>
						toggleMobileColor(
							'hero-title-color-mobile',
							'hero-title-color',
							e.currentTarget.checked
						)}
				/>
				<span>Aparte kleur mobiel</span>
			</label>
		</div>

		{#if theme['hero-title-color-mobile']}
			<div class="control-group indent">
				<span class="input-label">Kleur Mobiel</span>
				<div class="color-input-group">
					<input
						type="color"
						bind:value={theme['hero-title-color-mobile']}
						oninput={handleChange}
						class="color-picker"
					/>
					<input
						type="text"
						bind:value={theme['hero-title-color-mobile']}
						oninput={handleChange}
						class="input-field"
					/>
				</div>
			</div>
		{/if}

		<div class="checkbox-row">
			<label class="checkbox-label">
				<input
					type="checkbox"
					checked={theme['hero-title-transform'] === 'uppercase'}
					onchange={(e) => {
						theme['hero-title-transform'] = e.currentTarget.checked ? 'uppercase' : 'none';
						handleChange();
					}}
				/>
				<span>Hoofdletters</span>
			</label>
			<label class="checkbox-label">
				<input
					type="checkbox"
					checked={theme['hero-title-style'] === 'italic'}
					onchange={(e) => {
						theme['hero-title-style'] = e.currentTarget.checked ? 'italic' : 'normal';
						handleChange();
					}}
				/>
				<span>Cursief</span>
			</label>
		</div>
	</div>

	<div class="section">
		<h3>Label Styling</h3>

		<div class="control-group">
			<span class="input-label">Uitlijning (t.o.v. Kop)</span>
			<div class="icon-group">
				<button
					class:active={theme['hero-label-align'] === 'flex-start'}
					onclick={() => {
						theme['hero-label-align'] = 'flex-start';
						handleChange();
					}}
					title="Links"
				>
					<svg viewBox="0 0 24 24" fill="none">{@html icons.alignLeft}</svg>
				</button>
				<button
					class:active={!theme['hero-label-align'] || theme['hero-label-align'] === 'center'}
					onclick={() => {
						theme['hero-label-align'] = 'center';
						handleChange();
					}}
					title="Midden"
				>
					<svg viewBox="0 0 24 24" fill="none">{@html icons.alignCenter}</svg>
				</button>
				<button
					class:active={theme['hero-label-align'] === 'flex-end'}
					onclick={() => {
						theme['hero-label-align'] = 'flex-end';
						handleChange();
					}}
					title="Rechts"
				>
					<svg viewBox="0 0 24 24" fill="none">{@html icons.alignRight}</svg>
				</button>
			</div>
		</div>

		<div class="control-row-grid">
			<div class="control-group">
				<span class="input-label">Font</span>
				<select
					id="hero-label-font"
					bind:value={theme['hero-label-font']}
					onchange={handleChange}
					class="input-field"
				>
					{#each fontOptions as option}
						<option value={option.value}>{option.label}</option>
					{/each}
				</select>
			</div>
			<div class="control-group">
				<span class="input-label">Font Weight</span>
				<select
					id="hero-label-weight"
					bind:value={theme['hero-label-weight']}
					onchange={handleChange}
					class="input-field"
				>
					{#each fontWeightOptions as option}
						<option value={option.value}>{option.label}</option>
					{/each}
				</select>
			</div>
		</div>

		<div class="control-row-grid">
			<div class="control-group">
				<label class="input-label" for="hero-label-size">Grootte desktop (rem)</label>
				<input
					id="hero-label-size"
					type="number"
					step="0.1"
					value={labelSize}
					oninput={(e) => handleSizeInput('hero-label-size', e)}
					class="input-field"
				/>
			</div>
			<div class="control-group">
				<label class="input-label" for="hero-label-size-mobile">Grootte mobiel (rem)</label>
				<input
					id="hero-label-size-mobile"
					type="number"
					step="0.1"
					value={labelSizeMobile}
					oninput={(e) => handleSizeInput('hero-label-size-mobile', e)}
					class="input-field"
				/>
			</div>
		</div>

		<div class="control-group">
			<span class="input-label">Kleur</span>
			<div class="color-input-group">
				<input
					type="color"
					bind:value={theme['hero-label-color']}
					oninput={handleChange}
					class="color-picker"
				/>
				<input
					type="text"
					bind:value={theme['hero-label-color']}
					oninput={handleChange}
					class="input-field"
				/>
			</div>
		</div>

		<div class="control-group" style="margin-top: 0.5rem;">
			<label class="checkbox-label">
				<input
					type="checkbox"
					checked={!!theme['hero-label-color-mobile']}
					onchange={(e) =>
						toggleMobileColor(
							'hero-label-color-mobile',
							'hero-label-color',
							e.currentTarget.checked
						)}
				/>
				<span>Aparte kleur mobiel</span>
			</label>
		</div>

		{#if theme['hero-label-color-mobile']}
			<div class="control-group indent">
				<span class="input-label">Kleur Mobiel</span>
				<div class="color-input-group">
					<input
						type="color"
						bind:value={theme['hero-label-color-mobile']}
						oninput={handleChange}
						class="color-picker"
					/>
					<input
						type="text"
						bind:value={theme['hero-label-color-mobile']}
						oninput={handleChange}
						class="input-field"
					/>
				</div>
			</div>
		{/if}

		<div class="checkbox-row">
			<label class="checkbox-label">
				<input
					type="checkbox"
					checked={theme['hero-label-transform'] === 'uppercase'}
					onchange={(e) => {
						theme['hero-label-transform'] = e.currentTarget.checked ? 'uppercase' : 'none';
						handleChange();
					}}
				/>
				<span>Hoofdletters</span>
			</label>
			<label class="checkbox-label">
				<input
					type="checkbox"
					checked={theme['hero-label-style'] === 'italic'}
					onchange={(e) => {
						theme['hero-label-style'] = e.currentTarget.checked ? 'italic' : 'normal';
						handleChange();
					}}
				/>
				<span>Cursief</span>
			</label>
		</div>
	</div>

	<div class="section">
		<h3>Bron Styling</h3>

		<div class="control-group">
			<span class="input-label">Uitlijning (t.o.v. Kop)</span>
			<div class="icon-group">
				<button
					class:active={theme['hero-source-align'] === 'flex-start'}
					onclick={() => {
						theme['hero-source-align'] = 'flex-start';
						handleChange();
					}}
					title="Links"
				>
					<svg viewBox="0 0 24 24" fill="none">{@html icons.alignLeft}</svg>
				</button>
				<button
					class:active={!theme['hero-source-align'] || theme['hero-source-align'] === 'center'}
					onclick={() => {
						theme['hero-source-align'] = 'center';
						handleChange();
					}}
					title="Midden"
				>
					<svg viewBox="0 0 24 24" fill="none">{@html icons.alignCenter}</svg>
				</button>
				<button
					class:active={theme['hero-source-align'] === 'flex-end'}
					onclick={() => {
						theme['hero-source-align'] = 'flex-end';
						handleChange();
					}}
					title="Rechts"
				>
					<svg viewBox="0 0 24 24" fill="none">{@html icons.alignRight}</svg>
				</button>
			</div>
		</div>

		<div class="control-group" style="margin-top: 1rem;">
			<span class="input-label">Kleur</span>
			<div class="color-input-group">
				<input
					type="color"
					bind:value={theme['hero-source-color']}
					oninput={handleChange}
					class="color-picker"
				/>
				<input
					type="text"
					bind:value={theme['hero-source-color']}
					oninput={handleChange}
					class="input-field"
				/>
			</div>
		</div>

		<div class="control-group" style="margin-top: 0.5rem;">
			<label class="checkbox-label">
				<input
					type="checkbox"
					checked={!!theme['hero-source-color-mobile']}
					onchange={(e) =>
						toggleMobileColor(
							'hero-source-color-mobile',
							'hero-source-color',
							e.currentTarget.checked
						)}
				/>
				<span>Aparte kleur mobiel</span>
			</label>
		</div>

		{#if theme['hero-source-color-mobile']}
			<div class="control-group indent">
				<span class="input-label">Kleur Mobiel</span>
				<div class="color-input-group">
					<input
						type="color"
						bind:value={theme['hero-source-color-mobile']}
						oninput={handleChange}
						class="color-picker"
					/>
					<input
						type="text"
						bind:value={theme['hero-source-color-mobile']}
						oninput={handleChange}
						class="input-field"
					/>
				</div>
			</div>
		{/if}
	</div>

	<div class="section">
		<h3>Sfeer</h3>
		<div class="control-group">
			<label class="input-label" for="hero-overlay-opacity"
				>Overlay Opacity ({Math.round((theme['hero-overlay-opacity'] ?? 0.5) * 100)}%)</label
			>
			<input
				id="hero-overlay-opacity"
				type="range"
				min="0"
				max="1"
				step="0.01"
				value={theme['hero-overlay-opacity'] ?? 0.5}
				oninput={handleOpacityInput}
				class="range-input"
			/>
		</div>
	</div>
</div>

<style>
	.style-editor {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
		padding: 2rem;
		max-width: 600px;
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
	.control-row-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 0.75rem;
	}

	.indent {
		margin-left: 1.5rem;
		border-left: 2px solid #e5e7eb;
		padding-left: 1rem;
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

	.checkbox-row {
		display: flex;
		gap: 1.5rem;
		margin-top: 0.5rem;
	}
	.checkbox-label {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		cursor: pointer;
		font-size: 0.875rem;
		user-select: none;
		color: #374151;
		font-weight: 400;
	}
	.checkbox-label input {
		accent-color: #d10a10;
		width: 16px;
		height: 16px;
	}

	.range-input {
		width: 100%;
		accent-color: #d10a10;
		cursor: pointer;
	}

	.icon-group {
		display: flex;
		background: white;
		border: 1px solid #d1d5db;
		border-radius: 4px;
		overflow: hidden;
		width: 100%;
	}
	.icon-group button {
		flex: 1;
		padding: 0.6rem;
		border: none;
		background: white;
		cursor: pointer;
		border-right: 1px solid #d1d5db;
		color: #6b7280;
		transition: all 0.1s;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.icon-group button:last-child {
		border-right: none;
	}
	.icon-group button:hover {
		background: #f3f4f6;
		color: #374151;
	}
	.icon-group button.active {
		background: #fef2f2;
		color: #d10a10;
	}
	.icon-group svg {
		width: 20px;
		height: 20px;
	}
</style>
