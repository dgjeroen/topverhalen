//src\routes\cms\api\projects\[id]\+server.ts
import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getGist, updateGist } from '$lib/server/gist';

// ✅ GET: Haal project content op
export const GET: RequestHandler = async ({ params, cookies }) => {
    const sessionId = cookies.get('session');
    if (!sessionId) {
        throw error(401, 'Niet ingelogd');
    }

    try {
        const content = await getGist(params.id);
        return json(content);
    } catch (err) {
        console.error('Fout bij ophalen project:', err);
        throw error(500, 'Kon project niet laden');
    }
};

// ✅ PATCH: Update project content
export const PATCH: RequestHandler = async ({ params, request, cookies }) => {
    const sessionId = cookies.get('session');
    if (!sessionId) {
        throw error(401, 'Niet ingelogd');
    }

    try {
        const content = await request.json();
        await updateGist(params.id, content);
        return json({ success: true });
    } catch (err) {
        console.error('Fout bij updaten project:', err);
        throw error(500, 'Kon project niet updaten');
    }
};