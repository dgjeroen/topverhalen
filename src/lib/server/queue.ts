// src/lib/server/queue.ts

import { dev } from '$app/environment';
import { Redis } from '@upstash/redis';
import { Octokit } from '@octokit/rest';

export type JobStatus = 'pending' | 'building' | 'completed' | 'failed';

export interface PublishJob {
	id: string;
	gistId: string;
	status: JobStatus;
	createdAt: number;
	completedAt?: number;
	downloadUrl?: string;
	error?: string;
}

// Dev: In-memory
const devJobs = new Map<string, PublishJob>();
const devQueue: string[] = [];

// Prod: Upstash Redis
let redis: Redis | null = null;

async function getRedis() {
	if (!redis && !dev) {
		redis = new Redis({
			url: process.env.UPSTASH_REDIS_REST_URL!,
			token: process.env.UPSTASH_REDIS_REST_TOKEN!,
			automaticDeserialization: false
		});
	}
	return redis;
}

// ✅ NIEUW: Detecteer huidige branch
function getCurrentBranch(): string {
	// Vercel deployments hebben deze env var
	if (process.env.VERCEL_GIT_COMMIT_REF) {
		const branch = process.env.VERCEL_GIT_COMMIT_REF;
		console.log(`🌿 Detected branch from Vercel: ${branch}`);
		return branch;
	}

	// Fallback voor manual runs, cron, etc.
	console.log('🌿 No Vercel branch detected, using main');
	return 'main';
}

export async function createJob(gistId: string): Promise<string> {
	const jobId = crypto.randomUUID();
	const job: PublishJob = {
		id: jobId,
		gistId,
		status: 'pending',
		createdAt: Date.now()
	};

	if (dev) {
		devJobs.set(jobId, job);
		devQueue.push(jobId);
		console.log(`[DEV] Job ${jobId} aangemaakt`);
	} else {
		const r = await getRedis();
		await r!.set(`job:${jobId}`, JSON.stringify(job));
		await r!.lpush('job:queue', jobId);
	}

	return jobId;
}

export async function getJob(jobId: string): Promise<PublishJob | null> {
	if (dev) {
		return devJobs.get(jobId) || null;
	} else {
		const r = await getRedis();
		const data = await r!.get(`job:${jobId}`);
		if (!data) return null;
		return JSON.parse(data as string);
	}
}

export async function updateJob(jobId: string, updates: Partial<PublishJob>): Promise<void> {
	const job = await getJob(jobId);
	if (!job) throw new Error(`Job ${jobId} niet gevonden`);

	const updated = { ...job, ...updates };

	if (dev) {
		devJobs.set(jobId, updated);
		console.log(`[DEV] Job ${jobId} updated:`, updates);
	} else {
		const r = await getRedis();
		await r!.set(`job:${jobId}`, JSON.stringify(updated));
	}
}

export async function getNextJob(): Promise<string | null> {
	if (dev) {
		return devQueue.shift() || null;
	} else {
		const r = await getRedis();
		return (await r!.rpop('job:queue')) as string | null;
	}
}

export async function simulateJobCompletion(jobId: string, success: boolean = true) {
	if (!dev) return;
	await new Promise((resolve) => setTimeout(resolve, 5000));

	if (success) {
		await updateJob(jobId, {
			status: 'completed',
			completedAt: Date.now(),
			downloadUrl: 'https://example.com/mock-download.zip'
		});
		console.log(`[DEV] Job ${jobId} completed`);
	} else {
		await updateJob(jobId, {
			status: 'failed',
			error: 'Gesimuleerde fout'
		});
	}
}

// ✅ UPDATED: Dynamic branch detection
export async function triggerWorkflow(jobId: string): Promise<void> {
	if (dev) {
		console.log(`[DEV] Would trigger workflow for job ${jobId}`);
		return;
	}

	const octokit = new Octokit({
		auth: process.env.SECRET_GITHUB_TOKEN
	});

	const branch = getCurrentBranch();

	try {
		await octokit.actions.createWorkflowDispatch({
			owner: 'dgjeroen',
			repo: 'topverhalen',
			workflow_id: 'build-worker.yml',
			ref: branch, // ✅ DYNAMIC
			inputs: {
				jobId: jobId
			}
		});
		console.log(`✅ Workflow triggered for job ${jobId} on branch ${branch}`);
	} catch (err) {
		console.error(`❌ Failed to trigger workflow on ${branch}:`, err);
		throw err;
	}
}
