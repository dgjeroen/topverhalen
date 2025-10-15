// scripts/generate-build-info.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { manifest } from '../.svelte-kit/output/server/manifest.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Zoek naar de node voor onze geïsoleerde template route
const templateNode = manifest._.nodes.find(node => node.id === '/publish-templates');

if (!templateNode) {
    throw new Error("FATALE FOUT: Kon de node voor '/publish-templates' niet vinden. Controleer de mapnaam en de `+layout.svelte` reset.");
}

// Sla alleen de bestandsnamen op die we nodig hebben
const buildInfo = {
    entry: templateNode.file,
    css: templateNode.css || []
};

const outputPath = path.resolve(__dirname, '../src/lib/server/build-info.json');
fs.writeFileSync(outputPath, JSON.stringify(buildInfo, null, 2));

console.log('✅ Publicatie-info is succesvol gegenereerd.');