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

        // Backup originele config
        const originalConfig = path.join(rootDir, 'svelte.config.js');
        const staticConfig = path.join(rootDir, 'svelte.config.static.js');
        const backupConfig = path.join(rootDir, 'svelte.config.backup.js');

        // Swap configs
        fs.renameSync(originalConfig, backupConfig);
        fs.copyFileSync(staticConfig, originalConfig);

        try {
            // Build met static config EN specifieke route voor prerendering
            execSync('npm run build', {
                cwd: rootDir,
                stdio: 'inherit',
                env: {
                    ...process.env,
                    GIST_ID: job.gistId,
                }
            });
        } finally {
            // Restore originele config
            fs.renameSync(backupConfig, originalConfig);
        }
        console.log('📂 Root directory contents:');
        execSync('ls -la', { cwd: rootDir, stdio: 'inherit' });

        console.log('📂 Checking for build output...');

        const buildDir = path.join(rootDir, 'build');

        if (!fs.existsSync(buildDir)) {
            throw new Error('Build folder not found. Static build failed?');
        }

        // Check of story/index.html bestaat
        const storyDir = path.join(buildDir, 'story');
        const storyIndexPath = path.join(storyDir, 'index.html');

        if (!fs.existsSync(storyIndexPath)) {
            console.error('❌ story/index.html not found!');
            console.log('📂 Build structure:');
            execSync('find build -type f -name "*.html"', { cwd: rootDir, stdio: 'inherit' });
            throw new Error('Prerendered story/index.html not found');
        }

        console.log('✅ Found story/index.html');

        // ✅ FIX PATHS: Maak alle paths relatief
        console.log('🔧 Fixing absolute paths to relative...');
        let html = fs.readFileSync(storyIndexPath, 'utf-8');

        // Replace alle absolute paths naar parent folder
        html = html.replace(/href="\/_app\//g, 'href="../_app/');
        html = html.replace(/src="\/_app\//g, 'src="../_app/');
        html = html.replace(/href='\/_app\//g, "href='../_app/");
        html = html.replace(/src='\/_app\//g, "src='../_app/");

        fs.writeFileSync(storyIndexPath, html);
        console.log('✅ Paths fixed to relative (parent folder)');

        // Copy _app folder naar story folder (voor standalone zip)
        const appDir = path.join(buildDir, '_app');
        const targetAppDir = path.join(storyDir, '_app');

        if (fs.existsSync(appDir) && !fs.existsSync(targetAppDir)) {
            console.log('📦 Copying _app assets to story folder...');
            execSync(`cp -r "${appDir}" "${targetAppDir}"`, { cwd: rootDir, stdio: 'inherit' });
            console.log('✅ Copied _app assets');

            // Nu paths opnieuw fixen naar lokale _app (niet ../_app)
            html = fs.readFileSync(storyIndexPath, 'utf-8');
            html = html.replace(/\.\.\/_app\//g, './_app/');
            fs.writeFileSync(storyIndexPath, html);
            console.log('✅ Updated paths to local _app folder');
        }

        // Zip vanaf story folder (zodat index.html in root van zip staat)
        const zipPath = path.join(rootDir, `${job.id}.zip`);
        console.log(`📦 Creating zip from story folder...`);
        execSync(`zip -r "${zipPath}" .`, { cwd: storyDir, stdio: 'inherit' });

        if (!fs.existsSync(zipPath)) {
            throw new Error('Zip file was not created!');
        }

        const zipStats = fs.statSync(zipPath);
        console.log(`✅ Zip created: ${(zipStats.size / 1024 / 1024).toFixed(2)} MB`);

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