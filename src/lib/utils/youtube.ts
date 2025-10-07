// src/lib/utils/youtube.ts

/**
 * Haalt de 11-karakter YouTube video ID uit verschillende URL-formaten.
 * @param url De YouTube URL.
 * @returns De video ID of null als er geen wordt gevonden.
 */
export function getYouTubeVideoId(url: string): string | null {
    // De reguliere expressie is nu uitgebreid met 'live\/'
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|live\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);

    if (match && match[2].length === 11) {
        return match[2];
    }

    return null;
}