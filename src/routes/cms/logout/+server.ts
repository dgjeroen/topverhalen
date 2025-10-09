// src/routes/cms/logout/+server.ts
import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ cookies }) => {
    // Verwijder sessie cookie
    cookies.delete('session', { path: '/' });

    // Redirect naar login
    throw redirect(303, '/cms/login');
};