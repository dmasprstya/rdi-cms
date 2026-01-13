/**
 * Client-side file utilities for PDF upload
 */

/**
 * Validates if a file is a valid PDF on client side
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
 * Get error message from error code
 */
export function getErrorMessage(code: string): string {
    const messages: Record<string, string> = {
        'FILE_TOO_LARGE': 'File terlalu besar (maksimal 10MB)',
        'INVALID_TYPE': 'Hanya file PDF yang diperbolehkan',
        'RATE_LIMIT_EXCEEDED': 'Terlalu banyak upload. Maksimal 10 file per jam',
        'UPLOAD_FAILED': 'Gagal mengupload file',
        'NO_FILE': 'File tidak ditemukan',
    };
    return messages[code] || 'Terjadi kesalahan';
}
