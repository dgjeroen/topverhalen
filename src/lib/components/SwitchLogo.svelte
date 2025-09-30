<script lang="ts">
	// Het script-gedeelte blijft ongewijzigd
	import dgLogo from '$lib/assets/dgLogo-dia.svg';
	import bdLogo from '$lib/assets/bdLogo-dia.svg';
	// ... (alle andere logo-imports) ...

	const logoMap: Record<string, string> = {
		'www.gelderlander.nl': dgLogo,
		'www.bd.nl': bdLogo,
		// ... (de rest van de map) ...
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
