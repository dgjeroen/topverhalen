import type { PageServerLoad } from './$types';

// Importeren uit 'private' in plaats van 'public'
import { SECRET_GIST_URL, SECRET_GITHUB_TOKEN } from '$env/static/private';

// De lokale fallback blijft onze reddingsboei
import contentFallback from '$lib/data/content.json';

export const load: PageServerLoad = async ({ fetch }) => {
    // We controleren nu op beide variabelen
    if (!SECRET_GIST_URL || !SECRET_GITHUB_TOKEN) {
        console.warn('Gist URL or GitHub Token is not set. Using local fallback.');
        return { content: contentFallback };
    }

    try {
        console.log(`Fetching secret Gist from: ${SECRET_GIST_URL}`);

        const response = await fetch(SECRET_GIST_URL, {
            // Dit is de cruciale toevoeging: we sturen de token mee
            headers: {
                'Authorization': `token ${SECRET_GITHUB_TOKEN}`
            }
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch Gist: ${response.statusText}`);
        }

        const content = await response.json();
        return { content };

    } catch (error) {
        console.error('Could not fetch live content:', error);
        console.warn('Using local fallback content.');
        return { content: contentFallback };
    }
};