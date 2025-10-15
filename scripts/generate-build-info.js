// scripts/generate-build-info.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Belangrijk: we importeren het manifest dat gegarandeerd bestaat na de build.
import { manifest } from '../.svelte-kit/output/server/manifest.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// We zoeken naar onze speciale, statische template-pagina.
const templateNode = manifest._.nodes.find(node => node.id === '/publish-template');

if (!templateNode) {
    throw new Error("FATALE FOUT: Kon de node voor '/publish-template' niet vinden in het build-manifest.");
}

// We slaan alleen de bestandsnamen op die we nodig hebben.
const buildInfo = {
    entry: templateNode.file,
    css: templateNode.css || []
};

const outputPath = path.resolve(__dirname, '../src/lib/server/build-info.json');
fs.writeFileSync(outputPath, JSON.stringify(buildInfo, null, 2));

console.log('✅ Publicatie-info succesvol gegenereerd.');