// src/routes/+page.server.ts
import type { PageServerLoad } from './$types';
import { env } from '$env/dynamic/private';
import { building } from '$app/environment';

export const load: PageServerLoad = async ({ url }) => {
    // TIJDENS DE BUILD: Sla de netwerk-call over.
    if (building) {
        // Retourneer de correcte, lege structuur.
        return {
            content: {
                storyName: 'Build Placeholder',
                theme: {},
                data: []
            }
        };
    }

    const gistId = url.searchParams.get('gist') || env.SECRET_INDEX_GIST_ID;

    if (!gistId) {
        // Fallback naar een lege, maar correct gestructureerde staat.
        return {
            content: {
                storyName: 'Geen project geselecteerd',
                theme: {},
                data: []
            }
        };
    }

    try {
        const response = await fetch(`https://api.github.com/gists/${gistId}`, {
            headers: {
                Authorization: `token ${env.SECRET_GITHUB_TOKEN}`,
                Accept: 'application/vnd.github.v3+json'
            }
        });

        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const gist = await response.json();
        const fileContent = Object.values(gist.files)[0] as { content: string };
        const content = JSON.parse(fileContent.content);

        // Retourneer de data in de `{ content: ... }` wrapper.
        return { content };
    } catch (error) {
        console.error('Fout bij laden Gist:', error);
        // Zorg dat de fallback ook de juiste structuur heeft.
        return {
            content: {
                storyName: 'Project niet gevonden (fallback)',
                theme: {},
                data: []
            }
        };
    }
};