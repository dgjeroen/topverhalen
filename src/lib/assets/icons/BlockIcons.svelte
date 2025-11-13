<script lang="ts">
	/**
	 * Block Type Icons
	 * Herbruikbare SVG symbols voor Blokken + Styling tabs
	 * @component BlockIcons
	 */
</script>

<svg class="icon-definitions" style="display: none;" aria-hidden="true">
	<!-- General Settings -->
	<symbol id="icon-style-general" viewBox="0 0 24 24">
		<circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="1.5" fill="none" />
		<path
			d="M12 1V3M12 21V23M23 12H21M3 12H1M20.49 20.49L19.07 19.07M4.93 4.93L3.51 3.51M20.49 3.51L19.07 4.93M4.93 19.07L3.51 20.49"
			stroke="currentColor"
			stroke-width="1.5"
			stroke-linecap="round"
		/>
	</symbol>

	<!-- Headings -->
	<symbol id="icon-block-h2" viewBox="0 0 24 24">
		<text x="3" y="19" font-family="sans-serif" font-size="16" fill="currentColor">H2</text>
	</symbol>

	<symbol id="icon-block-h3" viewBox="0 0 24 24">
		<text x="3" y="19" font-family="sans-serif" font-size="16" fill="currentColor">H3</text>
	</symbol>

	<symbol id="icon-block-h4" viewBox="0 0 24 24">
		<text x="3" y="19" font-family="sans-serif" font-size="16" fill="currentColor">H4</text>
	</symbol>

	<!-- Hero Video Icon -->
	<symbol id="icon-block-hero-video" viewBox="0 0 24 24">
		<rect
			x="2"
			y="3"
			width="20"
			height="14"
			rx="2"
			stroke="currentColor"
			stroke-width="2"
			fill="none"
		/>
		<polygon points="10 8 10 14 15 11" fill="currentColor" />
		<line
			x1="6"
			y1="20"
			x2="18"
			y2="20"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
		/>
	</symbol>

	<!-- Image Hero -->
	<symbol id="icon-block-image-hero" viewBox="0 0 24 24">
		<path
			stroke-linecap="round"
			stroke-linejoin="round"
			stroke-width="2"
			d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
		/>
	</symbol>

	<!-- Text Block -->
	<symbol id="icon-block-text" viewBox="0 0 24 24">
		<path
			stroke-linecap="round"
			stroke-linejoin="round"
			stroke-width="2"
			d="M4 6h16M4 12h16M4 18h16"
		/>
	</symbol>

	<!-- Quote -->
	<symbol id="icon-block-quote" viewBox="0 0 24 24">
		<path
			stroke-linecap="round"
			stroke-linejoin="round"
			stroke-width="2"
			d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
		/>
	</symbol>

	<!-- Image -->
	<symbol id="icon-block-image" viewBox="0 0 24 24">
		<path
			stroke-linecap="round"
			stroke-linejoin="round"
			stroke-width="2"
			d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
		/>
	</symbol>

	<!-- Video -->
	<symbol id="icon-block-video" viewBox="0 0 24 24">
		<path
			stroke-linecap="round"
			stroke-linejoin="round"
			stroke-width="2"
			d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
		/>
		<path
			stroke-linecap="round"
			stroke-linejoin="round"
			stroke-width="2"
			d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
		/>
	</symbol>

	<!-- Slider -->
	<symbol id="icon-block-slider" viewBox="0 0 24 24">
		<path
			stroke-linecap="round"
			stroke-linejoin="round"
			stroke-width="2"
			d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
		/>
	</symbol>

	<!-- Gallery -->
	<symbol id="icon-block-gallery" viewBox="0 0 24 24">
		<path
			stroke-linecap="round"
			stroke-linejoin="round"
			stroke-width="2"
			d="M4 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-3zM14 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1h-4a1 1 0 01-1-1v-3z"
		/>
	</symbol>

	<!-- Media Pair -->
	<symbol id="icon-block-media-pair" viewBox="0 0 24 24">
		<path
			stroke-linecap="round"
			stroke-linejoin="round"
			stroke-width="2"
			d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2"
		/>
	</symbol>

	<!-- Text Frame -->
	<symbol id="icon-block-text-frame" viewBox="0 0 24 24">
		<path
			stroke-linecap="round"
			stroke-linejoin="round"
			stroke-width="2"
			d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
		/>
	</symbol>

	<!-- Embed -->
	<symbol id="icon-block-embed" viewBox="0 0 24 24">
		<rect x="3" y="5" width="18" height="14" rx="2" stroke-width="1.5" />
		<path
			d="M8 10L6 12L8 14M16 10L18 12L16 14"
			stroke-width="1.5"
			stroke-linecap="round"
			stroke-linejoin="round"
		/>
	</symbol>

	<!-- Timeline -->
	<symbol id="icon-block-timeline" viewBox="0 0 24 24">
		<path
			stroke-linecap="round"
			stroke-linejoin="round"
			stroke-width="2"
			d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
		/>
	</symbol>

	<!-- Audio -->
	<symbol id="icon-block-audio" viewBox="0 0 24 24">
		<path
			stroke-linecap="round"
			stroke-linejoin="round"
			stroke-width="2"
			d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
		/>
	</symbol>

	<!-- Colofon -->
	<symbol id="icon-block-colofon" viewBox="0 0 24 24">
		<path
			stroke-linecap="round"
			stroke-linejoin="round"
			stroke-width="2"
			d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
		/>
	</symbol>

	<!-- Soccer Ball (SVG versie van emoji) -->
	<symbol id="icon-block-soccer" viewBox="0 0 24 24">
		<circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.5" fill="none" />
		<!-- Pentagon in center -->
		<path d="M12 7L14.5 10H9.5L12 7Z" fill="currentColor" opacity="0.3" />
		<!-- Hexagons around -->
		<path
			d="M8 10L6 13L8 16M16 10L18 13L16 16M12 17L10 19M12 17L14 19"
			stroke="currentColor"
			stroke-width="1"
			stroke-linecap="round"
		/>
	</symbol>
</svg>

<style>
	.icon-definitions {
		position: absolute;
		width: 0;
		height: 0;
		overflow: hidden;
		pointer-events: none;
	}
</style>
