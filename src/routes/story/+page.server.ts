//src\routes\story\+page.server.ts
import { getGist, type ProjectContent } from '$lib/server/gist';
import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';

// ✅ Alleen prerenderen als GIST_ID aanwezig is (worker context)
export const prerender = !!process.env.GIST_ID;

export const load: PageServerLoad = async () => {
    const gistId = process.env.GIST_ID;

    if (!gistId) {
        // In normale Vercel deployment (zonder GIST_ID), return fallback
        console.log('[Story Route] No GIST_ID, skipping prerender');
        throw error(404, 'This route is only available during static builds');
    }

    console.log(`[Static Build] Loading Gist: ${gistId}`);

    try {
        const projectData = await getGist(gistId);
        return {
            project: projectData,
            isPreview: false
        };
    } catch (err) {
        console.error(`[Static Build] Failed to load Gist:`, err);
        throw error(500, 'Failed to load story data');
    }
};