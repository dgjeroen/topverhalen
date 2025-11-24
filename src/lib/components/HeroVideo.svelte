<script lang="ts">
	import HeroLayout from './HeroLayout.svelte';
	import type { HeroVideoContent, Theme } from '$lib/types';
	import Hls from 'hls.js';
	import { onMount, onDestroy } from 'svelte';

	let {
		url,
		label,
		title,
		source,
		focusX = 50,
		focusY = 50,
		theme = {}
	}: HeroVideoContent & { theme?: Theme } = $props();

	let videoEl: HTMLVideoElement | undefined;
	let hlsInstance: Hls | null = null;
	const isHls = url.endsWith('.m3u8');

	onMount(() => {
		if (isHls && Hls.isSupported()) {
			hlsInstance = new Hls();
			hlsInstance.loadSource(url);
			if (videoEl) hlsInstance.attachMedia(videoEl);
		}
		onDestroy(() => hlsInstance?.destroy());
	});
</script>

<HeroLayout {label} {title} {source} {theme}>
	<video
		bind:this={videoEl}
		src={isHls ? undefined : url}
		autoplay
		muted
		loop
		playsinline
		class="hero-background"
		style:object-position="{focusX}% {focusY}%"
	></video>
</HeroLayout>
