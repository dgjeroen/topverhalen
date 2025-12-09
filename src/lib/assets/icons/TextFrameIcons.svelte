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

	<!-- Narrow Layout (page frame + centered content with wide gutters) -->
	<symbol id="icon-width-narrow" viewBox="0 0 24 24">
		<!-- 16:9 screen frame -->
		<rect
			x="2"
			y="6"
			width="20"
			height="11"
			rx="1.2"
			fill="none"
			stroke="currentColor"
			stroke-width="1"
		/>
		<!-- portrait (tall) content that spans top-to-bottom inside screen -->
		<rect x="9" y="6" width="6" height="11" rx="0.8" fill="#d10a10" opacity="0.22" />
	</symbol>

	<!-- Wide Layout (smaller side gutters) -->
	<symbol id="icon-width-wide" viewBox="0 0 24 24">
		<!-- 16:9 screen frame -->
		<rect
			x="2"
			y="6"
			width="20"
			height="11"
			rx="1.2"
			fill="none"
			stroke="currentColor"
			stroke-width="1"
		/>
		<!-- landscape content that doesn't touch screen edges (centered, slightly less wide) -->
		<rect x="6" y="7" width="12" height="9" rx="0.9" fill="#d10a10" opacity="0.2" />
	</symbol>

	<!-- Full / Edge-to-edge Layout (content touches edges) -->
	<symbol id="icon-width-full" viewBox="0 0 24 24">
		<!-- 16:9 screen frame -->
		<rect
			x="2"
			y="6"
			width="20"
			height="11"
			rx="1.2"
			fill="none"
			stroke="currentColor"
			stroke-width="1"
		/>
		<!-- full-bleed content that fills the screen horizontally -->
		<rect x="2" y="6" width="20" height="11" rx="1.2" fill="#d10a10" opacity="0.18" />
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

	<!-- ========================================
	     COLOFON LAYOUTS (2 icons)
	     ======================================== -->

	<!-- Colofon Inline: Onder elkaar (verticaal gestapeld) -->
	<symbol id="icon-colofon-inline" viewBox="0 0 32 32">
		<!-- Blok 1 -->
		<line
			x1="13"
			y1="9"
			x2="19"
			y2="9"
			stroke="currentColor"
			stroke-width="1.5"
			stroke-linecap="round"
		/>
		<line
			x1="8"
			y1="12"
			x2="24"
			y2="12"
			stroke="currentColor"
			stroke-width="1.5"
			stroke-linecap="round"
			opacity="0.5"
		/>
		<!-- Blok 2 -->
		<line
			x1="13"
			y1="20"
			x2="19"
			y2="20"
			stroke="currentColor"
			stroke-width="1.5"
			stroke-linecap="round"
		/>
		<line
			x1="8"
			y1="23"
			x2="24"
			y2="23"
			stroke="currentColor"
			stroke-width="1.5"
			stroke-linecap="round"
			opacity="0.5"
		/>
	</symbol>

	<!-- Colofon Columns: Naast elkaar (horizontaal) -->
	<symbol id="icon-colofon-columns" viewBox="0 0 32 32">
		<!-- Rij 1 -->
		<line
			x1="6"
			y1="10"
			x2="11"
			y2="10"
			stroke="currentColor"
			stroke-width="1.5"
			stroke-linecap="round"
		/>
		<line
			x1="14"
			y1="10"
			x2="26"
			y2="10"
			stroke="currentColor"
			stroke-width="1.5"
			stroke-linecap="round"
			opacity="0.5"
		/>
		<!-- Rij 2 -->
		<line
			x1="6"
			y1="16"
			x2="11"
			y2="16"
			stroke="currentColor"
			stroke-width="1.5"
			stroke-linecap="round"
		/>
		<line
			x1="14"
			y1="16"
			x2="26"
			y2="16"
			stroke="currentColor"
			stroke-width="1.5"
			stroke-linecap="round"
			opacity="0.5"
		/>
		<!-- Rij 3 -->
		<line
			x1="6"
			y1="22"
			x2="11"
			y2="22"
			stroke="currentColor"
			stroke-width="1.5"
			stroke-linecap="round"
		/>
		<line
			x1="14"
			y1="22"
			x2="26"
			y2="22"
			stroke="currentColor"
			stroke-width="1.5"
			stroke-linecap="round"
			opacity="0.5"
		/>
	</symbol>

	<!-- Aspect Ratio Icons -->
	<symbol id="icon-aspect-original" viewBox="0 0 32 32">
		<!-- Auto-fit rectangle with expanding arrows -->
		<rect
			x="8"
			y="10"
			width="16"
			height="12"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			rx="2"
		/>
		<path d="M 4 16 L 7 16 M 25 16 L 28 16" stroke="currentColor" stroke-width="2" />
		<path d="M 16 6 L 16 9 M 16 23 L 16 26" stroke="currentColor" stroke-width="2" />
		<text
			x="16"
			y="18"
			text-anchor="middle"
			font-size="6"
			font-weight="600"
			fill="currentColor"
		>
			AUTO
		</text>
	</symbol>

	<symbol id="icon-aspect-4-3" viewBox="0 0 32 32">
		<!-- 4:3 landscape rectangle -->
		<rect
			x="6"
			y="10"
			width="20"
			height="12"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			rx="2"
		/>
		<text
			x="16"
			y="18"
			text-anchor="middle"
			font-size="7"
			font-weight="600"
			fill="currentColor"
		>
			4:3
		</text>
	</symbol>

	<symbol id="icon-aspect-16-9" viewBox="0 0 32 32">
		<!-- 16:9 wide landscape rectangle -->
		<rect
			x="4"
			y="11"
			width="24"
			height="10"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			rx="2"
		/>
		<text
			x="16"
			y="18"
			text-anchor="middle"
			font-size="6"
			font-weight="600"
			fill="currentColor"
		>
			16:9
		</text>
	</symbol>

	<symbol id="icon-aspect-4-5" viewBox="0 0 32 32">
		<!-- 4:5 portrait rectangle -->
		<rect
			x="10"
			y="6"
			width="12"
			height="20"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			rx="2"
		/>
		<text
			x="16"
			y="18"
			text-anchor="middle"
			font-size="7"
			font-weight="600"
			fill="currentColor"
		>
			4:5
		</text>
	</symbol>

	<symbol id="icon-aspect-1-1" viewBox="0 0 32 32">
		<!-- 1:1 square -->
		<rect
			x="9"
			y="9"
			width="14"
			height="14"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			rx="2"
		/>
		<text
			x="16"
			y="18"
			text-anchor="middle"
			font-size="7"
			font-weight="600"
			fill="currentColor"
		>
			1:1
		</text>
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
