<!-- src/lib/components/BlockRenderer.svelte -->
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
	import type { ContentBlock } from '$lib/types';

	let { block, isFirst = false } = $props<{
		block: ContentBlock;
		isFirst?: boolean;
	}>();

	const componentMap: Record<string, any> = {
		heroVideo: HeroVideo,
		imageHero: ImageHero,
		textblock: TextBlock,
		heading: Heading,
		subheading: Heading,
		subheadingMedium: Heading,
		subheadingSoccer: SubheadingSoccer,
		image: Image,
		quote: Quote,
		audio: Audio,
		video: Video,
		colofon: Colofon,
		slider: ImageSlider,
		gallery: ImageGrid,
		timeline: Timeline,
		mediaPair: MediaPair,
		textframe: TextFrame,
		embed: Embed
	};

	const ComponentToRender = componentMap[block.type] || Unsupported;

	const noWrapperBlocks = ['heroVideo', 'imageHero'];
	const wideBlocks = ['video', 'slider', 'gallery', 'mediaPair'];
	const heroBlocks = ['heroVideo', 'imageHero'];

	// ✅ NIEUW: Helper functie voor heading levels
	function getHeadingLevel(type: string): number | undefined {
		if (type === 'heading') return 2;
		if (type === 'subheading') return 4;
		if (type === 'subheadingMedium') return 3;
		return undefined;
	}

	const headingLevel = $derived(getHeadingLevel(block.type));
</script>

{#if noWrapperBlocks.includes(block.type)}
	<ComponentToRender {...block.content} level={headingLevel} />

	{#if isFirst && heroBlocks.includes(block.type)}
		<div id="content-start"></div>
	{/if}
{:else}
	<div class={wideBlocks.includes(block.type) ? 'wrapper-wide' : 'wrapper-standard'}>
		<ComponentToRender {...block.content} level={headingLevel} />
	</div>
{/if}
