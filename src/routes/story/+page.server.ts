//src/routes/story/+page.server.ts
import { getGist, type ProjectContent } from '$lib/server/gist';
import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';

export const prerender = true;

export const load: PageServerLoad = async () => {
    const gistId = process.env.GIST_ID;

    if (!gistId) {
        throw error(500, 'GIST_ID environment variable required');
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