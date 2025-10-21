import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getGist } from '$lib/server/gist';
import { exec } from 'child_process';
import { promisify } from 'util';
import { writeFile, readdir, readFile, rm, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';
import JSZip from 'jszip';

const execAsync = promisify(exec);

export const POST: RequestHandler = async ({ request, cookies }) => {
    console.log('📡 POST /cms/api/build ontvangen');

    const session = cookies.get('session');
    if (!session && process.env.NODE_ENV !== 'development') {
        throw error(401, 'Niet ingelogd');
    }

    const { gistId, basePath = '/' } = await request.json();

    if (!gistId) {
        throw error(400, 'Gist ID verplicht');
    }

    console.log('📦 Build voor Gist:', gistId);
    console.log('📁 Base path:', basePath);

    try {
        // ✅ 1. Haal content op
        console.log('📥 Ophalen content...');
        const projectContent = await getGist(gistId);

        // ✅ 2. Schrijf naar static/
        const staticDir = join(process.cwd(), 'static');
        if (!existsSync(staticDir)) {
            await mkdir(staticDir, { recursive: true });
        }

        const contentPath = join(staticDir, 'content.json');
        await writeFile(contentPath, JSON.stringify(projectContent, null, 2));
        console.log('✅ content.json geschreven');

        // ✅ 3. Build
        console.log('🔨 Build starten...');
        const buildCommand = 'npx cross-env ADAPTER=static vite build';

        await execAsync(buildCommand, {
            timeout: 55000,
            cwd: process.cwd()
        });

        console.log('✅ Build voltooid');

        // ✅ Run fix-paths script
        console.log('🔧 Fixing paths...');
        await execAsync('node scripts/fix-paths.js', {
            timeout: 10000,
            cwd: process.cwd()
        });
        console.log('✅ Paths fixed');

        // ✅ 4. Genereer ZIP
        console.log('📦 ZIP genereren...');
        const buildDir = join(process.cwd(), 'build');

        if (!existsSync(buildDir)) {
            throw error(500, 'Build folder niet gevonden');
        }

        const zip = new JSZip();

        async function addFolderToZip(folderPath: string, zipFolder: JSZip) {
            const entries = await readdir(folderPath, { withFileTypes: true });

            for (const entry of entries) {
                const fullPath = join(folderPath, entry.name);

                if (entry.isDirectory()) {
                    const subFolder = zipFolder.folder(entry.name);
                    if (subFolder) {
                        await addFolderToZip(fullPath, subFolder);
                    }
                } else {
                    const fileContent = await readFile(fullPath);
                    zipFolder.file(entry.name, fileContent);
                }
            }
        }

        await addFolderToZip(buildDir, zip);

        // ✅ 5. Voeg README toe
        const readme = `
# ${projectContent.storyName} - Static Export

## 📁 Upload instructies:

1. Pak de ZIP uit
2. Upload ALLE bestanden (inclusief .htaccess) naar:
   ${basePath}

3. Verify dat de structuur klopt:
   ${basePath}index.html
   ${basePath}_app/
   ${basePath}.htaccess

## ✅ De .htaccess is al geconfigureerd voor:
   ${basePath}

## 🌐 Vereisten:

- Apache webserver met mod_rewrite enabled
- .htaccess moet toegestaan zijn (AllowOverride All)

## ⚠️ Troubleshooting:

Lege pagina of 404?
→ Check of .htaccess is geüpload
→ Check of mod_rewrite enabled is
→ Check browser console (F12) voor errors

## 📞 Info:

Gegenereerd: ${new Date().toLocaleString('nl-NL')}
Gist: ${gistId}
Base path: ${basePath}
		`.trim();

        zip.file('README.txt', readme);

        // ✅ 6. Voeg .htaccess toe met correcte base path
        const htaccess = `
# SvelteKit SPA Routing voor ${projectContent.storyName}
# Gegenereerd voor: ${basePath}

<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase ${basePath}
  
  # Als bestand of folder bestaat, serveer direct
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  
  # Anders: stuur naar index.html
  RewriteRule ^ index.html [L]
</IfModule>

# Disable directory listing
Options -Indexes

# Cache static assets (1 jaar)
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/jpg "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType image/webp "access plus 1 year"
  ExpiresByType image/svg+xml "access plus 1 year"
  ExpiresByType text/css "access plus 1 month"
  ExpiresByType application/javascript "access plus 1 month"
</IfModule>

# Compressie (optioneel)
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/css application/javascript
</IfModule>
		`.trim();

        zip.file('.htaccess', htaccess);
        console.log('✅ .htaccess toegevoegd met base path:', basePath);
        // ✅ Voeg version.json toe (SvelteKit verwacht deze)
        const versionJson = {
            version: Date.now().toString()
        };
        zip.file('version.json', JSON.stringify(versionJson)); // Root
        zip.file('_app/version.json', JSON.stringify(versionJson)); // In _app folder

        console.log('✅ version.json toegevoegd');

        // ✅ 7. Genereer ZIP
        console.log('🔄 ZIP comprimeren...');
        const zipBuffer = await zip.generateAsync({
            type: 'nodebuffer',
            compression: 'DEFLATE',
            compressionOptions: { level: 9 }
        });

        const zipSizeMB = (zipBuffer.length / 1024 / 1024).toFixed(2);
        console.log(`✅ ZIP gegenereerd (${zipSizeMB} MB)`);

        // ✅ 8. Cleanup
        await rm(buildDir, { recursive: true, force: true });
        console.log('🧹 Cleanup voltooid');

        // ✅ 9. Convert naar Uint8Array
        const uint8Array = new Uint8Array(zipBuffer);

        const filename = `${projectContent.storyName
            .replace(/[^a-z0-9]/gi, '-')
            .toLowerCase()}-export.zip`;

        // ✅ 10. Wacht voor Vite HMR
        console.log('⏳ Wacht 2 seconden voor Vite HMR...');
        await new Promise((resolve) => setTimeout(resolve, 2000));

        console.log('📤 Stuur ZIP naar browser...');
        return new Response(uint8Array, {
            status: 200,
            headers: {
                'Content-Type': 'application/zip',
                'Content-Disposition': `attachment; filename="${filename}"`,
                'Content-Length': uint8Array.length.toString(),
                'Cache-Control': 'no-cache'
            }
        });
    } catch (err: any) {
        console.error('❌ Build gefaald:', err);

        return new Response(
            JSON.stringify({
                error: true,
                message: err.message || 'Build mislukt'
            }),
            {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            }
        );
    }
};