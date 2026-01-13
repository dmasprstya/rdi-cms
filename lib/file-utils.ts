import fs from 'fs/promises';
import path from 'path';

/**
 * Validates if a file is a valid PDF
 * Checks both file extension and MIME type
 */
export function validatePDFFile(file: File): { valid: boolean; error?: string } {
    // Check file extension
    const fileName = file.name.toLowerCase();
    if (!fileName.endsWith('.pdf')) {
        return { valid: false, error: 'INVALID_TYPE' };
    }

    // Check file size (10MB max)
    const maxSize = 10 * 1024 * 1024; // 10MB in bytes
    if (file.size > maxSize) {
        return { valid: false, error: 'FILE_TOO_LARGE' };
    }

    // Check MIME type
    if (file.type !== 'application/pdf') {
        return { valid: false, error: 'INVALID_TYPE' };
    }

    return { valid: true };
}

/**
 * Formats file size in bytes to human-readable format
 */
export function formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Sanitizes filename to prevent path traversal and special characters
 * Returns only safe characters: a-z, A-Z, 0-9, dot, hyphen, underscore
 */
export function sanitizeFilename(filename: string): string {
    // Remove path components
    const basename = path.basename(filename);

    // Remove extension to sanitize the name part
    const ext = path.extname(basename);
    const nameWithoutExt = basename.slice(0, -ext.length);

    // Replace all unsafe characters with underscore
    const sanitized = nameWithoutExt.replace(/[^a-zA-Z0-9._-]/g, '_');

    // Prevent multiple consecutive underscores
    const cleaned = sanitized.replace(/_+/g, '_');

    // Remove leading/trailing underscores
    const trimmed = cleaned.replace(/^_+|_+$/g, '');

    // If filename is empty after sanitization, use a default
    const finalName = trimmed || 'file';

    return finalName + ext;
}

/**
 * Generates a unique filename with timestamp and user ID
 */
export function generateUniqueFilename(originalFilename: string, userId: string): string {
    const sanitized = sanitizeFilename(originalFilename);
    const timestamp = Date.now();
    const ext = path.extname(sanitized);
    const nameWithoutExt = sanitized.slice(0, -ext.length);

    return `${timestamp}-${userId}-${nameWithoutExt}${ext}`;
}

/**
 * Deletes a file if it exists
 * Does not throw errors - logs them instead
 */
export async function deleteFileIfExists(filePath: string): Promise<void> {
    try {
        await fs.access(filePath);
        await fs.unlink(filePath);
        console.log(`✓ Deleted file: ${filePath}`);
    } catch (error: any) {
        if (error.code === 'ENOENT') {
            // File doesn't exist, that's fine
            console.log(`File not found (already deleted): ${filePath}`);
        } else {
            // Log error but don't throw
            console.error(`Failed to delete file: ${filePath}`, error);
        }
    }
}

/**
 * Ensures a directory exists, creates it if it doesn't
 */
export async function ensureDirectoryExists(dirPath: string): Promise<void> {
    try {
        await fs.access(dirPath);
    } catch {
        await fs.mkdir(dirPath, { recursive: true });
        console.log(`✓ Created directory: ${dirPath}`);
    }
}

/**
 * Validates PDF file on server side using file buffer
 * Checks magic bytes (file signature) for PDF: %PDF
 */
export async function validatePDFBuffer(buffer: Buffer): Promise<boolean> {
    // PDF files start with %PDF (hex: 25 50 44 46)
    const pdfSignature = Buffer.from([0x25, 0x50, 0x44, 0x46]);

    if (buffer.length < 4) {
        return false;
    }

    // Check first 4 bytes
    for (let i = 0; i < 4; i++) {
        if (buffer[i] !== pdfSignature[i]) {
            return false;
        }
    }

    return true;
}

/**
 * Extracts file ID from file URL
 * URL format: /api/guru/files/{fileId}
 */
export function extractFileIdFromUrl(fileUrl: string): string | null {
    const match = fileUrl.match(/\/api\/guru\/files\/([^\/]+)/);
    return match ? match[1] : null;
}

/**
 * Gets the file path from file ID (filename)
 */
export function getFilePathFromId(fileId: string): string {
    return path.join(process.cwd(), 'uploads', 'modules', fileId);
}
