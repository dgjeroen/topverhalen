// src/routes/cms/api/preview/+server.ts
import { json, type RequestEvent } from '@sveltejs/kit';
import { triggerPreviewHook } from '$lib/server/gist';

export async function POST({ request, cookies }: RequestEvent) {
    // Check authenticatie
    const session = cookies.get('session');
    if (!session) {
        return json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { gistId } = await request.json();

        if (!gistId) {
            return json({ error: 'Gist ID is verplicht' }, { status: 400 });
        }

        // Trigger preview webhook
        await triggerPreviewHook(gistId);

        return json({
            success: true,
            message: 'Preview wordt gebouwd',
            gistId
        });
    } catch (error) {
        console.error('Preview trigger error:', error);
        return json(
            {
                error: 'Preview trigger mislukt',
                details: error instanceof Error ? error.message : 'Onbekende fout'
            },
            { status: 500 }
        );
    }
}