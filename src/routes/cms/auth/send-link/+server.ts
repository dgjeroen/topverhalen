// src/routes/cms/auth/send-link/+server.ts
import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { createMagicToken, isAllowedEmail } from '$lib/server/auth';
import { sendMagicLink } from '$lib/server/email';

const ALLOWED_EMAIL_DOMAIN = process.env.ALLOWED_EMAIL_DOMAIN || 'persgroep.net';

export const POST: RequestHandler = async ({ request, url }) => {
    try {
        const { email } = await request.json();

        // Validatie
        if (!email || typeof email !== 'string') {
            throw error(400, 'Email is verplicht');
        }

        // Check of email toegestaan is
        if (!isAllowedEmail(email, ALLOWED_EMAIL_DOMAIN)) {
            throw error(403, `Alleen @${ALLOWED_EMAIL_DOMAIN} emails zijn toegestaan`);
        }

        // Maak magic token aan
        const token = await createMagicToken(email);

        // Verstuur email
        const baseUrl = url.origin;
        await sendMagicLink(email, token, baseUrl);

        return json({ success: true });
    } catch (err) {
        console.error('Magic link send error:', err);

        if (err instanceof Error && 'status' in err) {
            throw err;
        }

        throw error(500, 'Kon magic link niet versturen');
    }
};