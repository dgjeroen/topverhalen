// src/routes/cms/editor/[id]/+page.server.ts

import { error, fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types'; // Belangrijk: 'Actions' is hier toegevoegd
import { getGist } from '$lib/server/gist';
import { verifySession } from '$lib/server/auth';

import fs from 'fs/promises';
import path from 'path';
import archiver from 'archiver';
// @ts-expect-error - 'MANIFEST' is een speciaal SvelteKit import-alias, IDE kent deze niet
import { manifest } from 'MANIFEST';

// --- Jouw bestaande load functie (ongewijzigd) ---
export const load: PageServerLoad = async ({ params, cookies }) => {
    // Check sessie
    const sessionToken = cookies.get('session');
    const session = await verifySession(sessionToken);

    if (!session) {
        throw error(401, 'Niet ingelogd');
    }

    try {
        // Haal project data op uit Gist
        const project = await getGist(params.id);

        return {
            project,
            gistId: params.id
        };
    } catch (err) {
        console.error('Fout bij laden project:', err);
        throw error(404, 'Project niet gevonden');
    }
};


// --- Gecorrigeerde publicatie-logica ---

// Helper-type voor een node in het manifest
type ManifestNode = {
    id: string;
    file: string;
    css?: string[];
};

// Zoek de JS en CSS bestanden voor de publieke hoofdpagina.
const clientEntryNode = manifest.nodes.find((node: ManifestNode) => node.id === 'src/routes/+page.svelte');
const clientEntry = clientEntryNode?.file;
const cssFiles = clientEntryNode?.css || [];

// Functie om de HTML-template te genereren
function generateHtml(contentJson: string, entryJs: string, css: string[]) {
    // Probeer de storyName uit de JSON te parsen voor de <title> tag
    let storyName = 'Topverhaal';
    try {
        storyName = JSON.parse(contentJson).storyName || 'Topverhaal';
    } catch { /* negeer parse-fouten */ }

    const cssLinks = css.map(file => `<link rel="stylesheet" href="/_app/${file}">`).join('\n');
    return `<!DOCTYPE html>
<html lang="nl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${storyName}</title>
    ${cssLinks}
    <script type="module" src="/_app/${entryJs}"></script>
    <script id="story-data" type="application/json">${contentJson}</script>
</head>
<body>
    <div id="svelte-app"></div>
</body>
</html>`;
}


export const actions: Actions = {
    publish: async ({ request }) => {
        const formData = await request.formData();
        const contentJson = formData.get('contentData') as string;
        const storyName = formData.get('storyName') as string || 'topverhaal';

        if (!contentJson || !clientEntry) {
            return fail(500, { error: 'Build-configuratie niet gevonden.' });
        }

        // Gebruik /tmp/ op Vercel, wat de standaard is voor tijdelijke bestanden
        const tempDir = path.join('/tmp', `publish-${Date.now()}`);
        const assetsDir = path.join(tempDir, '_app');

        try {
            // 1. Maak tijdelijke mappenstructuur aan
            await fs.mkdir(assetsDir, { recursive: true });

            // 2. Genereer en schrijf de index.html
            const htmlContent = generateHtml(contentJson, clientEntry, cssFiles);
            await fs.writeFile(path.join(tempDir, 'index.html'), htmlContent);

            // 3. Kopieer de benodigde SvelteKit assets
            const sourceAssetDir = path.resolve('.svelte-kit/output/client/_app');
            await fs.cp(sourceAssetDir, assetsDir, { recursive: true });

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
        } catch (err) {
            console.error('Publishing failed:', err);
            return fail(500, { error: 'Publiceren is mislukt.' });
        } finally {
            // 5. Ruim de tijdelijke map op
            await fs.rm(tempDir, { recursive: true, force: true }).catch(console.error);
        }
    }
};