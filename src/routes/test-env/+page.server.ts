// src/routes/test-env/+page.server.ts

import { getGist, type ProjectContent } from '$lib/server/gist';
import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';

// ✅ NIEUW: Enable prerendering voor static builds
export const prerender = true;

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
    // ✅ NIEUW: Check voor GIST_ID env var (gebruikt door worker)
    // Prioriteit: URL param > ENV var > fallback
    const previewGistId = url.searchParams.get('id') || process.env.GIST_ID;

    let isPreview = false;
    let projectData: ProjectContent;

    if (previewGistId) {
        // ✅ PREVIEW/PUBLISH MODUS (Gist ID in URL of ENV)
        const source = url.searchParams.get('id') ? 'URL' : 'ENV';
        console.log(`[Preview Build] Loading Gist ID from ${source}: ${previewGistId}`);

        try {
            projectData = await getGist(previewGistId);
            isPreview = true;
        } catch (err) {
            console.error(`[Preview Build] Fout bij laden Gist ${previewGistId}:`, err);
            // Gooi een SvelteKit-specifieke 404-error als de Gist niet bestaat
            throw error(404, `Project (Gist) ${previewGistId} niet gevonden.`);
        }
    } else {
        // ❌ FALLBACK MODUS (Geen Gist ID beschikbaar)
        console.log('[Preview Build] No Gist ID in URL or ENV, loading safe fallback.');
        projectData = safeFallback;
    }

    return {
        project: projectData,
        isPreview: isPreview
    };
};