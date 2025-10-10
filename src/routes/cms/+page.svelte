<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	interface Project {
		name: string;
		id: string;
	}

	let projects: Project[] = $state([]);
	let loading = $state(true);
	let error = $state('');
	let showNewProjectModal = $state(false);
	let newProjectName = $state('');

	// ✅ Haal projecten op
	async function loadProjects() {
		try {
			const response = await fetch('/cms/api/projects');
			if (!response.ok) throw new Error('Kon projecten niet laden');

			const result = await response.json();
			projects = result.projects || [];
		} catch (err) {
			error = err instanceof Error ? err.message : 'Onbekende fout';
		} finally {
			loading = false;
		}
	}

	// ✅ Maak nieuw project
	async function createProject() {
		if (!newProjectName.trim()) return;

		try {
			const response = await fetch('/cms/api/projects', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ name: newProjectName.trim() })
			});

			if (!response.ok) throw new Error('Kon project niet aanmaken');

			const { id } = await response.json();
			goto(`/cms/editor/${id}`);
		} catch (err) {
			alert(err instanceof Error ? err.message : 'Fout bij aanmaken');
		}
	}

	// ✅ Open bestaand project
	function openProject(id: string) {
		goto(`/cms/editor/${id}`);
	}

	onMount(loadProjects);
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

	<div class="projects-section">
		<div class="section-header">
			<h2>📝 Mijn Projecten</h2>
			<button class="btn-primary" onclick={() => (showNewProjectModal = true)}>
				+ Nieuw Project
			</button>
		</div>

		{#if loading}
			<p class="loading">Projecten laden...</p>
		{:else if error}
			<p class="error">{error}</p>
		{:else if projects.length === 0}
			<div class="empty-state">
				<p>Nog geen projecten.</p>
				<button class="btn-primary" onclick={() => (showNewProjectModal = true)}>
					Maak je eerste project
				</button>
			</div>
		{:else}
			<div class="projects-grid">
				{#each projects as project}
					<div class="project-card">
						<h3>{project.name}</h3>
						<p class="project-id">ID: {project.id.substring(0, 8)}...</p>
						<button class="btn-secondary" onclick={() => openProject(project.id)}> Openen </button>
					</div>
				{/each}
			</div>
		{/if}
	</div>

	<div class="cards">
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
</div>

{#if showNewProjectModal}
	<div class="modal-overlay" onclick={() => (showNewProjectModal = false)}>
		<div class="modal" onclick={(e) => e.stopPropagation()}>
			<h2>Nieuw Project</h2>
			<input
				type="text"
				placeholder="Projectnaam..."
				bind:value={newProjectName}
				onkeydown={(e) => e.key === 'Enter' && createProject()}
			/>
			<div class="modal-buttons">
				<button class="btn-secondary" onclick={() => (showNewProjectModal = false)}>
					Annuleren
				</button>
				<button class="btn-primary" onclick={createProject}> Aanmaken </button>
			</div>
		</div>
	</div>
{/if}

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

	.projects-section {
		background: white;
		padding: 30px;
		border-radius: 12px;
		margin-bottom: 30px;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
	}

	.section-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 20px;
	}

	.section-header h2 {
		margin: 0;
		font-size: 24px;
		color: #333;
	}

	.projects-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
		gap: 1.5rem;
	}

	.project-card {
		background: #f8f9fa;
		border: 1px solid #dee2e6;
		border-radius: 8px;
		padding: 1.5rem;
		transition: box-shadow 0.2s;
	}

	.project-card:hover {
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
	}

	.project-card h3 {
		margin: 0 0 0.5rem 0;
	}

	.project-id {
		color: #6c757d;
		font-size: 0.875rem;
		margin-bottom: 1rem;
	}

	.empty-state {
		text-align: center;
		padding: 3rem 2rem;
		color: #6c757d;
	}

	.loading,
	.error {
		text-align: center;
		padding: 2rem;
	}

	.error {
		color: #dc3545;
	}

	.cards {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		gap: 20px;
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

	.modal-overlay {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.5);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 1000;
	}

	.modal {
		background: white;
		padding: 2rem;
		border-radius: 8px;
		width: 90%;
		max-width: 400px;
	}

	.modal h2 {
		margin-top: 0;
	}

	.modal input {
		width: 100%;
		padding: 0.75rem;
		border: 1px solid #dee2e6;
		border-radius: 4px;
		margin-bottom: 1rem;
		box-sizing: border-box;
	}

	.modal-buttons {
		display: flex;
		gap: 1rem;
		justify-content: flex-end;
	}

	.btn-primary,
	.btn-secondary {
		padding: 0.75rem 1.5rem;
		border: none;
		border-radius: 4px;
		cursor: pointer;
		font-weight: 600;
	}

	.btn-primary {
		background: #d10a10;
		color: white;
	}

	.btn-primary:hover {
		background: #b00909;
	}

	.btn-secondary {
		background: #6c757d;
		color: white;
	}

	.btn-secondary:hover {
		background: #5a6268;
	}
</style>
