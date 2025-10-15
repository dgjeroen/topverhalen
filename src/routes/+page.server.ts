// src/routes/+page.server.ts
import type { PageServerLoad } from './$types';
import { env } from '$env/dynamic/private';

export const load: PageServerLoad = async ({ url }) => {
    // ✅ Gebruik ?gist= parameter, fallback naar SECRET_INDEX_GIST_ID
    const gistId = url.searchParams.get('gist') || env.SECRET_INDEX_GIST_ID;

    if (!gistId) {
        throw new Error('Geen Gist ID beschikbaar');
    }

    try {
        const response = await fetch(
            `https://api.github.com/gists/${gistId}`,
            {
                headers: {
                    'Authorization': `token ${env.SECRET_GITHUB_TOKEN}`,
                    'Accept': 'application/vnd.github.v3+json'
                }
            }
        );

        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const gist = await response.json();
        const fileContent = Object.values(gist.files)[0] as { content: string };
        const content = JSON.parse(fileContent.content);

        return { content };
    } catch (error) {
        console.error('Fout bij laden Gist:', error);
        // Fallback naar statische content
        const content = await import('$lib/data/content.json');
        return { content: content.default };
    }
};