<!-- src/routes/cms/IconButton.svelte -->
<script lang="ts">
	/**
	 * Icon-based toggle button voor CMS controls
	 * Gebruikt SVG symbols uit TextFrameIcons.svelte
	 *
	 * @component IconButton
	 * @example
	 * <IconButton
	 *   icon="icon-width-narrow"
	 *   label="Smalle layout"
	 *   active={width === 'narrow'}
	 *   onclick={() => setWidth('narrow')}
	 * />
	 */

	interface Props {
		/** SVG symbol ID (zonder #) */
		icon: string;
		/** Accessible label (screenreaders + tooltip) */
		label: string;
		/** Active/selected state */
		active?: boolean;
		/** Click handler */
		onclick?: () => void;
		/** Disabled state */
		disabled?: boolean;
	}

	let { icon, label, active = false, onclick, disabled = false }: Props = $props();
</script>

<button
	type="button"
	class="icon-button"
	class:active
	{onclick}
	{disabled}
	aria-label={label}
	aria-pressed={active}
	title={label}
>
	<svg class="icon" aria-hidden="true">
		<use href="#{icon}" />
	</svg>
</button>

<style>
	.icon-button {
		/* Reset */
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0;
		margin: 0;
		border: none;
		background: none;
		font: inherit;
		cursor: pointer;

		/* Sizing */
		width: 52px;
		height: 52px;
		flex-shrink: 0;

		/* Styling */
		background: white;
		border: 2px solid var(--color-border, #e5e7eb);
		border-radius: 6px;

		/* Transitions */
		transition: all 0.15s ease;

		/* Focus outline reset */
		outline: none;
	}

	.icon-button:hover:not(:disabled) {
		background: var(--color-bg-secondary, #f9fafb);
		border-color: var(--color-border-hover, #d1d5db);
		transform: translateY(-1px);
	}

	.icon-button:active:not(:disabled) {
		transform: translateY(0);
	}

	.icon-button:focus-visible {
		border-color: var(--color-primary, #d10a10);
		box-shadow: 0 0 0 3px rgba(209, 10, 16, 0.1);
	}

	.icon-button.active {
		background: rgba(209, 10, 16, 0.06);
		border-color: var(--color-primary, #d10a10);
	}

	.icon-button:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	/* Icon Styling */
	.icon {
		width: 42px;
		height: 42px;
		color: var(--color-text-secondary, #6b7280);
		transition: color 0.15s ease;
		pointer-events: none;
	}

	.icon-button:hover:not(:disabled) .icon {
		color: var(--color-text, #374151);
	}

	.icon-button.active .icon {
		color: var(--color-primary, #d10a10);
		transform: scale(1.08);
		filter: drop-shadow(0 2px 6px rgba(209, 10, 16, 0.12));
	}

	.icon-button:disabled .icon {
		color: var(--color-text-disabled, #9ca3af);
	}
</style>
