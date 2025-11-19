<!-- src/lib/components/SwitchFavicon.svelte -->
<script lang="ts">
	import { onMount } from 'svelte';

	import dgFavicon from '$lib/assets/favicons/favicon-dg.svg';
	import bdFavicon from '$lib/assets/favicons/favicon-bd.svg';
	import adFavicon from '$lib/assets/favicons/favicon-ad.svg';
	import edFavicon from '$lib/assets/favicons/favicon-ed.svg';
	import tubFavicon from '$lib/assets/favicons/favicon-tub.svg';
	import dsFavicon from '$lib/assets/favicons/favicon-ds.svg';
	import bndsFavicon from '$lib/assets/favicons/favicon-bnds.svg';
	import pzcFavicon from '$lib/assets/favicons/favicon-pzc.svg';

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

	let currentHost = $state('');

	onMount(() => {
		currentHost = window.location.hostname;
	});

	// Gebruik derived state. Als het host niet bestaat, pakken we standaard DG.
	let faviconSrc = $derived(faviconMap[currentHost] || dgFavicon);

	export { faviconSrc };
</script>
