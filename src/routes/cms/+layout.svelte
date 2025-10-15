<script lang="ts">
	import { page } from '$app/stores';
	import type { LayoutData } from './$types';

	let { data, children }: { data: LayoutData; children: any } = $props();

	// ✅ Svelte 5 runes syntax
	let isEditorPage = $derived($page.url.pathname.includes('/editor/'));
	$effect(() => {
		if (typeof document !== 'undefined') {
			document.body.style.overflow = isEditorPage ? 'hidden' : 'auto';
		}
	});
</script>

<svelte:head>
	<title>Topverhalen CMS</title>
</svelte:head>

<div class="cms-layout">
	{#if data.user && !isEditorPage}
		<!-- ✅ Toon alleen header op dashboard, NIET op editor -->
		<header class="cms-header">
			<div class="cms-header-content">
				<h1>Topverhalen CMS</h1>
				<div class="user-info">
					<span>{data.user.name}</span>
					<form method="POST" action="/cms/logout">
						<button type="submit">Uitloggen</button>
					</form>
				</div>
			</div>
		</header>
	{/if}

	<main class="cms-main" class:editor-mode={isEditorPage}>
		{@render children()}
	</main>
</div>

<style>
	:global(body) {
		margin: 0;
		font-family:
			-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
	}

	.cms-layout {
		min-height: 100vh;
		background: #f5f5f5;
	}

	.cms-header {
		background: white;
		border-bottom: 1px solid #e0e0e0;
		padding: 0 20px;
	}

	.cms-header-content {
		max-width: 1400px;
		margin: 0 auto;
		display: flex;
		justify-content: space-between;
		align-items: center;
		height: 60px;
	}

	.cms-header h1 {
		margin: 0;
		font-size: 20px;
		color: #333;
	}

	.user-info {
		display: flex;
		align-items: center;
		gap: 15px;
	}

	.user-info span {
		color: #666;
		font-size: 14px;
	}

	.user-info button {
		padding: 8px 16px;
		background: #667eea;
		color: white;
		border: none;
		border-radius: 6px;
		cursor: pointer;
		font-size: 14px;
		transition: background 0.2s;
	}

	.user-info button:hover {
		background: #5568d3;
	}

	.cms-main {
		max-width: 1400px;
		margin: 0 auto;
		padding: 20px;
	}

	/* ✅ Editor modus: geen padding/max-width */
	.cms-main.editor-mode {
		max-width: none;
		padding: 0;
		margin: 0;
		background: #f4f4f9;
	}
</style>
