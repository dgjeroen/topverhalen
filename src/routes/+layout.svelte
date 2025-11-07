<!-- src/routes/+layout.svelte -->
<script lang="ts">
	import type { Snippet } from 'svelte';
	import Lightbox from '$lib/components/Lightbox.svelte';
	import '../app.css';
	import { PUBLIC_GTM_ID } from '$env/static/public';
	import ThemeLoader from '$lib/components/ThemeLoader.svelte';
	import type { LayoutData } from './$types';
	import type { Theme } from '$lib/types';
	import { page } from '$app/stores';

	// Import favicons
	import dgFavicon from '$lib/assets/favicons/gelderlander-favicon.ico';
	import bdFavicon from '$lib/assets/favicons/bd-favicon.ico';
	import adFavicon from '$lib/assets/favicons/ad-favicon.ico';
	import edFavicon from '$lib/assets/favicons/ed-favicon.ico';
	import tubFavicon from '$lib/assets/favicons/tubantia-favicon.ico';
	import dsFavicon from '$lib/assets/favicons/destentor-favicon.ico';
	import bndsFavicon from '$lib/assets/favicons/bndestem-favicon.ico';
	import pzcFavicon from '$lib/assets/favicons/pzc-favicon.ico';

	let { children, data }: { children: Snippet; data: LayoutData } = $props();

	const theme = $derived((data as any)?.project?.theme ?? data?.content?.theme ?? undefined) as
		| Theme
		| undefined;

	// Favicon switching logic
	const faviconMap: Record<string, string> = {
		'www.gelderlander.nl': dgFavicon,
		'www.bd.nl': bdFavicon,
		'www.ad.nl': adFavicon,
		'www.ed.nl': edFavicon,
		'www.tubantia.nl': tubFavicon,
		'www.destentor.nl': dsFavicon,
		'www.bndestem.nl': bndsFavicon,
		'www.pzc.nl': pzcFavicon,
		localhost: dgFavicon
	};

	let favicon = $state<string>(dgFavicon);

	$effect(() => {
		if (typeof window !== 'undefined') {
			// Check voor test parameter (development only)
			const testHost = $page.url.searchParams.get('testHost');
			const currentHost = testHost || window.location.hostname;

			favicon = faviconMap[currentHost] || dgFavicon;
		}
	});
</script>

<svelte:head>
	<link rel="icon" type="image/x-icon" href={favicon} />

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
		})(window, document, 'script', 'dataLayer', '%sveltekit.env.PUBLIC_GTM_ID%');
	</script>
</svelte:head>

<noscript>
	<iframe
		src="https://www.googletagmanager.com/ns.html?id={PUBLIC_GTM_ID}"
		height="0"
		width="0"
		style="display:none;visibility:hidden"
		title="Google Tag Manager"
	></iframe>
</noscript>

<ThemeLoader {theme} />

<Lightbox />

{@render children?.()}
