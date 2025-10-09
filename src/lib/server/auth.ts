// src/lib/server/auth.ts
import { nanoid } from 'nanoid';

interface Session {
    email: string;
    name: string;
    expiresAt: number;
}

// In-memory store (voor productie: gebruik database)
const sessions = new Map<string, Session>();
const magicTokens = new Map<string, Session>();

export async function createSession(email: string): Promise<string> {
    const sessionId = nanoid(32);
    const name = email.split('@')[0];
    const expiresAt = Date.now() + 24 * 60 * 60 * 1000; // 24 uur

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
    const token = nanoid(32);
    const name = email.split('@')[0];
    const expiresAt = Date.now() + 15 * 60 * 1000; // 15 minuten

    magicTokens.set(token, { email, name, expiresAt });
    return token;
}

export async function verifyMagicToken(token: string): Promise<Session | null> {
    const session = magicTokens.get(token);
    if (!session) return null;

    if (Date.now() > session.expiresAt) {
        magicTokens.delete(token);
        return null;
    }

    // Verwijder token (eenmalig gebruik)
    magicTokens.delete(token);
    return session;
}

export function isAllowedEmail(email: string, allowedDomain: string): boolean {
    return email.endsWith(`@${allowedDomain}`);
}