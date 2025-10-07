// --- Definieer de 'content' voor elk bloktype ---

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
    caption?: string; // Optioneel, want video's hebben dit niet altijd
    poster?: string;  // Optioneel, want alleen video's hebben dit
    source?: string; // Optioneel, bronvermelding voor afbeeldingen
    showControls?: boolean; // Optioneel, om controls te tonen/verbergen
};

// --- Definieer dan de 'content' voor het HELE media-pair blok ---
export interface MediaPairContent {
    verticalAlign: 'top' | 'bottom';
    // Een 'tuple' die exact TWEE MediaItem objecten verwacht.
    items: [MediaItem, MediaItem];
}

// Dan definiëren we de 'content' voor het HELE timeline-blok
export interface TimelineContent {
    timelines: TimelineItem[]; // De content is een array van items
}
// --- Creëer een 'union type': een ContentBlock is EEN van de volgende opties ---
export type ContentBlock =
    | { type: 'textblock'; content: TextBlockContent }
    | { type: 'heading'; content: HeadingContent }
    | { type: 'subheading'; content: HeadingContent }
    | { type: 'image'; content: ImageContent }
    | { type: 'quote'; content: QuoteContent }
    | { type: 'audio'; content: AudioContent }
    | { type: 'heroVideo', content: HeroVideoContent }
    | { type: 'gallery', content: GalleryContent }
    | { type: 'video', content: VideoContent }
    | { type: 'slider', content: SliderContent }
    | { type: 'colofon', content: ColofonContent }
    | { type: 'timeline', content: TimelineContent }
    | { type: 'mediaPair'; content: MediaPairContent };