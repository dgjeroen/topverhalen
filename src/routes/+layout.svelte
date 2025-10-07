<script lang="ts">
	// Jouw bestaande imports
	import favicon from '$lib/assets/favicon.svg';
	import Lightbox from '$lib/components/Lightbox.svelte';
	import '../app.css';

	import { PUBLIC_GTM_ID } from '$env/static/public';

	// Jouw bestaande props
	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link
		href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=Lora:ital,wght@1,400&display=swap"
		rel="stylesheet"
	/>
	<link rel="stylesheet" href="https://use.typekit.net/vgt7pcs.css" />

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
		})(window, document, 'script', 'dataLayer', PUBLIC_GTM_ID);
	</script>
</svelte:head>

<noscript
	><iframe
		src="https://www.googletagmanager.com/ns.html?id={PUBLIC_GTM_ID}"
		height="0"
		width="0"
		style="display:none;visibility:hidden"
		title="Google Tag Manager"
	></iframe></noscript
>
<Lightbox />
{@render children?.()}
