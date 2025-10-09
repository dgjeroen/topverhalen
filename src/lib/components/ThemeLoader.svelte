<script lang="ts">
	/**
	 * Type-definitie voor het 'theme' object uit content.json.
	 * Deze sleutels komen 1-op-1 overeen met de CSS Custom Properties in app.css.
	 * Door ze hier te definiëren, krijgen we type-checking en editor auto-aanvulling.
	 * Alle eigenschappen zijn optioneel (aangegeven met '?').
	 */
	type Theme = {
		'standard-max-width'?: string;
		'wide-max-width'?: string;
		'space-s'?: string;
		'space-m'?: string;
		'space-l'?: string;
		'space-xl'?: string;
		'space-xxl'?: string;
		'space-xxxl'?: string;
		'block-vertical-margin'?: string;
		'color-text'?: string;
		'color-text-muted'?: string;
		'color-background-light'?: string;
		'color-border'?: string;
		'color-accent'?: string;
		'color-white'?: string;
		'font-family-base'?: string;
		'font-family-quote'?: string;
		'border-radius-base'?: string;
		'box-shadow-base'?: string;
		// ...en alle andere variabelen die je aanpasbaar wilt maken.
	};

	/**
	 * Accepteert een theme-object uit de content.json.
	 * @type {Theme | undefined | null}
	 */
	let { theme }: { theme: Theme | undefined | null } = $props();

	/**
	 * `$derived` berekent de inline-stijlstring alleen wanneer de `theme` prop verandert.
	 * Dit is efficiënt en voorkomt onnodige herberekeningen.
	 */
	const styleString = $derived(() => {
		if (!theme) return '';

		// Converteer het object naar een CSS-variabelen string:
		// { 'color-text': '#ff0000' } => '--color-text:#ff0000;'
		return Object.entries(theme)
			.filter(([, value]) => value) // Filter eventuele lege waarden uit
			.map(([key, value]) => `--${key}:${value};`)
			.join('');
	});
</script>

<svelte:head>
	{#if styleString()}
		<style>
:root {ldelim}{styleString()}{rdelim}
		</style>
	{/if}
</svelte:head>
