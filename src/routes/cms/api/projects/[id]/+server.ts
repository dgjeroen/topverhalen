// src/routes/api/cms/projects/[id]/+server.ts
import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getGist, updateGist, getProjectsIndex, updateProjectsIndex } from '$lib/server/gist';

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
		const payload = await request.json();

		// Support partial updates: if only storyName provided, fetch existing gist and merge
		let content = payload as any;
		if (!content || typeof content !== 'object') {
			throw new Error('Ongeldige payload');
		}

		if (Object.keys(content).length === 1 && typeof content.storyName === 'string') {
			// Fetch existing gist, merge storyName
			const existing = await getGist(params.id);
			existing.storyName = content.storyName;
			content = existing;
		}

		const result = await updateGist(params.id, content);

		// If storyName changed, also update the projects index so the overview shows the new name
		if (payload && typeof payload.storyName === 'string') {
			try {
				const index = await getProjectsIndex();
				const proj = index.projects.find((p) => p.id === params.id);
				if (proj) {
					proj.name = payload.storyName;
					await updateProjectsIndex(index);
				}
			} catch (idxErr) {
				console.warn('Kon projecten index niet bijwerken:', idxErr);
				// don't fail the whole request because of index update problems
			}
		}

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
