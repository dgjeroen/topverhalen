<script lang="ts">
	import type { PageData } from './$types';

	let { data } = $props<{ data: PageData }>();
</script>

<svelte:head>
	<title>Editor - {data.project.storyName}</title>
</svelte:head>

<div class="editor">
	<header>
		<h1>Editor: {data.project.storyName}</h1>
		<p>Gist ID: {data.project.gistId}</p>
	</header>

	<div class="placeholder">
		<h2>🎨 Editor komt hier</h2>
		<p>Volgende stap: Migreer je HTML editor naar deze pagina</p>
		<pre>{JSON.stringify(data.project, null, 2)}</pre>
	</div>
</div>

<style>
	.editor {
		max-width: 1400px;
		margin: 0 auto;
		padding: 20px;
	}

	header {
		background: white;
		padding: 20px;
		border-radius: 8px;
		margin-bottom: 20px;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
	}

	header h1 {
		margin: 0 0 10px;
	}

	header p {
		margin: 0;
		color: #666;
		font-family: monospace;
	}

	.placeholder {
		background: white;
		padding: 40px;
		border-radius: 8px;
		text-align: center;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
	}

	.placeholder h2 {
		margin-top: 0;
	}

	pre {
		text-align: left;
		background: #f5f5f5;
		padding: 20px;
		border-radius: 4px;
		overflow: auto;
		max-height: 400px;
	}
</style>
