import { del } from '@vercel/blob';

/**
 * Utility functions for cleaning up old images from Vercel Blob Storage
 * when content is updated in the CMS.
 */

// Check if URL is a Vercel Blob URL
export function isVercelBlobUrl(url: string): boolean {
    if (!url) return false;
    return url.includes('blob.vercel-storage.com') || url.includes('.public.blob.vercel-storage.com');
}

// Extract all image URLs from any object structure
export function extractImageUrls(obj: unknown, urls: Set<string> = new Set()): Set<string> {
    if (!obj) return urls;

    if (typeof obj === 'string') {
        // Check if it's a URL that looks like an image
        if (isVercelBlobUrl(obj) && /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(obj)) {
            urls.add(obj);
        }
        return urls;
    }

    if (Array.isArray(obj)) {
        for (const item of obj) {
            extractImageUrls(item, urls);
        }
        return urls;
    }

    if (typeof obj === 'object') {
        for (const key of Object.keys(obj as Record<string, unknown>)) {
            // Look for common image field names
            const value = (obj as Record<string, unknown>)[key];
            if (
                key.toLowerCase().includes('image') ||
                key.toLowerCase().includes('logo') ||
                key.toLowerCase().includes('photo') ||
                key.toLowerCase().includes('icon') ||
                key.toLowerCase().includes('url')
            ) {
                if (typeof value === 'string' && isVercelBlobUrl(value)) {
                    urls.add(value);
                }
            }
            // Recursively check nested objects
            extractImageUrls(value, urls);
        }
    }

    return urls;
}

/**
 * Delete old images that are no longer referenced in the new content
 * @param oldContent - The previous content object
 * @param newContent - The new content object
 * @returns Array of deleted URLs and any errors
 */
export async function cleanupUnusedImages(
    oldContent: unknown,
    newContent: unknown
): Promise<{ deleted: string[]; errors: string[] }> {
    const oldUrls = extractImageUrls(oldContent);
    const newUrls = extractImageUrls(newContent);

    // Find URLs that were in old content but not in new content
    const urlsToDelete: string[] = [];
    const oldUrlsArray = Array.from(oldUrls);
    for (const url of oldUrlsArray) {
        if (!newUrls.has(url)) {
            urlsToDelete.push(url);
        }
    }

    const deleted: string[] = [];
    const errors: string[] = [];

    // Delete each unused image
    for (const url of urlsToDelete) {
        try {
            await del(url);
            deleted.push(url);
            console.log(`✓ Deleted unused image from Blob: ${url}`);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            errors.push(`Failed to delete ${url}: ${errorMessage}`);
            console.warn(`⚠ Failed to delete image from Blob: ${url}`, errorMessage);
        }
    }

    return { deleted, errors };
}

/**
 * Delete a single image from Blob Storage
 * @param url - The URL of the image to delete
 * @returns true if deleted successfully, false otherwise
 */
export async function deleteImageFromBlob(url: string): Promise<boolean> {
    if (!isVercelBlobUrl(url)) {
        console.warn('URL is not a Vercel Blob URL:', url);
        return false;
    }

    try {
        await del(url);
        console.log(`✓ Deleted image from Blob: ${url}`);
        return true;
    } catch (error) {
        console.error(`⚠ Failed to delete image from Blob: ${url}`, error);
        return false;
    }
}
