// src/lib/server/gist.ts

// ✅ SSL bypass voor development
if (process.env.NODE_ENV === 'development') {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
}

import { env } from '$env/dynamic/private';

const GITHUB_TOKEN = env.SECRET_GITHUB_TOKEN!;
const INDEX_GIST_ID = env.SECRET_INDEX_GIST_ID!;

export interface Project {
    name: string;
    id: string;
}

export interface ProjectIndex {
    projects: Project[];
}

export interface ProjectContent {
    version: number;
    storyName: string;
    gistId?: string;
    theme: Record<string, any>;
    data: any[];
}

export interface UpdateResult {
    success: boolean;
    rateLimit: {
        remaining: number;
        limit: number;
        reset: number;
    };
}

// ✅ Haal project index op
export async function getProjectsIndex(): Promise<ProjectIndex> {
    const response = await fetch(`https://api.github.com/gists/${INDEX_GIST_ID}`, {
        headers: {
            Authorization: `token ${GITHUB_TOKEN}`,
            Accept: 'application/vnd.github.v3+json'
        }
    });

    if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Index niet gevonden`);
    }

    const gist = await response.json();
    const fileContent = Object.values(gist.files)[0] as { content: string };
    return JSON.parse(fileContent.content);
}

// ✅ Update project index
export async function updateProjectsIndex(data: ProjectIndex): Promise<void> {
    const response = await fetch(`https://api.github.com/gists/${INDEX_GIST_ID}`, {
        method: 'PATCH',
        headers: {
            Authorization: `token ${GITHUB_TOKEN}`,
            Accept: 'application/vnd.github.v3+json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            files: {
                'project-index.json': {
                    content: JSON.stringify(data, null, 2)
                }
            }
        })
    });

    if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Index updaten mislukt`);
    }
}

// ✅ Haal project content op
export async function getGist(id: string): Promise<ProjectContent> {
    const response = await fetch(`https://api.github.com/gists/${id}`, {
        headers: {
            Authorization: `token ${GITHUB_TOKEN}`,
            Accept: 'application/vnd.github.v3+json'
        }
    });

    if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Gist niet gevonden`);
    }

    const gist = await response.json();
    const fileContent = Object.values(gist.files)[0] as { content: string };
    return JSON.parse(fileContent.content);
}

// ✅ Maak nieuwe Gist
export async function createGist(
    name: string,
    content: ProjectContent
): Promise<{ id: string }> {
    const response = await fetch('https://api.github.com/gists', {
        method: 'POST',
        headers: {
            Authorization: `token ${GITHUB_TOKEN}`,
            Accept: 'application/vnd.github.v3+json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            description: `Project: ${name}`,
            public: false,
            files: {
                'content.json': {
                    content: JSON.stringify(content, null, 2)
                }
            }
        })
    });

    if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Gist aanmaken mislukt`);
    }

    const gist = await response.json();
    return { id: gist.id };
}

// ✅ Update bestaande Gist - ENTERPRISE VERSIE met retry + rate limit monitoring
export async function updateGist(id: string, content: ProjectContent): Promise<UpdateResult> {
    const maxRetries = 5;
    const baseDelay = 2000;
    let lastError: Error | null = null;
    let lastRateLimit = { remaining: 5000, limit: 5000, reset: 0 };

    for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
            const response = await fetch(`https://api.github.com/gists/${id}`, {
                method: 'PATCH',
                headers: {
                    Authorization: `token ${GITHUB_TOKEN}`,
                    Accept: 'application/vnd.github.v3+json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    files: {
                        'content.json': {
                            content: JSON.stringify(content, null, 2)
                        }
                    }
                })
            });

            // ✅ Extract rate limit headers
            lastRateLimit = {
                remaining: parseInt(response.headers.get('X-RateLimit-Remaining') || '5000'),
                limit: parseInt(response.headers.get('X-RateLimit-Limit') || '5000'),
                reset: parseInt(response.headers.get('X-RateLimit-Reset') || '0')
            };

            // ✅ Log rate limit status
            const usagePercent = ((lastRateLimit.limit - lastRateLimit.remaining) / lastRateLimit.limit) * 100;
            if (usagePercent > 80) {
                console.warn(
                    `⚠️ Rate limit high: ${lastRateLimit.remaining}/${lastRateLimit.limit} (${Math.round(usagePercent)}%)`
                );
            }

            // ✅ Handle rate limit errors (403 or 429)
            if (response.status === 403 || response.status === 429) {
                const retryAfter = parseInt(response.headers.get('Retry-After') || '60');
                const delay = Math.max(baseDelay * Math.pow(2, attempt), retryAfter * 1000);
                const maxDelay = 60000; // Max 1 minuut wachten
                const actualDelay = Math.min(delay, maxDelay);

                console.warn(
                    `⚠️ Rate limited (${response.status}), retry ${attempt + 1}/${maxRetries} in ${actualDelay}ms`
                );

                if (attempt < maxRetries - 1) {
                    await new Promise((resolve) => setTimeout(resolve, actualDelay));
                    continue;
                } else {
                    throw new Error(
                        `Rate limit bereikt. Probeer over ${Math.ceil(retryAfter / 60)} minuten opnieuw.`
                    );
                }
            }

            // ✅ Handle 409 conflicts (concurrent edits)
            if (response.status === 409) {
                const delay = Math.min(1000 * Math.pow(2, attempt), 5000);
                console.warn(`⚠️ Gist conflict (attempt ${attempt + 1}/${maxRetries}), retrying in ${delay}ms...`);

                if (attempt < maxRetries - 1) {
                    await new Promise((resolve) => setTimeout(resolve, delay));
                    continue;
                }
            }

            // ✅ Other errors
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`HTTP ${response.status}: ${errorText}`);
            }

            // ✅ Success!
            if (attempt > 0) {
                console.log(`✅ Gist updated successfully after ${attempt + 1} attempts`);
            }

            return {
                success: true,
                rateLimit: lastRateLimit
            };
        } catch (error) {
            lastError = error as Error;

            // Als het de laatste poging is, stop
            if (attempt === maxRetries - 1) {
                break;
            }

            // Anders: Retry na delay
            const delay = Math.min(baseDelay * Math.pow(2, attempt), 10000);
            console.warn(`⚠️ Update failed (attempt ${attempt + 1}/${maxRetries}): ${lastError.message}`);
            console.warn(`    Retrying in ${delay}ms...`);
            await new Promise((resolve) => setTimeout(resolve, delay));
        }
    }

    // Alle retries gefaald
    throw new Error(`Failed to update gist after ${maxRetries} attempts: ${lastError?.message}`);
}

// ✅ Trigger deploy webhook
export async function triggerDeployHook(gistId: string): Promise<void> {
    const webhookUrl = env.VERCEL_DEPLOY_WEBHOOK;
    if (!webhookUrl) {
        console.warn('⚠️ Deploy webhook niet ingesteld');
        return;
    }

    const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            gistId,
            timestamp: new Date().toISOString()
        })
    });

    if (!response.ok) {
        throw new Error(`Deploy trigger mislukt: ${response.status}`);
    }
}

// ✅ Trigger preview webhook
export async function triggerPreviewHook(gistId: string): Promise<void> {
    const webhookUrl = env.VERCEL_PREVIEW_WEBHOOK;
    if (!webhookUrl) {
        console.warn('⚠️ Preview webhook niet ingesteld');
        return;
    }

    const urlWithEnv = `${webhookUrl}?env_PREVIEW_GIST_ID=${gistId}`;

    const response = await fetch(urlWithEnv, {
        method: 'POST'
    });

    if (!response.ok) {
        throw new Error(`Preview trigger mislukt: ${response.status}`);
    }
}