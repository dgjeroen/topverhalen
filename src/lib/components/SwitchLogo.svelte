<!-- src/lib/components/SwitchLogo.svelte -->
<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';

	// Images imports
	import dgLogoDia from '$lib/assets/dgLogo-dia.svg';
	import bdLogoDia from '$lib/assets/bdLogo-dia.svg';
	import adLogoDia from '$lib/assets/adLogo-dia.svg';
	import edLogoDia from '$lib/assets/edLogo-dia.svg';
	import tubLogoDia from '$lib/assets/tubLogo-dia.svg';
	import dsLogoDia from '$lib/assets/dsLogo-dia.svg';
	import bndsLogoDia from '$lib/assets/bndsLogo-dia.svg';
	import pzcLogoDia from '$lib/assets/pzcLogo-dia.svg';

	import dgLogoColor from '$lib/assets/dgLogo-color.svg';
	import bdLogoColor from '$lib/assets/bdLogo-color.svg';
	import adLogoColor from '$lib/assets/adLogo-color.svg';
	import edLogoColor from '$lib/assets/edLogo-color.svg';
	import tubLogoColor from '$lib/assets/tubLogo-color.svg';
	import dsLogoColor from '$lib/assets/dsLogo-color.svg';
	import bndsLogoColor from '$lib/assets/bndsLogo-color.svg';
	import pzcLogoColor from '$lib/assets/pzcLogo-color.svg';

	let { variant = 'dia' } = $props<{
		variant?: 'color' | 'dia';
	}>();

	// Definieer de maps
	const logoMapDia: Record<string, string> = {
		'www.gelderlander.nl': dgLogoDia,
		'www.bd.nl': bdLogoDia,
		'www.ad.nl': adLogoDia,
		'www.ed.nl': edLogoDia,
		'www.tubantia.nl': tubLogoDia,
		'www.destentor.nl': dsLogoDia,
		'www.bndestem.nl': bndsLogoDia,
		'www.pzc.nl': pzcLogoDia,
		localhost: dgLogoDia,
		'cms.topverhaal.nl': dgLogoDia
	};

	const logoMapColor: Record<string, string> = {
		'www.gelderlander.nl': dgLogoColor,
		'www.bd.nl': bdLogoColor,
		'www.ad.nl': adLogoColor,
		'www.ed.nl': edLogoColor,
		'www.tubantia.nl': tubLogoColor,
		'www.destentor.nl': dsLogoColor,
		'www.bndestem.nl': bndsLogoColor,
		'www.pzc.nl': pzcLogoColor,
		localhost: dgLogoColor,
		'cms.topverhaal.nl': dgLogoColor
	};

	let currentHost = $state('');

	onMount(() => {
		currentHost = window.location.hostname;
	});

	let logoSrc = $derived.by(() => {
		if (!currentHost) return undefined;

		const map = variant === 'color' ? logoMapColor : logoMapDia;
		const foundLogo = map[currentHost];

		if (foundLogo) {
			return foundLogo;
		}

		console.warn(`⚠️ Hostname '${currentHost}' not in logoMap, using default.`);
		return variant === 'color' ? dgLogoColor : dgLogoDia;
	});
</script>

<div class="logo-container">
	{#if logoSrc}
		<a
			href="https://{currentHost}"
			target="_blank"
			rel="noopener noreferrer"
			aria-label="Homepagina"
		>
			<img src={logoSrc} alt="Logo" />
		</a>
	{/if}
</div>

<style>
	.logo-container {
		text-align: center;
		margin-bottom: var(--space-l);
	}

	.logo-container img {
		height: 60px;
		width: auto;
		display: block;
		margin: 21px auto 0 auto;
	}
</style>
