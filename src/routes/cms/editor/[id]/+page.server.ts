// src/routes/cms/editor/[id]/+page.server.ts

import { error, fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { getGist } from '$lib/server/gist';
import { verifySession } from '$lib/server/auth';

import fs from 'fs/promises';
import path from 'path';
import archiver from 'archiver';

// Importeer ons eigen, veilige manifest-bestand
import buildInfo from '$lib/server/build-info.json' with { type: 'json' };

// --- Jouw bestaande load functie (ongewijzigd) ---
export const load: PageServerLoad = async ({ params, cookies }) => {
    // ... (je load functie blijft hier exact hetzelfde)
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

// --- Functie om de HTML-template te genereren ---
function generateHtml(contentJson: string) {
    let storyName = 'Topverhaal';
    try {
        storyName = JSON.parse(contentJson).storyName || 'Topverhaal';
    } catch { /* negeer parse-fouten */ }

    // Gebruik de bestandsnamen uit ons eigen build-info.json
    const cssLinks = buildInfo.css.map((file: string) => `<link rel="stylesheet" href="/_app/${file}">`).join('\n');
    const entryScript = `<script type="module" src="/_app/${buildInfo.entry}"></script>`;

    return `<!DOCTYPE html>
<html lang="nl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${storyName}</title>
    ${cssLinks}
    ${entryScript}
    <script id="story-data" type="application/json">${contentJson}</script>
</head>
<body>
    <div id="svelte-app"></div>
</body>
</html>`;
}

// --- Definitieve, correcte publicatie-actie ---
export const actions: Actions = {
    publish: async ({ request }) => {
        const formData = await request.formData();
        const contentJson = formData.get('contentData') as string;
        const storyName = formData.get('storyName') as string || 'topverhaal';

        if (!contentJson) {
            return fail(400, { error: 'Geen content ontvangen.' });
        }

        const tempDir = path.join('/tmp', `publish-${Date.now()}`);
        const assetsDir = path.join(tempDir, '_app');

        try {
            await fs.mkdir(assetsDir, { recursive: true });

            const htmlContent = generateHtml(contentJson);
            await fs.writeFile(path.join(tempDir, 'index.html'), htmlContent);

            const sourceAssetDir = path.resolve('.svelte-kit/output/client/_app');
            await fs.cp(sourceAssetDir, assetsDir, { recursive: true });

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
        } catch (err) {
            console.error('Publishing failed:', err);
            return fail(500, { error: 'Publiceren is mislukt.' });
        } finally {
            await fs.rm(tempDir, { recursive: true, force: true }).catch(console.error);
        }
    }
};