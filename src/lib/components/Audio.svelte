<!--src\lib\components\Audio.svelte-->
<script lang="ts">
	import type { AudioContent } from '$lib/types';

	let {
		url,
		title,
		description,
		image = '',
		imageLayout = 'stamp',
		imageScale = 100,
		imageFocusX = 50,
		imageFocusY = 50
	}: AudioContent = $props();

	let audioElement: HTMLAudioElement;
	let isPlaying = $state(false);
	let currentTime = $state(0);
	let duration = $state(0);
	let progress = $derived(duration > 0 ? (currentTime / duration) * 100 : 0);

	// Image background style
	const imageStyle = $derived(() => {
		if (!image || imageLayout === 'none') return '';

		return `
      background-image: url(${image});
      background-position: ${imageFocusX}% ${imageFocusY}%;
      background-size: ${imageScale}%;
    `;
	});

	function formatTime(seconds: number) {
		if (isNaN(seconds) || seconds === 0) return '0:00';
		const m = Math.floor(seconds / 60);
		const s = Math.floor(seconds % 60);
		return `${m}:${s.toString().padStart(2, '0')}`;
	}

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
	}

	$effect(() => {
		if (audioElement) {
			const handleEnd = () => (isPlaying = false);
			audioElement.addEventListener('ended', handleEnd);
			return () => audioElement.removeEventListener('ended', handleEnd);
		}
	});
</script>

<audio bind:this={audioElement} bind:currentTime bind:duration src={url}></audio>

<div
	class="audio-widget-container"
	class:layout-none={imageLayout === 'none'}
	class:layout-stamp={imageLayout === 'stamp'}
	class:layout-portrait={imageLayout === 'portrait'}
>
	{#if image && imageLayout !== 'none'}
		<div class="audio-widget-image" style={imageStyle()} role="img" aria-label={title}></div>
	{/if}

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
					>
						<rect x="6" y="4" width="4" height="16"></rect>
						<rect x="14" y="4" width="4" height="16"></rect>
					</svg>
				{:else}
					<svg
						class="play-icon"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
					>
						<polygon points="5 3 19 12 5 21 5 3"></polygon>
					</svg>
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
	.audio-widget-container {
		font-family: var(--font-family-base);
		background-color: var(--audio-bg-color, #edeaec);
		border-radius: var(--audio-border-radius, var(--border-radius-base, 8px));
		padding: var(--audio-padding, var(--space-m, 1rem));
		display: flex;
		gap: var(--audio-gap, var(--space-m, 1rem));
		width: 100%;
		align-items: center;
		box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
	}

	/* Layout variants */
	.audio-widget-container.layout-none {
		flex-direction: column;
		align-items: stretch;
		gap: 12px;
	}

	.audio-widget-container.layout-none .audio-widget-info {
		text-align: center;
	}

	.audio-widget-container.layout-portrait {
		align-items: stretch;
	}

	/* Image */
	.audio-widget-image {
		flex-shrink: 0;
		border-radius: var(--audio-image-border-radius, 6px);
		background-repeat: no-repeat;
		cursor: grab;
	}

	.audio-widget-image:active {
		cursor: grabbing;
	}

	/* Stamp (rond, 80x80px) */
	.layout-stamp .audio-widget-image {
		width: var(--audio-image-size, 80px);
		height: var(--audio-image-size, 80px);
		border-radius: 50%;
	}

	/* Portrait (rechthoek, 120px breed, vult hoogte) */
	.layout-portrait .audio-widget-image {
		width: 120px;
		align-self: stretch;
		border-radius: var(--audio-image-border-radius, 6px);
	}

	.audio-widget-content {
		width: 100%;
		display: flex;
		flex-direction: column;
		justify-content: center;
		gap: 8px;
		min-width: 0;
	}

	.audio-widget-info {
		margin-bottom: 4px;
	}

	.audio-widget-info h3 {
		margin: 0;
		font-size: var(--audio-title-size, var(--font-size-m, 1.1rem));
		font-weight: var(--audio-title-weight, 600);
		color: var(--audio-title-color, #000000);
	}

	.audio-widget-info p {
		margin: 4px 0 0;
		font-size: var(--audio-description-size, var(--font-size-s, 0.9rem));
		color: var(--audio-description-color, #32302c);
	}

	.audio-widget-controls {
		display: flex;
		align-items: center;
		gap: 12px;
	}

	.audio-widget-play-btn {
		background-color: transparent;
		border: 2px solid var(--audio-button-border-color, #6e757c);
		border-radius: 50%;
		width: var(--audio-button-size, 40px);
		height: var(--audio-button-size, 40px);
		display: flex;
		justify-content: center;
		align-items: center;
		cursor: pointer;
		padding: 0;
		flex-shrink: 0;
		transition: background-color 0.2s;
	}

	.audio-widget-play-btn:hover {
		background-color: var(--audio-button-hover-bg, #e1dee0);
	}

	.audio-widget-play-btn svg {
		width: 20px;
		height: 20px;
		fill: var(--audio-button-icon-color, #6e757c);
	}

	.audio-widget-progress-wrapper {
		width: 100%;
		display: flex;
		align-items: center;
		gap: 8px;
	}

	.audio-widget-progress-bar {
		background-color: var(--audio-progress-bg, #6e757c);
		height: var(--audio-progress-height, 3px);
		border-radius: var(--audio-progress-border-radius, 0);
		width: 100%;
		cursor: pointer;
	}

	.audio-widget-progress-fill {
		background-color: var(--audio-progress-fill-color, #d10a10);
		height: 100%;
		border-radius: var(--audio-progress-border-radius, 0);
		transition: width 0.1s linear;
	}

	.audio-widget-time {
		font-size: var(--audio-time-size, 0.8rem);
		color: var(--audio-time-color, #000000);
		white-space: nowrap;
	}
</style>
