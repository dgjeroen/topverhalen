import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getGist } from '$lib/server/gist';

export const load: PageServerLoad = async ({ params, cookies }) => {
    const sessionToken = cookies.get('session');
    if (!sessionToken) {
        throw error(401, 'Niet ingelogd');
    }

    try {
        const project = await getGist(params.id);

        return {
            project: {
                ...project,
                gistId: params.id
            }
        };
    } catch (err) {
        console.error('Fout bij laden project:', err);
        throw error(404, 'Project niet gevonden');
    }
};