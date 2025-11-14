<script lang="ts">
	import type { Theme } from '$lib/types';

	let { theme = $bindable(), onsave } = $props<{
		theme: Theme;
		onsave: () => Promise<void>;
	}>();

	$effect(() => {
		if (!theme) theme = {};
	});

	// ✅ Sync toggle state
	let syncMobileDesktop = $state(theme['timeline-sync-mobile-desktop'] === 'true');

	// ✅ Sync effect: kopieer desktop waarden naar mobile
	$effect(() => {
		if (syncMobileDesktop) {
			// Kleuren
			theme['timeline-mobile-line-color'] = theme['timeline-line-color'];
			theme['timeline-mobile-marker-bg'] = theme['timeline-marker-bg'];
			theme['timeline-mobile-marker-border-color'] = theme['timeline-marker-border-color'];
			theme['timeline-mobile-card-bg'] = theme['timeline-card-bg'];
			theme['timeline-mobile-year-color'] = theme['timeline-year-color'];
			theme['timeline-mobile-connector-color'] = theme['timeline-line-color'];

			// Maten
			theme['timeline-mobile-line-height'] = theme['timeline-line-width'];
			theme['timeline-mobile-marker-size'] = theme['timeline-marker-size'];
			theme['timeline-mobile-marker-border-width'] = theme['timeline-marker-border-width'];
			theme['timeline-mobile-card-padding'] = theme['timeline-card-padding'];
			theme['timeline-mobile-card-border-radius'] = theme['timeline-card-border-radius'];
			theme['timeline-mobile-card-shadow'] = theme['timeline-card-shadow'];
			theme['timeline-mobile-connector-width'] = theme['timeline-line-width'];
		}
	});

	// ============================================
	// STATE MANAGEMENT
	// ============================================
	let titleColor = $state('');
	let lineColor = $state('');
	let markerBg = $state('');
	let markerBorderColor = $state('');
	let cardBg = $state('');
	let yearColor = $state('');
	let textColor = $state('');
	let mobileYearBg = $state('');
	let mobileButtonBg = $state('');
	let mobileButtonBorder = $state('');
	let mobileButtonIconColor = $state('');
	let mobileCardBorderColor = $state('');

	function updateTitleColor(value: string) {
		titleColor = value;
		theme['timeline-title-color'] = value;
	}
	function updateLineColor(value: string) {
		lineColor = value;
		theme['timeline-line-color'] = value;
		if (syncMobileDesktop) {
			theme['timeline-mobile-line-color'] = value;
			theme['timeline-mobile-connector-color'] = value;
		}
	}
	function updateMarkerBg(value: string) {
		markerBg = value;
		theme['timeline-marker-bg'] = value;
		if (syncMobileDesktop) theme['timeline-mobile-marker-bg'] = value;
	}
	function updateMarkerBorderColor(value: string) {
		markerBorderColor = value;
		theme['timeline-marker-border-color'] = value;
		if (syncMobileDesktop) theme['timeline-mobile-marker-border-color'] = value;
	}
	function updateCardBg(value: string) {
		cardBg = value;
		theme['timeline-card-bg'] = value;
		if (syncMobileDesktop) theme['timeline-mobile-card-bg'] = value;
	}
	function updateYearColor(value: string) {
		yearColor = value;
		theme['timeline-year-color'] = value;
		if (syncMobileDesktop) theme['timeline-mobile-year-color'] = value;
	}
	function updateTextColor(value: string) {
		textColor = value;
		theme['timeline-text-color'] = value;
	}
	function updateMobileYearBg(value: string) {
		mobileYearBg = value;
		theme['timeline-mobile-year-bg'] = value;
	}
	function updateMobileButtonBg(value: string) {
		mobileButtonBg = value;
		theme['timeline-mobile-button-bg'] = value;
	}
	function updateMobileButtonBorder(value: string) {
		mobileButtonBorder = value;
		theme['timeline-mobile-button-border'] = value;
	}
	function updateMobileButtonIconColor(value: string) {
		mobileButtonIconColor = value;
		theme['timeline-mobile-button-icon-color'] = value;
	}
	function updateMobileCardBorderColor(value: string) {
		mobileCardBorderColor = value;
		theme['timeline-mobile-card-border-color'] = value;
	}

	// ============================================
	// SYNC EFFECTS
	// ============================================
	$effect(() => {
		titleColor = theme['timeline-title-color'] || '#111827';
		lineColor = theme['timeline-line-color'] || '#f59e0b';
		markerBg = theme['timeline-marker-bg'] || '#fdf6e9';
		markerBorderColor = theme['timeline-marker-border-color'] || '#2c5599';
		cardBg = theme['timeline-card-bg'] || '#fdf6e9';
		yearColor = theme['timeline-year-color'] || '#f59e0b';
		textColor = theme['timeline-text-color'] || '#111827';
		mobileYearBg = theme['timeline-mobile-year-bg'] || '#fdf6e9';
		mobileButtonBg = theme['timeline-mobile-button-bg'] || 'rgba(255, 255, 255, 0.9)';
		mobileButtonBorder = theme['timeline-mobile-button-border'] || '#ddd';
		mobileButtonIconColor = theme['timeline-mobile-button-icon-color'] || '#78350f';
		mobileCardBorderColor = theme['timeline-mobile-card-border-color'] || '#e4b483';
	});
</script>

<div class="style-editor">
	<div class="editor-header">
		<h3>Tijdlijn</h3>
		<p class="editor-description">Pas de stijl van de tijdlijn aan</p>
	</div>

	<div class="controls">
		<!-- ============================================ -->
		<!-- SYNC TOGGLE                                  -->
		<!-- ============================================ -->
		<div class="control-group sync-toggle-group">
			<label class="checkbox-label">
				<input
					type="checkbox"
					bind:checked={syncMobileDesktop}
					onchange={async (e) => {
						const checked = e.currentTarget.checked;
						theme['timeline-sync-mobile-desktop'] = checked ? 'true' : '';
						await onsave();
					}}
				/>
				<span>Mobiel en Desktop gelijk houden</span>
			</label>
			<span class="hint">Als aan: mobiele styling volgt desktop automatisch</span>
		</div>

		<div class="section-divider"></div>

		<!-- ============================================ -->
		<!-- GEDEELDE STYLING (Desktop + Mobile)          -->
		<!-- ============================================ -->
		<div class="section-header">
			<h4>Algemeen</h4>
		</div>

		<!-- Titel -->
		<div class="control-group">
			<label for="timeline-title-color">Titelkleur</label>
			<div class="color-control">
				<input
					id="timeline-title-color"
					type="color"
					value={titleColor}
					oninput={(e) => updateTitleColor(e.currentTarget.value)}
					onchange={onsave}
				/>
				<input
					type="text"
					class="color-value"
					value={titleColor}
					oninput={(e) => updateTitleColor(e.currentTarget.value)}
					onchange={onsave}
					placeholder="#111827"
				/>
			</div>
		</div>

		<div class="control-group">
			<label for="timeline-title-size">Titelgrootte</label>
			<input
				id="timeline-title-size"
				type="text"
				bind:value={theme['timeline-title-size']}
				onchange={onsave}
				placeholder="2rem"
				class="text-input"
			/>
			<span class="hint">Bijv: 2rem, 24px, 1.5em</span>
		</div>

		<div class="control-group">
			<label for="timeline-title-weight">Titeldikte</label>
			<select
				id="timeline-title-weight"
				bind:value={theme['timeline-title-weight']}
				onchange={onsave}
			>
				<option value="">Standaard (Bold)</option>
				<option value="400">Regular (400)</option>
				<option value="500">Medium (500)</option>
				<option value="700">Bold (700)</option>
				<option value="900">Black (900)</option>
			</select>
		</div>

		<div class="section-divider"></div>

		<!-- Lijn -->
		<div class="control-group">
			<label for="timeline-line-color">Lijnkleur</label>
			<div class="color-control">
				<input
					id="timeline-line-color"
					type="color"
					value={lineColor}
					oninput={(e) => updateLineColor(e.currentTarget.value)}
					onchange={onsave}
				/>
				<input
					type="text"
					class="color-value"
					value={lineColor}
					oninput={(e) => updateLineColor(e.currentTarget.value)}
					onchange={onsave}
					placeholder="#f59e0b"
				/>
			</div>
			{#if syncMobileDesktop}
				<span class="hint sync-hint">✓ Ook voor mobiel</span>
			{/if}
		</div>

		<div class="control-group">
			<label for="timeline-line-width">Lijnbreedte</label>
			<input
				id="timeline-line-width"
				type="text"
				bind:value={theme['timeline-line-width']}
				onchange={async () => {
					if (syncMobileDesktop) {
						theme['timeline-mobile-line-height'] = theme['timeline-line-width'];
						theme['timeline-mobile-connector-width'] = theme['timeline-line-width'];
					}
					await onsave();
				}}
				placeholder="4px"
				class="text-input"
			/>
			<span class="hint">Bijv: 2px, 4px, 0.25rem</span>
		</div>

		<div class="section-divider"></div>

		<!-- Marker -->
		<div class="control-group">
			<label for="timeline-marker-size">Marker grootte</label>
			<input
				id="timeline-marker-size"
				type="text"
				bind:value={theme['timeline-marker-size']}
				onchange={async () => {
					if (syncMobileDesktop) {
						theme['timeline-mobile-marker-size'] = theme['timeline-marker-size'];
					}
					await onsave();
				}}
				placeholder="1rem"
				class="text-input"
			/>
			<span class="hint">Bijv: 1rem, 16px</span>
		</div>

		<div class="control-group">
			<label for="timeline-marker-bg">Marker achtergrond</label>
			<div class="color-control">
				<input
					id="timeline-marker-bg"
					type="color"
					value={markerBg}
					oninput={(e) => updateMarkerBg(e.currentTarget.value)}
					onchange={onsave}
				/>
				<input
					type="text"
					class="color-value"
					value={markerBg}
					oninput={(e) => updateMarkerBg(e.currentTarget.value)}
					onchange={onsave}
					placeholder="#fdf6e9"
				/>
			</div>
			{#if syncMobileDesktop}
				<span class="hint sync-hint">✓ Ook voor mobiel</span>
			{/if}
		</div>

		<div class="control-group">
			<label for="timeline-marker-border-color">Marker randkleur</label>
			<div class="color-control">
				<input
					id="timeline-marker-border-color"
					type="color"
					value={markerBorderColor}
					oninput={(e) => updateMarkerBorderColor(e.currentTarget.value)}
					onchange={onsave}
				/>
				<input
					type="text"
					class="color-value"
					value={markerBorderColor}
					oninput={(e) => updateMarkerBorderColor(e.currentTarget.value)}
					onchange={onsave}
					placeholder="#2c5599"
				/>
			</div>
			{#if syncMobileDesktop}
				<span class="hint sync-hint">✓ Ook voor mobiel</span>
			{/if}
		</div>

		<div class="control-group">
			<label for="timeline-marker-border-width">Marker randbreedte</label>
			<input
				id="timeline-marker-border-width"
				type="text"
				bind:value={theme['timeline-marker-border-width']}
				onchange={async () => {
					if (syncMobileDesktop) {
						theme['timeline-mobile-marker-border-width'] = theme['timeline-marker-border-width'];
					}
					await onsave();
				}}
				placeholder="4px"
				class="text-input"
			/>
			<span class="hint">Bijv: 2px, 4px, 0.25rem</span>
		</div>

		<div class="section-divider"></div>

		<!-- Event Card -->
		<div class="control-group">
			<label for="timeline-card-bg">Kaart achtergrond</label>
			<div class="color-control">
				<input
					id="timeline-card-bg"
					type="color"
					value={cardBg}
					oninput={(e) => updateCardBg(e.currentTarget.value)}
					onchange={onsave}
				/>
				<input
					type="text"
					class="color-value"
					value={cardBg}
					oninput={(e) => updateCardBg(e.currentTarget.value)}
					onchange={onsave}
					placeholder="#fdf6e9"
				/>
			</div>
			{#if syncMobileDesktop}
				<span class="hint sync-hint">✓ Ook voor mobiel</span>
			{/if}
		</div>

		<div class="control-group">
			<label for="timeline-card-padding">Kaart padding</label>
			<input
				id="timeline-card-padding"
				type="text"
				bind:value={theme['timeline-card-padding']}
				onchange={async () => {
					if (syncMobileDesktop) {
						theme['timeline-mobile-card-padding'] = theme['timeline-card-padding'];
					}
					await onsave();
				}}
				placeholder="1rem"
				class="text-input"
			/>
			<span class="hint">Bijv: 1rem, 16px</span>
		</div>

		<div class="control-group">
			<label for="timeline-card-border-radius">Kaart afronding</label>
			<input
				id="timeline-card-border-radius"
				type="text"
				bind:value={theme['timeline-card-border-radius']}
				onchange={async () => {
					if (syncMobileDesktop) {
						theme['timeline-mobile-card-border-radius'] = theme['timeline-card-border-radius'];
					}
					await onsave();
				}}
				placeholder="0.5rem"
				class="text-input"
			/>
			<span class="hint">Bijv: 0.5rem, 8px</span>
		</div>

		<div class="control-group">
			<label for="timeline-card-shadow">Kaart schaduw</label>
			<input
				id="timeline-card-shadow"
				type="text"
				bind:value={theme['timeline-card-shadow']}
				onchange={async () => {
					if (syncMobileDesktop) {
						theme['timeline-mobile-card-shadow'] = theme['timeline-card-shadow'];
					}
					await onsave();
				}}
				placeholder="0 4px 6px rgba(0, 0, 0, 0.1)"
				class="text-input"
			/>
			<span class="hint">Bijv: 0 4px 6px rgba(0,0,0,0.1)</span>
		</div>

		<div class="section-divider"></div>

		<!-- Jaar & Tekst -->
		<div class="control-group">
			<label for="timeline-year-color">Jaarkleur</label>
			<div class="color-control">
				<input
					id="timeline-year-color"
					type="color"
					value={yearColor}
					oninput={(e) => updateYearColor(e.currentTarget.value)}
					onchange={onsave}
				/>
				<input
					type="text"
					class="color-value"
					value={yearColor}
					oninput={(e) => updateYearColor(e.currentTarget.value)}
					onchange={onsave}
					placeholder="#f59e0b"
				/>
			</div>
			{#if syncMobileDesktop}
				<span class="hint sync-hint">✓ Ook voor mobiel</span>
			{/if}
		</div>

		<div class="control-group">
			<label for="timeline-year-size">Jaargrootte</label>
			<input
				id="timeline-year-size"
				type="text"
				bind:value={theme['timeline-year-size']}
				onchange={onsave}
				placeholder="1.125rem"
				class="text-input"
			/>
			<span class="hint">Bijv: 1.125rem, 18px</span>
		</div>

		<div class="control-group">
			<label for="timeline-year-weight">Jaardikte</label>
			<select
				id="timeline-year-weight"
				bind:value={theme['timeline-year-weight']}
				onchange={onsave}
			>
				<option value="">Standaard (Bold)</option>
				<option value="400">Regular (400)</option>
				<option value="500">Medium (500)</option>
				<option value="700">Bold (700)</option>
				<option value="900">Black (900)</option>
			</select>
		</div>

		<div class="control-group">
			<label for="timeline-text-color">Tekstkleur</label>
			<div class="color-control">
				<input
					id="timeline-text-color"
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
					placeholder="#111827"
				/>
			</div>
		</div>

		<div class="control-group">
			<label for="timeline-text-size">Tekstgrootte</label>
			<input
				id="timeline-text-size"
				type="text"
				bind:value={theme['timeline-text-size']}
				onchange={onsave}
				placeholder="0.875rem"
				class="text-input"
			/>
			<span class="hint">Bijv: 0.875rem, 14px</span>
		</div>

		<div class="control-group">
			<label for="timeline-text-line-height">Tekst regelafstand</label>
			<input
				id="timeline-text-line-height"
				type="text"
				bind:value={theme['timeline-text-line-height']}
				onchange={onsave}
				placeholder="1.6"
				class="text-input"
			/>
			<span class="hint">Bijv: 1.6, 1.5</span>
		</div>

		<div class="section-divider"></div>

		<!-- Afbeelding -->
		<div class="control-group">
			<label for="timeline-image-max-width">Afbeelding max breedte</label>
			<input
				id="timeline-image-max-width"
				type="text"
				bind:value={theme['timeline-image-max-width']}
				onchange={onsave}
				placeholder="80px"
				class="text-input"
			/>
			<span class="hint">Bijv: 80px, 5rem</span>
		</div>

		<div class="control-group">
			<label for="timeline-image-border-radius">Afbeelding afronding</label>
			<input
				id="timeline-image-border-radius"
				type="text"
				bind:value={theme['timeline-image-border-radius']}
				onchange={onsave}
				placeholder="0.25rem"
				class="text-input"
			/>
			<span class="hint">Bijv: 0.25rem, 4px</span>
		</div>

		<!-- ============================================ -->
		<!-- MOBIEL-SPECIFIEKE STYLING                    -->
		<!-- ============================================ -->
		{#if !syncMobileDesktop}
			<div class="section-divider-major"></div>

			<div class="section-header">
				<h4>Mobiel Specifiek</h4>
				<p class="section-description">
					Pas mobiele styling apart aan. Desktop waarden worden als fallback gebruikt.
				</p>
			</div>

			<!-- Titel Mobile -->
			<div class="control-group">
				<label for="timeline-mobile-title-align">Titel uitlijning</label>
				<select
					id="timeline-mobile-title-align"
					bind:value={theme['timeline-mobile-title-align']}
					onchange={onsave}
				>
					<option value="">Standaard (Links)</option>
					<option value="left">Links</option>
					<option value="center">Midden</option>
					<option value="right">Rechts</option>
				</select>
			</div>

			<div class="section-divider"></div>

			<!-- Horizontale Lijn -->
			<div class="control-group">
				<label for="timeline-mobile-line-color-manual">Lijnkleur</label>
				<div class="color-control">
					<input
						id="timeline-mobile-line-color-manual"
						type="color"
						bind:value={theme['timeline-mobile-line-color']}
						onchange={onsave}
					/>
					<input
						type="text"
						class="color-value"
						bind:value={theme['timeline-mobile-line-color']}
						onchange={onsave}
						placeholder={theme['timeline-line-color'] || '#f59e0b'}
					/>
				</div>
				<span class="hint">Fallback: desktop lijnkleur</span>
			</div>

			<div class="control-group">
				<label for="timeline-mobile-line-height-manual">Lijnhoogte</label>
				<input
					id="timeline-mobile-line-height-manual"
					type="text"
					bind:value={theme['timeline-mobile-line-height']}
					onchange={onsave}
					placeholder={theme['timeline-line-width'] || '4px'}
					class="text-input"
				/>
				<span class="hint">Fallback: desktop lijnbreedte</span>
			</div>

			<div class="section-divider"></div>

			<!-- Marker Mobile -->
			<div class="control-group">
				<label for="timeline-mobile-marker-size-manual">Marker grootte</label>
				<input
					id="timeline-mobile-marker-size-manual"
					type="text"
					bind:value={theme['timeline-mobile-marker-size']}
					onchange={onsave}
					placeholder={theme['timeline-marker-size'] || '1rem'}
					class="text-input"
				/>
				<span class="hint">Fallback: desktop marker grootte</span>
			</div>

			<div class="control-group">
				<label for="timeline-mobile-marker-bg-manual">Marker achtergrond</label>
				<div class="color-control">
					<input
						id="timeline-mobile-marker-bg-manual"
						type="color"
						bind:value={theme['timeline-mobile-marker-bg']}
						onchange={onsave}
					/>
					<input
						type="text"
						class="color-value"
						bind:value={theme['timeline-mobile-marker-bg']}
						onchange={onsave}
						placeholder={theme['timeline-marker-bg'] || '#f59e0b'}
					/>
				</div>
				<span class="hint">Fallback: desktop marker achtergrond</span>
			</div>

			<div class="control-group">
				<label for="timeline-mobile-marker-border-color-manual">Marker randkleur</label>
				<div class="color-control">
					<input
						id="timeline-mobile-marker-border-color-manual"
						type="color"
						bind:value={theme['timeline-mobile-marker-border-color']}
						onchange={onsave}
					/>
					<input
						type="text"
						class="color-value"
						bind:value={theme['timeline-mobile-marker-border-color']}
						onchange={onsave}
						placeholder={theme['timeline-marker-border-color'] || '#ffffff'}
					/>
				</div>
				<span class="hint">Fallback: desktop marker randkleur</span>
			</div>

			<div class="control-group">
				<label for="timeline-mobile-marker-border-width-manual">Marker randbreedte</label>
				<input
					id="timeline-mobile-marker-border-width-manual"
					type="text"
					bind:value={theme['timeline-mobile-marker-border-width']}
					onchange={onsave}
					placeholder={theme['timeline-marker-border-width'] || '2px'}
					class="text-input"
				/>
				<span class="hint">Fallback: desktop marker randbreedte</span>
			</div>

			<div class="section-divider"></div>

			<!-- Kaart Mobile -->
			<div class="control-group">
				<label for="timeline-mobile-card-width">Kaartbreedte</label>
				<input
					id="timeline-mobile-card-width"
					type="text"
					bind:value={theme['timeline-mobile-card-width']}
					onchange={onsave}
					placeholder="260px"
					class="text-input"
				/>
				<span class="hint">Bijv: 260px, 16rem</span>
			</div>

			<div class="control-group">
				<label for="timeline-mobile-card-bg-manual">Kaart achtergrond</label>
				<div class="color-control">
					<input
						id="timeline-mobile-card-bg-manual"
						type="color"
						bind:value={theme['timeline-mobile-card-bg']}
						onchange={onsave}
					/>
					<input
						type="text"
						class="color-value"
						bind:value={theme['timeline-mobile-card-bg']}
						onchange={onsave}
						placeholder={theme['timeline-card-bg'] || '#fdf6e9'}
					/>
				</div>
				<span class="hint">Fallback: desktop kaart achtergrond</span>
			</div>

			<div class="control-group">
				<label for="timeline-mobile-card-padding-manual">Kaart padding</label>
				<input
					id="timeline-mobile-card-padding-manual"
					type="text"
					bind:value={theme['timeline-mobile-card-padding']}
					onchange={onsave}
					placeholder={theme['timeline-card-padding'] || '1rem'}
					class="text-input"
				/>
				<span class="hint">Fallback: desktop kaart padding</span>
			</div>

			<div class="control-group">
				<label for="timeline-mobile-card-border-radius-manual">Kaart afronding</label>
				<input
					id="timeline-mobile-card-border-radius-manual"
					type="text"
					bind:value={theme['timeline-mobile-card-border-radius']}
					onchange={onsave}
					placeholder={theme['timeline-card-border-radius'] || '0.5rem'}
					class="text-input"
				/>
				<span class="hint">Fallback: desktop kaart afronding</span>
			</div>

			<div class="control-group">
				<label for="timeline-mobile-card-shadow-manual">Kaart schaduw</label>
				<input
					id="timeline-mobile-card-shadow-manual"
					type="text"
					bind:value={theme['timeline-mobile-card-shadow']}
					onchange={onsave}
					placeholder={theme['timeline-card-shadow'] || '0 4px 10px rgba(0, 0, 0, 0.2)'}
					class="text-input"
				/>
				<span class="hint">Fallback: desktop kaart schaduw</span>
			</div>

			<div class="control-group">
				<label for="timeline-mobile-card-border-color">Kaart randkleur</label>
				<div class="color-control">
					<input
						id="timeline-mobile-card-border-color"
						type="color"
						value={mobileCardBorderColor}
						oninput={(e) => updateMobileCardBorderColor(e.currentTarget.value)}
						onchange={onsave}
					/>
					<input
						type="text"
						class="color-value"
						value={mobileCardBorderColor}
						oninput={(e) => updateMobileCardBorderColor(e.currentTarget.value)}
						onchange={onsave}
						placeholder="#e4b483"
					/>
				</div>
			</div>

			<div class="section-divider"></div>

			<!-- Jaar Mobile -->
			<div class="control-group">
				<label for="timeline-mobile-year-color-manual">Jaarkleur</label>
				<div class="color-control">
					<input
						id="timeline-mobile-year-color-manual"
						type="color"
						bind:value={theme['timeline-mobile-year-color']}
						onchange={onsave}
					/>
					<input
						type="text"
						class="color-value"
						bind:value={theme['timeline-mobile-year-color']}
						onchange={onsave}
						placeholder={theme['timeline-year-color'] || '#78350f'}
					/>
				</div>
				<span class="hint">Fallback: desktop jaarkleur</span>
			</div>

			<div class="control-group">
				<label for="timeline-mobile-year-bg">Jaar achtergrond</label>
				<div class="color-control">
					<input
						id="timeline-mobile-year-bg"
						type="color"
						value={mobileYearBg}
						oninput={(e) => updateMobileYearBg(e.currentTarget.value)}
						onchange={onsave}
					/>
					<input
						type="text"
						class="color-value"
						value={mobileYearBg}
						oninput={(e) => updateMobileYearBg(e.currentTarget.value)}
						onchange={onsave}
						placeholder="#fdf6e9"
					/>
				</div>
			</div>

			<div class="section-divider"></div>

			<!-- Connector Lijn -->
			<div class="control-group">
				<label for="timeline-mobile-connector-color-manual">Verbindingslijn kleur</label>
				<div class="color-control">
					<input
						id="timeline-mobile-connector-color-manual"
						type="color"
						bind:value={theme['timeline-mobile-connector-color']}
						onchange={onsave}
					/>
					<input
						type="text"
						class="color-value"
						bind:value={theme['timeline-mobile-connector-color']}
						onchange={onsave}
						placeholder={theme['timeline-line-color'] || '#f59e0b'}
					/>
				</div>
				<span class="hint">Fallback: desktop lijnkleur</span>
			</div>

			<div class="control-group">
				<label for="timeline-mobile-connector-width-manual">Verbindingslijn breedte</label>
				<input
					id="timeline-mobile-connector-width-manual"
					type="text"
					bind:value={theme['timeline-mobile-connector-width']}
					onchange={onsave}
					placeholder={theme['timeline-line-width'] || '2px'}
					class="text-input"
				/>
				<span class="hint">Fallback: desktop lijnbreedte</span>
			</div>

			<div class="section-divider"></div>

			<!-- Afbeelding Mobile -->
			<div class="control-group">
				<label for="timeline-mobile-image-height">Afbeelding hoogte</label>
				<input
					id="timeline-mobile-image-height"
					type="text"
					bind:value={theme['timeline-mobile-image-height']}
					onchange={onsave}
					placeholder="120px"
					class="text-input"
				/>
				<span class="hint">Bijv: 120px, 7.5rem</span>
			</div>

			<div class="section-divider"></div>

			<!-- Scroll Knoppen -->
			<div class="control-group">
				<label for="timeline-mobile-button-size">Knop grootte</label>
				<input
					id="timeline-mobile-button-size"
					type="text"
					bind:value={theme['timeline-mobile-button-size']}
					onchange={onsave}
					placeholder="40px"
					class="text-input"
				/>
				<span class="hint">Bijv: 40px, 2.5rem</span>
			</div>

			<div class="control-group">
				<label for="timeline-mobile-button-bg">Knop achtergrond</label>
				<div class="color-control">
					<input
						id="timeline-mobile-button-bg"
						type="color"
						value={mobileButtonBg}
						oninput={(e) => updateMobileButtonBg(e.currentTarget.value)}
						onchange={onsave}
					/>
					<input
						type="text"
						class="color-value"
						value={mobileButtonBg}
						oninput={(e) => updateMobileButtonBg(e.currentTarget.value)}
						onchange={onsave}
						placeholder="rgba(255, 255, 255, 0.9)"
					/>
				</div>
			</div>

			<div class="control-group">
				<label for="timeline-mobile-button-border">Knop randkleur</label>
				<div class="color-control">
					<input
						id="timeline-mobile-button-border"
						type="color"
						value={mobileButtonBorder}
						oninput={(e) => updateMobileButtonBorder(e.currentTarget.value)}
						onchange={onsave}
					/>
					<input
						type="text"
						class="color-value"
						value={mobileButtonBorder}
						oninput={(e) => updateMobileButtonBorder(e.currentTarget.value)}
						onchange={onsave}
						placeholder="#ddd"
					/>
				</div>
			</div>

			<div class="control-group">
				<label for="timeline-mobile-button-icon-color">Knop icoon kleur</label>
				<div class="color-control">
					<input
						id="timeline-mobile-button-icon-color"
						type="color"
						value={mobileButtonIconColor}
						oninput={(e) => updateMobileButtonIconColor(e.currentTarget.value)}
						onchange={onsave}
					/>
					<input
						type="text"
						class="color-value"
						value={mobileButtonIconColor}
						oninput={(e) => updateMobileButtonIconColor(e.currentTarget.value)}
						onchange={onsave}
						placeholder="#78350f"
					/>
				</div>
			</div>
		{/if}
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

	.section-header {
		margin-top: 1rem;
		margin-bottom: 1rem;
	}

	.section-header h4 {
		margin: 0;
		color: #111827;
		font-size: 1.125rem;
		font-weight: 600;
		padding: 0.5rem 0.75rem;
		background: #f3f4f6;
		border-radius: 6px;
		border-left: 4px solid #d10a10;
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

	.sync-toggle-group {
		background: #fef2f2;
		padding: 1rem;
		border-radius: 8px;
		border: 2px solid #fecaca;
	}

	.section-divider {
		height: 1px;
		background: #e5e7eb;
		margin: 0.5rem 0;
	}

	.section-divider-major {
		height: 2px;
		background: #d1d5db;
		margin: 2rem 0;
	}

	.section-description {
		margin: 0.5rem 0 0 0;
		color: #6b7280;
		font-size: 0.8125rem;
		font-weight: 400;
		padding: 0;
		background: none;
		border: none;
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

	.sync-hint {
		color: #059669;
		font-weight: 600;
		font-style: normal;
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
