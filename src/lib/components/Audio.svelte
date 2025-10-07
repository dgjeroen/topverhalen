<script lang="ts">
	import type { AudioContent } from '$lib/types'; // De runes worden NIET geimporteerd, de Svelte-compiler handelt dit af.
	// Destructure de props direct uit de AudioContent interface

	let { url, title, description, image }: AudioContent = $props(); // --- State Variabelen ---

	let audioElement: HTMLAudioElement;
	let isPlaying = $state(false);
	let currentTime = $state(0);
	let duration = $state(0);
	let progress = $derived(duration > 0 ? (currentTime / duration) * 100 : 0); // --- Helper Functie voor Tijd Formatteren ---

	function formatTime(seconds: number) {
		if (isNaN(seconds) || seconds === 0) return '0:00';
		const m = Math.floor(seconds / 60);
		const s = Math.floor(seconds % 60);
		return `${m}:${s.toString().padStart(2, '0')}`;
	} // --- Event Handlers ---

	function togglePlay() {
		if (isPlaying) {
			audioElement.pause();
		} else {
			audioElement.play();
		}
		isPlaying = !isPlaying;
	}

	function handleSeek(event: MouseEvent) {
		const progressBar = event.currentTarget as HTMLElement;
		const rect = progressBar.getBoundingClientRect();
		const percent = (event.clientX - rect.left) / rect.width;
		audioElement.currentTime = duration * percent;
	} // --- Svelte's Magie: Reactieve Bindingen ---

	$effect(() => {
		if (audioElement) {
			const handleEnd = () => (isPlaying = false);
			audioElement.addEventListener('ended', handleEnd);
			return () => audioElement.removeEventListener('ended', handleEnd);
		}
	});
</script>

<audio bind:this={audioElement} bind:currentTime bind:duration src={url}></audio>

<div class="audio-widget-container">
	<div
		class="audio-widget-image"
		style="background-image: url({image})"
		role="img"
		aria-label={title}
	></div>
	<div class="audio-widget-content">
		<div class="audio-widget-info">
			<h3>{title}</h3>
			<p>{description}</p>
		</div>
		<div class="audio-widget-controls">
			<button
				class="audio-widget-play-btn"
				onclick={togglePlay}
				aria-label={isPlaying ? 'Pauzeer' : 'Speel af'}
			>
				{#if isPlaying}
					<svg
						class="pause-icon"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
						><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"
						></rect></svg
					>
				{:else}
					<svg
						class="play-icon"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg
					>
				{/if}
			</button>
			<div class="audio-widget-progress-wrapper">
				<div
					class="audio-widget-progress-bar"
					onclick={handleSeek}
					onkeydown={(e) => {
						if (e.key === 'Enter' || e.key === ' ') togglePlay();
					}}
					role="button"
					tabindex="0"
				>
					<div class="audio-widget-progress-fill" style="width: {progress}%"></div>
				</div>
				<span class="audio-widget-time">
					{formatTime(currentTime)} / {formatTime(duration)}
				</span>
			</div>
		</div>
	</div>
</div>

<style>
	/**
 * @component Audio
 * Een thematiseerbare audio speler die de globale stijlen volgt.
 *
 * @cssprop --audio-bg-color - De achtergrondkleur van de hele widget. Standaard: --color-background-light.
 * @cssprop --audio-accent-color - De kleur voor de progress bar. Standaard: --color-accent.
 * @cssprop --audio-text-heading - De kleur van de titel. Standaard: --color-text.
 * @cssprop --audio-text-body - De kleur van de subtitel en tijd. Standaard: --color-text-muted.
 * @cssprop --audio-border-color - De kleur van de rand van de play-knop. Standaard: --color-border.
 * @cssprop --audio-surface-color - De achtergrondkleur van de progress bar en button-hover.
 */
	.audio-widget-container {
		/* * DE COMPONENT STYLING API
         * We definiëren lokale variabelen die proberen de globale 
         * variabelen te gebruiken, met een veilige fallback voor als ze niet bestaan.
         */
		--_bg-color: var(--audio-bg-color, var(--color-background-light, #f3f3f3));
		--_text-color-heading: var(--audio-text-heading, var(--color-text, #111827));
		--_text-color-body: var(--audio-text-body, var(--color-text-muted, #4b5563));
		--_accent-color: var(--audio-accent-color, var(--color-accent, #ef4444));
		--_border-color: var(--audio-border-color, var(--color-border, #d1d5db));
		--_surface-color: var(
			--audio-surface-color,
			#e5e7eb
		); /* Kleur voor progress bar bg, hover, etc. */

		/* Gebruik van de API in de rest van de component */
		font-family: var(--font-family-base);
		background-color: var(--_bg-color);
		border-radius: var(--border-radius-base);
		padding: var(--space-m);
		display: flex;
		gap: var(--space-m);
		width: 100%;
	}

	/* --- Structurele stijlen (meestal ongewijzigd) --- */
	.audio-widget-image {
		width: 80px;
		border-radius: 6px; /* Kan ook een variabele worden: var(--border-radius-small, 6px) */
		flex-shrink: 0;
		background-size: cover;
		background-position: center;
	}
	.audio-widget-content {
		width: 100%;
		display: flex;
		flex-direction: column;
		gap: 8px;
		min-width: 0;
	}
	.audio-widget-info {
		margin-bottom: 4px;
	}

	/* --- Thematische stijlen (nu met variabelen) --- */
	.audio-widget-info h3 {
		margin: 0;
		font-size: var(--font-size-m, 1.1rem);
		font-weight: 600;
		color: var(--_text-color-heading);
	}

	.audio-widget-info p {
		margin: 4px 0 0;
		font-size: var(--font-size-s, 0.9rem);
		color: var(--_text-color-body);
	}

	.audio-widget-controls {
		display: flex;
		align-items: center;
		gap: 12px;
	}

	.audio-widget-play-btn {
		background-color: transparent;
		border: 2px solid var(--_border-color);
		border-radius: 50%;
		width: 40px;
		height: 40px;
		display: flex;
		justify-content: center;
		align-items: center;
		cursor: pointer;
		padding: 0;
		flex-shrink: 0;
		transition: background-color 0.2s;
	}
	.audio-widget-play-btn:hover {
		background-color: var(--_surface-color);
	}

	.audio-widget-play-btn svg {
		width: 20px;
		height: 20px;
		fill: var(--_text-color-heading); /* SVG's stijlen we vaak met 'fill' */
	}

	.audio-widget-progress-wrapper {
		width: 100%;
		display: flex;
		align-items: center;
		gap: 8px;
	}

	.audio-widget-progress-bar {
		background-color: var(--_surface-color);
		height: 6px;
		border-radius: 3px;
		width: 100%;
		cursor: pointer;
	}

	.audio-widget-progress-fill {
		background-color: var(--_accent-color);
		height: 100%;
		border-radius: 3px;
	}

	.audio-widget-time {
		font-size: 0.8rem;
		color: var(--_text-color-body);
		white-space: nowrap;
	}
</style>
