import type { PageServerLoad } from './$types';
import { getGist } from '$lib/server/gist';
import { error } from '@sveltejs/kit';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import type { ContentFile } from '$lib/types';

// ✅ Disable client-side data fetching
export const prerender = false;
export const ssr = true;

export const load: PageServerLoad = async ({ url }) => {
    const gistId = url.searchParams.get('gist');

    // ✅ Geen Gist ID? Laad statische content.json
    if (!gistId) {
        console.log('⚠️ Geen Gist ID, laad statische content');

        try {
            // ✅ Probeer eerst via filesystem (werkt lokaal en op Vercel)
            const contentPath = join(process.cwd(), 'src/lib/data/content.json');

            if (existsSync(contentPath)) {
                const fileContent = readFileSync(contentPath, 'utf-8');
                const content: ContentFile = JSON.parse(fileContent);
                console.log('✅ Statische content geladen:', content.storyName);
                return { content };
            }

            // ✅ Fallback: probeer dynamic import
            const staticContent = await import('$lib/data/content.json');
            console.log('✅ Statische content geladen via import');
            return { content: staticContent.default };

        } catch (err) {
            console.error('❌ Kon statische content niet laden:', err);

            // ✅ Laatste fallback: lege content
            return {
                content: {
                    version: 0,
                    storyName: 'Topverhaal',
                    theme: {},
                    data: []
                }
            };
        }
    }

    // ✅ Met Gist ID: laad dynamisch
    try {
        console.log('📥 Laden content voor Gist:', gistId);
        const content = await getGist(gistId);
        console.log('✅ Content geladen:', content.storyName);
        return { content };
    } catch (err) {
        console.error('❌ Fout bij laden Gist content:', err);
        const errorMessage = err instanceof Error
            ? `Content kon niet worden geladen: ${err.message}`
            : 'Content kon niet worden geladen';
        throw error(500, errorMessage);
    }
};