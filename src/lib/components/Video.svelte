<!-- src/lib/components/Video.svelte -->
<script lang="ts">
	import Hls from 'hls.js';
	import { dev } from '$app/environment';

	let {
		url,
		poster,
		focusX = 50,
		focusY = 50,
		videoScale = 100
	} = $props<{
		url: string;
		poster?: string;
		focusX?: number;
		focusY?: number;
		videoScale?: number;
	}>();

	let videoEl = $state<HTMLVideoElement | undefined>();
	const isYoutube = url.includes('youtube.com') || url.includes('youtu.be');
	const isHls = url.endsWith('.m3u8');
	const youtubeEmbedUrl = getYoutubeEmbedUrl(url);

	let isMuted = $state(true);
	let aspectRatio = $state<string | undefined>();
	let hasPlayedOnce = $state(false);

	function getYoutubeEmbedUrl(videoUrl: string) {
		if (!isYoutube) return '';
		const videoIdMatch = videoUrl.match(/(?:v=|\/)([0-9A-Za-z_-]{11}).*/);
		return videoIdMatch ? `https://www.youtube-nocookie.com/embed/${videoIdMatch[1]}` : '';
	}

	function toggleMute() {
		isMuted = !isMuted;
	}

	function handleVideoEnd() {
		hasPlayedOnce = true;
		if (videoEl) {
			videoEl.pause();
			videoEl.currentTime = 0;
		}
	}

	$effect(() => {
		if (videoEl) {
			videoEl.muted = isMuted;
		}
	});

	$effect(() => {
		if (hasPlayedOnce && videoEl) {
			videoEl.controls = true;
		}
	});

	$effect(() => {
		const video = videoEl;
		if (!video || isYoutube) return;

		let hls: Hls | undefined;

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
						hls.attachMedia(videoEl);
					}
				} catch (e) {
					console.error('Kon hls.js niet laden', e);
				}
			} else {
				videoEl.src = url;
			}
		}

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
			<iframe
				title="YouTube video player"
				src={youtubeEmbedUrl}
				frameborder="0"
				allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
				allowfullscreen
				loading="lazy"
			></iframe>
		</div>
	{:else}
		<video
			bind:this={videoEl}
			playsinline
			preload="metadata"
			{poster}
			onended={handleVideoEnd}
			style:aspect-ratio={aspectRatio || '16 / 9'}
			style:object-position="{focusX}% {focusY}%"
			style:transform="scale({videoScale / 100})"
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
		margin: 0;
		border-radius: var(--border-radius-base);
		overflow: hidden;
		line-height: 0;
	}
	video {
		display: block;
		width: 100%;
		background-color: #000;
		aspect-ratio: 16 / 9;
		transform-origin: center center;
		transition: transform 0.3s ease;
	}
	.youtube-wrapper {
		position: relative;
		padding-bottom: 56.25%;
		height: 0;
		overflow: hidden;
		border-radius: var(--border-radius-base);
		background-color: #000;
	}
	.youtube-wrapper iframe {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
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
