import { toast } from 'react-toastify';
import * as Sentry from '@sentry/nextjs';

/**
 * Centralized error handler for the application
 * Logs errors to Sentry and displays user-friendly notifications
 */
export class ErrorHandler {
    /**
     * Handle Supabase connection errors
     */
    static handleSupabaseError(error: unknown, context?: string) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        const displayMessage = this.getSupabaseErrorMessage(errorMessage);

        // Log to Sentry with context
        Sentry.captureException(error, {
            tags: {
                type: 'supabase_error',
                context: context || 'unknown',
            },
            extra: {
                originalMessage: errorMessage,
            },
        });

        // Display user-friendly notification
        toast.error(displayMessage, {
            position: 'top-right',
            autoClose: 5000,
        });

        // Log to console in development
        if (process.env.NODE_ENV === 'development') {
            console.error('[Supabase Error]:', error);
        }
    }

    /**
     * Handle general application errors
     */
    static handleError(error: unknown, context?: string) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';

        // Log to Sentry
        Sentry.captureException(error, {
            tags: {
                type: 'application_error',
                context: context || 'unknown',
            },
        });

        // Display notification
        toast.error(`Error: ${errorMessage}`, {
            position: 'top-right',
            autoClose: 5000,
        });

        // Log to console in development
        if (process.env.NODE_ENV === 'development') {
            console.error('[Application Error]:', error);
        }
    }

    /**
     * Handle network errors
     */
    static handleNetworkError(error: unknown) {
        toast.error('Koneksi jaringan bermasalah. Silakan periksa koneksi internet Anda.', {
            position: 'top-right',
            autoClose: 6000,
        });

        Sentry.captureException(error, {
            tags: {
                type: 'network_error',
            },
        });
    }

    /**
     * Display success message
     */
    static success(message: string) {
        toast.success(message, {
            position: 'top-right',
            autoClose: 3000,
        });
    }

    /**
     * Display info message
     */
    static info(message: string) {
        toast.info(message, {
            position: 'top-right',
            autoClose: 4000,
        });
    }

    /**
     * Display warning message
     */
    static warning(message: string) {
        toast.warning(message, {
            position: 'top-right',
            autoClose: 4000,
        });
    }

    /**
     * Convert Supabase error messages to user-friendly Indonesian messages
     */
    private static getSupabaseErrorMessage(error: string): string {
        const errorMap: Record<string, string> = {
            'Failed to fetch': 'Gagal terhubung ke server. Periksa koneksi internet Anda.',
            'Network request failed': 'Permintaan jaringan gagal. Silakan coba lagi.',
            'timeout': 'Koneksi timeout. Server membutuhkan waktu terlalu lama untuk merespons.',
            'Invalid API key': 'Konfigurasi API tidak valid. Hubungi administrator.',
            'not found': 'Data tidak ditemukan.',
            'unauthorized': 'Anda tidak memiliki akses untuk melakukan operasi ini.',
            'permission denied': 'Izin ditolak. Anda tidak memiliki hak akses.',
            'already exists': 'Data sudah ada dalam sistem.',
            'Invalid credentials': 'Kredensial tidak valid.',
        };

        // Check if error message contains any known patterns
        for (const [key, value] of Object.entries(errorMap)) {
            if (error.toLowerCase().includes(key.toLowerCase())) {
                return value;
            }
        }

        // Default message
        return 'Terjadi kesalahan saat terhubung ke database. Silakan coba lagi.';
    }
}
