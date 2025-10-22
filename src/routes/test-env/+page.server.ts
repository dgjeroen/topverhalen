// src/routes/test-env/+page.server.ts

import { env } from '$env/dynamic/private';
import { getGist } from '$lib/server/gist';
import type { PageServerLoad } from './$types';


import fallbackContent from '$lib/data/content.json';

export const load: PageServerLoad = async () => {

    const previewGistId = env.PREVIEW_GIST_ID;

    let projectData;
    let isPreview = false;

    if (previewGistId) {
        // ✅ PREVIEW-MODUS

        console.log(`[Preview Build] Loading Gist ID: ${previewGistId}`);
        try {
            // We gebruiken de getGist functie die al bestaat
            const project = await getGist(previewGistId);
            projectData = project.data; // We sturen alleen de 'data' array door
            isPreview = true;
        } catch (error) {
            console.error(`[Preview Build] Fout bij laden Gist ${previewGistId}:`, error);
            // Fallback naar standaard content als de Gist faalt
            projectData = fallbackContent.data;
        }
    } else {
        // ❌ NORMALE MODUS
        // Geen Gist ID gevonden. Dit is een normale build (of de hook is fout).
        // Laad de standaard 'content.json'.
        console.log('[Preview Build] No Gist ID found, loading fallback content.json');
        projectData = fallbackContent.data;
    }

    return {
        // Dit 'project' object wordt de 'data' prop in je +page.svelte
        project: {
            data: projectData
        },
        isPreview: isPreview
    };
};