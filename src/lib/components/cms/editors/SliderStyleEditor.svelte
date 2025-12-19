<!-- SliderStyleEditor.svelte - cleaned and restored -->
<script lang="ts">
	import { onMount } from 'svelte';
	import type { Theme } from '$lib/types';

	// Allow indexing theme with arbitrary string keys used for theme values.
	export let theme: Theme & Record<string, any> = {};
	export let onsave: () => Promise<void> | void = () => {};

	// Ensure sensible defaults
	if (!theme['slider-indicator-style']) theme['slider-indicator-style'] = 'dots';
	if (!theme['slider-btn-bg']) theme['slider-btn-bg'] = '#ffffff';
	if (!theme['slider-btn-hover-bg']) theme['slider-btn-hover-bg'] = '#ffffff';
	if (!theme['slider-btn-color']) theme['slider-btn-color'] = '#1f2937';
	if (!theme['slider-dots-bg']) theme['slider-dots-bg'] = '#ffffff';
	if (!theme['slider-dots-border-radius']) theme['slider-dots-border-radius'] = '50px';
	if (!theme['slider-dots-padding']) theme['slider-dots-padding'] = '6px 12px';
	if (!theme['slider-dots-gap']) theme['slider-dots-gap'] = '8px';
	if (!theme['slider-dot-size']) theme['slider-dot-size'] = '12px';
	if (!theme['slider-dot-bg']) theme['slider-dot-bg'] = '#ffffff';
	if (!theme['slider-dot-border-width']) theme['slider-dot-border-width'] = '2px';
	if (!theme['slider-dot-border-radius']) theme['slider-dot-border-radius'] = '50%';
	if (!theme['slider-dot-active-bg']) theme['slider-dot-active-bg'] = '#d10a10';

	// Local UI state for the button opacity slider (0-100)
	let btnOpacity = Math.round((parseColor(theme['slider-btn-bg'])?.a ?? 1) * 100);
	let containerOpacity = Math.round((parseColor(theme['slider-container-bg'])?.a ?? 1) * 100);

	// Track whether transparency is enabled (controls whether opacity slider is active)
	let useBtnTransparency = (parseColor(theme['slider-btn-bg'])?.a ?? 1) < 1;
	let useContainerTransparency = (parseColor(theme['slider-container-bg'])?.a ?? 1) < 1;

	// Keep a last-alpha so we can restore a reasonable default when enabling transparency
	let lastBtnAlpha = parseColor(theme['slider-btn-bg'])?.a ?? 1;
	let lastContainerAlpha = parseColor(theme['slider-container-bg'])?.a ?? 1;

	onMount(() => {
		btnOpacity = Math.round((parseColor(theme['slider-btn-bg'])?.a ?? 1) * 100);
		containerOpacity = Math.round((parseColor(theme['slider-container-bg'])?.a ?? 1) * 100);
		useBtnTransparency = (parseColor(theme['slider-btn-bg'])?.a ?? 1) < 1;
		useContainerTransparency = (parseColor(theme['slider-container-bg'])?.a ?? 1) < 1;
		lastBtnAlpha = parseFloat((parseColor(theme['slider-btn-bg'])?.a ?? 1).toString());
		lastContainerAlpha = parseFloat((parseColor(theme['slider-container-bg'])?.a ?? 1).toString());
	});

	// Helpers
	function parseColor(color?: string): { r: number; g: number; b: number; a: number } | null {
		if (!color) return null;
		color = color.trim();
		if (color === 'transparent') return { r: 255, g: 255, b: 255, a: 0 };
		if (color.startsWith('#')) {
			const hex = color.slice(1);
			if (hex.length === 3) {
				const r = parseInt(hex[0] + hex[0], 16);
				const g = parseInt(hex[1] + hex[1], 16);
				const b = parseInt(hex[2] + hex[2], 16);
				return { r, g, b, a: 1 };
			}
			if (hex.length === 6) {
				const r = parseInt(hex.slice(0, 2), 16);
				const g = parseInt(hex.slice(2, 4), 16);
				const b = parseInt(hex.slice(4, 6), 16);
				return { r, g, b, a: 1 };
			}
		}
		const rgba = color.match(/rgba?\(([^)]+)\)/);
		if (rgba) {
			const parts = rgba[1].split(',').map((p) => p.trim());
			const r = Number(parts[0]);
			const g = Number(parts[1]);
			const b = Number(parts[2]);
			const a = parts.length === 4 ? Number(parts[3]) : 1;
			return { r, g, b, a };
		}
		return null;
	}

	function toRgbaString(c: { r: number; g: number; b: number; a: number }) {
		return `rgba(${Math.round(c.r)}, ${Math.round(c.g)}, ${Math.round(c.b)}, ${Number(c.a).toFixed(2)})`;
	}

	// Indicator style helpers
	$: isDots = theme['slider-indicator-style'] === 'dots';
	$: isBars = theme['slider-indicator-style'] === 'bars';

	// Update helpers used by inputs
	function toggleTransparentBg(checked: boolean) {
		useBtnTransparency = checked;
		const c = parseColor(theme['slider-btn-bg']) ?? { r: 255, g: 255, b: 255, a: 1 };
		if (checked) {
			// enable transparency: restore last alpha if it was <1, otherwise default to 0.8
			const alpha = lastBtnAlpha < 1 ? lastBtnAlpha : 0.8;
			theme['slider-btn-bg'] = toRgbaString({ r: c.r, g: c.g, b: c.b, a: alpha });
			btnOpacity = Math.round(alpha * 100);
		} else {
			// disable transparency: make fully opaque
			theme['slider-btn-bg'] = toRgbaString({ r: c.r, g: c.g, b: c.b, a: 1 });
			btnOpacity = 100;
		}
		lastBtnAlpha = parseFloat((parseColor(theme['slider-btn-bg'])?.a ?? 1).toString());
		onsave();
	}

	function onBtnOpacityInput(v: number) {
		// ensure transparency mode is active when dragging
		if (!useBtnTransparency) {
			useBtnTransparency = true;
		}
		btnOpacity = v;
		const alpha = v / 100;
		const c = parseColor(theme['slider-btn-bg']) ?? { r: 255, g: 255, b: 255, a: 1 };
		theme['slider-btn-bg'] = toRgbaString({ r: c.r, g: c.g, b: c.b, a: alpha });
	}

	function onBtnOpacityChange() {
		lastBtnAlpha = parseColor(theme['slider-btn-bg'])?.a ?? 1;
		onsave();
	}

	function toggleContainerTransparent(checked: boolean) {
		useContainerTransparency = checked;
		const c = parseColor(theme['slider-container-bg']) ?? { r: 255, g: 255, b: 255, a: 1 };
		if (checked) {
			const alpha = lastContainerAlpha < 1 ? lastContainerAlpha : 0.8;
			theme['slider-container-bg'] = toRgbaString({ r: c.r, g: c.g, b: c.b, a: alpha });
			containerOpacity = Math.round(alpha * 100);
		} else {
			theme['slider-container-bg'] = toRgbaString({ r: c.r, g: c.g, b: c.b, a: 1 });
			containerOpacity = 100;
		}
		lastContainerAlpha = parseFloat((parseColor(theme['slider-container-bg'])?.a ?? 1).toString());
		onsave();
	}

	function onContainerOpacityInput(v: number) {
		if (!useContainerTransparency) useContainerTransparency = true;
		containerOpacity = v;
		const alpha = v / 100;
		const c = parseColor(theme['slider-container-bg']) ?? { r: 255, g: 255, b: 255, a: 1 };
		theme['slider-container-bg'] = toRgbaString({ r: c.r, g: c.g, b: c.b, a: alpha });
		onsave();
	}

	function onContainerOpacityChange() {
		lastContainerAlpha = parseColor(theme['slider-container-bg'])?.a ?? 1;
		onsave();
	}
</script>

<div class="style-editor">
	<!-- SECTIE: Achtergrondkleur slider -->
	<div class="section">
		<h3>Achtergrondkleur slider</h3>
		<div class="control-group">
			<div class="color-control">
				<input
					id="slider-bg"
					type="color"
					bind:value={theme['slider-container-bg']}
					on:change={onsave}
				/>
				<input
					type="text"
					class="color-value"
					bind:value={theme['slider-container-bg']}
					on:change={onsave}
					placeholder="#ffffff"
				/>
			</div>
		</div>
	</div>
	<!-- Navigatie Knoppen -->
	<div class="section">
		<h3>Navigatie Knoppen (‹ ›)</h3>

		<div class="control-group">
			<label for="btn-bg">Achtergrondkleur</label>
			<div class="color-control">
				<input id="btn-bg" type="color" bind:value={theme['slider-btn-bg']} on:change={onsave} />
				<input
					type="text"
					class="color-value"
					bind:value={theme['slider-btn-bg']}
					on:change={onsave}
					placeholder="rgba(255,255,255,0.9)"
				/>
			</div>
			<span class="hint">Ondersteunt rgba voor transparantie</span>

			<div style="display:flex;gap:0.75rem;align-items:center;margin-top:0.5rem;">
				<label class="checkbox-label" style="margin:0;">
					<input
						type="checkbox"
						on:change={(e) => toggleTransparentBg((e.target as HTMLInputElement).checked)}
					/>
					<span>Transparant</span>
				</label>

				<div style="display:flex;align-items:center;gap:0.5rem;">
					<input
						id="slider-btn-opacity"
						type="range"
						class="range-input"
						min="0"
						max="1"
						step="0.01"
						value={parseColor(theme['slider-btn-bg'])?.a ?? 1}
						disabled={!useBtnTransparency}
						on:input={(e) => {
							const v = Number((e.target as HTMLInputElement).value);
							const c = parseColor(theme['slider-btn-bg']) ?? { r: 255, g: 255, b: 255, a: 1 };
							theme['slider-btn-bg'] = toRgbaString({ r: c.r, g: c.g, b: c.b, a: v });
							btnOpacity = Math.round(v * 100);
							// live update while dragging
							onsave();
						}}
					/>
					<span style="min-width:36px;text-align:center;font-size:0.875rem;color:#374151;"
						>{btnOpacity}%</span
					>
				</div>
			</div>
		</div>

		<div class="control-group">
			<label for="btn-hover-bg">Hover achtergrond</label>
			<div class="color-control">
				<input
					id="btn-hover-bg"
					type="color"
					bind:value={theme['slider-btn-hover-bg']}
					on:change={onsave}
				/>
				<input
					type="text"
					class="color-value"
					bind:value={theme['slider-btn-hover-bg']}
					on:change={onsave}
					placeholder="rgba(255,255,255,1)"
				/>
			</div>
			<span class="hint">Ondersteunt rgba voor transparantie</span>
		</div>

		<div class="control-group">
			<label for="btn-color">Icoon kleur</label>
			<div class="color-control">
				<input
					id="btn-color"
					type="color"
					bind:value={theme['slider-btn-color']}
					on:change={onsave}
				/>
				<input
					type="text"
					class="color-value"
					bind:value={theme['slider-btn-color']}
					on:change={onsave}
					placeholder="#1f2937"
				/>
			</div>
		</div>

		<div class="control-group">
			<label for="btn-size">Knop grootte</label>
			<input
				id="btn-size"
				type="text"
				bind:value={theme['slider-btn-size']}
				on:change={onsave}
				placeholder="40px"
				class="text-input"
			/>
			<span class="hint">Bijv: 40px, 3rem</span>
		</div>
	</div>

	<!-- Indicator Stijl -->
	<div class="section">
		<h3>Indicator Stijl</h3>

		<div class="control-group">
			<div class="indicator-choice">
				<label class="indicator-option">
					<input
						type="radio"
						name="indicator-style"
						value="dots"
						checked={theme['slider-indicator-style'] === 'dots'}
						on:change={() => {
							theme['slider-indicator-style'] = 'dots';
							onsave();
						}}
					/>
					<span class="indicator-visual">
						<span class="preview-dots">
							<span class="preview-dot"></span>
							<span class="preview-dot"></span>
							<span class="preview-dot active"></span>
							<span class="preview-dot"></span>
						</span>
					</span>
					<span class="indicator-label">Ronde dots</span>
				</label>

				<label class="indicator-option">
					<input
						type="radio"
						name="indicator-style"
						value="bars"
						checked={theme['slider-indicator-style'] === 'bars'}
						on:change={() => {
							theme['slider-indicator-style'] = 'bars';
							onsave();
						}}
					/>
					<span class="indicator-visual">
						<span class="preview-bars">
							<span class="preview-bar"></span>
							<span class="preview-bar"></span>
							<span class="preview-bar active"></span>
							<span class="preview-bar"></span>
						</span>
					</span>
					<span class="indicator-label">Strepen</span>
				</label>
			</div>
		</div>
	</div>

	<!-- Always show container options for both dots and bars -->
	<div class="section">
		<h3>Indicator Container</h3>

		<div class="control-group">
			<label for="dots-bg">Achtergrondkleur</label>
			<div class="color-control">
				<input
					id="dots-bg"
					type="color"
					bind:value={theme['slider-dots-bg']}
					on:change={onsave}
				/>
				<input
					type="text"
					class="color-value"
					bind:value={theme['slider-dots-bg']}
					on:change={onsave}
					placeholder="rgba(255,255,255,0.9)"
				/>
			</div>
			<span class="hint">Voor transparant: gebruik 'transparent' of rgba(255,255,255,0)</span>
		</div>

		<div class="control-group">
			<label for="dots-radius">Afronding container</label>
			<input
				id="dots-radius"
				type="text"
				bind:value={theme['slider-dots-border-radius']}
				on:change={onsave}
				placeholder="50px"
				class="text-input"
			/>
			<span class="hint">Rond: 50px of 999px (pill), hoekig: 8px of 12px</span>
		</div>

		<div class="control-group">
			<label for="dots-padding">Padding container</label>
			<input
				id="dots-padding"
				type="text"
				bind:value={theme['slider-dots-padding']}
				on:change={onsave}
				placeholder="6px 12px"
				class="text-input"
			/>
			<span class="hint">Bijv: 4px 8px, 0.5rem 1rem</span>
		</div>

		<div class="control-group">
			<label for="dots-gap">Afstand tussen {isDots ? 'dots' : 'strepen'}</label>
			<input
				id="dots-gap"
				type="text"
				bind:value={theme['slider-dots-gap']}
				on:change={onsave}
				placeholder="8px"
				class="text-input"
			/>
			<span class="hint">Bijv: 8px, 0.5rem</span>
		</div>
	</div>

	<div class="section">
		<h3>{isDots ? 'Dots' : 'Bars'} (Actief)</h3>

		<div class="control-group">
			<label for="dot-size">{isDots ? 'Grootte (diameter)' : 'Hoogte'}</label>
			<input
				id="dot-size"
				type="text"
				bind:value={theme['slider-dot-size']}
				on:change={onsave}
				placeholder={isDots ? '12px' : '6px'}
				class="text-input"
			/>
			<span class="hint"
				>{isDots
					? 'Bijv: 12px, 14px, 1rem'
					: 'Hoogte van de streep. Breedte is 20px standaard'}</span
			>
		</div>

		<div class="control-group">
			<label for="dot-border-radius">Vorm (afronding hoeken)</label>
			<input
				id="dot-border-radius"
				type="text"
				bind:value={theme['slider-dot-border-radius']}
				on:change={onsave}
				placeholder={isDots ? '50%' : '2px'}
				class="text-input"
			/>
			<span class="hint"
				>{isDots
					? 'Rond: 50% of 100px. Vierkant: 0'
					: 'Rechthoekig: 0 of 2px. Afgerond: 4px of 8px'}</span
			>
		</div>

		<div class="control-group">
			<label for="dot-active-bg">Achtergrondkleur</label>
			<div class="color-control">
				<input
					id="dot-active-bg"
					type="color"
					bind:value={theme['slider-dot-active-bg']}
					on:change={onsave}
				/>
				<input
					type="text"
					class="color-value"
					bind:value={theme['slider-dot-active-bg']}
					on:change={onsave}
					placeholder="#d10a10"
				/>
			</div>
		</div>
	</div>

	<div class="section">
		<h3>{isDots ? 'Dots' : 'Bars'} (Inactief)</h3>

		<div class="control-group">
			<label for="dot-bg">Achtergrondkleur</label>
			<div class="color-control">
				<input id="dot-bg" type="color" bind:value={theme['slider-dot-bg']} on:change={onsave} />
				<input
					type="text"
					class="color-value"
					bind:value={theme['slider-dot-bg']}
					on:change={onsave}
					placeholder="#ffffff"
				/>
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

	.control-group {
		margin-bottom: 1rem;
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

	.indicator-choice {
		display: flex;
		gap: 1rem;
		margin-top: 0.5rem;
	}

	.indicator-option {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.5rem;
		padding: 1rem;
		border: 2px solid #e5e7eb;
		border-radius: 8px;
		cursor: pointer;
		transition: all 0.2s ease;
		background: white;
	}

	.indicator-option:hover {
		border-color: #d1d5db;
		background: #f9fafb;
	}

	.indicator-option input[type='radio'] {
		width: 18px;
		height: 18px;
		cursor: pointer;
		accent-color: #d10a10;
	}

	.indicator-option:has(input[type='radio']:checked) {
		border-color: #d10a10;
		background: rgba(209, 10, 16, 0.04);
	}

	.indicator-visual {
		padding: 0.75rem;
		background: #f3f4f6;
		border-radius: 6px;
		transition: transform 0.2s ease;
	}

	.preview-dots,
	.preview-bars {
		display: flex;
		gap: 6px;
		align-items: center;
		padding: 4px 8px;
		background: rgba(255, 255, 255, 0.9);
		border-radius: 16px;
	}

	.preview-bars {
		background: transparent;
		padding: 0;
	}

	.preview-dot {
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background: #d1d5db; /* show inactive dots as gray */
		border: none;
		transition: all 0.2s ease;
	}

	.preview-dot.active {
		background: #d10a10;
		border: none;
		transform: scale(1.2);
	}

	.preview-bar {
		width: 20px;
		height: 6px;
		border-radius: 2px;
		background: white;
		border: none;
		transition: all 0.2s ease;
	}

	.preview-bar.active {
		background: #d10a10;
		border: none;
		transform: scale(1.15);
	}

	.indicator-label {
		font-size: 0.8125rem;
		font-weight: 500;
		color: #4b5563;
		text-align: center;
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

	/* Range styling is provided by global .range-input in src/app.css */
</style>
