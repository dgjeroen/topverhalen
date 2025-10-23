// src/lib/server/storage.ts
import { put } from '@vercel/blob';
import { createReadStream } from 'fs';

/**
 * Upload .zip bestand naar Vercel Blob storage
 * @param jobId - Unieke identifier voor bestandsnaam
 * @param filePath - Lokaal pad naar .zip bestand
 * @returns Publieke download URL
 */
export async function uploadZip(jobId: string, filePath: string): Promise<string> {
    const blob = await put(`${jobId}.zip`, createReadStream(filePath), {
        access: 'public',
        addRandomSuffix: false
    });

    return blob.url;
}