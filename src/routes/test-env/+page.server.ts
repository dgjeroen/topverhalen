// src/routes/test-env/+page.server.ts

import { env } from '$env/dynamic/private'; // <-- [FIX] Terug naar private
import { getGist } from '$lib/server/gist';
import type { PageServerLoad } from './$types';
import type { ProjectContent } from '$lib/server/gist';

// [FIX] We importeren de fallback en typen het.
import fallbackJson from '$lib/data/content.json';
const fallbackContent: ProjectContent = fallbackJson as ProjectContent;

export const load: PageServerLoad = async () => {
    // [FIX] We lezen de private variabele
    const previewGistId = env.PREVIEW_GIST_ID;
    let isPreview = false;
    let project: ProjectContent; // <-- [FIX] We gebruiken één object

    if (previewGistId) {
        // ✅ PREVIEW-MODUS
        console.log(`[Preview Build] Loading Gist ID: ${previewGistId}`);
        try {
            // We halen de *volledige* gist op
            project = await getGist(previewGistId);
            isPreview = true;
        } catch (error) {
            console.error(`[Preview Build] Fout bij laden Gist ${previewGistId}:`, error);
            // Fallback als de Gist faalt
            project = fallbackContent;
        }
    } else {
        // ❌ NORMALE MODUS
        console.log('[Preview Build] No Gist ID found, loading fallback content.json');
        project = fallbackContent;
    }

    return {
        project: project, // Stuur het hele object
        isPreview: isPreview
    };
};