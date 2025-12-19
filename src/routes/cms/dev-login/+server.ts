// src/routes/cms/dev-login/+server.ts

import { redirect } from '@sveltejs/kit';
import { dev } from '$app/environment';
import type { RequestHandler } from './$types';
import { createSession } from '$lib/server/auth';

export const GET: RequestHandler = async ({ cookies }) => {
	// ⚠️ ALLEEN in development mode!
	if (!dev) {
		throw redirect(303, '/cms/login');
	}

	// Maak sessie voor test gebruiker
	const sessionId = await createSession('test@persgroep.net');

	cookies.set('session', sessionId, {
		path: '/',
		httpOnly: true,
		sameSite: 'lax',
		maxAge: 60 * 60 * 24
	});

	throw redirect(303, '/cms');
};
