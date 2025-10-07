// src/routes/+page.server.ts

import content from '$lib/data/content.json';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = () => {
    // Hier kun je de data transformeren of een API aanroepen.
    // De content wordt nu door de server ingelezen.
    return { content };
};