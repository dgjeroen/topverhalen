// src/routes/+layout.server.ts
import { readFileSync } from 'fs';
import path from 'path';

import type { LayoutServerLoad } from './$types';
import type { ContentFile } from '$lib/types'; // Importeer je zelfgemaakte, betrouwbare type


export const load: LayoutServerLoad = async () => {
    // Bouw een pad naar het bestand vanuit de project-root. Dit is 100% betrouwbaar.
    const filePath = path.join(process.cwd(), 'src/lib/data/content.json');

    // Lees de inhoud van het bestand
    const fileContent = readFileSync(filePath, 'utf-8');

    // Parse de JSON en dwing het om te voldoen aan jouw ContentFile-type
    const contentData: ContentFile = JSON.parse(fileContent);

    // Geef de correct getypeerde data door
    return {
        content: contentData
    };
};