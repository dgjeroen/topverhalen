<!-- src/lib/components/TextFrame.svelte -->
<script lang="ts">
	import type { TextFrameContent } from '$lib/types';
	import { marked } from 'marked';

	let { width, heading, text, image }: TextFrameContent = $props();

	const parsedText = $derived(marked.parse(text, { breaks: true }));
	const parsedHeading = $derived(heading ? marked.parseInline(heading) : '');

	const imagePosition = $derived(image?.layout.startsWith('top') ? 'top' : 'inline');

	const imageAlignment = $derived(image?.layout.includes('left') ? 'left' : 'right');

	const photoFirst = $derived(image?.layout === 'top-rect');

	// Toon caption/source NIET bij inline + rounded
	const showCaption = $derived(image && (imagePosition === 'top' || !image.rounded));
</script>

<div class="text-frame" class:wide={width === 'wide'}>
	<div class="frame-content">
		{#if imagePosition === 'top'}
			{#if image && photoFirst}
				<figure class="frame-image-top">
					<img src={image.url} alt={image.alt} class:rounded={image.rounded} loading="lazy" />
					{#if showCaption && (image.caption || image.source)}
						<figcaption>
							<span class="caption">{image.caption}</span>
							{#if image.source}<span class="source">{image.source}</span>{/if}
						</figcaption>
					{/if}
				</figure>
			{/if}

			{#if heading}
				<h3 class="frame-heading">{@html parsedHeading}</h3>
			{/if}

			<div class="frame-text">
				{@html parsedText}
			</div>

			{#if image && !photoFirst}
				<figure class="frame-image-top">
					<img src={image.url} alt={image.alt} class:rounded={image.rounded} loading="lazy" />
					{#if showCaption && (image.caption || image.source)}
						<figcaption>
							<span class="caption">{image.caption}</span>
							{#if image.source}<span class="source">{image.source}</span>{/if}
						</figcaption>
					{/if}
				</figure>
			{/if}
		{/if}

		{#if imagePosition === 'inline'}
			<div class="frame-text-inline">
				{#if heading}
					<h3 class="frame-heading">{@html parsedHeading}</h3>
				{/if}

				{#if image}
					<figure
						class="inline-image"
						class:float-left={imageAlignment === 'left'}
						class:float-right={imageAlignment === 'right'}
						class:rounded={image.rounded}
					>
						<img src={image.url} alt={image.alt} class:rounded={image.rounded} loading="lazy" />
						{#if showCaption && (image.caption || image.source)}
							<figcaption>
								<span class="caption">{image.caption}</span>
								{#if image.source}<span class="source">{image.source}</span>{/if}
							</figcaption>
						{/if}
					</figure>
				{/if}

				<div class="text-content">
					{@html parsedText}
				</div>
			</div>
		{/if}
	</div>
</div>

<style>
	.text-frame {
		margin: var(--space-xl, 3rem) auto;
		max-width: var(--text-max-width, 700px);
		padding: 0 var(--space-m, 1.5rem);
	}

	.text-frame.wide {
		max-width: var(--wide-max-width, 1200px);
	}

	.frame-content {
		background: var(--color-bg-secondary, #f9fafb);
		border: 1px solid var(--color-border, #e5e7eb);
		border-radius: 8px;
		padding: var(--space-l, 2rem);
		display: flex;
		flex-direction: column;
		gap: var(--space-m, 1.5rem);
	}

	.frame-heading {
		margin: 0;
		font-size: var(--font-size-xl, 1.875rem);
		font-weight: 700;
		line-height: 1.2;
		color: var(--color-text, #111827);
	}

	.frame-text,
	.text-content {
		line-height: 1.7;
		color: var(--color-text, #374151);
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

	.frame-text :global(u),
	.text-content :global(u) {
		text-decoration: underline;
	}

	.frame-text :global(a),
	.text-content :global(a) {
		color: var(--color-primary, #d10a10);
		text-decoration: underline;
		transition: color 0.15s ease;
	}

	.frame-text :global(a:hover),
	.text-content :global(a:hover) {
		color: var(--color-primary-dark, #a00808);
	}

	/* ========================================
	   FIGURE & FIGCAPTION (zoals ImageStandard)
	   ======================================== */

	figure {
		margin: 0;
	}

	figcaption {
		padding-top: var(--space-s, 0.75rem);
		font-size: var(--font-size-s, 0.875rem);
		color: var(--color-text-muted, #6b7280);
		display: flex;
		justify-content: space-between; /* Caption links, source rechts */
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
		margin: 0;
	}

	.frame-image-top img {
		width: 100%;
		height: auto;
		display: block;
		border-radius: 6px;
	}

	.frame-image-top img.rounded {
		border-radius: 50%;
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
		border-radius: 6px;
	}

	.inline-image img.rounded {
		border-radius: 50%;
		aspect-ratio: 1;
		object-fit: cover;
	}

	/* Caption binnen inline image */
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

	/* Shape-outside alleen op ronde images */
	.inline-image.rounded.float-left,
	.inline-image.rounded.float-right {
		shape-outside: circle(50%);
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

		.frame-text-inline .frame-heading {
			order: 0;
		}

		.text-content {
			order: 1;
		}
	}

	@media (max-width: 480px) {
		.text-frame {
			padding: 0 var(--space-s, 1rem);
		}

		.frame-content {
			padding: var(--space-s, 1rem);
		}

		.frame-image-top img.rounded {
			max-width: 250px;
		}
	}
</style>
