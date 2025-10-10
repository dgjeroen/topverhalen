<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>Dashboard - Topverhalen CMS</title>
</svelte:head>

<div class="dashboard">
	<div class="welcome">
		<h1>Welkom, {data.user.name}! 👋</h1>
		<p>Je bent succesvol ingelogd in het Topverhalen CMS.</p>
		<p class="email">{data.user.email}</p>
	</div>

	<div class="cards">
		<div class="card">
			<h2>📝 Projecten</h2>
			<p>Beheer je verhalen en projecten</p>
			<button disabled>Binnenkort beschikbaar</button>
		</div>

		<div class="card">
			<h2>🎨 Thema's</h2>
			<p>Pas styling en branding aan</p>
			<button disabled>Binnenkort beschikbaar</button>
		</div>

		<div class="card">
			<h2>🚀 Deployments</h2>
			<p>Bekijk en beheer deployments</p>
			<button disabled>Binnenkort beschikbaar</button>
		</div>
	</div>

	<div class="success-banner">
		<h3>🎉 Authenticatie Werkt!</h3>
		<p>Je magic link systeem is succesvol geïmplementeerd.</p>
		<p><strong>Volgende stap:</strong> CMS editor interface bouwen</p>
	</div>
</div>

<style>
	.dashboard {
		max-width: 1200px;
		margin: 0 auto;
		padding: 20px;
	}

	.welcome {
		background: white;
		padding: 30px;
		border-radius: 12px;
		margin-bottom: 30px;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
	}

	.welcome h1 {
		margin: 0 0 10px;
		color: #333;
		font-size: 32px;
	}

	.welcome p {
		margin: 5px 0 0;
		color: #666;
		font-size: 16px;
	}

	.welcome .email {
		color: #667eea;
		font-weight: 600;
	}

	.cards {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		gap: 20px;
		margin-bottom: 30px;
	}

	.card {
		background: white;
		padding: 30px;
		border-radius: 12px;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
	}

	.card h2 {
		margin: 0 0 10px;
		font-size: 20px;
		color: #333;
	}

	.card p {
		margin: 0 0 20px;
		color: #666;
		font-size: 14px;
	}

	.card button {
		padding: 10px 20px;
		background: #e0e0e0;
		color: #999;
		border: none;
		border-radius: 6px;
		cursor: not-allowed;
		font-size: 14px;
	}

	.success-banner {
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		color: white;
		padding: 30px;
		border-radius: 12px;
		text-align: center;
	}

	.success-banner h3 {
		margin: 0 0 10px;
		font-size: 24px;
	}

	.success-banner p {
		margin: 5px 0;
		font-size: 16px;
	}

	.success-banner strong {
		font-weight: 700;
	}
</style>
