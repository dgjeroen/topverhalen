<!-- src/lib/components/cms/StyleComponentList.svelte -->
<script lang="ts">
	let { selected = $bindable('general') } = $props<{
		selected: string;
	}>();

	const components = [
		{ id: 'general', label: 'Algemeen', icon: '⚙️' },
		{ id: 'heading', label: 'Kop (H2)', icon: 'H2' },
		{ id: 'subheading', label: 'Tussenkop (H4)', icon: 'H4' },
		{ id: 'text', label: 'Tekst', icon: '¶' },
		{ id: 'quote', label: 'Citaat', icon: '💬' },
		{ id: 'image', label: 'Afbeelding', icon: '🖼️' },
		{ id: 'slider', label: 'Slider', icon: '🎞️' },
		{ id: 'subheadingSoccer', label: 'Tussenkop voetbal', icon: '⚽' }
	];
</script>

<div class="component-list">
	<h3>Componenten</h3>
	{#each components as comp}
		<button
			class="component-item"
			class:active={selected === comp.id}
			onclick={() => (selected = comp.id)}
		>
			<span class="icon">{comp.icon}</span>
			<span class="label">{comp.label}</span>
		</button>
	{/each}
</div>

<style>
	.component-list {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	h3 {
		margin: 0 0 1rem 0;
		color: #111827;
		font-size: 0.875rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.component-item {
		display: flex;
		align-items: center;
		gap: 12px;
		background: #f9fafb;
		border: 1px solid #e5e7eb;
		border-radius: 6px;
		padding: 10px 12px;
		cursor: pointer;
		font-weight: 500;
		font-size: 0.875rem;
		transition: all 0.15s;
		color: #374151;
		width: 100%;
		text-align: left;
	}

	.component-item:hover {
		background: #f3f4f6;
		border-color: #d1d5db;
		transform: translateX(2px);
	}

	.component-item.active {
		background: #fef2f2;
		border-color: #d10a10;
		color: #d10a10;
		font-weight: 600;
	}

	.icon {
		width: 18px;
		height: 18px;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
		font-size: 14px;
	}

	.label {
		flex: 1;
	}
</style>
