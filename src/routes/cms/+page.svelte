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
	let newProjectName = $state('');
	let searchQuery = $state('');
	let dialogEl: HTMLDialogElement;

	// ✅ Filtered projects (real-time search)
	let filteredProjects = $derived.by(() => {
		const query = searchQuery.trim().toLowerCase();

		// Toon alle projecten als query < 3 karakters
		if (query.length < 3) {
			return projects;
		}

		// Filter op projectnaam (case-insensitive)
		return projects.filter((project) => project.name.toLowerCase().includes(query));
	});

	// ✅ Show search hint
	let showSearchHint = $derived(searchQuery.trim().length > 0 && searchQuery.trim().length < 3);

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

	function openProject(id: string) {
		goto(`/cms/editor/${id}`);
	}

	function showModal() {
		dialogEl?.showModal();
	}

	function closeModal() {
		dialogEl?.close();
		newProjectName = '';
	}

	onMount(loadProjects);
</script>

<svelte:head>
	<title>Dashboard - Topverhalen CMS</title>
</svelte:head>

<div class="dashboard">
	<div class="welcome">
		{#if data.user}
			<h1>Welkom, {data.user.name}! 👋</h1>
			<p>Je bent succesvol ingelogd in het Topverhalen CMS.</p>
			<p class="email">{data.user.email}</p>
		{:else}
			<p>Laden...</p>
		{/if}
	</div>

	<div class="projects-section">
		<div class="section-header">
			<h2>📝 Mijn Projecten</h2>
			<button class="btn-primary" onclick={showModal}> + Nieuw Project </button>
		</div>

		<!-- ✅ SEARCH BAR -->
		<div class="search-container">
			<svg
				class="search-icon"
				width="20"
				height="20"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
			>
				<circle cx="11" cy="11" r="8"></circle>
				<path d="m21 21-4.35-4.35"></path>
			</svg>
			<input
				type="search"
				class="search-input"
				placeholder="Zoek project..."
				bind:value={searchQuery}
			/>
			{#if searchQuery}
				<button class="clear-btn" onclick={() => (searchQuery = '')} aria-label="Wis zoekopdracht">
					<svg
						width="16"
						height="16"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
					>
						<line x1="18" y1="6" x2="6" y2="18"></line>
						<line x1="6" y1="6" x2="18" y2="18"></line>
					</svg>
				</button>
			{/if}
		</div>

		<!-- ✅ SEARCH HINT -->
		{#if showSearchHint}
			<p class="search-hint">
				Type nog {3 - searchQuery.trim().length} karakter{3 - searchQuery.trim().length === 1
					? ''
					: 's'} om te zoeken...
			</p>
		{/if}

		<!-- ✅ RESULTS -->
		{#if loading}
			<p class="loading">Projecten laden...</p>
		{:else if error}
			<p class="error">{error}</p>
		{:else if projects.length === 0}
			<div class="empty-state">
				<p>Nog geen projecten.</p>
				<button class="btn-primary" onclick={showModal}> Maak je eerste project </button>
			</div>
		{:else if filteredProjects.length === 0}
			<div class="empty-state">
				<p>Geen projecten gevonden voor "{searchQuery}"</p>
				<button class="btn-secondary" onclick={() => (searchQuery = '')}> Wis zoekopdracht </button>
			</div>
		{:else}
			<div class="projects-grid">
				{#each filteredProjects as project (project.id)}
					<div class="project-card">
						<h3>{project.name}</h3>
						<p class="project-id">ID: {project.id.substring(0, 8)}...</p>
						<button class="btn-secondary" onclick={() => openProject(project.id)}> Openen </button>
					</div>
				{/each}
			</div>
		{/if}
	</div>

	<!-- ✅ THEMA'S EN DEPLOYMENTS VERWIJDERD -->
</div>

<!-- ✅ Native <dialog> element -->
<dialog bind:this={dialogEl} class="modal">
	<h2>Nieuw Project</h2>
	<input
		type="text"
		placeholder="Projectnaam..."
		bind:value={newProjectName}
		onkeydown={(e) => e.key === 'Enter' && createProject()}
	/>
	<div class="modal-buttons">
		<button class="btn-secondary" onclick={closeModal}> Annuleren </button>
		<button class="btn-primary" onclick={createProject}> Aanmaken </button>
	</div>
</dialog>

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

	/* ✅ SEARCH BAR STYLING */
	.search-container {
		position: relative;
		margin-bottom: 24px;
	}

	.search-input {
		width: 100%;
		padding: 12px 48px 12px 44px;
		border: 2px solid #e0e0e0;
		border-radius: 8px;
		font-size: 16px;
		transition: all 0.2s;
		box-sizing: border-box;
	}

	/* ✅ HIDE NATIVE CLEAR BUTTONS */
	.search-input::-webkit-search-cancel-button {
		-webkit-appearance: none;
		appearance: none;
	}

	.search-input::-webkit-search-decoration {
		-webkit-appearance: none;
	}

	.search-input::-ms-clear {
		display: none;
	}

	.search-input:focus {
		outline: none;
		border-color: #d10a10;
		box-shadow: 0 0 0 3px rgba(209, 10, 16, 0.1);
	}

	.search-icon {
		position: absolute;
		left: 14px;
		top: 50%;
		transform: translateY(-50%);
		color: #999;
		pointer-events: none;
	}

	.clear-btn {
		position: absolute;
		right: 12px;
		top: 50%;
		transform: translateY(-50%);
		background: none;
		border: none;
		color: #999;
		cursor: pointer;
		padding: 4px;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 4px;
		transition: all 0.2s;
	}

	.clear-btn:hover {
		background: #f0f0f0;
		color: #333;
	}

	.search-hint {
		color: #999;
		font-size: 14px;
		margin: -16px 0 16px 0;
		font-style: italic;
	}

	/* ✅ PROJECTS GRID */
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
		transition: all 0.2s;
	}

	.project-card:hover {
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
		transform: translateY(-2px);
	}

	.project-card h3 {
		margin: 0 0 0.5rem 0;
		font-size: 18px;
		color: #333;
	}

	.project-id {
		color: #6c757d;
		font-size: 0.875rem;
		margin-bottom: 1rem;
		font-family: monospace;
	}

	.empty-state {
		text-align: center;
		padding: 3rem 2rem;
		color: #6c757d;
	}

	.empty-state p {
		margin-bottom: 1rem;
		font-size: 16px;
	}

	.loading,
	.error {
		text-align: center;
		padding: 2rem;
	}

	.error {
		color: #dc3545;
	}

	/* ✅ BUTTONS */
	.btn-primary,
	.btn-secondary {
		padding: 0.75rem 1.5rem;
		border: none;
		border-radius: 6px;
		cursor: pointer;
		font-weight: 600;
		font-size: 14px;
		transition: all 0.2s;
	}

	.btn-primary {
		background: #d10a10;
		color: white;
	}

	.btn-primary:hover {
		background: #b00909;
		transform: translateY(-1px);
		box-shadow: 0 2px 8px rgba(209, 10, 16, 0.3);
	}

	.btn-secondary {
		background: #6c757d;
		color: white;
	}

	.btn-secondary:hover {
		background: #5a6268;
	}

	/* ✅ MODAL */
	dialog.modal {
		border: none;
		border-radius: 12px;
		padding: 2rem;
		width: 90%;
		max-width: 400px;
		box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
	}

	dialog.modal::backdrop {
		background: rgba(0, 0, 0, 0.5);
		backdrop-filter: blur(4px);
	}

	.modal h2 {
		margin: 0 0 1rem 0;
		font-size: 24px;
		color: #333;
	}

	.modal input {
		width: 100%;
		padding: 0.75rem;
		border: 2px solid #e0e0e0;
		border-radius: 6px;
		margin-bottom: 1rem;
		box-sizing: border-box;
		font-size: 16px;
	}

	.modal input:focus {
		outline: none;
		border-color: #d10a10;
	}

	.modal-buttons {
		display: flex;
		gap: 1rem;
		justify-content: flex-end;
	}
</style>
