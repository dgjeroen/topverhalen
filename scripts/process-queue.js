// scripts/process-queue.js
import { kv } from '@vercel/kv';
import { put } from '@vercel/blob';
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

async function getNextJob() {
    const jobId = await kv.rpop('job:queue');
    if (!jobId) return null;
    return await kv.get(`job:${jobId}`);
}

async function updateJob(jobId, updates) {
    const job = await kv.get(`job:${jobId}`);
    const updated = { ...job, ...updates };
    await kv.set(`job:${jobId}`, updated);
}

async function processJob(job) {
    console.log(`📦 Job ${job.id} voor Gist ${job.gistId}`);

    try {
        await updateJob(job.id, { status: 'building' });

        // Build
        execSync('cross-env ADAPTER=static npm run build', {
            cwd: rootDir,
            stdio: 'inherit',
            env: { ...process.env, GIST_ID: job.gistId }
        });

        // Zip
        const zipPath = path.join(rootDir, `${job.id}.zip`);
        if (process.platform === 'win32') {
            execSync(
                `powershell Compress-Archive -Path "build\\*" -DestinationPath "${zipPath}" -Force`
            );
        } else {
            execSync(`cd build && zip -r "${zipPath}" .`);
        }

        // Upload
        const blob = await put(`${job.id}.zip`, fs.createReadStream(zipPath), { access: 'public' });
        fs.unlinkSync(zipPath);

        await updateJob(job.id, {
            status: 'completed',
            completedAt: Date.now(),
            downloadUrl: blob.url
        });

        console.log(`✅ Done: ${blob.url}`);
    } catch (err) {
        await updateJob(job.id, { status: 'failed', error: err.message });
        console.error(`❌ Failed:`, err);
    }
}

async function main() {
    while (true) {
        const job = await getNextJob();
        if (!job) break;
        await processJob(job);
    }
}

main();