// scripts/generate-build-info.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Importeer de manifest die door SvelteKit is gegenereerd
import { manifest } from '../.svelte-kit/output/server/manifest.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Vind de informatie voor de publieke hoofdpagina ('/')
const clientEntryNode = manifest.nodes.find(node => node.id === 'src/routes/+page.svelte');

if (!clientEntryNode) {
    throw new Error("Kon de manifest-node voor 'src/routes/+page.svelte' niet vinden.");
}

// Extraheer de bestandsnamen die we nodig hebben
const buildInfo = {
    entry: clientEntryNode.file,
    css: clientEntryNode.css || []
};

// Definieer waar we ons eigen, simpele manifest-bestand willen opslaan
const outputPath = path.resolve(__dirname, '../src/lib/server/build-info.json');

// Schrijf het JSON-bestand
fs.writeFileSync(outputPath, JSON.stringify(buildInfo, null, 2));

console.log('✅ Build info gegenereerd:', outputPath);