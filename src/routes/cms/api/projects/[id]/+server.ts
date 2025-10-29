// src/routes/api/cms/projects/[id]/+server.ts
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

// ✅ PATCH: Update project content - MET RATE LIMIT INFO
export const PATCH: RequestHandler = async ({ params, request, cookies }) => {
    const sessionId = cookies.get('session');
    if (!sessionId) {
        throw error(401, 'Niet ingelogd');
    }

    try {
        const content = await request.json();
        const result = await updateGist(params.id, content);

        // ✅ Return success + rate limit info
        return json(
            {
                success: true,
                rateLimit: result.rateLimit
            },
            {
                headers: {
                    'X-RateLimit-Remaining': result.rateLimit.remaining.toString(),
                    'X-RateLimit-Limit': result.rateLimit.limit.toString(),
                    'X-RateLimit-Reset': result.rateLimit.reset.toString()
                }
            }
        );
    } catch (err) {
        console.error('Fout bij updaten project:', err);

        // ✅ Return error met details
        const errorMessage = err instanceof Error ? err.message : 'Kon project niet updaten';

        return json(
            {
                success: false,
                error: errorMessage
            },
            { status: 500 }
        );
    }
};