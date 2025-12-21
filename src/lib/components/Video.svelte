<script lang="ts">
	import Hls from 'hls.js';
	import { dev } from '$app/environment';
	import { onMount } from 'svelte';

	let { url, poster } = $props<{
		url: string;
		poster?: string;
	}>();

	let videoEl = $state<HTMLVideoElement | undefined>();
	const isYoutube = url.includes('youtube.com') || url.includes('youtu.be');
	const isHls = url.endsWith('.m3u8');
	const youtubeVideoId = getYoutubeVideoId(url);

	let isMuted = $state(true);
	let aspectRatio = $state<string | undefined>();
	let hasPlayedOnce = $state(false);

	// YouTube player state
	let youtubePlayer = $state<any>();
	let isYoutubeReady = $state(false);
	let isPlaying = $state(false);
	let currentTime = $state(0);
	let duration = $state(0);
	let volume = $state(100);
	let isYoutubeMuted = $state(true);
	let progressUpdateInterval: number;

	function getYoutubeVideoId(videoUrl: string) {
		if (!isYoutube) return '';
		const videoIdMatch = videoUrl.match(/(?:v=|\/)([0-9A-Za-z_-]{11}).*/);
		return videoIdMatch ? videoIdMatch[1] : '';
	}

	function toggleMute() {
		isMuted = !isMuted;
	}

	// De stabiele functie die terugspoelt naar het begin.
	function handleVideoEnd() {
		hasPlayedOnce = true;
		if (videoEl) {
			videoEl.pause();
			videoEl.currentTime = 0;
		}
	}

	// YouTube player functions
	function toggleYoutubePlayPause() {
		if (!youtubePlayer) return;
		if (isPlaying) {
			youtubePlayer.pauseVideo();
		} else {
			youtubePlayer.playVideo();
		}
	}

	function toggleYoutubeMute() {
		if (!youtubePlayer) return;
		if (isYoutubeMuted) {
			youtubePlayer.unMute();
			isYoutubeMuted = false;
		} else {
			youtubePlayer.mute();
			isYoutubeMuted = true;
		}
	}

	function handleVolumeChange(e: Event) {
		const target = e.target as HTMLInputElement;
		const newVolume = parseInt(target.value);
		volume = newVolume;
		if (youtubePlayer) {
			youtubePlayer.setVolume(newVolume);
			if (newVolume === 0) {
				isYoutubeMuted = true;
			} else if (isYoutubeMuted) {
				isYoutubeMuted = false;
			}
		}
	}

	function handleProgressChange(e: Event) {
		const target = e.target as HTMLInputElement;
		const newTime = parseFloat(target.value);
		currentTime = newTime;
		if (youtubePlayer) {
			youtubePlayer.seekTo(newTime, true);
		}
	}

	function formatTime(seconds: number): string {
		const mins = Math.floor(seconds / 60);
		const secs = Math.floor(seconds % 60);
		return `${mins}:${secs.toString().padStart(2, '0')}`;
	}

	function updateProgress() {
		if (youtubePlayer && youtubePlayer.getCurrentTime) {
			currentTime = youtubePlayer.getCurrentTime();
		}
	}

	// Load YouTube IFrame API
	onMount(() => {
		if (!isYoutube) return;

		// Load YouTube API if not already loaded
		if (!(window as any).YT) {
			const tag = document.createElement('script');
			tag.src = 'https://www.youtube.com/iframe_api';
			const firstScriptTag = document.getElementsByTagName('script')[0];
			firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

			(window as any).onYouTubeIframeAPIReady = () => {
				initYoutubePlayer();
			};
		} else {
			initYoutubePlayer();
		}

		return () => {
			if (progressUpdateInterval) {
				clearInterval(progressUpdateInterval);
			}
			if (youtubePlayer && youtubePlayer.destroy) {
				youtubePlayer.destroy();
			}
		};
	});

	function initYoutubePlayer() {
		const YT = (window as any).YT;
		if (!YT || !youtubeVideoId) return;

		youtubePlayer = new YT.Player('youtube-player', {
			videoId: youtubeVideoId,
			playerVars: {
				enablejsapi: 1,
				controls: 0,
				modestbranding: 1,
				rel: 0,
				playsinline: 1,
				autoplay: 0,
				mute: 1,
				fs: 0,
				iv_load_policy: 3,
				disablekb: 1,
				cc_load_policy: 0,
				showinfo: 0
			},
			events: {
				onReady: (event: any) => {
					isYoutubeReady = true;
					duration = event.target.getDuration();
					isYoutubeMuted = event.target.isMuted();
					volume = event.target.getVolume();
				},
				onStateChange: (event: any) => {
					const playerState = event.data;
					const YT = (window as any).YT;

					if (playerState === YT.PlayerState.PLAYING) {
						isPlaying = true;
						progressUpdateInterval = window.setInterval(updateProgress, 100);
					} else if (playerState === YT.PlayerState.PAUSED) {
						isPlaying = false;
						if (progressUpdateInterval) {
							clearInterval(progressUpdateInterval);
						}
					} else if (playerState === YT.PlayerState.ENDED) {
						isPlaying = false;
						currentTime = 0;
						if (progressUpdateInterval) {
							clearInterval(progressUpdateInterval);
						}
					}
				}
			}
		});
	}

	$effect(() => {
		if (videoEl) {
			videoEl.muted = isMuted;
		}
	});

	// Dit effect zorgt ervoor dat de controls altijd aan gaan
	// zodra de video een keer heeft gespeeld.
	$effect(() => {
		if (hasPlayedOnce && videoEl) {
			videoEl.controls = true;
		}
	});

	// Deze $effect voor de IntersectionObserver en HLS-player blijft ongewijzigd.
	$effect(() => {
		const video = videoEl;
		// Deze controle blijft cruciaal
		if (!video || isYoutube) return;

		let hls: Hls | undefined;

		// FIX: We geven 'video' nu als argument mee, zodat TypeScript weet dat het bestaat.
		async function setupHls(videoEl: HTMLVideoElement) {
			if (isHls) {
				if (videoEl.canPlayType('application/vnd.apple.mpegurl')) {
					videoEl.src = url;
					return;
				}
				try {
					const HlsModule = await import('hls.js');
					const Hls = HlsModule.default;
					if (Hls.isSupported()) {
						hls = new Hls();
						hls.loadSource(url);
						hls.attachMedia(videoEl); // Nu veilig om te gebruiken
					}
				} catch (e) {
					console.error('Kon hls.js niet laden', e);
				}
			} else {
				videoEl.src = url;
			}
		}

		// Roep de functie aan met de 'video' variabele die hier gegarandeerd bestaat.
		setupHls(video);

		const onMetadataLoaded = () => {
			if (video.videoWidth > 0 && video.videoHeight > 0) {
				aspectRatio = `${video.videoWidth} / ${video.videoHeight}`;
			}
		};
		video.addEventListener('loadedmetadata', onMetadataLoaded);

		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					const playPromise = video.play();
					if (playPromise !== undefined) {
						playPromise.catch(() => {
							if (dev) console.warn('Autoplay is geblokkeerd door de browser.');
						});
					}
				} else {
					video.pause();
				}
			},
			{ threshold: 0.5 }
		);
		observer.observe(video);

		return () => {
			observer.disconnect();
			video.removeEventListener('loadedmetadata', onMetadataLoaded);
			hls?.destroy();
			video.src = '';
			aspectRatio = undefined;
		};
	});
</script>

<figure>
	{#if isYoutube}
		<div class="youtube-wrapper">
			<div id="youtube-player"></div>

			<!-- Cover overlay when not playing to hide YouTube UI -->
			{#if !isPlaying}
				<div class="video-cover">
					<button
						class="play-overlay-button"
						onclick={toggleYoutubePlayPause}
						aria-label="Video afspelen"
					>
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="80" height="80">
							<path fill="white" d="M8 5v14l11-7z" />
						</svg>
					</button>
				</div>
			{/if}

			<div
				class="youtube-overlay"
				onclick={toggleYoutubePlayPause}
				onkeydown={(e) => e.key === 'Enter' && toggleYoutubePlayPause()}
				role="button"
				tabindex="0"
				aria-label="Video afspelen/pauzeren"
			></div>
			{#if isYoutubeReady}
				<div class="youtube-controls">
					<!-- Play/Pause Button -->
					<button
						class="control-button play-button"
						onclick={toggleYoutubePlayPause}
						aria-label={isPlaying ? 'Pauzeren' : 'Afspelen'}
					>
						{#if isPlaying}
							<!-- Pause Icon -->
							<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
								<path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
							</svg>
						{:else}
							<!-- Play Icon -->
							<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
								<path d="M8 5v14l11-7z" />
							</svg>
						{/if}
					</button>

					<!-- Progress Bar -->
					<div class="progress-container">
						<input
							type="range"
							min="0"
							max={duration}
							step="0.1"
							value={currentTime}
							oninput={handleProgressChange}
							class="progress-bar"
							aria-label="Video voortgang"
						/>
						<div class="progress-fill" style="width: {(currentTime / duration) * 100}%"></div>
					</div>

					<!-- Time Display -->
					<div class="time-display">
						<span>{formatTime(currentTime)}</span>
						<span>/</span>
						<span>{formatTime(duration)}</span>
					</div>

					<!-- Volume Controls -->
					<button
						class="control-button volume-toggle"
						onclick={toggleYoutubeMute}
						aria-label={isYoutubeMuted ? 'Geluid aanzetten' : 'Geluid dempen'}
					>
						{#if isYoutubeMuted || volume === 0}
							<!-- Muted Icon -->
							<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
								<path
									d="M12.97 3.47a.75.75 0 00-1.22-.84L5.18 8.25H3a.75.75 0 00-.75.75v6c0 .41.34.75.75.75h2.18l6.57 5.62c.5.43 1.22-.06 1.22-.84V3.47zm-1.47 1.22v14.62L6.25 14.8a.75.75 0 00-.6-.25H4.5v-4.5h1.15c.2 0 .4-.08.59-.25l5.23-4.48z"
								/>
								<path
									d="M3.22 3.22a.75.75 0 00-1.06 1.06l18.5 18.5a.75.75 0 101.06-1.06L3.22 3.22z"
								/>
							</svg>
						{:else}
							<!-- Volume Icon -->
							<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
								<path
									d="M12.97 3.47a.75.75 0 00-1.22-.84L5.18 8.25H3a.75.75 0 00-.75.75v6c0 .41.34.75.75.75h2.18l6.57 5.62c.5.43 1.22-.06 1.22-.84V3.47zm-1.47 1.22v14.62L6.25 14.8a.75.75 0 00-.6-.25H4.5v-4.5h1.15c.2 0 .4-.08.59-.25l5.23-4.48zM16.5 7.75a.75.75 0 00-1.5 0v8.5a.75.75 0 001.5 0V7.75z"
								/>
								<path d="M20.25 5a.75.75 0 00-1.5 0v14a.75.75 0 001.5 0V5z" />
							</svg>
						{/if}
					</button>

					<!-- Volume Slider -->
					<input
						type="range"
						min="0"
						max="100"
						step="1"
						value={volume}
						oninput={handleVolumeChange}
						class="volume-slider"
						aria-label="Volume"
					/>
				</div>
			{/if}
		</div>
	{:else}
		<video
			bind:this={videoEl}
			playsinline
			preload="metadata"
			{poster}
			onended={handleVideoEnd}
			style:aspect-ratio={aspectRatio || '16 / 9'}
		>
			<track kind="captions" />
			Je browser ondersteunt de video-tag niet.
		</video>
	{/if}

	{#if !isYoutube && !hasPlayedOnce}
		<button
			class="volume-button"
			onclick={toggleMute}
			aria-label={isMuted ? 'Geluid aanzetten' : 'Geluid dempen'}
		>
			{#if isMuted}
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
					><path
						d="M12.97 3.47a.75.75 0 00-1.22-.84L5.18 8.25H3a.75.75 0 00-.75.75v6c0 .41.34.75.75.75h2.18l6.57 5.62c.5.43 1.22-.06 1.22-.84V3.47zm-1.47 1.22v14.62L6.25 14.8a.75.75 0 00-.6-.25H4.5v-4.5h1.15c.2 0 .4-.08.59-.25l5.23-4.48zM16.5 7.75a.75.75 0 00-1.5 0v8.5a.75.75 0 001.5 0V7.75z"
					/><path d="M20.25 5a.75.75 0 00-1.5 0v14a.75.75 0 001.5 0V5z" /><path
						d="M3.22 3.22a.75.75 0 00-1.06 1.06l18.5 18.5a.75.75 0 101.06-1.06L3.22 3.22z"
					/></svg
				>
			{:else}
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
					><path
						d="M12.97 3.47a.75.75 0 00-1.22-.84L5.18 8.25H3a.75.75 0 00-.75.75v6c0 .41.34.75.75.75h2.18l6.57 5.62c.5.43 1.22-.06 1.22-.84V3.47zm-1.47 1.22v14.62L6.25 14.8a.75.75 0 00-.6-.25H4.5v-4.5h1.15c.2 0 .4-.08.59-.25l5.23-4.48zM16.5 7.75a.75.75 0 00-1.5 0v8.5a.75.75 0 001.5 0V7.75z"
					/><path d="M20.25 5a.75.75 0 00-1.5 0v14a.75.75 0 001.5 0V5z" /></svg
				>
			{/if}
		</button>
	{/if}
</figure>

<style>
	figure {
		position: relative;
		margin: 0 auto;
		border-radius: var(--border-radius-base);
		overflow: hidden;
		line-height: 0;
		max-width: 100%;
		display: block;
	}
	video {
		display: block;
		width: 100%;
		background-color: #000;
		aspect-ratio: 16 / 9;
	}
	.youtube-wrapper {
		position: relative;
		padding-bottom: 56.25%;
		height: 0;
		overflow: hidden;
		border-radius: var(--border-radius-base);
		background-color: #000;
		margin: 0 auto;
		max-width: 100%;
	}
	.youtube-wrapper #youtube-player {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
	}

	.youtube-wrapper #youtube-player :global(iframe) {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
	}

	/* Video cover to hide YouTube UI when not playing */
	.video-cover {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: var(--video-cover-bg, #000);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 8;
	}

	.play-overlay-button {
		width: 80px;
		height: 80px;
		border: none;
		border-radius: 50%;
		background-color: var(--video-play-btn-color, rgba(255, 0, 0, 0.8));
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		transition:
			background-color 0.2s,
			transform 0.2s;
	}

	.play-overlay-button:hover {
		background-color: var(--video-play-btn-color, rgba(255, 0, 0, 0.8));
		transform: scale(1.1);
		filter: brightness(1.2);
	}

	.play-overlay-button:focus-visible {
		outline: 3px solid var(--color-focus, #4a90e2);
		outline-offset: 4px;
	}

	/* Overlay to block YouTube UI and enable click-to-play */
	.youtube-overlay {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		cursor: pointer;
		z-index: 5;
		background: transparent;
		pointer-events: auto;
	}

	/* YouTube Custom Controls */
	.youtube-controls {
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 1rem;
		background: linear-gradient(
			to top,
			rgba(0, 0, 0, 0.8) 0%,
			rgba(0, 0, 0, 0.6) 70%,
			transparent 100%
		);
		z-index: 10;
		transition: opacity 0.3s ease;
	}

	.control-button {
		width: 40px;
		height: 40px;
		padding: 8px;
		border: none;
		border-radius: 50%;
		background-color: rgba(255, 255, 255, 0.1);
		color: var(--video-control-icon, white);
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: background-color 0.2s;
		flex-shrink: 0;
	}

	.control-button:hover {
		background-color: rgba(255, 255, 255, 0.2);
	}

	.control-button:focus-visible {
		outline: 3px solid var(--color-focus, #4a90e2);
		outline-offset: 2px;
	}

	.control-button svg {
		width: 100%;
		height: 100%;
		fill: currentColor;
	}

	.progress-container {
		position: relative;
		flex: 1;
		height: 6px;
		background-color: rgba(255, 255, 255, 0.3);
		border-radius: 3px;
		overflow: hidden;
		cursor: pointer;
	}

	.progress-fill {
		position: absolute;
		top: 0;
		left: 0;
		height: 100%;
		background-color: var(--video-progress-fill, #ff0000);
		border-radius: 3px;
		pointer-events: none;
		transition: width 0.1s linear;
	}

	.progress-bar {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		opacity: 0;
		cursor: pointer;
		z-index: 2;
	}

	.progress-bar::-webkit-slider-thumb {
		opacity: 1;
		width: 14px;
		height: 14px;
		background-color: var(--video-progress-thumb, #ff0000);
		border-radius: 50%;
		cursor: pointer;
		appearance: none;
		-webkit-appearance: none;
	}

	.progress-bar::-moz-range-thumb {
		opacity: 1;
		width: 14px;
		height: 14px;
		background-color: var(--video-progress-thumb, #ff0000);
		border-radius: 50%;
		cursor: pointer;
		border: none;
	}

	.time-display {
		color: white;
		font-size: 0.875rem;
		font-variant-numeric: tabular-nums;
		white-space: nowrap;
		display: flex;
		gap: 0.25rem;
		flex-shrink: 0;
		user-select: none;
	}

	.volume-slider {
		width: 80px;
		height: 6px;
		background: transparent;
		border-radius: 3px;
		outline: none;
		appearance: none;
		-webkit-appearance: none;
		cursor: pointer;
		flex-shrink: 0;
		position: relative;
	}

	.volume-slider::-webkit-slider-runnable-track {
		width: 100%;
		height: 6px;
		background: rgba(255, 255, 255, 0.3);
		border-radius: 3px;
	}

	.volume-slider::-webkit-slider-thumb {
		width: 14px;
		height: 14px;
		background-color: var(--video-volume-thumb, white);
		border-radius: 50%;
		cursor: pointer;
		appearance: none;
		-webkit-appearance: none;
		margin-top: -4px;
	}

	.volume-slider::-moz-range-track {
		width: 100%;
		height: 6px;
		background: rgba(255, 255, 255, 0.3);
		border-radius: 3px;
	}

	.volume-slider::-moz-range-thumb {
		width: 14px;
		height: 14px;
		background-color: var(--video-volume-thumb, white);
		border-radius: 50%;
		cursor: pointer;
		border: none;
	}

	.volume-slider::-moz-range-progress {
		height: 6px;
		background-color: white;
		border-radius: 3px;
	}
	.volume-button {
		position: absolute;
		bottom: 1rem;
		right: 1rem;
		z-index: 10;
		width: 40px;
		height: 40px;
		padding: 8px;
		border-radius: 50%;
		border: none;
		background-color: rgba(0, 0, 0, 0.6);
		color: white;
		cursor: pointer;
		display: grid;
		place-items: center;
		transition: background-color 0.2s;
	}
	.volume-button:hover {
		background-color: rgba(0, 0, 0, 0.8);
	}
	.volume-button:focus-visible {
		outline: 3px solid var(--color-focus);
		outline-offset: 2px;
	}
	.volume-button svg {
		width: 100%;
		height: 100%;
		fill: currentColor;
	}
</style>
