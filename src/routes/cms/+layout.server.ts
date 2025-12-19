// src/routes/cms/+layout.server.ts
import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { verifySession } from '$lib/server/auth';

export const load: LayoutServerLoad = async ({ cookies, url }) => {
	// Uitzondering: login en auth routes
	if (url.pathname.startsWith('/cms/login') || url.pathname.startsWith('/cms/auth')) {
		return {};
	}

	// Check sessie
	const sessionId = cookies.get('session');
	const user = await verifySession(sessionId);

	if (!user) {
		throw redirect(303, '/cms/login');
	}

	return {
		user: {
			email: user.email,
			name: user.name
		}
	};
};
