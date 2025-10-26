<!-- src/lib/assets/icons/TextFrameIcons.svelte -->
<script lang="ts">
	/**
	 * TextFrame Layout Icons
	 * 4 layout presets + width controls
	 * @component TextFrameIcons
	 */
</script>

<svg class="icon-definitions" style="display: none;" aria-hidden="true">
	<!-- ========================================
	     WIDTH CONTROLS (2 icons)
	     ======================================== -->

	<!-- Narrow Layout -->
	<symbol id="icon-width-narrow" viewBox="0 0 24 24">
		<rect
			x="6"
			y="4"
			width="12"
			height="16"
			rx="2"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
		/>
	</symbol>

	<!-- Wide Layout -->
	<symbol id="icon-width-wide" viewBox="0 0 24 24">
		<rect
			x="2"
			y="4"
			width="20"
			height="16"
			rx="2"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
		/>
	</symbol>

	<!-- ========================================
	     IMAGE LAYOUTS (4 icons)
	     ======================================== -->

	<!-- Layout 1: Rechthoek boven, kop + tekst onder -->
	<symbol id="icon-layout-top-rect" viewBox="0 0 32 32">
		<!-- Foto (rechthoek, volle breedte) -->
		<rect x="4" y="4" width="24" height="9" rx="1" fill="currentColor" opacity="0.25" />
		<!-- Kop (dikke lijn) -->
		<line
			x1="4"
			y1="17"
			x2="20"
			y2="17"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
		/>
		<!-- Tekst (dunne lijnen) -->
		<line
			x1="4"
			y1="21"
			x2="28"
			y2="21"
			stroke="currentColor"
			stroke-width="1"
			stroke-linecap="round"
		/>
		<line
			x1="4"
			y1="24"
			x2="28"
			y2="24"
			stroke="currentColor"
			stroke-width="1"
			stroke-linecap="round"
		/>
		<line
			x1="4"
			y1="27"
			x2="22"
			y2="27"
			stroke="currentColor"
			stroke-width="1"
			stroke-linecap="round"
		/>
	</symbol>

	<!-- Layout 2: Kop + tekst boven, rechthoek onderaan -->
	<symbol id="icon-layout-top-rect-bottom" viewBox="0 0 32 32">
		<!-- Kop (dikke lijn) -->
		<line
			x1="4"
			y1="5"
			x2="20"
			y2="5"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
		/>
		<!-- Tekst (dunne lijnen) -->
		<line
			x1="4"
			y1="9"
			x2="28"
			y2="9"
			stroke="currentColor"
			stroke-width="1"
			stroke-linecap="round"
		/>
		<line
			x1="4"
			y1="12"
			x2="28"
			y2="12"
			stroke="currentColor"
			stroke-width="1"
			stroke-linecap="round"
		/>
		<line
			x1="4"
			y1="15"
			x2="22"
			y2="15"
			stroke="currentColor"
			stroke-width="1"
			stroke-linecap="round"
		/>
		<!-- Foto (rechthoek, volle breedte, onderaan) -->
		<rect x="4" y="19" width="24" height="9" rx="1" fill="currentColor" opacity="0.25" />
	</symbol>

	<!-- Layout 3: Kop boven, vierkant links (50% width) -->
	<symbol id="icon-layout-inline-left" viewBox="0 0 32 32">
		<!-- Kop (dikke lijn) -->
		<line
			x1="4"
			y1="5"
			x2="20"
			y2="5"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
		/>
		<!-- Foto (vierkant links, 50% width) -->
		<rect x="4" y="9" width="12" height="12" rx="1" fill="currentColor" opacity="0.25" />
		<!-- Tekst rechts van foto -->
		<line
			x1="18"
			y1="10"
			x2="28"
			y2="10"
			stroke="currentColor"
			stroke-width="1"
			stroke-linecap="round"
		/>
		<line
			x1="18"
			y1="13"
			x2="28"
			y2="13"
			stroke="currentColor"
			stroke-width="1"
			stroke-linecap="round"
		/>
		<line
			x1="18"
			y1="16"
			x2="28"
			y2="16"
			stroke="currentColor"
			stroke-width="1"
			stroke-linecap="round"
		/>
		<line
			x1="18"
			y1="19"
			x2="28"
			y2="19"
			stroke="currentColor"
			stroke-width="1"
			stroke-linecap="round"
		/>
		<!-- Tekst onder foto (volle breedte) -->
		<line
			x1="4"
			y1="24"
			x2="28"
			y2="24"
			stroke="currentColor"
			stroke-width="1"
			stroke-linecap="round"
		/>
		<line
			x1="4"
			y1="27"
			x2="22"
			y2="27"
			stroke="currentColor"
			stroke-width="1"
			stroke-linecap="round"
		/>
	</symbol>

	<!-- Layout 4: Kop boven, vierkant rechts (50% width) -->
	<symbol id="icon-layout-inline-right" viewBox="0 0 32 32">
		<!-- Kop (dikke lijn) -->
		<line
			x1="4"
			y1="5"
			x2="20"
			y2="5"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
		/>
		<!-- Foto (vierkant rechts, 50% width) -->
		<rect x="16" y="9" width="12" height="12" rx="1" fill="currentColor" opacity="0.25" />
		<!-- Tekst links van foto -->
		<line
			x1="4"
			y1="10"
			x2="14"
			y2="10"
			stroke="currentColor"
			stroke-width="1"
			stroke-linecap="round"
		/>
		<line
			x1="4"
			y1="13"
			x2="14"
			y2="13"
			stroke="currentColor"
			stroke-width="1"
			stroke-linecap="round"
		/>
		<line
			x1="4"
			y1="16"
			x2="14"
			y2="16"
			stroke="currentColor"
			stroke-width="1"
			stroke-linecap="round"
		/>
		<line
			x1="4"
			y1="19"
			x2="14"
			y2="19"
			stroke="currentColor"
			stroke-width="1"
			stroke-linecap="round"
		/>
		<!-- Tekst onder foto (volle breedte) -->
		<line
			x1="4"
			y1="24"
			x2="28"
			y2="24"
			stroke="currentColor"
			stroke-width="1"
			stroke-linecap="round"
		/>
		<line
			x1="10"
			y1="27"
			x2="28"
			y2="27"
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
