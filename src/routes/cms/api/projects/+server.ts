import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getProjectsIndex, updateProjectsIndex, createGist } from '$lib/server/gist';

// ✅ GET: Haal projectenlijst op
export const GET: RequestHandler = async ({ cookies }) => {
	const sessionId = cookies.get('session');
	if (!sessionId) {
		throw error(401, 'Niet ingelogd');
	}

	try {
		const index = await getProjectsIndex();
		return json(index);
	} catch (err) {
		console.error('Fout bij ophalen projecten:', err);
		throw error(500, 'Kon projecten niet laden');
	}
};

// ✅ POST: Maak nieuw project
export const POST: RequestHandler = async ({ request, cookies }) => {
	const sessionId = cookies.get('session');
	if (!sessionId) {
		throw error(401, 'Niet ingelogd');
	}

	try {
		const { name } = await request.json();

		if (!name || typeof name !== 'string') {
			throw error(400, 'Projectnaam is verplicht');
		}

		// Maak nieuwe Gist
		const newGist = await createGist(name, {
			version: 0,
			storyName: name,
			theme: {},
			data: []
		});

		// Update index
		const index = await getProjectsIndex();
		index.projects.push({
			name,
			id: newGist.id
		});
		await updateProjectsIndex(index);

		return json({ id: newGist.id });
	} catch (err) {
		console.error('Fout bij aanmaken project:', err);
		throw error(500, 'Kon project niet aanmaken');
	}
};
