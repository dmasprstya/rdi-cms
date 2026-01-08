'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

export default function SetupPage() {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<{
        success: boolean;
        message: string;
        details?: string;
    } | null>(null);

    const handleSetup = async () => {
        setLoading(true);
        setResult(null);

        try {
            const response = await fetch('/api/dropdown-menu/setup', {
                method: 'POST',
            });

            const data = await response.json();
            setResult(data);
        } catch (error) {
            setResult({
                success: false,
                message: 'Terjadi kesalahan saat setup',
                details: error instanceof Error ? error.message : 'Unknown error',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-2xl">
            <div className="bg-card border border-border rounded-lg p-8">
                <h1 className="text-3xl font-bold text-foreground mb-4">
                    Setup Database - Dropdown Menu
                </h1>
                <p className="text-muted-foreground mb-6">
                    Halaman ini digunakan untuk membuat tabel <code className="px-2 py-1 bg-muted rounded">dropdown_menu</code> dan mengisi data awal
                    (Jerman, Taiwan, Jepang, Haltec).
                </p>

                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 mb-6">
                    <p className="text-sm text-foreground">
                        <strong>⚠️ Penting:</strong> Setup ini hanya perlu dilakukan satu kali saat pertama kali menggunakan fitur dropdown menu.
                    </p>
                </div>

                <Button
                    onClick={handleSetup}
                    disabled={loading}
                    className="w-full bg-primary hover:bg-primary/90 mb-4"
                >
                    {loading ? (
                        <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Setting up...
                        </>
                    ) : (
                        'Setup Database'
                    )}
                </Button>

                {result && (
                    <div
                        className={`rounded-lg p-4 ${result.success
                                ? 'bg-green-500/10 border border-green-500/20'
                                : 'bg-red-500/10 border border-red-500/20'
                            }`}
                    >
                        <div className="flex items-start gap-3">
                            {result.success ? (
                                <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                            ) : (
                                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                            )}
                            <div className="flex-1">
                                <p
                                    className={`font-medium mb-1 ${result.success ? 'text-green-500' : 'text-red-500'
                                        }`}
                                >
                                    {result.success ? 'Setup Berhasil!' : 'Setup Gagal'}
                                </p>
                                <p className="text-sm text-foreground">{result.message}</p>
                                {result.details && (
                                    <p className="text-xs text-muted-foreground mt-2">
                                        Detail: {result.details}
                                    </p>
                                )}
                                {result.success && (
                                    <div className="mt-4">
                                        <a
                                            href="/editor/dropdown-menu"
                                            className="inline-flex items-center justify-center px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm"
                                        >
                                            Kelola Dropdown Menu
                                        </a>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                <div className="mt-8 pt-8 border-t border-border">
                    <h2 className="text-lg font-semibold text-foreground mb-3">
                        Troubleshooting
                    </h2>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                        <li>
                            • Jika muncul error &quot;Table already exists&quot;, berarti setup sudah dilakukan sebelumnya.
                            Anda bisa langsung ke halaman{' '}
                            <a href="/editor/dropdown-menu" className="text-primary hover:underline">
                                Dropdown Menu
                            </a>
                        </li>
                        <li>
                            • Jika muncul error database connection, pastikan <code className="px-1 py-0.5 bg-muted rounded">DATABASE_URL</code> sudah benar di file .env
                        </li>
                        <li>
                            • Jika muncul error unauthorized, pastikan Anda login sebagai editor atau admin
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
