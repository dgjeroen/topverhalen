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
	const wideBlocks = ['video', 'slider', 'gallery', 'mediaPair'];
	const heroBlocks = ['heroVideo', 'imageHero'];

	function getHeadingLevel(type: string): number | undefined {
		if (type === 'heading') return 2;
		if (type === 'subheading') return 4;
		if (type === 'subheadingMedium') return 3;
		return undefined;
	}

	const headingLevel = $derived(getHeadingLevel(block.type));

	const wrapperClass = $derived(() => {
		if (wideBlocks.includes(block.type)) {
			return 'wrapper-wide';
		}

		if (block.type === 'textframe') {
			return block.content?.width === 'wide' ? 'wrapper-wide' : 'wrapper-standard';
		}

		return 'wrapper-standard';
	});
</script>

<!-- ✅ HERO BLOCKS (no wrapper, expliciete props) -->
{#if block.type === 'heroVideo'}
	<HeroVideo
		url={block.content.url}
		poster={block.content.poster}
		label={block.content.label}
		title={block.content.title}
		source={block.content.source}
		textAlign={block.content.textAlign}
		focusX={block.content.focusX}
		focusY={block.content.focusY}
		videoScale={block.content.videoScale}
	/>
	{#if isFirst}
		<div id="content-start"></div>
	{/if}
{:else if block.type === 'imageHero'}
	<ImageHero
		url={block.content.url}
		label={block.content.label}
		title={block.content.title}
		source={block.content.source}
		textAlign={block.content.textAlign}
		focusX={block.content.focusX}
		focusY={block.content.focusY}
		imageScale={block.content.imageScale}
	/>
	{#if isFirst}
		<div id="content-start"></div>
	{/if}

	<!-- ✅ STANDARD BLOCKS (met wrapper, spread OK) -->
{:else if block.type === 'textblock'}
	<div class="wrapper-standard">
		<TextBlock {...block.content} />
	</div>
{:else if block.type === 'heading' || block.type === 'subheading' || block.type === 'subheadingMedium'}
	<div class="wrapper-standard">
		<Heading {...block.content} level={headingLevel} />
	</div>
{:else if block.type === 'subheadingSoccer'}
	<div class="wrapper-standard">
		<SubheadingSoccer {...block.content} {theme} />
	</div>
{:else if block.type === 'image'}
	<div class="wrapper-standard">
		<Image {...block.content} />
	</div>
{:else if block.type === 'quote'}
	<div class="wrapper-standard">
		<Quote {...block.content} />
	</div>
{:else if block.type === 'video'}
	<div class="wrapper-wide">
		<Video
			url={block.content.url}
			poster={block.content.poster}
			focusX={block.content.focusX}
			focusY={block.content.focusY}
			videoScale={block.content.videoScale}
		/>
	</div>
{:else if block.type === 'audio'}
	<div class="wrapper-standard">
		<Audio {...block.content} />
	</div>
{:else if block.type === 'slider'}
	<div class="wrapper-wide">
		<ImageSlider {...block.content} />
	</div>
{:else if block.type === 'gallery'}
	<div class="wrapper-wide">
		<ImageGrid {...block.content} />
	</div>
{:else if block.type === 'timeline'}
	<div class="wrapper-wide">
		<Timeline {...block.content} {theme} />
		<!-- ✅ FIXED: theme toegevoegd -->
	</div>
{:else if block.type === 'mediaPair'}
	<div class="wrapper-wide">
		<MediaPair {...block.content} />
	</div>
{:else if block.type === 'textframe'}
	<div class={wrapperClass()}>
		<TextFrame {...block.content} />
	</div>
{:else if block.type === 'embed'}
	<div class="wrapper-standard">
		<Embed {...block.content} />
	</div>
{:else if block.type === 'colofon'}
	<div class="wrapper-standard">
		<Colofon {...block.content} {theme} />
		<!-- ✅ Check of Colofon theme nodig heeft -->
	</div>
{:else}
	<div class="wrapper-standard">
		<Unsupported type={block.type} />
	</div>
{/if}
