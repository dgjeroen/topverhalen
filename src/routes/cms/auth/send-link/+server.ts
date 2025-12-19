// src/routes/cms/auth/send-link/+server.ts
import { json, error } from '@sveltejs/kit';
import { dev } from '$app/environment';
import type { RequestHandler } from './$types';
import { createMagicToken, isAllowedEmail } from '$lib/server/auth';
import { sendMagicLink } from '$lib/server/email';
import { env } from '$env/dynamic/private';

export const POST: RequestHandler = async ({ request, url }) => {
	try {
		const { email } = await request.json();

		// Validatie
		if (!email || typeof email !== 'string') {
			throw error(400, 'Email is verplicht');
		}

		// ✅ Gebruik $env/dynamic/private
		const allowedDomain = env.ALLOWED_EMAIL_DOMAIN || 'persgroep.net';

		// Check of email toegestaan is
		if (!isAllowedEmail(email, allowedDomain)) {
			throw error(403, `Alleen @${allowedDomain} emails zijn toegestaan`);
		}

		// Maak magic token aan
		const token = await createMagicToken(email);

		const baseUrl = url.origin;

		await sendMagicLink(email, token, baseUrl);

		return json({ success: true });

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
