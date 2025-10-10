import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { env } from '$env/dynamic/private';

const GITHUB_TOKEN = env.SECRET_GITHUB_TOKEN;
const INDEX_GIST_ID = env.SECRET_INDEX_GIST_ID;

// ✅ GET: Haal projectenlijst op
export const GET: RequestHandler = async ({ cookies }) => {
    // Check sessie
    const sessionId = cookies.get('session');
    if (!sessionId) {
        throw error(401, 'Niet ingelogd');
    }

    try {
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
            throw new Error('Kon index niet ophalen');
        }

        const gist = await response.json();
        const content = Object.values(gist.files)[0].content;
        const data = JSON.parse(content);

        return json(data);
    } catch (err) {
        console.error('Fout bij ophalen projecten:', err);
        throw error(500, 'Kon projecten niet laden');
    }
};

// ✅ POST: Maak nieuw project
export const POST: RequestHandler = async ({ request, cookies }) => {
    const sessionId = cookies.get('session');
    if (!sessionId) {
        throw error(401, 'Niet ingelogd');
    }

    try {
        const { name } = await request.json();

        if (!name || typeof name !== 'string') {
            throw error(400, 'Projectnaam is verplicht');
        }

        // Maak nieuwe Gist
        const createResponse = await fetch('https://api.github.com/gists', {
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
                        content: JSON.stringify({
                            version: 0,
                            storyName: name,
                            theme: {},
                            data: []
                        }, null, 2)
                    }
                }
            })
        });

        if (!createResponse.ok) {
            throw new Error('Kon Gist niet aanmaken');
        }

        const newGist = await createResponse.json();

        // Update index
        const indexResponse = await fetch(
            `https://api.github.com/gists/${INDEX_GIST_ID}`,
            {
                headers: {
                    'Authorization': `token ${GITHUB_TOKEN}`,
                    'Accept': 'application/vnd.github.v3+json'
                }
            }
        );

        const indexGist = await indexResponse.json();
        const indexContent = JSON.parse(Object.values(indexGist.files)[0].content);

        indexContent.projects.push({
            name,
            id: newGist.id
        });

        await fetch(
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
                            content: JSON.stringify(indexContent, null, 2)
                        }
                    }
                })
            }
        );

        return json({ id: newGist.id });
    } catch (err) {
        console.error('Fout bij aanmaken project:', err);
        throw error(500, 'Kon project niet aanmaken');
    }
};