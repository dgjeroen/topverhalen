// src/routes/cms/auth/verify/+server.ts
import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { verifyMagicToken, createSession } from '$lib/server/auth';

export const GET: RequestHandler = async ({ url, cookies }) => {
    const token = url.searchParams.get('token');

    if (!token) {
        throw redirect(303, '/cms/login?error=invalid_token');
    }

    try {
        // Verifieer magic token
        const user = await verifyMagicToken(token);

        if (!user) {
            throw redirect(303, '/cms/login?error=expired_token');
        }

        // Maak sessie aan
        const sessionId = await createSession(user.email);

        // Zet cookie
        cookies.set('session', sessionId, {
            path: '/',
            httpOnly: true,
            sameSite: 'lax',
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24 // 24 uur
        });

        // Redirect naar CMS
        throw redirect(303, '/cms');
    } catch (err) {
        console.error('Token verification error:', err);

        if (err instanceof Error && 'status' in err && (err as any).status === 303) {
            throw err; // Re-throw redirect
        }

        throw redirect(303, '/cms/login?error=verification_failed');
    }
};