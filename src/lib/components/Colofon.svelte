<!-- src/lib/components/Colofon.svelte -->
<script lang="ts">
	import type { ColofonContent } from '$lib/types';
	import SwitchLogo from './SwitchLogo.svelte';

	let { items, showLogo = true, logoVariant = 'dia', layout = 'inline' }: ColofonContent = $props();
</script>

<div class="colofon-container" class:with-logo={showLogo}>
	<dl class="layout-{layout}">
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
		text-align: center;
	}

	.colofon-container:not(.with-logo) {
		border-top: 1px solid var(--colofon-border-color, var(--color-border, #e5e7eb));
	}

	/* Base styles for both layouts */
	dl {
		margin: 0;
	}

	dt {
		font-family: var(--font-family-base);
		font-weight: var(--colofon-dt-weight, 600);
		color: var(--colofon-dt-color, var(--color-text, #111827));
	}

	dd {
		margin: 0;
		color: var(--colofon-dd-color, var(--color-text-muted, #6b7280));
		font-weight: var(--colofon-dd-weight, 400);
	}

	/* Inline layout (default) */
	dl.layout-inline {
		display: flex;
		flex-direction: column;
		gap: var(--colofon-gap, var(--space-s, 0.75rem));
	}

	dl.layout-inline dt,
	dl.layout-inline dd {
		display: inline;
	}

	dl.layout-inline dt::after {
		content: '';
		display: inline-block;
		width: var(--colofon-column-gap, 0.5rem);
	}

	/* Columns layout */
	dl.layout-columns {
		display: grid;
		grid-template-columns: 1fr 1fr;
		row-gap: var(--colofon-gap, var(--space-s, 0.75rem));
		max-width: max-content;
		margin: 0 auto;
	}

	dl.layout-columns dt {
		text-align: right;
		white-space: nowrap;
		padding-right: var(--colofon-column-gap, 0.25rem);
	}

	dl.layout-columns dd {
		text-align: left;
		padding-left: var(--colofon-column-gap, 0.25rem);
	}

	@media (max-width: 600px) {
		/* Op mobiel: dl wordt een smal blok (gecentreerd), inhoud links uitgelijnd */
		dl.layout-inline,
		dl.layout-columns {
			display: flex;
			flex-direction: column;
			gap: var(--space-xs);
			width: min(92%, 360px);
			margin: 0 auto; /* center the block itself */
			text-align: left; /* make inner text left-aligned */
		}

		/* Stack items and remove inline separators on small screens */
		dl.layout-inline dt,
		dl.layout-inline dd,
		dl.layout-columns dt,
		dl.layout-columns dd {
			display: block;
			padding: 0;
			text-align: left;
		}

		dl.layout-inline dt::after,
		dl.layout-columns dt::after {
			content: none;
		}
	}
</style>
