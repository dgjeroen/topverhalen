<!-- src/lib/components/TextBlock.svelte -->
<script lang="ts">
	import type { TextBlockContent } from '$lib/types';
	import { marked } from 'marked';

	let { text, isLead = false }: TextBlockContent = $props();

	// ✅ Configure Marked with ALL features
	marked.use({
		gfm: true, // ✅ GitHub Flavored Markdown
		breaks: true, // ✅ Line breaks
		async: false // ✅ Force synchronous parsing
	});

	// ✅ PREPROCESSING: Convert custom syntax BEFORE marked parses
	function preprocessMarkdown(md: string): string {
		return (
			md
				// __text__ → underline (must be before marked parses it as bold)
				.replace(/__([^_]+)__/g, '{{U}}$1{{/U}}')
				// ~~text~~ is already handled by GFM, but we ensure it works
				.replace(/~~([^~]+)~~/g, '{{DEL}}$1{{/DEL}}')
		);
	}

	// ✅ POSTPROCESSING: Convert custom tokens to HTML tags
	function postprocessHtml(html: string): string {
		return html
			.replace(/\{\{U\}\}/g, '<u>')
			.replace(/\{\{\/U\}\}/g, '</u>')
			.replace(/\{\{DEL\}\}/g, '<del>')
			.replace(/\{\{\/DEL\}\}/g, '</del>');
	}

	// ✅ Parse with pre/postprocessing
	const htmlContent = $derived(() => {
		const preprocessed = preprocessMarkdown(text[0] || '');
		const parsed = marked.parse(preprocessed, { breaks: true }) as string;
		return postprocessHtml(parsed);
	});
</script>

<div class="textblock" class:is-lead={isLead}>
	{@html htmlContent()}
</div>

<style>
	/* Basis styling voor het blok */
	.textblock {
		font-size: var(--text-font-size, var(--font-size-base, 1rem));
		line-height: var(--text-line-height, var(--line-height-base, 1.6));
		color: var(--text-color, var(--color-text));
		font-weight: var(--text-font-weight, 400);
	}

	/* ✅ DE FIX VOOR DE LEAD 
       We passen de stijlen toe op de container...
    */
	.textblock.is-lead {
		font-size: var(--text-lead-font-size, var(--font-size-l, 1.2rem));
		font-weight: var(--text-lead-font-weight, 500);
		line-height: var(--text-lead-line-height, 1.5);
		color: var(--text-lead-color, var(--color-text));
	}

	/* ...MAAR we forceren ze ook op de paragraaf (<p>).
       Dit overschrijft globale resets die zeggen "p is altijd 1rem".
    */
	.textblock.is-lead :global(p) {
		font-size: var(--text-lead-font-size, var(--font-size-l, 1.2rem)) !important;
		font-weight: var(--text-lead-font-weight, 500) !important;
		line-height: var(--text-lead-line-height, 1.5) !important;
		color: var(--text-lead-color, var(--color-text)) !important;
		margin-bottom: 0.5em; /* Leads hebben vaak minder witruimte nodig */
	}

	/* Zorg dat strong/em/span in een lead ook de kleur en grootte erven */
	.textblock.is-lead :global(span),
	.textblock.is-lead :global(strong),
	.textblock.is-lead :global(em),
	.textblock.is-lead :global(a) {
		font-size: inherit !important;
		color: inherit !important;
		/* Let op: font-weight doen we niet inherit bij strong, anders is het niet meer dikgedrukt */
	}

	/* Standaard paragraaf spacing */
	.textblock :global(p) {
		margin: 0 0 1em 0;
	}

	.textblock :global(p:last-child) {
		margin-bottom: 0;
	}

	/* Dikgedrukt (Bold) */
	.textblock :global(strong) {
		font-weight: var(--text-bold-weight, 700);
		color: var(--text-bold-color, inherit);
	}

	/* Cursief (Italic) */
	.textblock :global(em) {
		font-style: italic;
		color: var(--text-italic-color, inherit);
	}

	/* ✅ UNDERLINE STYLING */
	.textblock :global(u) {
		text-decoration: var(--text-underline-style, underline);
		text-decoration-color: var(--text-underline-color, currentColor);
		text-decoration-thickness: var(--text-underline-thickness, 1px);
		text-underline-offset: var(--text-underline-offset, 2px);
	}

	/* ✅ STRIKETHROUGH STYLING */
	.textblock :global(del) {
		text-decoration: line-through;
		text-decoration-color: var(--text-strikethrough-color, currentColor);
		text-decoration-thickness: var(--text-strikethrough-thickness, 1px);
		opacity: 0.7;
	}

	/* Links */
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

	/* ✅ LISTS */
	.textblock :global(ul),
	.textblock :global(ol) {
		margin: 0.5em 0;
		padding-left: 1.5em;
	}

	.textblock :global(li) {
		margin: 0.25em 0;
	}

	/* ✅ BLOCKQUOTES */
	.textblock :global(blockquote) {
		margin: 1em 0;
		padding-left: 1em;
		border-left: 3px solid var(--color-border, #d1d5db);
		color: var(--color-text-muted);
		font-style: italic;
	}

	/* ✅ CODE */
	.textblock :global(code) {
		background: var(--color-background-light, #f3f4f6);
		padding: 0.125em 0.25em;
		border-radius: 3px;
		font-family: 'SF Mono', Monaco, monospace;
		font-size: 0.9em;
	}
</style>
