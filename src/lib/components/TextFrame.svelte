<!-- src/lib/components/TextFrame.svelte -->
<script lang="ts">
	import type { TextFrameContent } from '$lib/types';
	import { marked } from 'marked';
	import { slide } from 'svelte/transition';

	let {
		width,
		heading,
		text,
		image,
		collapsible = false,
		defaultOpen = false
	}: TextFrameContent = $props();

	let isOpen = $state(collapsible ? defaultOpen : true);

	// ✅ Configure Marked with ALL features
	marked.use({
		gfm: true, // ✅ GitHub Flavored Markdown (tables, strikethrough, etc.)
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

	const parsedText = $derived(() => {
		const preprocessed = preprocessMarkdown(text);
		const parsed = marked.parse(preprocessed, { breaks: true }) as string;
		return postprocessHtml(parsed);
	});

	const parsedHeading = $derived(() => {
		if (!heading) return '';
		const preprocessed = preprocessMarkdown(heading);
		const parsed = marked.parseInline(preprocessed) as string;
		return postprocessHtml(parsed);
	});

	const visibleImage = $derived(image && !image.hidden ? image : null);
	const imagePosition = $derived(visibleImage?.layout.startsWith('top') ? 'top' : 'inline');
	const imageAlignment = $derived(visibleImage?.layout.includes('left') ? 'left' : 'right');
	const photoFirst = $derived(visibleImage?.layout === 'top-rect');
	const showCaption = $derived(visibleImage && (imagePosition === 'top' || !visibleImage.rounded));
</script>

<div class="frame-content">
	{#if collapsible}
		<button
			class="collapse-toggle"
			class:has-content={isOpen}
			onclick={() => (isOpen = !isOpen)}
			aria-expanded={isOpen}
			aria-label={isOpen ? 'Inklappen' : 'Uitklappen'}
		>
			<span class="toggle-icon" class:open={isOpen}>▶</span>
			<h3 class="frame-heading collapsible-heading">
				{@html parsedHeading()}
			</h3>
		</button>
	{:else if heading}
		<h3 class="frame-heading textframe-heading">{@html parsedHeading()}</h3>
	{/if}

	{#if isOpen}
		<div transition:slide={{ duration: 300 }}>
			{#if imagePosition === 'top'}
				{#if visibleImage && photoFirst}
					<figure class="frame-image-top">
						<img
							src={visibleImage.url}
							alt={visibleImage.alt}
							class:rounded={visibleImage.rounded}
							loading="lazy"
						/>
						{#if showCaption && (visibleImage.caption || visibleImage.source)}
							<figcaption>
								<span class="caption">{visibleImage.caption}</span>
								{#if visibleImage.source}<span class="source">{visibleImage.source}</span>{/if}
							</figcaption>
						{/if}
					</figure>
				{/if}

				<div class="frame-text">
					{@html parsedText()}
				</div>

				{#if visibleImage && !photoFirst}
					<figure class="frame-image-top">
						<img
							src={visibleImage.url}
							alt={visibleImage.alt}
							class:rounded={visibleImage.rounded}
							loading="lazy"
						/>
						{#if showCaption && (visibleImage.caption || visibleImage.source)}
							<figcaption>
								<span class="caption">{visibleImage.caption}</span>
								{#if visibleImage.source}<span class="source">{visibleImage.source}</span>{/if}
							</figcaption>
						{/if}
					</figure>
				{/if}
			{/if}

			{#if imagePosition === 'inline'}
				<div class="frame-text-inline">
					{#if visibleImage}
						<figure
							class="inline-image"
							class:float-left={imageAlignment === 'left'}
							class:float-right={imageAlignment === 'right'}
							class:rounded={visibleImage.rounded}
						>
							<img
								src={visibleImage.url}
								alt={visibleImage.alt}
								class:rounded={visibleImage.rounded}
								loading="lazy"
							/>
							{#if showCaption && (visibleImage.caption || visibleImage.source)}
								<figcaption>
									<span class="caption">{visibleImage.caption}</span>
									{#if visibleImage.source}<span class="source">{visibleImage.source}</span>{/if}
								</figcaption>
							{/if}
						</figure>
					{/if}

					<div class="text-content">
						{@html parsedText()}
					</div>
				</div>
			{/if}
		</div>
	{/if}
</div>

<style>
	/* ========================================
     LAYOUT
     ======================================== */
	.frame-content {
		background: var(--textframe-bg-color, var(--color-bg-secondary, #f9fafb)) !important;
		border: 1px solid var(--textframe-border-color, var(--color-border, #e5e7eb)) !important;
		border-radius: var(--textframe-border-radius, 8px) !important;
		padding: var(--textframe-padding, var(--space-l, 2rem)) !important;
		overflow: hidden;
	}

	/* ========================================
     HEADINGS
     ======================================== */
	.frame-heading {
		margin: 0 0 var(--space-m, 1.5rem) 0;
		font-size: var(--textframe-heading-size, 1.875rem) !important;
		font-weight: var(--textframe-heading-weight, 700) !important;
		line-height: 1.2;
		color: var(--textframe-heading-color, #111827) !important;
		background: none !important;
		padding: 0 !important;
	}

	/* ========================================
     TEXT
     ======================================== */
	.frame-text,
	.text-content {
		line-height: var(--textframe-line-height, 1.7) !important;
		font-size: var(--textframe-text-size, 1rem) !important;
	}

	:global(.frame-text),
	:global(.text-content) {
		color: var(--textframe-text-color, #374151) !important;
	}

	:global(.frame-text p),
	:global(.text-content p) {
		color: var(--textframe-text-color, #374151) !important;
	}

	.frame-text :global(p),
	.text-content :global(p) {
		margin: 0 0 var(--space-m, 1.5rem) 0;
	}

	.frame-text :global(p:last-child),
	.text-content :global(p:last-child) {
		margin-bottom: 0;
	}

	.frame-text :global(strong),
	.text-content :global(strong) {
		font-weight: 700;
		color: var(--color-text-dark, #111827);
	}

	.frame-text :global(em),
	.text-content :global(em) {
		font-style: italic;
	}

	/* ✅ UNDERLINE STYLING */
	.frame-text :global(u),
	.text-content :global(u) {
		text-decoration: var(--text-underline-style, underline);
		text-decoration-color: var(--text-underline-color, currentColor);
		text-decoration-thickness: var(--text-underline-thickness, 1px);
		text-underline-offset: var(--text-underline-offset, 2px);
	}

	/* ✅ STRIKETHROUGH STYLING */
	.frame-text :global(del),
	.text-content :global(del) {
		text-decoration: line-through;
		text-decoration-color: var(--text-strikethrough-color, currentColor);
		text-decoration-thickness: var(--text-strikethrough-thickness, 1px);
		opacity: 0.7;
	}

	.frame-text :global(a),
	.text-content :global(a) {
		color: var(--text-link-color, var(--color-primary, #d10a10));
		text-decoration: var(--text-link-decoration, underline);
		text-decoration-thickness: var(--text-link-thickness, 1px);
		text-underline-offset: var(--text-link-offset, 2px);
		transition: color 0.15s ease;
	}

	.frame-text :global(a:hover),
	.text-content :global(a:hover) {
		color: var(--text-link-hover-color, var(--color-primary-dark, #a00808));
		text-decoration: var(--text-link-hover-decoration, none);
	}

	/* ========================================
     ✅ LISTS (NIEUW)
     ======================================== */
	.frame-text :global(ul),
	.frame-text :global(ol),
	.text-content :global(ul),
	.text-content :global(ol) {
		margin: var(--space-m, 1.5rem) 0;
		padding-left: 1.5em;
		color: var(--textframe-text-color, #374151);
	}

	.frame-text :global(li),
	.text-content :global(li) {
		margin: 0.25em 0;
		color: var(--textframe-text-color, #374151);
	}

	.frame-text :global(ul ul),
	.frame-text :global(ol ol),
	.frame-text :global(ul ol),
	.frame-text :global(ol ul),
	.text-content :global(ul ul),
	.text-content :global(ol ol),
	.text-content :global(ul ol),
	.text-content :global(ol ul) {
		margin: 0.25em 0;
	}

	/* ========================================
     ✅ BLOCKQUOTES (NIEUW)
     ======================================== */
	.frame-text :global(blockquote),
	.text-content :global(blockquote) {
		margin: var(--space-m, 1.5rem) 0;
		padding: var(--space-s, 0.75rem) var(--space-m, 1.5rem);
		border-left: 4px solid var(--textframe-border-color, #e5e7eb);
		background: var(--color-bg-secondary, #f9fafb);
		color: var(--textframe-text-color, #374151);
		font-style: italic;
		border-radius: 0 var(--textframe-border-radius, 8px) var(--textframe-border-radius, 8px) 0;
	}

	.frame-text :global(blockquote p),
	.text-content :global(blockquote p) {
		margin: 0;
	}

	/* ========================================
     ✅ CODE (NIEUW)
     ======================================== */
	.frame-text :global(code),
	.text-content :global(code) {
		background: var(--color-bg-secondary, #f3f4f6);
		color: var(--color-text-dark, #111827);
		padding: 0.125em 0.375em;
		border-radius: 4px;
		font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Courier New', monospace;
		font-size: 0.9em;
		border: 1px solid var(--textframe-border-color, #e5e7eb);
	}

	.frame-text :global(pre),
	.text-content :global(pre) {
		background: var(--color-bg-secondary, #f3f4f6);
		padding: var(--space-m, 1.5rem);
		border-radius: var(--textframe-border-radius, 8px);
		overflow-x: auto;
		margin: var(--space-m, 1.5rem) 0;
		border: 1px solid var(--textframe-border-color, #e5e7eb);
	}

	.frame-text :global(pre code),
	.text-content :global(pre code) {
		background: none;
		padding: 0;
		border: none;
		font-size: 0.875rem;
		line-height: 1.5;
	}

	/* ========================================
     FIGURE & FIGCAPTION
     ======================================== */
	figure {
		margin: 0;
	}

	figcaption {
		padding-top: var(--space-s, 0.75rem);
		font-size: var(--textframe-caption-size, var(--font-size-s, 0.875rem)) !important;
		color: var(--textframe-caption-color, var(--color-text-muted, #6b7280)) !important;
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: 100%;
	}

	.caption {
		text-align: left;
	}

	.source {
		text-align: right;
		font-style: italic;
	}

	/* ========================================
     TOP IMAGES
     ======================================== */
	.frame-image-top {
		margin: 0 0 var(--space-m, 1.5rem) 0;
	}

	.frame-image-top img {
		width: 100%;
		height: auto;
		display: block;
		border-radius: var(--textframe-img-radius, 6px) !important;
	}

	.frame-image-top img.rounded {
		border-radius: 50% !important;
		aspect-ratio: 1;
		object-fit: cover;
		margin: 0 auto;
		max-width: 400px;
	}

	/* ========================================
     INLINE IMAGES
     ======================================== */
	.frame-text-inline {
		display: block;
		overflow: auto;
	}

	.inline-image {
		width: 50%;
		margin: 0.5rem 0 0 0;
		display: block;
	}

	.inline-image img {
		width: 100%;
		height: auto;
		display: block;
		border-radius: var(--textframe-img-radius, 6px) !important;
	}

	.inline-image img.rounded {
		border-radius: 50% !important;
		aspect-ratio: 1;
		object-fit: cover;
	}

	.inline-image figcaption {
		display: flex;
		width: 100%;
	}

	.inline-image.float-left {
		float: left;
		margin-right: var(--space-m, 1.5rem);
		margin-bottom: var(--space-s, 0.75rem);
	}

	.inline-image.float-right {
		float: right;
		margin-left: var(--space-m, 1.5rem);
		margin-bottom: var(--space-s, 0.75rem);
	}

	.inline-image.rounded.float-left,
	.inline-image.rounded.float-right {
		shape-outside: circle(50%);
	}

	/* ========================================
     COLLAPSIBLE STYLES
     ======================================== */
	.collapse-toggle {
		width: 100%;
		background: transparent;
		border: none;
		padding: 0;
		margin: 0;
		cursor: pointer;
		display: flex;
		align-items: center;
		gap: var(--space-s, 0.75rem);
		text-align: left;
		transition:
			background-color 0.2s ease,
			margin-bottom 0.3s ease;
		border-radius: 6px;
	}

	.collapse-toggle.has-content {
		margin-bottom: var(--space-m, 1.5rem);
	}

	.collapse-toggle:hover {
		background: var(--textframe-toggle-hover-bg, rgba(209, 10, 16, 0.05));
	}

	.collapse-toggle:focus-visible {
		outline: 2px solid var(--textframe-toggle-color, #d10a10);
		outline-offset: 2px;
	}

	.toggle-icon {
		font-size: var(--textframe-toggle-size, 1rem);
		color: var(--textframe-toggle-color, var(--color-primary, #d10a10));
		transition: transform 0.3s ease;
		display: inline-block;
		min-width: 1em;
		text-align: center;
		flex-shrink: 0;
	}

	.toggle-icon.open {
		transform: rotate(90deg);
	}

	.collapsible-heading {
		margin: 0 !important;
		flex: 1;
		color: var(--textframe-heading-color, #111827) !important;
	}

	/* ========================================
     RESPONSIVE
     ======================================== */
	@media (max-width: 768px) {
		.frame-content {
			padding: var(--space-m, 1.5rem);
		}

		.frame-heading {
			font-size: var(--font-size-lg, 1.5rem);
		}

		.frame-text-inline {
			display: flex;
			flex-direction: column;
		}

		.inline-image {
			float: none !important;
			shape-outside: none;
			width: 100%;
			max-width: 100%;
			margin: 0 0 var(--space-m, 1.5rem) 0 !important;
			order: -1;
		}

		.text-content {
			order: 1;
		}
	}

	@media (max-width: 480px) {
		.frame-content {
			padding: var(--space-s, 1rem);
		}

		.frame-image-top img.rounded {
			max-width: 250px;
		}
	}
</style>
