<script lang="ts">
	export let type: string;

	// Vertel Svelte om te negeren dat 'content' niet wordt gebruikt in dit component
	// svelte-ignore export_let_unused
	// Maak de prop optioneel door een standaardwaarde te geven
	export let content: any = undefined;
</script>

<div class="unsupported-block">
	Component van het type '<strong>{type}</strong>' is nog niet gemaakt.
</div>

<style>
	.unsupported-block {
		padding: 1rem;
		background-color: #fee2e2;
		border: 1px solid #fca5a5;
		color: #991b1b;
		border-radius: 8px;
		width: 100%;
		margin-block: var(--block-vertical-margin);
		max-width: var(--content-max-width);
		margin-left: auto;
		margin-right: auto;
		box-sizing: border-box;
	}
</style>
