// src/routes/+page.server.ts
import type { PageServerLoad } from './$types';
import { env } from '$env/dynamic/private';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ url }) => {
    // Gebruik ?gist= parameter, fallback naar de geheime index Gist ID.
    const gistId = url.searchParams.get('gist') || env.SECRET_INDEX_GIST_ID;

    if (!gistId) {
        // Dit gebeurt alleen als de fallback env var ook niet is ingesteld.
        throw error(404, 'Geen project ID gevonden.');
    }

    try {
        const response = await fetch(`https://api.github.com/gists/${gistId}`, {
            headers: {
                Authorization: `token ${env.SECRET_GITHUB_TOKEN}`,
                Accept: 'application/vnd.github.v3+json'
            }
        });

        if (!response.ok) {
            throw new Error(`GitHub API faalde met status ${response.status}`);
        }

        const gist = await response.json();
        const fileContent = Object.values(gist.files)[0] as { content: string };

        // Belangrijk: parse de content hier, en geef het direct door.
        const content = JSON.parse(fileContent.content);

        return { content };
    } catch (err) {
        console.error('Fout bij laden Gist:', err);
        throw error(500, 'Kon het project niet laden.');
    }
};