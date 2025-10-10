// src/lib/server/gist.ts
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

// ✅ Haal project index op
export async function getProjectsIndex(): Promise<ProjectIndex> {
    const response = await fetch(
        `https://api.github.com/gists/${INDEX_GIST_ID}`,
        {
            headers: {
                'Authorization': `token ${GITHUB_TOKEN}`,
                'Accept': 'application/vnd.github.v3+json'
            }
        }
    );

    if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Index niet gevonden`);
    }

    const gist = await response.json();
    return JSON.parse(Object.values(gist.files)[0].content);
}

// ✅ Update project index
export async function updateProjectsIndex(data: ProjectIndex): Promise<void> {
    const response = await fetch(
        `https://api.github.com/gists/${INDEX_GIST_ID}`,
        {
            method: 'PATCH',
            headers: {
                'Authorization': `token ${GITHUB_TOKEN}`,
                'Accept': 'application/vnd.github.v3+json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                files: {
                    'project-index.json': {
                        content: JSON.stringify(data, null, 2)
                    }
                }
            })
        }
    );

    if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Index updaten mislukt`);
    }
}

// ✅ Haal project content op
export async function getGist(id: string): Promise<ProjectContent> {
    const response = await fetch(
        `https://api.github.com/gists/${id}`,
        {
            headers: {
                'Authorization': `token ${GITHUB_TOKEN}`,
                'Accept': 'application/vnd.github.v3+json'
            }
        }
    );

    if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Gist niet gevonden`);
    }

    const gist = await response.json();
    return JSON.parse(Object.values(gist.files)[0].content);
}

// ✅ Maak nieuwe Gist
export async function createGist(name: string, content: ProjectContent): Promise<{ id: string }> {
    const response = await fetch('https://api.github.com/gists', {
        method: 'POST',
        headers: {
            'Authorization': `token ${GITHUB_TOKEN}`,
            'Accept': 'application/vnd.github.v3+json',
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

// ✅ Update bestaande Gist
export async function updateGist(id: string, content: ProjectContent): Promise<void> {
    const response = await fetch(
        `https://api.github.com/gists/${id}`,
        {
            method: 'PATCH',
            headers: {
                'Authorization': `token ${GITHUB_TOKEN}`,
                'Accept': 'application/vnd.github.v3+json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                files: {
                    'content.json': {
                        content: JSON.stringify(content, null, 2)
                    }
                }
            })
        }
    );

    if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Gist updaten mislukt`);
    }
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

    const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            gistId,
            timestamp: new Date().toISOString()
        })
    });

    if (!response.ok) {
        throw new Error(`Preview trigger mislukt: ${response.status}`);
    }
}