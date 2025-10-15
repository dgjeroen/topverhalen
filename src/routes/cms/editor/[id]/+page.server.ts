// src/routes/cms/editor/[id]/+page.server.ts

import { error, fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { getGist } from '$lib/server/gist';
import { verifySession } from '$lib/server/auth';

import fs from 'fs/promises';
import path from 'path';
import archiver from 'archiver';

// --- Jouw bestaande load functie (ongewijzigd) ---
export const load: PageServerLoad = async ({ params, cookies }) => {
    const sessionToken = cookies.get('session');
    const session = await verifySession(sessionToken);
    if (!session) throw error(401, 'Niet ingelogd');

    try {
        const project = await getGist(params.id);
        return { project, gistId: params.id };
    } catch (err) {
        console.error('Fout bij laden project:', err);
        throw error(404, 'Project niet gevonden');
    }
};

// --- Definitieve, robuuste publicatie-actie ---
export const actions: Actions = {
    publish: async ({ request }) => {
        const formData = await request.formData();
        const contentJson = formData.get('contentData') as string;
        const storyName = formData.get('storyName') as string || 'topverhaal';

        if (!contentJson) {
            return fail(400, { error: 'Geen content ontvangen.' });
        }

        // Pad naar het kant-en-klare HTML-bestand dat SvelteKit voor ons heeft gemaakt
        const prerenderedHtmlPath = path.resolve('.svelte-kit/output/prerendered/pages/publish-template.html');
        const tempDir = path.join('/tmp', `publish-${Date.now()}`);

        try {
            // 1. Lees de door SvelteKit gegenereerde HTML
            let htmlContent = await fs.readFile(prerenderedHtmlPath, 'utf-8');

            // 2. Injecteer de gebruikerscontent met een simpele string-vervanging
            const injectionScript = `<script id="story-data" type="application/json">${contentJson}</script>`;
            htmlContent = htmlContent.replace('</body>', `${injectionScript}</body>`);

            await fs.mkdir(tempDir, { recursive: true });
            await fs.writeFile(path.join(tempDir, 'index.html'), htmlContent);

            // 3. Kopieer de benodigde assets
            const sourceAssetDir = path.resolve('.svelte-kit/output/client');
            await fs.cp(sourceAssetDir, tempDir, { recursive: true });

            // 4. Maak het ZIP-bestand
            const zipStream = archiver('zip', { zlib: { level: 9 } });
            zipStream.directory(tempDir, false);
            await zipStream.finalize();

            const safeFileName = storyName.replace(/[^a-z0-9]/gi, '_').toLowerCase();

            return new Response(zipStream as any, {
                status: 200,
                headers: {
                    'Content-Type': 'application/zip',
                    'Content-Disposition': `attachment; filename="${safeFileName}.zip"`
                }
            });
        } catch (err: any) {
            // Verbeterde error logging voor Vercel
            if (err.code === 'ENOENT') {
                console.error("Publicatie Mislukt: Kon het prerendered bestand niet vinden.", prerenderedHtmlPath);
                return fail(500, { error: 'Publicatie-fout: Zorg dat `export const prerender = true;` in `src/routes/+page.ts` staat.' });
            }
            console.error('Onverwachte publicatie-fout:', err);
            return fail(500, { error: 'Publiceren is mislukt.' });
        } finally {
            await fs.rm(tempDir, { recursive: true, force: true }).catch(console.error);
        }
    }
};