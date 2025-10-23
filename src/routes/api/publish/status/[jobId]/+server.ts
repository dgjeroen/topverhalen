// src/routes/api/publish/status/[jobId]/+server.ts
import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getJob } from '$lib/server/queue';
import { verifySession } from '$lib/server/auth';

/**
 * GET /api/publish/status/{jobId}
 * Haal huidige status van een publish job op
 */
export const GET: RequestHandler = async ({ params, cookies }) => {
    // ✅ Auth check
    const sessionToken = cookies.get('session');
    const session = await verifySession(sessionToken);

    if (!session) {
        throw error(401, 'Niet ingelogd');
    }

    // ✅ Haal job op
    const job = await getJob(params.jobId);

    if (!job) {
        throw error(404, 'Job niet gevonden');
    }

    // ✅ Return job details
    return json(job);
};