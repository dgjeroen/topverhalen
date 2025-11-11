<!-- src/lib/components/SwitchLogo.svelte -->
<script lang="ts">
	import { browser } from '$app/environment'; // ✅ Import browser check

	// ✅ Import BEIDE varianten
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

	const logoMapDia: Record<string, string> = {
		// Production domains
		'www.gelderlander.nl': dgLogoDia,
		'www.bd.nl': bdLogoDia,
		'www.ad.nl': adLogoDia,
		'www.ed.nl': edLogoDia,
		'www.tubantia.nl': tubLogoDia,
		'www.destentor.nl': dsLogoDia,
		'www.bndestem.nl': bndsLogoDia,
		'www.pzc.nl': pzcLogoDia,

		// Development & CMS
		localhost: dgLogoDia,
		'cms.topverhaal.nl': dgLogoDia,

		// Vercel preview domains
		'topverhalen.vercel.app': dgLogoDia,
		'topverhalen-git-develop-dgjeroen.vercel.app': dgLogoDia,
		'topverhalen-git-main-dgjeroen.vercel.app': dgLogoDia
	};

	const logoMapColor: Record<string, string> = {
		// Production domains
		'www.gelderlander.nl': dgLogoColor,
		'www.bd.nl': bdLogoColor,
		'www.ad.nl': adLogoColor,
		'www.ed.nl': edLogoColor,
		'www.tubantia.nl': tubLogoColor,
		'www.destentor.nl': dsLogoColor,
		'www.bndestem.nl': bndsLogoColor,
		'www.pzc.nl': pzcLogoColor,

		// Development & CMS
		localhost: dgLogoColor,
		'cms.topverhaal.nl': dgLogoColor,

		// Vercel preview domains
		'topverhalen.vercel.app': dgLogoColor,
		'topverhalen-git-develop-dgjeroen.vercel.app': dgLogoColor,
		'topverhalen-git-main-dgjeroen.vercel.app': dgLogoColor
	};

	let logoSrc = $state<string | undefined>(undefined);

	$effect(() => {
		// ✅ Only run in browser
		if (!browser) return;

		const currentHost = window.location.hostname;
		const logoMap = variant === 'color' ? logoMapColor : logoMapDia;
		logoSrc = logoMap[currentHost];

		// ✅ DEBUG (kan later verwijderd worden)
		console.log('🔍 SwitchLogo Debug:', {
			hostname: currentHost,
			variant,
			logoSrc,
			availableHosts: Object.keys(logoMap)
		});

		// ✅ Fallback als hostname niet gevonden
		if (!logoSrc) {
			console.warn('⚠️ Hostname not in logoMap, using Gelderlander as fallback');
			logoSrc = variant === 'color' ? dgLogoColor : dgLogoDia;
		}
	});
</script>

<div class="logo-container">
	{#if logoSrc}
		<a
			href="https://{browser ? window.location.hostname : ''}"
			target="_blank"
			rel="noopener noreferrer"
			aria-label="Homepagina"
		>
			<img
				src={logoSrc}
				alt="Logo"
				onload={() => console.log('✅ Logo loaded:', logoSrc)}
				onerror={() => console.error('❌ Logo failed:', logoSrc)}
			/>
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
