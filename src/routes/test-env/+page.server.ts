// src/routes/test-env/+page.server.ts

import { getGist, type ProjectContent } from '$lib/server/gist';
import type { PageServerLoad } from './$types';
import { error }M from '@sveltejs/kit';

// -----------------------------------------------------------------
// [ SENSEI'S V6 FIX ]
// We maken een "bulletproof" fallback die NIET afhankelijk is
// van een falende JSON-import. We maken gewoon een leeg object.
// -----------------------------------------------------------------
const safeFallback: ProjectContent = {
    version: 0,
    storyName: 'Standaard Verhaal (Fallback)',
    theme: {},
    data: [] // Een lege data-array
};

export const load: PageServerLoad = async ({ url }) => {
    // We lezen de 'id' parameter uit de URL (jouw inzicht)
    const previewGistId = url.searchParams.get('id');

    let isPreview = false;
    let projectData: ProjectContent;

    if (previewGistId) {
        // ✅ PREVIEW-MODUS (Gist ID is in de URL)
        console.log(`[Preview Build] Loading Gist ID from URL: ${previewGistId}`);
        try {
            projectData = await getGist(previewGistId);
            isPreview = true;
        } catch (err) {
            console.error(`[Preview Build] Fout bij laden Gist ${previewGistId}:`, err);
            // Gooi een SvelteKit-specifieke 404-error als de Gist niet bestaat
            throw error(404, `Project (Gist) ${previewGistId} niet gevonden.`);
        }
    } else {
        // ❌ NORMALE MODUS (Geen Gist ID in de URL)
        console.log('[Preview Build] No Gist ID in URL, loading safe fallback.');
        projectData = safeFallback;
    }

    return {
        project: projectData,
        isPreview: isPreview
    };
};