<script lang="ts">
	// Het script-gedeelte blijft ongewijzigd
	import dgLogo from '$lib/assets/dgLogo-dia.svg';
	import bdLogo from '$lib/assets/bdLogo-dia.svg';
	import adLogo from '$lib/assets/adLogo-dia.svg';
	import edLogo from '$lib/assets/edLogo-dia.svg';
	import tubLogo from '$lib/assets/tubLogo-dia.svg';
	import dsLogo from '$lib/assets/dsLogo-dia.svg';
	import bndsLogo from '$lib/assets/bndsLogo-dia.svg';
	import pzcLogo from '$lib/assets/pzcLogo-dia.svg';

	const logoMap: Record<string, string> = {
		'www.gelderlander.nl': dgLogo,
		'www.bd.nl': bdLogo,
		'www.ad.nl': adLogo,
		'www.ed.nl': edLogo,
		'www.tubantia.nl': tubLogo,
		'www.destentor.nl': dsLogo,
		'www.bndestem.nl': bndsLogo,
		'www.pzc.nl': pzcLogo,
		localhost: dgLogo
	};

	let logoSrc = $state<string | undefined>(undefined);

	$effect(() => {
		const currentHost = window.location.hostname;
		logoSrc = logoMap[currentHost];
	});
</script>

<div class="logo-container">
	{#if logoSrc}
		<a
			href="https://{window.location.hostname}"
			target="_blank"
			rel="noopener noreferrer"
			aria-label="Homepagina"
		>
			<img src={logoSrc} alt="Logo" />
		</a>
	{/if}
</div>

<style>
	/* De padding en border zijn weg, de rest is hetzelfde */
	.logo-container {
		text-align: center;
		margin-bottom: var(--space-l); /* Zorgt voor ruimte tussen logo en colofon-items */
	}

	.logo-container img {
		height: 60px;
		width: auto;
		display: block;
		margin: 21px auto 0 auto;
	}
</style>
