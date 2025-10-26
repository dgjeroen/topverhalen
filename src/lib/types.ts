// src/lib/types.ts

// =================================================================
// 1. DEFINITIE VOOR HET THEMA-OBJECT
// =================================================================
export type Theme = {
    'standard-max-width'?: string;
    'wide-max-width'?: string;
    'color-text'?: string;
    'color-text-muted'?: string;
    'color-background-light'?: string;
    'color-border'?: string;
    'color-accent'?: string;
    'font-family-base'?: string;
    'font-family-quote'?: string;
    'border-radius-base'?: string;
    'box-shadow-base'?: string;
    // Voeg hier alle andere CSS-variabelen toe die je aanpasbaar wilt maken
};

// =================================================================
// 2. DEFINITIES VOOR INDIVIDUELE CONTENTBLOKKEN
// (Jouw bestaande, uitstekende definities)
// =================================================================

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
    image: string;
}

export interface HeroVideoContent {
    url: string;
    poster?: string;
    label?: string;
    title: string;
    source: string;
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

// src/lib/types.ts (update TextFrameContent interface)
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
        | 'top-rect'                // Foto boven, kop + tekst onder
        | 'top-rect-bottom'         // Kop + tekst boven, foto onderaan
        | 'inline-square-left'      // Kop boven, foto links (50% width)
        | 'inline-square-right';    // Kop boven, foto rechts (50% width)
        rounded: boolean;
    } | null;
}

export interface TimelineContent {
    timelines: TimelineItem[];
}

// =================================================================
// 3. UNION TYPE DIE ALLE MOGELIJKE BLOKKEN VERZAMELT
// =================================================================
export type ContentBlock =
    | { type: 'textblock'; content: TextBlockContent }
    | { type: 'heading'; content: HeadingContent }
    | { type: 'subheading'; content: HeadingContent }
    | { type: 'image'; content: ImageContent }
    | { type: 'quote'; content: QuoteContent }
    | { type: 'audio'; content: AudioContent }
    | { type: 'heroVideo'; content: HeroVideoContent }
    | { type: 'gallery'; content: GalleryContent }
    | { type: 'video'; content: VideoContent }
    | { type: 'slider'; content: SliderContent }
    | { type: 'colofon'; content: ColofonContent }
    | { type: 'timeline'; content: TimelineContent }
    | { type: 'mediaPair'; content: MediaPairContent }
    | { type: 'textframe'; content: TextFrameContent };

// =================================================================
// 4. HET HOOFDTYPE DAT DE VOLLEDIGE STRUCTUUR VAN content.json BESCHRIJFT
// =================================================================
export interface ContentFile {
    version: number;
    storyName: string;
    theme: Theme;
    /** De 'data' array mag uitsluitend objecten bevatten die voldoen aan het ContentBlock type. */
    data: ContentBlock[];
}