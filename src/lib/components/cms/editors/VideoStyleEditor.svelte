<!--src/lib/components/cms/editors/VideoStyleEditor.svelte-->
<script lang="ts">
	import type { Theme } from '$lib/types';

	let { theme = $bindable(), onsave } = $props<{
		theme: Theme;
		onsave: () => Promise<void>;
	}>();

	$effect(() => {
		if (!theme) theme = {};

		// Set default colors if not explicitly set
		if (!theme['video-cover-bg'] || theme['video-cover-bg'] === '') {
			theme['video-cover-bg'] = '#000000';
		}
		if (!theme['video-play-btn-color'] || theme['video-play-btn-color'] === '') {
			theme['video-play-btn-color'] = 'rgba(255, 0, 0, 0.8)';
		}
		if (!theme['video-progress-fill'] || theme['video-progress-fill'] === '') {
			theme['video-progress-fill'] = '#ff0000';
		}
		if (!theme['video-progress-thumb'] || theme['video-progress-thumb'] === '') {
			theme['video-progress-thumb'] = '#ff0000';
		}
		if (!theme['video-volume-thumb'] || theme['video-volume-thumb'] === '') {
			theme['video-volume-thumb'] = '#ffffff';
		}
		if (!theme['video-control-icon'] || theme['video-control-icon'] === '') {
			theme['video-control-icon'] = '#ffffff';
		}
	});

	// Helper functions for play button color with opacity
	function rgbaToHex(rgba: string): string {
		if (rgba.startsWith('#')) return rgba;
		const match = rgba.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
		if (!match) return '#ff0000';
		const r = parseInt(match[1]).toString(16).padStart(2, '0');
		const g = parseInt(match[2]).toString(16).padStart(2, '0');
		const b = parseInt(match[3]).toString(16).padStart(2, '0');
		return `#${r}${g}${b}`;
	}

	function getOpacityFromRgba(rgba: string): number {
		const match = rgba.match(/rgba?\([^,]+,[^,]+,[^,]+,?\s*([0-9.]*)\)/);
		return match && match[1] ? parseFloat(match[1]) : 0.8;
	}

	function hexToRgba(hex: string, alpha: number): string {
		const r = parseInt(hex.slice(1, 3), 16);
		const g = parseInt(hex.slice(3, 5), 16);
		const b = parseInt(hex.slice(5, 7), 16);
		return `rgba(${r}, ${g}, ${b}, ${alpha})`;
	}

	let playButtonHex = $state(rgbaToHex(theme['video-play-btn-color'] || 'rgba(255, 0, 0, 0.8)'));
	let playButtonOpacity = $state(
		getOpacityFromRgba(theme['video-play-btn-color'] || 'rgba(255, 0, 0, 0.8)')
	);

	function updatePlayButtonColor() {
		theme['video-play-btn-color'] = hexToRgba(playButtonHex, playButtonOpacity);
		onsave();
	}
</script>

<div class="style-editor">
	<!-- SECTIE: Cover Overlay -->
	<div class="section">
		<h3>Cover Overlay (wanneer gepauzeerd)</h3>

		<div class="control-group">
			<label for="video-cover-bg">Achtergrondkleur</label>
			<div class="color-control">
				<input
					id="video-cover-bg"
					type="color"
					bind:value={theme['video-cover-bg']}
					onchange={onsave}
				/>
				<input
					type="text"
					class="color-value"
					bind:value={theme['video-cover-bg']}
					onchange={onsave}
					placeholder="#000000"
				/>
			</div>
		</div>

		<div class="control-group">
			<label for="video-play-btn">Afspeelknop Kleur</label>
			<div class="color-control">
				<input
					id="video-play-btn"
					type="color"
					bind:value={playButtonHex}
					onchange={updatePlayButtonColor}
				/>
				<input
					type="text"
					class="color-value"
					value={theme['video-play-btn-color']}
					readonly
					placeholder="rgba(255, 0, 0, 0.8)"
				/>
			</div>
			<div class="opacity-control">
				<label for="play-opacity">Transparantie: {Math.round(playButtonOpacity * 100)}%</label>
				<input
					type="range"
					id="play-opacity"
					bind:value={playButtonOpacity}
					onchange={updatePlayButtonColor}
					min="0"
					max="1"
					step="0.05"
				/>
			</div>
		</div>
	</div>

	<!-- SECTIE: Voortgangsbalk -->
	<div class="section">
		<h3>Voortgangsbalk</h3>

		<div class="control-group">
			<label for="video-progress-fill">Vulkleur</label>
			<div class="color-control">
				<input
					id="video-progress-fill"
					type="color"
					bind:value={theme['video-progress-fill']}
					onchange={onsave}
				/>
				<input
					type="text"
					class="color-value"
					bind:value={theme['video-progress-fill']}
					onchange={onsave}
					placeholder="#ff0000"
				/>
			</div>
		</div>

		<div class="control-group">
			<label for="video-progress-thumb">Schuifknop Kleur</label>
			<div class="color-control">
				<input
					id="video-progress-thumb"
					type="color"
					bind:value={theme['video-progress-thumb']}
					onchange={onsave}
				/>
				<input
					type="text"
					class="color-value"
					bind:value={theme['video-progress-thumb']}
					onchange={onsave}
					placeholder="#ff0000"
				/>
			</div>
		</div>
	</div>

	<!-- SECTIE: Volume & Controls -->
	<div class="section">
		<h3>Volume & Bedieningsknoppen</h3>

		<div class="control-group">
			<label for="video-volume-thumb">Volume Schuifknop</label>
			<div class="color-control">
				<input
					id="video-volume-thumb"
					type="color"
					bind:value={theme['video-volume-thumb']}
					onchange={onsave}
				/>
				<input
					type="text"
					class="color-value"
					bind:value={theme['video-volume-thumb']}
					onchange={onsave}
					placeholder="#ffffff"
				/>
			</div>
		</div>

		<div class="control-group">
			<label for="video-control-icon">Icoon Kleur (play/pause/volume)</label>
			<div class="color-control">
				<input
					id="video-control-icon"
					type="color"
					bind:value={theme['video-control-icon']}
					onchange={onsave}
				/>
				<input
					type="text"
					class="color-value"
					bind:value={theme['video-control-icon']}
					onchange={onsave}
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

	.color-value {
		width: 100%;
		padding: 0.5rem;
		border: 1px solid #d1d5db;
		border-radius: 4px;
		font-size: 0.875rem;
		background: white;
		box-sizing: border-box;
		color: #374151;
		font-family: 'SF Mono', Monaco, monospace;
		flex: 1;
	}

	.color-value:focus {
		outline: none;
		border-color: #d10a10;
	}

	.opacity-control {
		margin-top: 0.75rem;
		padding-top: 0.75rem;
		border-top: 1px solid #e5e7eb;
	}

	.opacity-control label {
		font-size: 0.75rem;
		color: #6b7280;
		margin-bottom: 0.5rem;
	}

	input[type='range'] {
		width: 100%;
		height: 6px;
		background: #e5e7eb;
		border-radius: 3px;
		outline: none;
		appearance: none;
		-webkit-appearance: none;
		cursor: pointer;
	}

	input[type='range']::-webkit-slider-thumb {
		width: 16px;
		height: 16px;
		background: #d10a10;
		border-radius: 50%;
		cursor: pointer;
		appearance: none;
		-webkit-appearance: none;
	}

	input[type='range']::-moz-range-thumb {
		width: 16px;
		height: 16px;
		background: #d10a10;
		border-radius: 50%;
		cursor: pointer;
		border: none;
	}
</style>
