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
	import Timeline from './Timeline.svelte';
	import MediaPair from './MediaPair.svelte';
	import Unsupported from './Unsupported.svelte';
	import type { ContentBlock } from '$lib/types';

	let { block } = $props<{
		block: ContentBlock;
	}>();

	const componentMap: Record<string, any> = {
		heroVideo: HeroVideo,
		textblock: TextBlock,
		heading: Heading,
		subheading: Heading,
		image: Image,
		quote: Quote,
		audio: Audio,
		video: Video,
		colofon: Colofon,
		slider: ImageSlider,
		gallery: ImageGrid,
		timeline: Timeline,
		mediaPair: MediaPair
	};
	const ComponentToRender = componentMap[block.type] || Unsupported;

	// FIX: 'timeline' uit de noWrapperBlocks array halen
	const noWrapperBlocks = ['heroVideo'];
	// FIX: 'timeline' uit de noWrapperBlocks array halen
	//	const wideBlocks = ['quote', 'video', 'slider', 'gallery', 'image'];

	const wideBlocks = ['video', 'slider', 'gallery', 'mediaPair'];
</script>

{#if noWrapperBlocks.includes(block.type)}
	<ComponentToRender {...block.content} />
{:else}
	<div
		class={wideBlocks.includes(block.type) ? 'wrapper-wide' : 'wrapper-standard'}
		class:is-linked-to-next={block.type === 'subheading'}
	>
		<ComponentToRender {...block.content} />
	</div>
{/if}
