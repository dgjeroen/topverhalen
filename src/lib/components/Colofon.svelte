<script lang="ts">
	import type { ColofonContent } from '$lib/types';
	import HeaderLogo from './SwitchLogo.svelte'; // DE FIX: Ontvang de props direct en gebruik het specifieke type

	let { items, showLogo = true }: ColofonContent = $props();
</script>

<div class="colofon-container" class:with-logo={showLogo}>
	<dl>
		{#each items as item (item.functie)}
			<dt>{item.functie}</dt>
			<dd>{item.namen}</dd>
		{/each}
	</dl>
	{#if showLogo}
		<HeaderLogo />
	{/if}
</div>

<style>
	.colofon-container {
		border-bottom: 1px solid var(--color-border);
		padding-block: var(--space-l);
		font-size: var(--font-size-m);
	}

	.colofon-container:not(.with-logo) {
		border-top: 1px solid var(--color-border);
	}

	dl {
		margin: 0;
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: var(--space-s) var(--space-l);
	}
	dt {
		font-family: var(--font-family-base);
		font-weight: 600;
		color: var(--color-text);
		text-align: right;
	}
	dd {
		margin: 0;
		color: var(--color-text-muted);
	}
	@media (max-width: 600px) {
		dl {
			grid-template-columns: 1fr; /* Stapel op kleine schermen */
			gap: var(--space-xs);
		}
		dt {
			text-align: left; /* Lijn links uit op mobiel */
		}
	}
</style>
