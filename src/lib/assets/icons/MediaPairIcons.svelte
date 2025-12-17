<!-- src/lib/assets/icons/MediaPairIcons.svelte -->
<script lang="ts">
	/**
	 * MediaPair Layout Icons
	 * Layout presets voor 2-item en 3-item configuraties
	 * @component MediaPairIcons
	 */
</script>

<svg class="icon-definitions" style="display: none;" aria-hidden="true">
	<!-- ========================================
	     2-ITEM LAYOUTS (4 existing + variations)
	     ======================================== -->

	<!-- Layout: Beide items boven uitgelijnd -->
	<symbol id="icon-mediapair-top" viewBox="0 0 32 24">
		<!-- Item 1: Staand blok links (portrait) -->
		<rect x="2" y="2" width="12" height="20" rx="1" fill="currentColor" opacity="0.9" class="item-1" />
		<!-- Item 2: Liggend blok rechts boven (landscape) -->
		<rect x="16" y="2" width="14" height="9" rx="1" fill="currentColor" opacity="0.6" class="item-2" />
	</symbol>

	<!-- Layout: Links staand, rechts onderaan liggend -->
	<symbol id="icon-mediapair-center" viewBox="0 0 32 24">
		<!-- Item 1: Staand blok links -->
		<rect x="2" y="2" width="12" height="20" rx="1" fill="currentColor" opacity="0.9" class="item-1" />
		<!-- Item 2: Liggend blok rechts onderaan -->
		<rect x="16" y="13" width="14" height="9" rx="1" fill="currentColor" opacity="0.6" class="item-2" />
	</symbol>

	<!-- Layout: Beide items onder uitgelijnd -->
	<symbol id="icon-mediapair-bottom" viewBox="0 0 32 24">
		<!-- Item 1: Liggend blok links boven -->
		<rect x="2" y="2" width="12" height="9" rx="1" fill="currentColor" opacity="0.9" class="item-1" />
		<!-- Item 2: Staand blok rechts (portrait) -->
		<rect x="16" y="2" width="14" height="20" rx="1" fill="currentColor" opacity="0.6" class="item-2" />
	</symbol>

	<!-- Layout: Links liggend onder, rechts staand -->
	<symbol id="icon-mediapair-bottom-alt" viewBox="0 0 32 24">
		<!-- Item 1: Liggend blok links onder -->
		<rect x="2" y="13" width="12" height="9" rx="1" fill="currentColor" opacity="0.9" class="item-1" />
		<!-- Item 2: Staand blok rechts -->
		<rect x="16" y="2" width="14" height="20" rx="1" fill="currentColor" opacity="0.6" class="item-2" />
	</symbol>

	<!-- ========================================
	     3-ITEM LAYOUTS (NEW!)
	     ======================================== -->

	<!-- Layout 5: 1 staand links, 2 liggend rechts gestapeld -->
	<symbol id="icon-mediapair-3col-left" viewBox="0 0 32 24">
		<!-- Item 1: Staand blok links -->
		<rect x="2" y="2" width="12" height="20" rx="1" fill="currentColor" opacity="0.9" class="item-1" />
		<!-- Item 2: Liggend blok rechtsboven -->
		<rect x="16" y="2" width="14" height="9" rx="1" fill="currentColor" opacity="0.6" class="item-2" />
		<!-- Item 3: Liggend blok rechtsonder -->
		<rect x="16" y="13" width="14" height="9" rx="1" fill="currentColor" opacity="0.35" class="item-3" />
	</symbol>

	<!-- Layout 6: 2 liggend links gestapeld, 1 staand rechts -->
	<symbol id="icon-mediapair-3col-right" viewBox="0 0 32 24">
		<!-- Item 1: Liggend blok linksboven -->
		<rect x="2" y="2" width="14" height="9" rx="1" fill="currentColor" opacity="0.9" class="item-1" />
		<!-- Item 2: Liggend blok linksonder -->
		<rect x="2" y="13" width="14" height="9" rx="1" fill="currentColor" opacity="0.6" class="item-2" />
		<!-- Item 3: Staand blok rechts -->
		<rect x="18" y="2" width="12" height="20" rx="1" fill="currentColor" opacity="0.35" class="item-3" />
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
