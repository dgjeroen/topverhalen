// src/lib/server/auth.ts
import { nanoid } from 'nanoid';
import jwt from 'jsonwebtoken';
import { env } from '$env/dynamic/private';

interface Session {
    email: string;
    name: string;
    expiresAt: number;
}

interface MagicTokenPayload {
    email: string;
    exp: number;
}

// ❌ VERWIJDER: const sessions = new Map<string, Session>();

const getAuthSecret = (): string => {
    const secret = env.AUTH_SECRET;
    if (!secret) {
        throw new Error('AUTH_SECRET is niet ingesteld');
    }
    return secret;
};

// ✅ NIEUW: Maak JWT-based session
export async function createSession(email: string): Promise<string> {
    const name = email.split('@')[0];
    const expiresAt = Date.now() + 24 * 60 * 60 * 1000;

    // Maak JWT met session data
    const sessionToken = jwt.sign(
        { email, name, expiresAt },
        getAuthSecret(),
        { expiresIn: '24h' }
    );

    return sessionToken;
}

// ✅ NIEUW: Verifieer JWT-based session
export async function verifySession(sessionToken: string | undefined): Promise<Session | null> {
    if (!sessionToken) return null;

    try {
        const decoded = jwt.verify(sessionToken, getAuthSecret()) as Session;

        // Check expiratie
        if (Date.now() > decoded.expiresAt) {
            return null;
        }

        return decoded;
    } catch (error) {
        console.error('Session verification failed:', error);
        return null;
    }
}

// ✅ AANGEPAST: destroySession is nu no-op (JWT kan niet worden ingetrokken)
export function destroySession(sessionId: string): void {
    // JWT sessions kunnen niet server-side worden vernietigd
    // Cookie wordt client-side verwijderd
}

export async function createMagicToken(email: string): Promise<string> {
    const payload: MagicTokenPayload = {
        email,
        exp: Math.floor(Date.now() / 1000) + (15 * 60)
    };

    const token = jwt.sign(payload, getAuthSecret());
    return token;
}

export async function verifyMagicToken(token: string): Promise<Session | null> {
    try {
        const payload = jwt.verify(token, getAuthSecret()) as MagicTokenPayload;

        const name = payload.email.split('@')[0];

        return {
            email: payload.email,
            name,
            expiresAt: payload.exp * 1000
        };
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            console.log('Magic token expired');
        } else if (error instanceof jwt.JsonWebTokenError) {
            console.error('Invalid magic token:', error.message);
        } else {
            console.error('Magic token verification failed:', error);
        }
        return null;
    }
}

export function isAllowedEmail(email: string, allowedDomain: string): boolean {
    const allowedDomains = [
        'persgroep.net',
        'gelderlander.nl',
        'ad.nl',
        'bd.nl',
        'tubantia.nl',
        'ed.nl',
        'pzc.nl',
        'bndestem.nl',
        'destentor.nl'
    ];

    return allowedDomains.some(domain => email.endsWith(`@${domain}`));
}