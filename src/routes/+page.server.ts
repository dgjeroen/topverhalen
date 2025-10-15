// src/routes/+page.server.ts
import type { PageServerLoad } from './$types';
import { env } from '$env/dynamic/private';
import { building } from '$app/environment'; // <-- CORRECTE IMPORT

export const load: PageServerLoad = async ({ url }) => {
    // TIJDENS DE BUILD: Sla de netwerk-call over en gebruik direct de lokale fallback.
    if (building) { // <-- CORRECTE VARIABELE
        const content = await import('$lib/data/content.json');
        return { content: content.default };
    }

    // TIJDENS NORMAAL GEBRUIK (door een bezoeker): Voer je bestaande logica uit.
    const gistId = url.searchParams.get('gist') || env.SECRET_INDEX_GIST_ID;

    if (!gistId) {
        throw new Error('Geen Gist ID beschikbaar');
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

        return { content };
    } catch (error) {
        console.error('Fout bij laden Gist:', error);
        // Je bestaande fallback voor als de Gist niet gevonden wordt.
        const content = await import('$lib/data/content.json');
        return { content: content.default };
    }
};