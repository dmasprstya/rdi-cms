'use client';

import { useState, useEffect } from 'react';
import { Save, Eye, RotateCcw, Mail, Phone, Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';

interface ContactContent {
    sectionTitle: string;
    sectionSubtitle: string;
    email: string;
    phone: string;
    alternativeText: string;
}

const defaultContent: ContactContent = {
    sectionTitle: 'Hubungi Kami',
    sectionSubtitle: 'Ada pertanyaan atau ingin mencoba sistem kami? Isi form di bawah ini dan tim kami akan segera menghubungi Anda.',
    email: 'info@sts-system.com',
    phone: '+62 812-3456-7890',
    alternativeText: 'Atau hubungi kami langsung',
};

export default function ContactEditorPage() {
    const [content, setContent] = useState<ContactContent>(defaultContent);
    const [isSaving, setIsSaving] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isPublished, setIsPublished] = useState(true);

    // Load content from API on mount
    useEffect(() => {
        const loadContent = async () => {
            try {
                const response = await fetch('/api/cms?section=contact');
                if (response.ok) {
                    const data = await response.json();
                    if (data && data.content) {
                        setContent(data.content);
                        setIsPublished(data.isPublished ?? true);
                    }
                }
            } catch (error) {
                console.error('Error loading contact content:', error);
            } finally {
                setIsLoading(false);
            }
        };
        loadContent();
    }, []);

    const handleSave = async (publish: boolean = false) => {
        setIsSaving(true);
        try {
            const response = await fetch('/api/cms', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    section: 'contact',
                    content: content,
                    isPublished: publish ? true : isPublished,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to save');
            }

            if (publish) {
                setIsPublished(true);
                toast.success('Kontak berhasil dipublikasikan!');
            } else {
                toast.success('Perubahan berhasil disimpan!');
            }
        } catch (error) {
            console.error('Error saving contact content:', error);
            toast.error('Gagal menyimpan perubahan');
        } finally {
            setIsSaving(false);
        }
    };

    const handleReset = () => {
        setContent(defaultContent);
        toast.info('Konten direset ke default');
    };

    return (
        <div className="space-y-6 pb-20 lg:pb-0">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Edit Kontak</h1>
                    <p className="mt-1 text-muted-foreground">Kelola informasi kontak</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={handleReset}
                        className="px-4 py-2 bg-muted hover:bg-muted/80 text-muted-foreground rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                    >
                        <RotateCcw className="w-4 h-4" />
                        Reset
                    </button>
                    <button
                        onClick={() => handleSave(false)}
                        disabled={isSaving}
                        className="px-4 py-2 bg-card hover:bg-muted border border-border text-foreground rounded-lg text-sm font-medium transition-colors flex items-center gap-2 disabled:opacity-50"
                    >
                        <Save className="w-4 h-4" />
                        Draft
                    </button>
                    <button
                        onClick={() => handleSave(true)}
                        disabled={isSaving}
                        className="px-4 py-2 bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-400 hover:to-amber-400 text-black rounded-lg text-sm font-medium transition-colors flex items-center gap-2 disabled:opacity-50"
                    >
                        <Eye className="w-4 h-4" />
                        {isSaving ? 'Menyimpan...' : 'Publikasikan'}
                    </button>
                </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
                {/* Editor Form */}
                <div className="space-y-6">
                    <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-6 border border-border">
                        <h2 className="text-lg font-semibold text-foreground mb-4">Header Section</h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-muted-foreground mb-2">
                                    Judul Section
                                </label>
                                <input
                                    type="text"
                                    value={content.sectionTitle}
                                    onChange={(e) => setContent({ ...content, sectionTitle: e.target.value })}
                                    className="w-full px-4 py-3 bg-muted/50 border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-yellow-500/50"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-muted-foreground mb-2">
                                    Deskripsi
                                </label>
                                <textarea
                                    value={content.sectionSubtitle}
                                    onChange={(e) => setContent({ ...content, sectionSubtitle: e.target.value })}
                                    rows={3}
                                    className="w-full px-4 py-3 bg-muted/50 border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-yellow-500/50 resize-none"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-6 border border-border">
                        <h2 className="text-lg font-semibold text-foreground mb-4">Informasi Kontak</h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-muted-foreground mb-2">
                                    Email
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                    <input
                                        type="email"
                                        value={content.email}
                                        onChange={(e) => setContent({ ...content, email: e.target.value })}
                                        className="w-full pl-12 pr-4 py-3 bg-muted/50 border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-yellow-500/50"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-muted-foreground mb-2">
                                    Nomor Telepon
                                </label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                    <input
                                        type="text"
                                        value={content.phone}
                                        onChange={(e) => setContent({ ...content, phone: e.target.value })}
                                        className="w-full pl-12 pr-4 py-3 bg-muted/50 border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-yellow-500/50"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-muted-foreground mb-2">
                                    Teks Alternatif
                                </label>
                                <input
                                    type="text"
                                    value={content.alternativeText}
                                    onChange={(e) => setContent({ ...content, alternativeText: e.target.value })}
                                    className="w-full px-4 py-3 bg-muted/50 border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-yellow-500/50"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Preview */}
                <div className="lg:sticky lg:top-24 h-fit">
                    <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-6 border border-border">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold text-foreground">Preview</h2>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${isPublished ? 'bg-green-500/10 text-green-400' : 'bg-yellow-500/10 text-yellow-400'}`}>
                                {isPublished ? 'Published' : 'Draft'}
                            </span>
                        </div>

                        <div className="bg-gradient-dark rounded-xl p-6 text-center">
                            <h3 className="text-xl font-bold text-foreground mb-2">{content.sectionTitle}</h3>
                            <p className="text-sm text-muted-foreground mb-6">{content.sectionSubtitle}</p>

                            <div className="bg-card/50 rounded-xl p-4 mb-4">
                                <p className="text-xs text-muted-foreground">Form kontak akan tampil di sini</p>
                            </div>

                            <p className="text-xs text-muted-foreground mb-3">{content.alternativeText}</p>

                            <div className="flex flex-col gap-2">
                                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                                    <Mail className="w-4 h-4 text-yellow-400" />
                                    <span>{content.email}</span>
                                </div>
                                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                                    <Phone className="w-4 h-4 text-yellow-400" />
                                    <span>{content.phone}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
