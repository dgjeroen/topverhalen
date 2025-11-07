<!-- src/lib/components/SwitchFavicon.svelte -->
<script lang="ts">
	import dgFavicon from '$lib/assets/favicon-dg.svg';
	import bdFavicon from '$lib/assets/favicon-bd.svg';
	import adFavicon from '$lib/assets/favicon-ad.svg';
	import edFavicon from '$lib/assets/favicon-ed.svg';
	import tubFavicon from '$lib/assets/favicon-tub.svg';
	import dsFavicon from '$lib/assets/favicon-ds.svg';
	import bndsFavicon from '$lib/assets/favicon-bnds.svg';
	import pzcFavicon from '$lib/assets/favicon-pzc.svg';

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

	let faviconSrc = $state<string | undefined>(undefined);

	$effect(() => {
		const currentHost = window.location.hostname;
		faviconSrc = faviconMap[currentHost];
	});

	// Export voor gebruik in +layout.svelte
	export { faviconSrc };
</script>

<!-- Geen HTML nodig - dit is alleen logica -->
