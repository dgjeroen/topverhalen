// src/routes/+page.server.ts
import type { PageServerLoad } from './$types';
import { env } from '$env/dynamic/private';

export const load: PageServerLoad = async () => {
    // ✅ Haal Gist ID uit environment variable (gezet door webhook)
    const gistId = env.PREVIEW_GIST_ID || env.DEFAULT_GIST_ID;

    if (!gistId) {
        console.warn('⚠️ Geen Gist ID gevonden, gebruik fallback');
        // Fallback naar statische content
        const content = await import('$lib/data/content.json');
        return { content: content.default };
    }

    try {
        console.log('📥 Loading content from Gist:', gistId);

        // ✅ Haal content op van GitHub Gist
        const response = await fetch(
            `https://api.github.com/gists/${gistId}`,
            {
                headers: {
                    'Authorization': `token ${env.SECRET_GITHUB_TOKEN}`,
                    'Accept': 'application/vnd.github.v3+json'
                }
            }
        );

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const gist = await response.json();
        const fileContent = Object.values(gist.files)[0] as { content: string };
        const content = JSON.parse(fileContent.content);

        console.log('✅ Content loaded from Gist:', gistId);

        return { content };
    } catch (error) {
        console.error('❌ Fout bij laden Gist content:', error);

        // Fallback naar statische content
        const content = await import('$lib/data/content.json');
        return { content: content.default };
    }
};