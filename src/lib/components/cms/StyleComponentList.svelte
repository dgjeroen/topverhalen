<!--src\lib\components\cms\StyleComponentList.svelte-->
<script lang="ts">
	import BlockIcons from '$lib/assets/icons/BlockIcons.svelte';

	let { selected = $bindable('general') } = $props<{
		selected: string;
	}>();

	const components = [
		{ id: 'general', label: 'Algemeen', icon: 'icon-style-general' },
		{ id: 'heading', label: 'Kop (H2)', icon: 'icon-block-h2' },
		{ id: 'subheading', label: 'Tussenkop (H4)', icon: 'icon-block-h4' },
		{ id: 'text', label: 'Tekst', icon: 'icon-block-text' },
		{ id: 'textframe', label: 'Tekstkader', icon: 'icon-block-text' },
		{ id: 'quote', label: 'Citaat', icon: 'icon-block-quote' },
		{ id: 'image', label: 'Afbeelding', icon: 'icon-block-image' },
		{ id: 'slider', label: 'Slider', icon: 'icon-block-slider' },
		{ id: 'audio', label: 'Audio', icon: 'icon-block-audio' },
		{ id: 'subheadingMedium', label: 'Extra tussenkop (H3)', icon: 'icon-block-h3' },
		{ id: 'subheadingSoccer', label: 'Tussenkop voetbal', icon: 'icon-block-soccer' },
		{ id: 'colofon', label: 'Colofon', icon: 'icon-block-colofon' }
	];
</script>

<BlockIcons />

<div class="component-list">
	{#each components as comp}
		<button
			class="component-item"
			class:active={selected === comp.id}
			onclick={() => (selected = comp.id)}
		>
			<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
				<use href="#{comp.icon}" />
			</svg>
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
		width: 20px;
		height: 20px;
		flex-shrink: 0;
		color: currentColor;
	}

	.label {
		flex: 1;
	}
</style>
