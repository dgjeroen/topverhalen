// src/routes/+layout.server.ts
import { readFileSync } from 'fs';
import { existsSync } from 'fs';
import path from 'path';

import type { LayoutServerLoad } from './$types';
import type { ContentFile } from '$lib/types';

export const load: LayoutServerLoad = async ({ url }) => {
	// Skip content loading voor CMS routes
	if (url.pathname.startsWith('/cms')) {
		return {};
	}

	// Alleen laden voor story routes
	const filePath = path.join(process.cwd(), 'src/lib/data/content.json');

	// Check of bestand bestaat (voor Vercel compatibility)
	if (!existsSync(filePath)) {
		console.warn('content.json niet gevonden, skip laden');
		return {};
	}

	const fileContent = readFileSync(filePath, 'utf-8');
	const contentData: ContentFile = JSON.parse(fileContent);

	return {
		content: contentData
	};
};
