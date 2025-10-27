<!-- src/lib/components/cms/editors/HeadingStyleEditor.svelte -->
<script lang="ts">
	import type { Theme } from '$lib/types';

	let {
		theme = $bindable(),
		onsave,
		level = 'h2'
	} = $props<{
		theme: Theme;
		onsave: () => Promise<void>;
		level: 'h2' | 'h4';
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
		defaultSize: string;
		defaultWeight: string;
		defaultColor: string;
	};

	const configs: Record<'h2' | 'h4', Config> = {
		h2: {
			title: 'Kop (H2)',
			sizeKey: 'font-size-h2',
			weightKey: 'font-weight-headings',
			colorKey: 'color-text',
			styleKey: 'font-style-h2',
			defaultSize: '2rem',
			defaultWeight: '700',
			defaultColor: '#000000'
		},
		h4: {
			title: 'Tussenkop (H4)',
			sizeKey: 'font-size-h4',
			weightKey: 'font-weight-subheading',
			colorKey: 'color-subheading',
			styleKey: 'font-style-h4',
			defaultSize: '1.25rem',
			defaultWeight: '600',
			defaultColor: '#4b5563'
		}
	};

	const config = $derived(configs[level as 'h2' | 'h4']);

	let showBackground = $state(theme[`${level}-background-enabled`] === 'true');

	// ✅ Sync + cleanup
	$effect(() => {
		const enabled = theme[`${level}-background-enabled`] === 'true';
		showBackground = enabled;

		if (!enabled && level === 'h4') {
			delete theme[`${level}-background-color`];
			delete theme[`${level}-background-text-color`];
			delete theme[`${level}-background-padding`];
		}
	});
</script>

<div class="style-editor">
	<div class="editor-header">
		<h3>{config.title}</h3>
		<p class="editor-description">Pas de stijl van {level.toUpperCase()} koppen aan</p>
	</div>

	<div class="controls">
		<!-- Tekstkleur -->
		<div class="control-group">
			<label for="{level}-color">Tekstkleur</label>
			<div class="color-control">
				<input
					id="{level}-color"
					type="color"
					bind:value={theme[config.colorKey]}
					onchange={onsave}
				/>
				<input
					type="text"
					class="color-value"
					bind:value={theme[config.colorKey]}
					onchange={onsave}
					placeholder={config.defaultColor}
				/>
			</div>
		</div>

		<!-- Lettergrootte -->
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

		<!-- Letterdikte -->
		<div class="control-group">
			<label for="{level}-weight">Letterdikte</label>
			<select id="{level}-weight" bind:value={theme[config.weightKey]} onchange={onsave}>
				<option value="">Standaard ({config.defaultWeight})</option>
				<option value="400">Normal (400)</option>
				<option value="500">Medium (500)</option>
				<option value="600">Semi-bold (600)</option>
				<option value="700">Bold (700)</option>
				<option value="800">Extra-bold (800)</option>
			</select>
		</div>

		<!-- Italic Toggle -->
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

		<!-- ✅ ACHTERGROND BALKJE (ALLEEN H4) -->
		{#if level === 'h4'}
			<div class="section-divider"></div>

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
								theme[`${level}-background-color`] =
									theme[`${level}-background-color`] || '#000000';
								theme[`${level}-background-text-color`] =
									theme[`${level}-background-text-color`] || '#ffffff';
								theme[`${level}-background-padding`] =
									theme[`${level}-background-padding`] || '0.2rem 0.5rem';
							}

							await onsave();
						}}
					/>
					<span>Achtergrondkleur Balkje</span>
				</label>
			</div>

			{#if showBackground}
				<div class="control-group indent">
					<label for="{level}-bg">Achtergrondkleur</label>
					<div class="color-control">
						<input
							id="{level}-bg"
							type="color"
							bind:value={theme[`${level}-background-color`]}
							onchange={onsave}
						/>
						<input
							type="text"
							class="color-value"
							bind:value={theme[`${level}-background-color`]}
							onchange={onsave}
							placeholder="#000000"
						/>
					</div>
				</div>

				<div class="control-group indent">
					<label for="{level}-bg-text-color">Tekstkleur op Balkje</label>
					<div class="color-control">
						<input
							id="{level}-bg-text-color"
							type="color"
							bind:value={theme[`${level}-background-text-color`]}
							onchange={onsave}
						/>
						<input
							type="text"
							class="color-value"
							bind:value={theme[`${level}-background-text-color`]}
							onchange={onsave}
							placeholder="#ffffff"
						/>
					</div>
				</div>

				<div class="control-group indent">
					<label for="{level}-bg-padding">Padding Balkje</label>
					<input
						id="{level}-bg-padding"
						type="text"
						bind:value={theme[`${level}-background-padding`]}
						onchange={onsave}
						placeholder="0.2rem 0.5rem"
						class="text-input"
					/>
					<span class="hint">Bijv: 0.2rem 0.5rem, 4px 8px</span>
				</div>
			{/if}
		{/if}
	</div>
</div>

<!-- ... bestaande styles ... -->

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

	.control-group.indent {
		margin-left: 2rem;
		padding-left: 1rem;
		border-left: 2px solid #e5e7eb;
	}

	.section-divider {
		height: 1px;
		background: #e5e7eb;
		margin: 1rem 0;
	}

	label {
		font-weight: 600;
		font-size: 0.875rem;
		color: #374151;
		text-transform: uppercase;
		letter-spacing: 0.05em;
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
	.text-input {
		flex: 1;
		padding: 0.5rem 0.75rem;
		border: 1px solid #e5e7eb;
		border-radius: 6px;
		font-size: 0.875rem;
		color: #374151;
	}

	.color-value {
		font-family: 'SF Mono', Monaco, monospace;
	}

	.text-input:focus,
	.color-value:focus {
		outline: none;
		border-color: #667eea;
		box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
	}

	.hint {
		font-size: 0.75rem;
		color: #9ca3af;
		font-style: italic;
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
