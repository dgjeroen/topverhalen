// src/routes/api/publish/start/+server.ts
import { json, error } from '@sveltejs/kit';
import { dev } from '$app/environment';
import type { RequestHandler } from './$types';
import { createJob, simulateJobCompletion } from '$lib/server/queue';
import { verifySession } from '$lib/server/auth';

/**
 * POST /api/publish/start
 * Start een async build job voor een Gist
 */
export const POST: RequestHandler = async ({ request, cookies }) => {
    // ✅ Auth check
    const sessionToken = cookies.get('session');
    const session = await verifySession(sessionToken);

    if (!session) {
        throw error(401, 'Niet ingelogd');
    }

    // ✅ Parse request body
    const { gistId } = await request.json();

    if (!gistId || typeof gistId !== 'string') {
        throw error(400, 'Gist ID vereist');
    }

    try {
        // ✅ Maak job aan
        const jobId = await createJob(gistId);

        // ✅ Development: Simuleer worker (na 5s)
        if (dev) {
            simulateJobCompletion(jobId, true); // Verander naar false om failure te testen
        }

        // ✅ Direct response
        return json(
            {
                jobId,
                status: 'pending',
                message: dev
                    ? '[DEV MODE] Build gesimuleerd. Status updates elke 3s.'
                    : 'Build gestart. Gebruik /api/publish/status/{jobId} om voortgang te volgen.'
            },
            { status: 202 }
        );
    } catch (err) {
        console.error('Fout bij starten publish job:', err);
        throw error(500, 'Kon job niet starten');
    }
};