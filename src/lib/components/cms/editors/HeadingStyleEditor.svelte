<!--src\lib\components\cms\editors\HeadingStyleEditor.svelte-->
<script lang="ts">
	import type { Theme } from '$lib/types';

	let {
		theme = $bindable(),
		onsave,
		level = 'h2'
	} = $props<{
		theme: Theme;
		onsave: () => Promise<void>;
		level: 'h2' | 'h3' | 'h4';
	}>();

	$effect(() => {
		if (!theme) theme = {};
	});

	type Config = {
		title: string;
		sizeKey: string;
		weightKey: string;
		colorKey: string;
		styleKey: string;
		marginKey: string;
		lineHeightKey: string;
		defaultSize: string;
		defaultWeight: string;
		defaultColor: string;
		defaultMargin: string;
		defaultLineHeight: string;
	};

	const configs: Record<'h2' | 'h3' | 'h4', Config> = {
		h2: {
			title: 'Kop (H2)',
			sizeKey: 'font-size-h2',
			weightKey: 'font-weight-headings',
			colorKey: 'h2-color',
			styleKey: 'font-style-h2',
			marginKey: 'h2-margin-bottom',
			lineHeightKey: 'h2-line-height',
			defaultSize: '2.5rem',
			defaultWeight: '700',
			defaultColor: '#000000',
			defaultMargin: '1rem',
			defaultLineHeight: '1.3'
		},
		h3: {
			title: 'Extra Tussenkop (H3)',
			sizeKey: 'font-size-h3',
			weightKey: 'font-weight-subheading-medium',
			colorKey: 'h3-color',
			styleKey: 'font-style-h3',
			marginKey: 'h3-margin-bottom',
			lineHeightKey: 'h3-line-height',
			defaultSize: '1.5rem',
			defaultWeight: '700',
			defaultColor: '#374151',
			defaultMargin: '0.5rem',
			defaultLineHeight: '1.3'
		},
		h4: {
			title: 'Tussenkop (H4)',
			sizeKey: 'font-size-h4',
			weightKey: 'font-weight-subheading',
			colorKey: 'h4-color',
			styleKey: 'font-style-h4',
			marginKey: 'h4-margin-bottom',
			lineHeightKey: 'h4-line-height',
			defaultSize: '1.125rem',
			defaultWeight: '500',
			defaultColor: '#4b5563',
			defaultMargin: '0.5rem',
			defaultLineHeight: '1.3'
		}
	};

	const config = $derived(configs[level as keyof typeof configs]);

	let headingColor = $state('');

	function updateHeadingColor(value: string) {
		headingColor = value;
		theme[config.colorKey] = value;
	}

	$effect(() => {
		headingColor = theme[config.colorKey] || config.defaultColor;
	});

	let showBackground = $state(theme[`${level}-background-enabled`] === 'true');

	let backgroundColor = $state('');
	let textColor = $state('');
	let padding = $state('');

	function updateBackgroundColor(value: string) {
		backgroundColor = value;
		theme[`${level}-background-color`] = value;
	}

	function updateTextColor(value: string) {
		textColor = value;
		theme[`${level}-background-text-color`] = value;
	}

	function updatePadding(value: string) {
		padding = value;
		theme[`${level}-background-padding`] = value;
	}

	$effect(() => {
		const enabled = theme[`${level}-background-enabled`] === 'true';
		showBackground = enabled;

		if (enabled) {
			backgroundColor = theme[`${level}-background-color`] || '#000000';
			textColor = theme[`${level}-background-text-color`] || '#ffffff';
			padding = theme[`${level}-background-padding`] || '0.2rem 0.5rem';
		} else {
			delete theme[`${level}-background-color`];
			delete theme[`${level}-background-text-color`];
			delete theme[`${level}-background-padding`];
		}
	});
</script>

<div class="style-editor">
	<!-- SECTIE: Basis Styling -->
	<div class="section">
		<h3>Basis Styling</h3>

		<div class="control-group">
			<label for="{level}-color">Tekstkleur</label>
			<div class="color-control">
				<input
					id="{level}-color"
					type="color"
					value={headingColor}
					oninput={(e) => updateHeadingColor(e.currentTarget.value)}
					onchange={onsave}
				/>
				<input
					type="text"
					class="color-value"
					value={headingColor}
					oninput={(e) => updateHeadingColor(e.currentTarget.value)}
					onchange={onsave}
					placeholder={config.defaultColor}
				/>
			</div>
		</div>

		<div class="control-group">
			<label for="{level}-size">Lettergrootte</label>
			<input
				id="{level}-size"
				type="text"
				bind:value={theme[config.sizeKey]}
				onchange={onsave}
				placeholder={config.defaultSize}
				class="text-input"
			/>
			<span class="hint">Bijv: 2rem, 24px, 1.5em</span>
		</div>

		<div class="control-group">
			<label for="{level}-weight">Letterdikte</label>
			<select id="{level}-weight" bind:value={theme[config.weightKey]} onchange={onsave}>
				{#if config.defaultWeight === '400'}
					<option value="">Standaard (Regular)</option>
				{:else if config.defaultWeight === '500'}
					<option value="">Standaard (Medium)</option>
				{:else if config.defaultWeight === '700'}
					<option value="">Standaard (Bold)</option>
				{:else}
					<option value="">Standaard (Black)</option>
				{/if}
				<option value="400">Regular (400)</option>
				<option value="500">Medium (500)</option>
				<option value="700">Bold (700)</option>
				<option value="900">Black (900)</option>
			</select>
		</div>

		<div class="control-group">
			<label for="{level}-margin">Witruimte onder</label>
			<input
				id="{level}-margin"
				type="text"
				bind:value={theme[config.marginKey]}
				onchange={onsave}
				placeholder={config.defaultMargin}
				class="text-input"
			/>
			<span class="hint">Bijv: 0.5rem, 1rem, 2rem</span>
		</div>

		<div class="control-group">
			<label for="{level}-line-height">Regelafstand (Line Height)</label>
			<input
				id="{level}-line-height"
				type="text"
				bind:value={theme[config.lineHeightKey]}
				onchange={onsave}
				placeholder={config.defaultLineHeight}
				class="text-input"
			/>
			<span class="hint">Bijv: 1.2, 1.3, 1.5 (zonder eenheid)</span>
		</div>

		<div class="control-group">
			<label class="checkbox-label">
				<input
					type="checkbox"
					checked={theme[config.styleKey] === 'italic'}
					onchange={(e) => {
						theme[config.styleKey] = e.currentTarget.checked ? 'italic' : '';
						onsave();
					}}
				/>
				<span>Cursief (Italic)</span>
			</label>
		</div>
	</div>

	<!-- SECTIE: Achtergrond Balkje (alleen H3 en H4) -->
	{#if level === 'h3' || level === 'h4'}
		<div class="section">
			<h3>Achtergrond Balkje</h3>

			<div class="control-group">
				<label class="checkbox-label">
					<input
						type="checkbox"
						bind:checked={showBackground}
						onchange={async (e) => {
							const checked = e.currentTarget.checked;
							theme[`${level}-background-enabled`] = checked ? 'true' : '';

							if (!checked) {
								delete theme[`${level}-background-color`];
								delete theme[`${level}-background-text-color`];
								delete theme[`${level}-background-padding`];
							} else {
								theme[`${level}-background-color`] = '#000000';
								theme[`${level}-background-text-color`] = '#ffffff';
								theme[`${level}-background-padding`] = '0.2rem 0.5rem';
							}

							await onsave();
						}}
					/>
					<span>Achtergrondkleur Balkje Inschakelen</span>
				</label>
			</div>

			{#if showBackground}
				<div class="control-group">
					<label for="{level}-bg">Achtergrondkleur</label>
					<div class="color-control">
						<input
							id="{level}-bg"
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
							placeholder="#000000"
						/>
					</div>
				</div>

				<div class="control-group">
					<label for="{level}-bg-text-color">Tekstkleur op Balkje</label>
					<div class="color-control">
						<input
							id="{level}-bg-text-color"
							type="color"
							value={textColor}
							oninput={(e) => updateTextColor(e.currentTarget.value)}
							onchange={onsave}
						/>
						<input
							type="text"
							class="color-value"
							value={textColor}
							oninput={(e) => updateTextColor(e.currentTarget.value)}
							onchange={onsave}
							placeholder="#ffffff"
						/>
					</div>
				</div>

				<div class="control-group">
					<label for="{level}-bg-padding">Padding Balkje</label>
					<input
						id="{level}-bg-padding"
						type="text"
						value={padding}
						oninput={(e) => updatePadding(e.currentTarget.value)}
						onchange={onsave}
						placeholder="0.2rem 0.5rem"
						class="text-input"
					/>
					<span class="hint">Bijv: 0.2rem 0.5rem, 4px 8px</span>
				</div>
			{/if}
		</div>
	{/if}
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

	.checkbox-label {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		cursor: pointer;
		user-select: none;
		font-size: 0.875rem;
		color: #374151;
		padding: 0.5rem 0;
		transition: color 0.15s ease;
		text-transform: none;
		letter-spacing: normal;
		font-weight: 500;
	}

	.checkbox-label:hover {
		color: #111827;
	}

	.checkbox-label input[type='checkbox'] {
		width: 18px;
		height: 18px;
		margin: 0;
		cursor: pointer;
		accent-color: #d10a10;
	}
</style>
