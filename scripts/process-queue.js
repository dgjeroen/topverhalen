// scripts/process-queue.js
import { Redis } from '@upstash/redis';
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Octokit } from '@octokit/rest';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
    automaticDeserialization: false
});

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

async function getNextJob() {
    const jobId = await redis.rpop('job:queue');
    if (!jobId) return null;
    const data = await redis.get(`job:${jobId}`);
    if (!data) return null;
    return typeof data === 'string' ? JSON.parse(data) : data;
}

async function updateJob(jobId, updates) {
    const data = await redis.get(`job:${jobId}`);
    if (!data) throw new Error(`Job ${jobId} not found`);
    const job = typeof data === 'string' ? JSON.parse(data) : data;
    const updated = { ...job, ...updates };
    await redis.set(`job:${jobId}`, JSON.stringify(updated));
}

async function uploadToGitHub(jobId, zipPath) {
    const [owner, repo] = process.env.GITHUB_REPOSITORY.split('/');
    const tag = `build-${jobId}`;

    const release = await octokit.repos.createRelease({
        owner,
        repo,
        tag_name: tag,
        name: `Build ${jobId.substring(0, 8)}`,
        body: 'Automated build',
        draft: false,
        prerelease: false
    });

    const fileContent = fs.readFileSync(zipPath);

    const asset = await octokit.repos.uploadReleaseAsset({
        owner,
        repo,
        release_id: release.data.id,
        name: `${jobId}.zip`,
        data: fileContent
    });

    return asset.data.browser_download_url;
}

async function processJob(job) {
    console.log(`📦 Job ${job.id} voor Gist ${job.gistId}`);

    try {
        await updateJob(job.id, { status: 'building' });

        execSync('npm run build -- --config svelte.config.static.js', {
            cwd: rootDir,
            stdio: 'inherit',
            env: {
                ...process.env,
                GIST_ID: job.gistId
            }
        });
        console.log('📂 Root directory contents:');
        execSync('ls -la', { cwd: rootDir, stdio: 'inherit' });

        console.log('📂 Checking for build output...');
        execSync('find . -name "index.html" -type f', { cwd: rootDir, stdio: 'inherit' });
        const zipPath = path.join(rootDir, `${job.id}.zip`);

        // ✅ Adapter-static output is altijd /build
        const buildDir = path.join(rootDir, 'build');

        if (!fs.existsSync(buildDir)) {
            throw new Error('Build folder not found. Static build failed?');
        }

        execSync(`zip -r "${zipPath}" .`, { cwd: buildDir });

        const downloadUrl = await uploadToGitHub(job.id, zipPath);
        fs.unlinkSync(zipPath);

        await updateJob(job.id, {
            status: 'completed',
            completedAt: Date.now(),
            downloadUrl
        });

        console.log(`✅ Done: ${downloadUrl}`);
    } catch (err) {
        await updateJob(job.id, { status: 'failed', error: err.message });
        console.error(`❌ Failed:`, err);
    }
}

async function main() {
    console.log('🚀 Worker started');
    while (true) {
        const job = await getNextJob();
        if (!job) break;
        await processJob(job);
    }
    console.log('✅ Queue empty');
}

main();