<!-- src/lib/components/Colofon.svelte -->
<script lang="ts">
	import type { ColofonContent } from '$lib/types';
	import SwitchLogo from './SwitchLogo.svelte';

	let { items, showLogo = true, logoVariant = 'dia' }: ColofonContent = $props();
</script>

<div class="colofon-container" class:with-logo={showLogo}>
	<dl>
		{#each items as item (item.functie)}
			<dt>{item.functie}</dt>
			<dd>{item.namen}</dd>
		{/each}

		<!-- Hardcoded development credit -->
		<dt>Development</dt>
		<dd>Jeroen Kuitert</dd>
	</dl>

	{#if showLogo}
		<SwitchLogo variant={logoVariant} />
	{/if}
</div>

<style>
	.colofon-container {
		border-bottom: 1px solid var(--colofon-border-color, var(--color-border, #e5e7eb));
		padding-block: var(--colofon-padding-block, var(--space-l, 2rem));
		font-size: var(--colofon-font-size, var(--font-size-m, 1rem));
	}

	.colofon-container:not(.with-logo) {
		border-top: 1px solid var(--colofon-border-color, var(--color-border, #e5e7eb));
	}

	dl {
		margin: 0;
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: var(--colofon-gap, var(--space-s, 0.75rem)) var(--colofon-column-gap, var(--space-l, 2rem));
	}

	dt {
		font-family: var(--font-family-base);
		font-weight: var(--colofon-dt-weight, 600);
		color: var(--colofon-dt-color, var(--color-text, #111827));
		text-align: var(--colofon-dt-align, right);
	}

	dd {
		margin: 0;
		color: var(--colofon-dd-color, var(--color-text-muted, #6b7280));
		font-weight: var(--colofon-dd-weight, 400);
	}

	/* ✅ REMOVED: .development-credit specifieke styling */

	@media (max-width: 600px) {
		dl {
			grid-template-columns: 1fr;
			gap: var(--space-xs);
		}
		dt {
			text-align: left;
		}
	}
</style>
