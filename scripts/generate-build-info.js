// scripts/generate-build-info.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Importeer de manifest die door SvelteKit is gegenereerd
import { manifest } from '../.svelte-kit/output/server/manifest.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const clientEntryNode = manifest._.nodes.find(node => node.id === 'src/routes/+page.svelte');

if (!clientEntryNode) {
    console.error("Manifest structuur:", JSON.stringify(manifest, null, 2));
    throw new Error("Kon de manifest-node voor 'src/routes/+page.svelte' niet vinden in `manifest._.nodes`. Zie de log hierboven.");
}

const buildInfo = {
    entry: clientEntryNode.file,
    css: clientEntryNode.css || []
};

const outputPath = path.resolve(__dirname, '../src/lib/server/build-info.json');

fs.writeFileSync(outputPath, JSON.stringify(buildInfo, null, 2));

console.log('✅ Build info succesvol gegenereerd:', outputPath);