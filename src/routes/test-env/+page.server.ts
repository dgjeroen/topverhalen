// src/routes/test-env/+page.server.ts

// [ SENSEI'S FIX V2 ]: We importeren nu van 'public'
import { env } from '$env/dynamic/public';
import { getGist } from '$lib/server/gist';
import type { PageServerLoad } from './$types';

// Zorg dat dit pad nog steeds klopt (je vorige aanpassing)
import fallbackContent from '$lib/data/content.json';

export const load: PageServerLoad = async () => {
    // [ SENSEI'S FIX V2 ]: We lezen de PUBLIC_ variabele
    const previewGistId = env.PUBLIC_PREVIEW_GIST_ID;

    let projectData;
    let isPreview = false;

    if (previewGistId) {
        // ✅ PREVIEW-MODUS
        // We hebben een Gist ID! Haal de data uit die specifieke Gist.
        // De 'getGist' functie zelf blijft server-side en geheim.
        console.log(`[Preview Build] Loading Gist ID: ${previewGistId}`);
        try {
            const project = await getGist(previewGistId);
            projectData = project.data;
            isPreview = true;
        } catch (error) {
            console.error(`[Preview Build] Fout bij laden Gist ${previewGistId}:`, error);
            projectData = fallbackContent.data;
        }
    } else {
        // ❌ NORMALE MODUS
        // Geen Gist ID gevonden.
        console.log('[Preview Build] No Gist ID found, loading fallback content.json');
        projectData = fallbackContent.data;
    }

    return {
        project: {
            data: projectData
        },
        isPreview: isPreview
    };
};