<!-- src/lib/components/TextBlock.svelte -->
<script lang="ts">
	import type { TextBlockContent } from '$lib/types';
	import { marked } from 'marked';

	let { text, isLead = false }: TextBlockContent = $props();

	// ✅ FIX: Gebruik walkTokens voor preprocessing
	marked.use({
		walkTokens(token) {
			// Converteer __text__ naar <u>text</u>
			if (token.type === 'text' && typeof token.text === 'string') {
				token.text = token.text.replace(/__([^_]+)__/g, '<u>$1</u>');
			}
		}
	});

	const htmlContent = $derived(marked.parse(text[0] || '', { breaks: true }));
</script>

<div class="textblock" class:is-lead={isLead}>
	{@html htmlContent}
</div>

<style>
	.textblock {
		font-size: var(--text-font-size, var(--font-size-base, 1rem));
		line-height: var(--text-line-height, var(--line-height-base, 1.6));
		color: var(--text-color, var(--color-text));
		font-weight: var(--text-font-weight, 400);
	}

	.textblock.is-lead {
		font-size: var(--text-lead-font-size, var(--font-size-l, 1.2rem));
		font-weight: var(--text-lead-font-weight, 500);
		color: var(--text-lead-color, var(--color-text));
		line-height: var(--text-lead-line-height, 1.5);
	}

	.textblock :global(p) {
		margin: 0 0 1em 0;
	}

	.textblock :global(p:last-child) {
		margin-bottom: 0;
	}

	.textblock :global(strong) {
		font-weight: var(--text-bold-weight, 700);
		color: var(--text-bold-color, inherit);
	}

	.textblock :global(em) {
		font-style: italic;
		color: var(--text-italic-color, inherit);
	}

	.textblock :global(u) {
		text-decoration: var(--text-underline-style, underline);
		text-decoration-color: var(--text-underline-color, currentColor);
		text-decoration-thickness: var(--text-underline-thickness, 1px);
		text-underline-offset: var(--text-underline-offset, 2px);
	}

	.textblock :global(a) {
		color: var(--text-link-color, var(--color-accent, #ef4444));
		text-decoration: var(--text-link-decoration, underline);
		text-decoration-thickness: var(--text-link-thickness, 1px);
		text-underline-offset: var(--text-link-offset, 2px);
		transition: color 0.15s ease;
	}

	.textblock :global(a:hover) {
		color: var(--text-link-hover-color, var(--color-accent, #ef4444));
		text-decoration: var(--text-link-hover-decoration, none);
	}

	.textblock :global(ul),
	.textblock :global(ol) {
		margin: 0.5em 0;
		padding-left: 1.5em;
	}

	.textblock :global(li) {
		margin: 0.25em 0;
	}

	.textblock :global(blockquote) {
		margin: 1em 0;
		padding-left: 1em;
		border-left: 3px solid var(--color-border, #d1d5db);
		color: var(--color-text-muted);
		font-style: italic;
	}

	.textblock :global(code) {
		background: var(--color-background-light, #f3f4f6);
		padding: 0.125em 0.25em;
		border-radius: 3px;
		font-family: 'SF Mono', Monaco, monospace;
		font-size: 0.9em;
	}
</style>
