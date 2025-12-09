<script lang="ts">
	import TextBlock from './TextBlock.svelte';
	import Heading from './Heading.svelte';
	import Image from './Image.svelte';
	import Quote from './Quote.svelte';
	import Audio from './Audio.svelte';
	import Video from './Video.svelte';
	import Colofon from './Colofon.svelte';
	import ImageGrid from './ImageGrid.svelte';
	import ImageSlider from './ImageSlider.svelte';
	import HeroVideo from './HeroVideo.svelte';
	import ImageHero from './ImageHero.svelte';
	import Timeline from './Timeline.svelte';
	import MediaPair from './MediaPair.svelte';
	import TextFrame from './TextFrame.svelte';
	import Embed from './Embed.svelte';
	import SubheadingSoccer from './SubheadingSoccer.svelte';
	import Unsupported from './Unsupported.svelte';
	import type { ContentBlock, Theme } from '$lib/types';

	let {
		block,
		isFirst = false,
		theme = {}
	} = $props<{
		block: ContentBlock;
		isFirst?: boolean;
		theme?: Theme;
	}>();

	const noWrapperBlocks = ['heroVideo', 'imageHero'];
	const heroBlocks = ['heroVideo', 'imageHero'];

	function getHeadingLevel(type: string): number | undefined {
		if (type === 'heading') return 2;
		if (type === 'subheading') return 4;
		if (type === 'subheadingMedium') return 3;
		return undefined;
	}

	const headingLevel = $derived(getHeadingLevel(block.type));

	const wrapperClass = $derived(() => {
		const width = block.content?.width;

		// Support for components with width property
		if (width === 'wide') {
			return 'wrapper-wide';
		}
		if (width === 'full') {
			return 'wrapper-full';
		}

		return 'wrapper-standard';
	});
</script>

{#if block.type === 'heroVideo'}
	<HeroVideo {...block.content} {theme} />
	{#if isFirst}<div id="content-start"></div>{/if}
{:else if block.type === 'imageHero'}
	<ImageHero {...block.content} {theme} />
	{#if isFirst}<div id="content-start"></div>{/if}
{:else}
	<div class={wrapperClass()}>
		{#if block.type === 'textblock'}
			<TextBlock text={block.content.text} isLead={block.content.isLead} />
		{:else if block.type === 'heading' || block.type === 'subheading' || block.type === 'subheadingMedium'}
			<Heading {...block.content} level={headingLevel} {theme} />
		{:else if block.type === 'subheadingSoccer'}
			<SubheadingSoccer {...block.content} {theme} />
		{:else if block.type === 'image'}
			<Image {...block.content} {theme} />
		{:else if block.type === 'quote'}
			<Quote {...block.content} {theme} />
		{:else if block.type === 'textframe'}
			<TextFrame {...block.content} {theme} />
		{:else if block.type === 'slider'}
			<ImageSlider {...block.content} {theme} />
		{:else if block.type === 'gallery'}
			<ImageGrid {...block.content} {theme} />
		{:else if block.type === 'timeline'}
			<Timeline {...block.content} {theme} />
		{:else if block.type === 'mediaPair'}
			<MediaPair {...block.content} {theme} />
		{:else if block.type === 'audio'}
			<Audio {...block.content} {theme} />
		{:else if block.type === 'video'}
			<Video {...block.content} {theme} />
		{:else if block.type === 'embed'}
			<Embed {...block.content} {theme} />
		{:else if block.type === 'colofon'}
			<Colofon {...block.content} {theme} />
		{:else}
			<Unsupported type={block.type} />
		{/if}
	</div>
{/if}
