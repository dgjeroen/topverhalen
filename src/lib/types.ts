// src/lib/types.ts

export type Theme = {
    // ============================================
    // LAYOUT
    // ============================================
    'standard-max-width'?: string;
    'wide-max-width'?: string;

    // ============================================
    // GLOBALE KLEUREN
    // ============================================
    'color-background-light'?: string;
    'color-text'?: string;
    'color-text-muted'?: string;
    'color-border'?: string;
    'color-accent'?: string;
    'color-white'?: string;

    // ============================================
    // GLOBALE TYPOGRAFIE
    // ============================================
    'font-family-base'?: string;
    'font-family-quote'?: string;
    'font-size-base'?: string;
    'line-height-base'?: string;

    // ============================================
    // SPACING
    // ============================================
    'space-s'?: string;
    'space-m'?: string;
    'space-l'?: string;
    'space-xl'?: string;
    'space-xxl'?: string;
    'space-xxxl'?: string;
    'block-vertical-margin'?: string;

    // ============================================
    // HEADINGS
    // ============================================
    'font-size-h1'?: string;
    'font-size-h2'?: string;
    'font-size-h3'?: string;
    'font-size-h4'?: string;
    'font-weight-headings'?: string;
    'font-weight-subheading'?: string;
    'font-weight-subheading-medium'?: string;
    'h2-color'?: string;
    'h3-color'?: string;
    'h4-color'?: string;
    'font-style-h2'?: string;
    'font-style-h3'?: string;
    'font-style-h4'?: string;
    'h2-margin-bottom'?: string;
    'h3-margin-bottom'?: string;
    'h4-margin-bottom'?: string;
    'h2-background-enabled'?: string;
    'h2-background-color'?: string;
    'h2-background-text-color'?: string;
    'h2-background-padding'?: string;
    'h3-background-enabled'?: string;
    'h3-background-color'?: string;
    'h3-background-text-color'?: string;
    'h3-background-padding'?: string;
    'h4-background-enabled'?: string;
    'h4-background-color'?: string;
    'h4-background-text-color'?: string;
    'h4-background-padding'?: string;

    // ============================================
    // SUBHEADING SOCCER COMPONENT
    // ============================================
    'subheading-soccer-bg'?: string;
    'subheading-soccer-color'?: string;
    'subheading-soccer-padding'?: string;
    'subheading-soccer-border-radius'?: string;
    'subheading-soccer-font-size'?: string;
    'subheading-soccer-font-weight'?: string;
    'subheading-soccer-height'?: string;
    'subheading-soccer-ball-size'?: string;
    'subheading-soccer-text-offset'?: string;
    'subheading-soccer-margin-bottom'?: string;

    // ============================================
    // TEXT COMPONENT
    // ============================================
    'text-font-size'?: string;
    'text-line-height'?: string;
    'text-color'?: string;
    'text-font-weight'?: string;
    'text-lead-font-size'?: string;
    'text-lead-font-weight'?: string;
    'text-lead-color'?: string;
    'text-lead-line-height'?: string;
    'text-bold-weight'?: string;
    'text-bold-color'?: string;
    'text-italic-color'?: string;
    'text-link-color'?: string;
    'text-link-hover-color'?: string;
    'text-link-decoration'?: string;

    // ============================================
    // TEXTFRAME COMPONENT (✅ ADD THESE)
    // ============================================
    'textframe-bg-color'?: string;
    'textframe-border-color'?: string;
    'textframe-border-radius'?: string;
    'textframe-padding'?: string;
    'textframe-heading-color'?: string;
    'textframe-heading-size'?: string;
    'textframe-heading-weight'?: string;
    'textframe-text-color'?: string;
    'textframe-line-height'?: string;
    'textframe-text-size'?: string;
    'textframe-caption-color'?: string;
    'textframe-caption-size'?: string;
    'textframe-img-radius'?: string;
    'textframe-toggle-size'?: string;
    'textframe-toggle-color'?: string;
    'textframe-toggle-bg'?: string;
    'textframe-toggle-hover-bg'?: string;

    // ============================================
    // QUOTE COMPONENT
    // ============================================
    'quote-font-family'?: string;
    'quote-font-size'?: string;
    'quote-font-weight'?: string;
    'quote-font-style'?: string;
    'quote-line-height'?: string;
    'quote-color'?: string;
    'quote-border-color'?: string;
    'quote-border-width'?: string;
    'quote-border-radius'?: string;
    'quote-background'?: string;
    'quote-box-shadow'?: string;
    'quote-padding'?: string;
    'quote-mark-font-family'?: string;
    'quote-mark-size'?: string;
    'quote-mark-color'?: string;
    'quote-mark-opacity'?: string;
    'quote-cursor-color'?: string;
    'quote-author-font-size'?: string;
    'quote-author-font-family'?: string;
    'quote-author-font-weight'?: string;
    'quote-author-color'?: string;
    'quote-author-align'?: string;

    // ============================================
    // COLOFON COMPONENT
    // ============================================
    'colofon-padding-block'?: string;
    'colofon-border-color'?: string;
    'colofon-font-size'?: string;
    'colofon-dt-color'?: string;
    'colofon-dt-weight'?: string;
    'colofon-dt-align'?: string;
    'colofon-dd-color'?: string;
    'colofon-dd-weight'?: string;
    'colofon-gap'?: string;
    'colofon-column-gap'?: string;

    // ============================================
    // AUDIO COMPONENT
    // ============================================
    'audio-bg-color'?: string;
    'audio-border-radius'?: string;
    'audio-padding'?: string;
    'audio-gap'?: string;
    'audio-image-size'?: string;
    'audio-image-border-radius'?: string;
    'audio-title-color'?: string;
    'audio-title-size'?: string;
    'audio-title-weight'?: string;
    'audio-description-color'?: string;
    'audio-description-size'?: string;
    'audio-button-size'?: string;
    'audio-button-border-color'?: string;
    'audio-button-hover-bg'?: string;
    'audio-button-icon-color'?: string;
    'audio-progress-height'?: string;
    'audio-progress-bg'?: string;
    'audio-progress-fill-color'?: string;
    'audio-progress-border-radius'?: string;
    'audio-time-color'?: string;
    'audio-time-size'?: string;

    // ============================================
    // IMAGE COMPONENTS (Standard, Parallax, Grid, Slider)
    // ============================================
    'image-border-radius'?: string;
    'image-box-shadow'?: string;
    'image-hover-transform'?: string;
    'image-hover-shadow'?: string;
    'image-caption-spacing'?: string;
    'image-caption-color'?: string;
    'image-caption-font-size'?: string;
    'image-caption-font-weight'?: string;
    'image-caption-align'?: string;
    'image-source-color'?: string;
    'image-source-font-size'?: string;
    'image-source-font-style'?: string;
    'image-source-font-weight'?: string;

    // ============================================
    // VIDEO COMPONENT
    // ============================================
    'video-border-radius'?: string;
    'video-aspect-ratio'?: string;

    // ============================================
    // HERO VIDEO
    // ============================================
    'hero-title-font-size'?: string;
    'hero-title-color'?: string;
    'hero-label-color'?: string;
    'hero-label-background'?: string;

    // ============================================
    // SLIDER COMPONENT
    // ============================================
    'slider-btn-bg'?: string;
    'slider-btn-hover-bg'?: string;
    'slider-btn-color'?: string;
    'slider-btn-size'?: string;
    'slider-btn-font-size'?: string;
    'slider-dots-bg'?: string;
    'slider-dots-padding'?: string;
    'slider-dots-border-radius'?: string;
    'slider-dots-gap'?: string;
    'slider-dot-size'?: string;
    'slider-dot-bg'?: string;
    'slider-dot-border-width'?: string;
    'slider-dot-border-color'?: string;
    'slider-dot-active-bg'?: string;
    'slider-dot-active-border-width'?: string;
    'slider-dot-active-border-color'?: string;

    // ============================================
    // ACHTERGROND AFBEELDING (Desktop only)
    // ============================================
    'background-image'?: string;
    'background-repeat'?: 'repeat' | 'no-repeat' | 'repeat-x' | 'repeat-y';
    'background-position'?: string;
    'background-size'?: 'cover' | 'contain' | 'auto';
    'background-opacity'?: number;
    'background-attachment'?: 'scroll' | 'fixed';

    // ============================================
    // OVERIG
    // ============================================
    'border-radius-base'?: string;
    'box-shadow-base'?: string;
};

// Rest van types blijft hetzelfde...
export interface TextBlockContent {
    text: string[];
    isLead?: boolean;
}

export interface HeadingContent {
    text: string;
    level: number;
}

export interface ImageContent {
    url: string;
    caption: string;
    source: string;
    parallax: boolean;
}

export interface QuoteContent {
    text: string;
    author: string;
}

export interface AudioContent {
    url: string;
    title: string;
    description: string;
    image?: string;
    imageLayout?: 'none' | 'stamp' | 'portrait';
    imageScale?: number;
    imageFocusX?: number;
    imageFocusY?: number;
}

export interface HeroVideoContent {
    url: string;
    poster?: string;
    label?: string;
    title: string;
    source: string;
    textAlign?: 'top' | 'center' | 'bottom';
    focusX?: number;
    focusY?: number;
}

export interface ImageHeroContent {
    url: string;
    label?: string;
    title: string;
    source?: string;
    textAlign?: 'top' | 'center' | 'bottom';
}

export interface GalleryContent {
    images: { url: string; caption: string; source: string }[];
    columns: number;
}

export interface VideoContent {
    url: string;
    poster?: string;
}

export interface SliderContent {
    images: Array<{
        url: string;
        caption: string;
        source: string;
    }>;
}

export interface ColofonContent {
    items: { functie: string; namen: string }[];
    showLogo?: boolean;
    logoVariant?: 'color' | 'dia';
}

export interface TimelineItem {
    year: string;
    title: string | null;
    imageSrc: string | null;
    imageAlt: string;
    description: string;
}

export type MediaItem = {
    type: 'image' | 'video';
    orientation: 'portrait' | 'landscape';
    url: string;
    caption?: string;
    poster?: string;
    source?: string;
    showControls?: boolean;
};

export interface MediaPairContent {
    verticalAlign: 'top' | 'bottom';
    items: [MediaItem, MediaItem];
}

export interface TextFrameContent {
    width: 'narrow' | 'wide';
    heading?: string;
    text: string;
    image?: {
        url: string;
        alt: string;
        caption?: string;
        source?: string;
        layout:
        | 'top-rect'
        | 'top-rect-bottom'
        | 'inline-square-left'
        | 'inline-square-right';
        rounded: boolean;
        hidden?: boolean;
    } | null;
    collapsible?: boolean;
    defaultOpen?: boolean;
}

export interface TimelineContent {
    timelines: TimelineItem[];
}

export interface EmbedContent {
    code: string;
    aspectRatio?: '16:9' | '4:3' | '1:1' | '3:2' | '21:9' | 'auto';
    caption?: string;
    source?: string;
}

type BlockBase = {
    id: string;
};

type BlockUnion =
    | { type: 'textblock'; content: TextBlockContent }
    | { type: 'heading'; content: HeadingContent }
    | { type: 'subheading'; content: HeadingContent }
    | { type: 'subheadingMedium'; content: HeadingContent }
    | { type: 'subheadingSoccer'; content: HeadingContent }
    | { type: 'image'; content: ImageContent }
    | { type: 'quote'; content: QuoteContent }
    | { type: 'audio'; content: AudioContent }
    | { type: 'heroVideo'; content: HeroVideoContent }
    | { type: 'imageHero'; content: ImageHeroContent }
    | { type: 'gallery'; content: GalleryContent }
    | { type: 'video'; content: VideoContent }
    | { type: 'slider'; content: SliderContent }
    | { type: 'colofon'; content: ColofonContent }
    | { type: 'timeline'; content: TimelineContent }
    | { type: 'mediaPair'; content: MediaPairContent }
    | { type: 'textframe'; content: TextFrameContent }
    | { type: 'embed'; content: EmbedContent };

export type ContentBlock = BlockBase & BlockUnion;

export interface ContentFile {
    version: number;
    storyName: string;
    theme: Theme;
    data: ContentBlock[];
}