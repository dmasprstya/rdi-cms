'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, Loader2, CheckCircle2, AlertCircle, Image as ImageIcon } from 'lucide-react';

interface LogoContent {
    logoText: string;
    logoSubText: string;
    useIcon: boolean;
    customImageUrl?: string;
}

export default function LogoEditor() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string>('');
    const [success, setSuccess] = useState(false);

    const [logoData, setLogoData] = useState<LogoContent>({
        logoText: 'STS',
        logoSubText: 'System',
        useIcon: true,
        customImageUrl: '',
    });

    useEffect(() => {
        fetchLogoData();
    }, []);

    const fetchLogoData = async () => {
        try {
            setError('');
            const response = await fetch('/api/cms?section=logo');
            const data = await response.json();

            console.log('Fetch response:', data); // Debug

            if (data.success && data.data) {
                setLogoData(data.data.content as LogoContent);
            }
        } catch (err) {
            console.error('Error fetching logo:', err);
            setError('Gagal memuat data logo');
        } finally {
            setLoading(false);
        }
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate
        if (!file.type.startsWith('image/')) {
            setError('File harus berupa gambar (PNG, JPG, dll)');
            return;
        }

        if (file.size > 2 * 1024 * 1024) {
            setError('Ukuran file maksimal 2MB');
            return;
        }

        setError('');

        // Convert to Base64
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = reader.result as string;
            setLogoData({
                ...logoData,
                customImageUrl: base64String,
                useIcon: false,
            });
        };
        reader.onerror = () => {
            setError('Gagal membaca file');
        };
        reader.readAsDataURL(file);
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            setError('');
            setSuccess(false);

            console.log('Saving logo data:', logoData); // Debug

            const response = await fetch('/api/cms', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    section: 'logo',
                    content: logoData,
                    isPublished: true,
                }),
            });

            const data = await response.json();
            console.log('Save response:', data); // Debug

            if (!response.ok) {
                throw new Error(data.error || `HTTP ${response.status}`);
            }

            if (data.success) {
                setSuccess(true);
                setTimeout(() => {
                    window.location.reload();
                }, 1500);
            } else {
                throw new Error(data.error || 'Failed to save');
            }
        } catch (err) {
            console.error('Save error:', err);
            setError(err instanceof Error ? err.message : 'Gagal menyimpan logo');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-foreground mb-2">
                    Logo Perusahaan
                </h1>
                <p className="text-muted-foreground">
                    Kelola logo yang ditampilkan di navbar
                </p>
            </div>

            {/* Error Alert */}
            {error && (
                <div className="mb-6 bg-red-500/10 border border-red-500/20 rounded-lg p-4 flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                        <p className="font-medium text-red-500">Error</p>
                        <p className="text-sm text-foreground mt-1">{error}</p>
                    </div>
                </div>
            )}

            {/* Success Alert */}
            {success && (
                <div className="mb-6 bg-green-500/10 border border-green-500/20 rounded-lg p-4 flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                        <p className="font-medium text-green-500">Berhasil!</p>
                        <p className="text-sm text-foreground mt-1">
                            Logo berhasil disimpan. Halaman akan refresh...
                        </p>
                    </div>
                </div>
            )}

            <div className="grid md:grid-cols-2 gap-8">
                {/* Settings */}
                <div className="space-y-6">
                    <div className="bg-card border border-border rounded-lg p-6">
                        <h2 className="text-xl font-semibold text-foreground mb-4">
                            Pengaturan Logo
                        </h2>

                        {/* Logo Type */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-foreground mb-3">
                                Tipe Logo
                            </label>
                            <div className="space-y-3">
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input
                                        type="radio"
                                        checked={logoData.useIcon}
                                        onChange={() =>
                                            setLogoData({ ...logoData, useIcon: true })
                                        }
                                        className="w-4 h-4 text-primary"
                                    />
                                    <span className="text-foreground">
                                        Default
                                    </span>
                                </label>
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input
                                        type="radio"
                                        checked={!logoData.useIcon}
                                        onChange={() =>
                                            setLogoData({ ...logoData, useIcon: false })
                                        }
                                        className="w-4 h-4 text-primary"
                                    />
                                    <span className="text-foreground">Custom Image</span>
                                </label>
                            </div>
                        </div>

                        {/* Text Settings - Always show */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-foreground mb-2">
                                Teks Logo Utama
                            </label>
                            <input
                                type="text"
                                value={logoData.logoText}
                                onChange={(e) =>
                                    setLogoData({
                                        ...logoData,
                                        logoText: e.target.value,
                                    })
                                }
                                className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                                placeholder="STS"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-foreground mb-2">
                                Teks Logo Sekunder
                            </label>
                            <input
                                type="text"
                                value={logoData.logoSubText}
                                onChange={(e) =>
                                    setLogoData({
                                        ...logoData,
                                        logoSubText: e.target.value,
                                    })
                                }
                                className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                                placeholder="System"
                            />
                        </div>

                        {/* Image Upload */}
                        {!logoData.useIcon && (
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-foreground mb-2">
                                    Upload Logo
                                </label>
                                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        className="hidden"
                                        id="logo-upload"
                                    />
                                    <label
                                        htmlFor="logo-upload"
                                        className="cursor-pointer flex flex-col items-center gap-2"
                                    >
                                        {logoData.customImageUrl ? (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img
                                                src={logoData.customImageUrl}
                                                alt="Preview"
                                                className="max-h-20 object-contain mb-2"
                                            />
                                        ) : (
                                            <ImageIcon className="w-12 h-12 text-muted-foreground mb-2" />
                                        )}
                                        <span className="text-sm text-primary font-medium">
                                            {logoData.customImageUrl ? 'Klik untuk ganti' : 'Klik untuk upload'}
                                        </span>
                                        <span className="text-xs text-muted-foreground">
                                            PNG, JPG (max 2MB)
                                        </span>
                                    </label>
                                </div>
                            </div>
                        )}

                        {/* Save Button */}
                        <Button
                            onClick={handleSave}
                            disabled={saving || success}
                            className="w-full bg-primary hover:bg-primary/90 mt-4"
                        >
                            {saving ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Menyimpan...
                                </>
                            ) : success ? (
                                <>
                                    <CheckCircle2 className="w-4 h-4 mr-2" />
                                    Tersimpan!
                                </>
                            ) : (
                                <>
                                    <Upload className="w-4 h-4 mr-2" />
                                    Simpan Logo
                                </>
                            )}
                        </Button>
                    </div>
                </div>

                {/* Preview */}
                <div className="space-y-6">
                    <div className="bg-card border border-border rounded-lg p-6">
                        <h2 className="text-xl font-semibold text-foreground mb-4">
                            Preview
                        </h2>

                        {/* Light Mode */}
                        <div className="mb-6">
                            <p className="text-sm text-muted-foreground mb-3">Light Mode</p>
                            <div className="bg-white border border-border rounded-lg p-4">
                                {logoData.useIcon ? (
                                    <div className="flex items-center gap-2">
                                        <div className="p-2 bg-yellow-400/10 rounded-lg">
                                            <svg className="w-6 h-6 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path d="M12 14l9-5-9-5-9 5 9 5z" />
                                                <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
                                            </svg>
                                        </div>
                                        <span className="text-xl font-bold text-gray-900">
                                            {logoData.logoText}{' '}
                                            <span className="text-yellow-500">{logoData.logoSubText}</span>
                                        </span>
                                    </div>
                                ) : logoData.customImageUrl ? (
                                    <div className="flex items-center gap-2">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src={logoData.customImageUrl} alt="Logo" className="h-10 object-contain" />
                                        <span className="text-xl font-bold text-gray-900">
                                            {logoData.logoText} <span className="text-yellow-500">{logoData.logoSubText}</span>
                                        </span>
                                    </div>
                                ) : (
                                    <p className="text-sm text-gray-400">Upload image untuk preview</p>
                                )}
                            </div>
                        </div>

                        {/* Dark Mode */}
                        <div>
                            <p className="text-sm text-muted-foreground mb-3">Dark Mode</p>
                            <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
                                {logoData.useIcon ? (
                                    <div className="flex items-center gap-2">
                                        <div className="p-2 bg-yellow-400/10 rounded-lg">
                                            <svg className="w-6 h-6 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path d="M12 14l9-5-9-5-9 5 9 5z" />
                                                <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
                                            </svg>
                                        </div>
                                        <span className="text-xl font-bold text-foreground">
                                            {logoData.logoText}{' '}
                                            <span className="text-yellow-400">{logoData.logoSubText}</span>
                                        </span>
                                    </div>
                                ) : logoData.customImageUrl ? (
                                    <div className="flex items-center gap-2">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src={logoData.customImageUrl} alt="Logo" className="h-10 object-contain" />
                                        <span className="text-xl font-bold text-foreground">
                                            {logoData.logoText} <span className="text-yellow-400">{logoData.logoSubText}</span>
                                        </span>
                                    </div>
                                ) : (
                                    <p className="text-sm text-gray-400">Upload image untuk preview</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Tips */}
                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                        <h3 className="text-sm font-semibold text-foreground mb-2">💡 Tips</h3>
                        <ul className="text-xs text-muted-foreground space-y-1">
                            <li>• Logo akan tampil di navbar semua halaman</li>
                            <li>• Ukuran optimal: tinggi 40-50px</li>
                            <li>• Format PNG dengan background transparan lebih baik</li>
                            <li>• Test di light & dark mode sebelum save</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
