// scripts/generate-build-info.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { manifest } from '../.svelte-kit/output/server/manifest.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// 🔧 FIX: Zoek naar de route-ID '/' in plaats van de bestandsnaam.
const clientEntryNode = manifest._.nodes.find(node => node.id === '/');

if (!clientEntryNode) {
    console.error("Manifest structuur:", JSON.stringify(manifest, null, 2));
    throw new Error("Kon de manifest-node voor de root route ('/') niet vinden. Zie de log hierboven.");
}

const buildInfo = {
    entry: clientEntryNode.file,
    css: clientEntryNode.css || []
};

const outputPath = path.resolve(__dirname, '../src/lib/server/build-info.json');

fs.writeFileSync(outputPath, JSON.stringify(buildInfo, null, 2));

console.log('✅ Build info succesvol gegenereerd voor root route:', outputPath);