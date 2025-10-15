// src/routes/cms/editor/[id]/+page.server.ts

import { error, fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import fs from 'fs/promises';
import path from 'path';
import archiver from 'archiver';
import { getGist } from '$lib/server/gist';
import { verifySession } from '$lib/server/auth';

// Jouw werkende `load` functie
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

// De definitieve, correcte "Publiceren" actie
import buildInfo from '$lib/server/build-info.json';

// Deze functie bouwt de HTML op als een string, zonder bestanden te lezen.
function generateStaticHtml(contentJson: string): string {
    const storyData = JSON.parse(contentJson);
    const cssLinks = buildInfo.css.map(file => `<link rel="stylesheet" href="./_app/${file}">`).join('\n\t');
    const entryScript = `<script type="module" src="./_app/${buildInfo.entry}"></script>`;

    return `<!DOCTYPE html>
<html lang="nl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${storyData.storyName || 'Topverhaal'}</title>
    ${cssLinks}
</head>
<body>
    <div id="svelte-app"></div>
    <script id="story-data" type="application/json">${contentJson}</script>
    ${entryScript}
</body>
</html>`;
}

export const actions: Actions = {
    publish: async ({ request }) => {
        const formData = await request.formData();
        const contentJson = formData.get('contentData') as string;
        const storyName = formData.get('storyName') as string || 'topverhaal';

        if (!contentJson) {
            return fail(400, { error: 'Geen content ontvangen.' });
        }

        const tempDir = path.join('/tmp', `publish-${Date.now()}`);

        try {
            // 1. Genereer de HTML direct als een string
            const htmlContent = generateStaticHtml(contentJson);

            // 2. Maak de tijdelijke mappenstructuur voor de ZIP
            await fs.mkdir(path.join(tempDir, '_app'), { recursive: true });
            await fs.writeFile(path.join(tempDir, 'index.html'), htmlContent);

            // 3. Kopieer de benodigde assets (JS en CSS bestanden)
            const sourceAssetDir = path.resolve('.svelte-kit/output/client/_app');
            await fs.cp(sourceAssetDir, path.join(tempDir, '_app'), { recursive: true });

            // 4. Maak en verstuur het ZIP-bestand
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
            console.error('FATALE PUBLICATIE-FOUT:', err);
            return fail(500, { error: 'Publiceren is mislukt. De server kon de build niet assembleren.' });
        } finally {
            await fs.rm(tempDir, { recursive: true, force: true }).catch(console.error);
        }
    }
};