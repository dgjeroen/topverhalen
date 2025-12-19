// src/routes/api/publish/start/+server.ts
import { json, error } from '@sveltejs/kit';
import { dev } from '$app/environment';
import type { RequestHandler } from './$types';
import { createJob, simulateJobCompletion, triggerWorkflow } from '$lib/server/queue';
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

		// ✅ Development: Simuleer worker
		if (dev) {
			simulateJobCompletion(jobId, true);
			return json(
				{
					jobId,
					status: 'pending',
					message: '[DEV MODE] Build gesimuleerd. Status updates elke 3s.'
				},
				{ status: 202 }
			);
		}

		// ✅ NIEUW: Trigger workflow direct via GitHub API
		try {
			await triggerWorkflow(jobId);
			console.log(`✅ Workflow triggered for job ${jobId}`);
		} catch (triggerError) {
			console.error('⚠️ Failed to trigger workflow, falling back to cron:', triggerError);
			// Fallback: Job blijft in queue voor cron pickup
		}

		return json(
			{
				jobId,
				status: 'pending',
				message: 'Build gestart. Gebruik /api/publish/status/{jobId} om voortgang te volgen.'
			},
			{ status: 202 }
		);
	} catch (err) {
		console.error('Fout bij starten publish job:', err);
		throw error(500, 'Kon job niet starten');
	}
};
