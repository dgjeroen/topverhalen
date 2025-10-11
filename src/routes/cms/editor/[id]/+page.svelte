<script lang="ts">
	import type { PageData } from './$types';

	let { data } = $props<{ data: PageData }>();
</script>

<svelte:head>
	<title>Editor - {data.project.storyName}</title>
</svelte:head>

<div class="editor">
	<header class="editor-header">
		<div class="header-left">
			<a href="/cms" class="back-link">← Terug naar dashboard</a>
			<h1>{data.project.storyName}</h1>
		</div>
		<div class="header-right">
			<span class="gist-id">ID: {data.gistId}</span>
			<button class="btn-save" disabled>Opslaan</button>
			<button class="btn-publish" disabled>Publiceren</button>
		</div>
	</header>

	<div class="editor-content">
		<div class="placeholder">
			<h2>🎨 Editor Interface</h2>
			<p>Hier komt je drag & drop editor</p>
			<p class="version">Versie: {data.project.version}</p>

			<details>
				<summary>Project Data (debug)</summary>
				<pre>{JSON.stringify(data.project, null, 2)}</pre>
			</details>
		</div>
	</div>
</div>

<style>
	.editor {
		min-height: 100vh;
		background: #f4f4f9;
	}

	.editor-header {
		background: #d10a10;
		color: white;
		padding: 1rem 2rem;
		display: flex;
		justify-content: space-between;
		align-items: center;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
	}

	.header-left {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.back-link {
		color: rgba(255, 255, 255, 0.8);
		text-decoration: none;
		font-size: 0.875rem;
		transition: color 0.2s;
	}

	.back-link:hover {
		color: white;
	}

	.editor-header h1 {
		margin: 0;
		font-size: 1.5rem;
	}

	.header-right {
		display: flex;
		gap: 1rem;
		align-items: center;
	}

	.gist-id {
		font-family: monospace;
		font-size: 0.875rem;
		opacity: 0.8;
	}

	.btn-save,
	.btn-publish {
		padding: 0.5rem 1rem;
		border: none;
		border-radius: 4px;
		cursor: pointer;
		font-weight: 600;
		transition: opacity 0.2s;
	}

	.btn-save {
		background: white;
		color: #333;
	}

	.btn-publish {
		background: #28a745;
		color: white;
	}

	.btn-save:disabled,
	.btn-publish:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.editor-content {
		max-width: 1400px;
		margin: 2rem auto;
		padding: 0 2rem;
	}

	.placeholder {
		background: white;
		padding: 3rem;
		border-radius: 8px;
		text-align: center;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
	}

	.placeholder h2 {
		margin-top: 0;
		color: #333;
	}

	.placeholder p {
		color: #666;
		margin: 1rem 0;
	}

	.version {
		font-family: monospace;
		font-size: 0.875rem;
		color: #999;
	}

	details {
		margin-top: 2rem;
		text-align: left;
	}

	summary {
		cursor: pointer;
		color: #667eea;
		font-weight: 600;
		padding: 0.5rem;
	}

	pre {
		background: #f5f5f5;
		padding: 1rem;
		border-radius: 4px;
		overflow: auto;
		max-height: 400px;
		font-size: 0.875rem;
	}
</style>
