// src/routes/cms/editor/[id]/+page.server.ts

import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getGist } from '$lib/server/gist';
import { verifySession } from '$lib/server/auth';

export const load: PageServerLoad = async ({ params, cookies }) => {
    // Check sessie
    const sessionToken = cookies.get('session');
    const session = await verifySession(sessionToken);

    if (!session) {
        throw error(401, 'Niet ingelogd');
    }

    try {
        // Haal project data op uit Gist
        const project = await getGist(params.id);

        return {
            project,
            gistId: params.id
        };
    } catch (err) {
        console.error('Fout bij laden project:', err);
        throw error(404, 'Project niet gevonden');
    }
};