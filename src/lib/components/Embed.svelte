<script lang="ts">
	import type { EmbedContent } from '$lib/types';
	import { onMount } from 'svelte';

	let { code, aspectRatio = 'auto', caption, source }: EmbedContent = $props();

	let containerElement: HTMLDivElement;

	// ✅ Auto-detect platform
	function detectPlatform(embedCode: string): string {
		const lower = embedCode.toLowerCase();

		if (lower.includes('datawrapper.dwcdn.net') || lower.includes('datawrapper'))
			return 'datawrapper';
		if (lower.includes('youtube.com') || lower.includes('youtu.be')) return 'youtube';
		if (lower.includes('twitter.com') || lower.includes('x.com') || lower.includes('tweet'))
			return 'twitter';
		if (lower.includes('instagram.com')) return 'instagram';
		if (lower.includes('spotify.com')) return 'spotify';
		if (lower.includes('google.com/maps')) return 'maps';
		if (lower.includes('typeform.com')) return 'typeform';

		return 'generic';
	}

	// ✅ Convert URL to embed code
	function convertToEmbed(embedCode: string): string {
		const trimmed = embedCode.trim();
		const platform = detectPlatform(trimmed);

		// Already embed code
		if (
			trimmed.startsWith('<iframe') ||
			trimmed.startsWith('<script') ||
			trimmed.startsWith('<blockquote')
		) {
			return trimmed;
		}

		// Convert URL to embed
		if (trimmed.startsWith('http')) {
			switch (platform) {
				case 'youtube':
					return convertYouTubeUrl(trimmed);
				case 'spotify':
					return convertSpotifyUrl(trimmed);
				case 'twitter':
					return convertTwitterUrl(trimmed);
				case 'instagram':
					return convertInstagramUrl(trimmed);
				case 'maps':
					return `<iframe src="${trimmed}" width="100%" height="450" style="border:0;" allowfullscreen="" loading="lazy"></iframe>`;
				default:
					return `<iframe src="${trimmed}" width="100%" height="450" frameborder="0" allowfullscreen></iframe>`;
			}
		}

		return trimmed;
	}

	// ✅ YouTube URL → Embed
	function convertYouTubeUrl(url: string): string {
		const patterns = [
			/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/,
			/youtube\.com\/embed\/([^&\s]+)/
		];

		for (const pattern of patterns) {
			const match = url.match(pattern);
			if (match) {
				const videoId = match[1];
				return `<iframe width="560" height="315" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
			}
		}

		return `<iframe src="${url}" width="560" height="315" frameborder="0" allowfullscreen></iframe>`;
	}

	// ✅ Spotify URL → Embed
	function convertSpotifyUrl(url: string): string {
		const embedUrl = url
			.replace('open.spotify.com/', 'open.spotify.com/embed/')
			.replace('/track/', '/embed/track/')
			.replace('/album/', '/embed/album/')
			.replace('/playlist/', '/embed/playlist/');

		return `<iframe style="border-radius:12px" src="${embedUrl}" width="100%" height="352" frameborder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>`;
	}

	// ✅ Twitter URL → Embed (uses Twitter's oEmbed)
	function convertTwitterUrl(url: string): string {
		// Twitter embed requires their widget script
		return `<blockquote class="twitter-tweet" data-dnt="true"><a href="${url}"></a></blockquote><script async src="https://platform.twitter.com/widgets.js" charset="utf-8"><\/script>`;
	}

	// ✅ Instagram URL → Embed
	function convertInstagramUrl(url: string): string {
		const cleanUrl = url.replace(/\/$/, ''); // Remove trailing slash
		return `<blockquote class="instagram-media" data-instgrm-permalink="${cleanUrl}" data-instgrm-version="14"></blockquote><script async src="//www.instagram.com/embed.js"><\/script>`;
	}

	// ✅ Get aspect ratio padding
	function getAspectRatioPadding(): string {
		if (aspectRatio === 'auto') return '0';

		const ratios: Record<string, string> = {
			'16:9': '56.25%',
			'4:3': '75%',
			'1:1': '100%',
			'3:2': '66.67%',
			'21:9': '42.86%'
		};

		return ratios[aspectRatio] || '56.25%';
	}

	const embedCode = $derived(convertToEmbed(code));
	const hasScript = $derived(embedCode.includes('<script'));
	const paddingBottom = $derived(getAspectRatioPadding());
	const hasAspectRatio = $derived(aspectRatio !== 'auto');

	// ✅ Handle script tags (Twitter, Instagram, Datawrapper)
	onMount(() => {
		if (hasScript && containerElement) {
			const tempDiv = document.createElement('div');
			tempDiv.innerHTML = embedCode;

			// Execute scripts
			const scripts = tempDiv.querySelectorAll('script');
			scripts.forEach((script) => {
				const newScript = document.createElement('script');
				if (script.src) {
					newScript.src = script.src;
					newScript.async = true;
				} else {
					newScript.textContent = script.textContent;
				}
				document.body.appendChild(newScript);
			});

			// Add non-script content
			const nonScriptContent = Array.from(tempDiv.childNodes)
				.filter((node) => node.nodeName !== 'SCRIPT')
				.map((node) => node.cloneNode(true));

			containerElement.innerHTML = '';
			nonScriptContent.forEach((node) => {
				containerElement.appendChild(node);
			});
		}
	});
</script>

<div class="embed-wrapper">
	<div
		class="embed-container"
		class:has-aspect-ratio={hasAspectRatio}
		style:padding-bottom={hasAspectRatio ? paddingBottom : undefined}
		bind:this={containerElement}
	>
		{#if !hasScript}
			{@html embedCode}
		{/if}
	</div>

	{#if caption || source}
		<figcaption>
			<span class="caption">{caption}</span>
			{#if source}<span class="source">{source}</span>{/if}
		</figcaption>
	{/if}
</div>

<style>
	.embed-wrapper {
		width: 100%;
		margin: 0;
	}

	.embed-container {
		position: relative;
		width: 100%;
		overflow: hidden;
		background: #f9fafb;
		border-radius: var(--border-radius-base, 8px);
	}

	/* ✅ Aspect ratio */
	.embed-container.has-aspect-ratio {
		position: relative;
		height: 0;
	}

	.embed-container.has-aspect-ratio :global(iframe) {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		border: none;
	}

	/* ✅ Auto height */
	.embed-container:not(.has-aspect-ratio) :global(iframe) {
		width: 100%;
		min-height: 400px;
		border: none;
	}

	/* ✅ Responsive embeds */
	.embed-container :global(iframe) {
		max-width: 100%;
	}

	/* ✅ Datawrapper */
	.embed-container :global(.datawrapper-chart) {
		width: 100%;
		border: none;
	}

	/* ✅ Twitter */
	.embed-container :global(.twitter-tweet) {
		margin: 0 auto !important;
	}

	/* ✅ Instagram */
	.embed-container :global(.instagram-media) {
		margin: 0 auto !important;
		max-width: 540px;
		min-width: 326px;
	}

	/* ✅ Caption */
	figcaption {
		padding-top: var(--space-s, 0.5rem);
		font-size: var(--image-caption-font-size, 0.875rem);
		color: var(--image-caption-color, #6b7280);
		display: block;
		overflow: hidden;
	}

	.caption {
		display: inline;
		font-weight: var(--image-caption-font-weight, 400);
		line-height: 1.4;
	}

	.source {
		font-size: var(--image-source-font-size, 0.75rem);
		font-style: var(--image-source-font-style, italic);
		font-weight: var(--image-source-font-weight, 400);
		color: var(--image-source-color, #9ca3af);
		white-space: nowrap;
		float: right;
		margin-left: var(--space-xs, 0.25rem);
	}
</style>
