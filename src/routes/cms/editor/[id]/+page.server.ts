// src/routes/cms/editor/[id]/+page.server.ts

import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getGist } from '$lib/server/gist';
import { verifySession } from '$lib/server/auth';

// Apply default theme values for components
function applyThemeDefaults(theme: any) {
    if (!theme) theme = {};

    // Quote defaults
    if (!theme['quote-color']) theme['quote-color'] = '#000000';
    if (!theme['quote-background']) theme['quote-background'] = '#EDEAEC';
    if (!theme['quote-border-color']) theme['quote-border-color'] = '#D10A10';
    if (!theme['quote-mark-color']) theme['quote-mark-color'] = '#6E757C';
    if (!theme['quote-author-color']) theme['quote-author-color'] = '#6E757C';

    // SubheadingSoccer defaults
    if (!theme['subheading-soccer-bg']) theme['subheading-soccer-bg'] = '#000000';
    if (!theme['subheading-soccer-color']) theme['subheading-soccer-color'] = '#ffffff';

    // Audio defaults
    if (!theme['audio-bg-color']) theme['audio-bg-color'] = '#EDEAEC';
    if (!theme['audio-title-color']) theme['audio-title-color'] = '#000000';
    if (!theme['audio-description-color']) theme['audio-description-color'] = '#32302c';
    if (!theme['audio-button-border-color']) theme['audio-button-border-color'] = '#6E757C';
    if (!theme['audio-button-hover-bg']) theme['audio-button-hover-bg'] = '#E1DEE0';
    if (!theme['audio-button-icon-color']) theme['audio-button-icon-color'] = '#6E757C';
    if (!theme['audio-progress-bg']) theme['audio-progress-bg'] = '#6E757C';
    if (!theme['audio-progress-fill-color']) theme['audio-progress-fill-color'] = '#D10A10';
    if (!theme['audio-time-color']) theme['audio-time-color'] = '#000000';

    return theme;
}

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

        // Apply theme defaults
        project.theme = applyThemeDefaults(project.theme);

        return {
            project,
            gistId: params.id
        };
    } catch (err) {
        console.error('Fout bij laden project:', err);
        throw error(404, 'Project niet gevonden');
    }
};