<!-- TextBlock.svelte -->
<script lang="ts">
	// We maken de interface wat algemener, passend bij de nieuwe componentnaam.
	import type { TextBlockContent } from '$lib/types'; // Je moet wellicht ParagraphsContent hernoemen in je types.ts

	// NIEUW: We voegen een optionele 'isLead' prop toe, die standaard 'false' is.
	let { text, isLead = false }: TextBlockContent = $props();
</script>

<div class:lead={isLead}>
	{#each text as paragraph}
		<p>{@html paragraph}</p>
	{/each}
</div>

<style>
	/* Standaardstijl voor alle paragrafen */
	p {
		margin: 0 0 var(--space-m) 0;
		line-height: 1.7;
		font-size: var(--font-size-m);
		/* NIEUW: We zetten een standaard font-weight */
		font-weight: var(--font-weight-normal, 400);
	}

	p:last-child {
		margin-bottom: 0;
	}

	/* NIEUW: Speciale stijl die ALLEEN actief wordt als de 'lead' class aanwezig is */
	.lead p {
		font-size: var(--font-size-l); /* Groter lettertype */
		font-weight: var(--font-weight-semibold, 600); /* Dikker lettertype */
		line-height: 1.6; /* Eventueel een iets andere line-height */
	}
</style>
