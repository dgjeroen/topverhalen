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

const sessions = new Map<string, Session>();

// ✅ Gebruik $env/dynamic/private
const getAuthSecret = (): string => {
    const secret = env.AUTH_SECRET;
    if (!secret) {
        throw new Error('AUTH_SECRET is niet ingesteld');
    }
    return secret;
};

export async function createSession(email: string): Promise<string> {
    const sessionId = nanoid(32);
    const name = email.split('@')[0];
    const expiresAt = Date.now() + 24 * 60 * 60 * 1000;

    sessions.set(sessionId, { email, name, expiresAt });
    return sessionId;
}

export async function verifySession(sessionId: string | undefined): Promise<Session | null> {
    if (!sessionId) return null;

    const session = sessions.get(sessionId);
    if (!session) return null;

    if (Date.now() > session.expiresAt) {
        sessions.delete(sessionId);
        return null;
    }

    return session;
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
    return email.endsWith(`@${allowedDomain}`);
}