<script lang="ts">
	// Jouw bestaande imports
	import favicon from '$lib/assets/favicon.svg';
	import Lightbox from '$lib/components/Lightbox.svelte';
	import '../app.css';

	// VERWIJDERD: De directe import van de environment variabele
	// import { PUBLIC_GTM_ID } from '$env/static/public';

	// AANGEPAST: We ontvangen nu 'data' van onze load functie
	let { data, children } = $props<{
		data: { gtmId?: string }; // TypeScript type voor de data
		children: any;
	}>();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	{#if data.gtmId}
		<script>
			(function (w, d, s, l, i) {
				w[l] = w[l] || [];
				w[l].push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
				var f = d.getElementsByTagName(s)[0],
					j = d.createElement(s),
					dl = l != 'dataLayer' ? '&l=' + l : '';
				j.async = true;
				j.src = 'https://www.googletagmanager.com/gtm.js?id=' + i + dl;
				f.parentNode.insertBefore(j, f);
			})(window, document, 'script', 'dataLayer', data.gtmId);
		</script>
	{/if}
</svelte:head>

{#if data.gtmId}
	<noscript
		><iframe
			src={`https://www.googletagmanager.com/ns.html?id=${data.gtmId}`}
			height="0"
			width="0"
			style="display:none;visibility:hidden"
			title="Google Tag Manager"
		></iframe></noscript
	>
{/if}

<Lightbox />
{@render children?.()}
