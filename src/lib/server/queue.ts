// src/lib/server/queue.ts
import { dev } from '$app/environment';

/**
 * Job statussen voor async build process
 */
export type JobStatus = 'pending' | 'building' | 'completed' | 'failed';

/**
 * Publish job data structure
 */
export interface PublishJob {
    id: string;
    gistId: string;
    status: JobStatus;
    createdAt: number;
    completedAt?: number;
    downloadUrl?: string;
    error?: string;
}

// ✅ Development: In-memory store
const devJobs = new Map<string, PublishJob>();
const devQueue: string[] = [];

// ✅ Production: Vercel KV (lazy loaded)
let kv: any = null;

async function getKV() {
    if (!kv && !dev) {
        const { kv: vercelKV } = await import('@vercel/kv');
        kv = vercelKV;
    }
    return kv;
}

/**
 * Maak een nieuwe publish job aan
 * @param gistId - ID van de Gist die gepubliceerd moet worden
 * @returns Job ID voor tracking
 */
export async function createJob(gistId: string): Promise<string> {
    const jobId = crypto.randomUUID();

    const job: PublishJob = {
        id: jobId,
        gistId,
        status: 'pending',
        createdAt: Date.now()
    };

    if (dev) {
        // ✅ Development: In-memory
        devJobs.set(jobId, job);
        devQueue.push(jobId);
        console.log(`[DEV] Job ${jobId} aangemaakt voor Gist ${gistId}`);
    } else {
        // ✅ Production: Vercel KV
        const kvStore = await getKV();
        await kvStore.set(`job:${jobId}`, job);
        await kvStore.lpush('job:queue', jobId);
    }

    return jobId;
}

/**
 * Haal job details op
 * @param jobId - Unieke job identifier
 */
export async function getJob(jobId: string): Promise<PublishJob | null> {
    if (dev) {
        // ✅ Development: In-memory
        return devJobs.get(jobId) || null;
    } else {
        // ✅ Production: Vercel KV
        const kvStore = await getKV();
        return await kvStore.get(`job:${jobId}`);
    }
}

/**
 * Update job status en metadata
 * @param jobId - Job om te updaten
 * @param updates - Partial updates (status, downloadUrl, etc.)
 */
export async function updateJob(jobId: string, updates: Partial<PublishJob>): Promise<void> {
    const job = await getJob(jobId);

    if (!job) {
        throw new Error(`Job ${jobId} niet gevonden`);
    }

    const updated: PublishJob = {
        ...job,
        ...updates
    };

    if (dev) {
        // ✅ Development: In-memory
        devJobs.set(jobId, updated);
        console.log(`[DEV] Job ${jobId} updated:`, updates);
    } else {
        // ✅ Production: Vercel KV
        const kvStore = await getKV();
        await kvStore.set(`job:${jobId}`, updated);
    }
}

/**
 * Haal volgende job uit wachtrij (voor worker)
 * @returns Job ID of null als wachtrij leeg is
 */
export async function getNextJob(): Promise<string | null> {
    if (dev) {
        // ✅ Development: In-memory
        return devQueue.shift() || null;
    } else {
        // ✅ Production: Vercel KV
        const kvStore = await getKV();
        return await kvStore.rpop('job:queue');
    }
}

/**
 * [DEV ONLY] Simuleer job completion (voor testen)
 */
export async function simulateJobCompletion(jobId: string, success: boolean = true) {
    if (!dev) return;

    await new Promise((resolve) => setTimeout(resolve, 5000)); // 5s delay

    if (success) {
        await updateJob(jobId, {
            status: 'completed',
            completedAt: Date.now(),
            downloadUrl: 'https://example.com/mock-download.zip'
        });
        console.log(`[DEV] Job ${jobId} gesimuleerd als completed`);
    } else {
        await updateJob(jobId, {
            status: 'failed',
            error: 'Gesimuleerde fout voor testing'
        });
        console.log(`[DEV] Job ${jobId} gesimuleerd als failed`);
    }
}