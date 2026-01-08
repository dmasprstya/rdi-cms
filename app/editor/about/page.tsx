'use client';

import { useState, useEffect } from 'react';
import { Save, Eye, RotateCcw, Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';

interface AboutContent {
    sectionTitle: string;
    paragraph1: string;
    paragraph2: string;
}

const defaultContent: AboutContent = {
    sectionTitle: 'Tentang Sistem Kami',
    paragraph1: 'Sistem Terintegrasi Sekolah (STS) adalah platform manajemen sekolah yang dikembangkan dengan teknologi modern untuk membantu institusi pendidikan mengelola operasional sehari-hari dengan lebih efisien dan terorganisir.',
    paragraph2: 'Dengan antarmuka yang intuitif dan fitur yang komprehensif, STS memungkinkan admin, staff, dan siswa untuk berkolaborasi dalam satu ekosistem digital yang terintegrasi.',
};

export default function AboutEditorPage() {
    const [content, setContent] = useState<AboutContent>(defaultContent);
    const [isSaving, setIsSaving] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isPublished, setIsPublished] = useState(true);

    // Load content from API on mount
    useEffect(() => {
        const loadContent = async () => {
            try {
                const response = await fetch('/api/cms?section=about');
                if (response.ok) {
                    const data = await response.json();
                    if (data && data.content) {
                        setContent(data.content);
                        setIsPublished(data.isPublished ?? true);
                    }
                }
            } catch (error) {
                console.error('Error loading about content:', error);
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
                    section: 'about',
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
                toast.success('Tentang Kami berhasil dipublikasikan!');
            } else {
                toast.success('Perubahan berhasil disimpan!');
            }
        } catch (error) {
            console.error('Error saving about content:', error);
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
                    <h1 className="text-2xl font-bold text-foreground">Edit Tentang Kami</h1>
                    <p className="mt-1 text-muted-foreground">Kelola deskripsi dan informasi sekolah</p>
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
                        Simpan Draft
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
                        <h2 className="text-lg font-semibold text-foreground mb-4">Konten Section</h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-muted-foreground mb-2">
                                    Judul Section
                                </label>
                                <input
                                    type="text"
                                    value={content.sectionTitle}
                                    onChange={(e) => setContent({ ...content, sectionTitle: e.target.value })}
                                    className="w-full px-4 py-3 bg-muted/50 border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500/50 transition-all"
                                    placeholder="Masukkan judul section"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-muted-foreground mb-2">
                                    Paragraf Pertama
                                </label>
                                <textarea
                                    value={content.paragraph1}
                                    onChange={(e) => setContent({ ...content, paragraph1: e.target.value })}
                                    rows={5}
                                    className="w-full px-4 py-3 bg-muted/50 border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500/50 transition-all resize-none"
                                    placeholder="Masukkan paragraf pertama"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-muted-foreground mb-2">
                                    Paragraf Kedua
                                </label>
                                <textarea
                                    value={content.paragraph2}
                                    onChange={(e) => setContent({ ...content, paragraph2: e.target.value })}
                                    rows={5}
                                    className="w-full px-4 py-3 bg-muted/50 border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500/50 transition-all resize-none"
                                    placeholder="Masukkan paragraf kedua"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Live Preview */}
                <div className="lg:sticky lg:top-24 h-fit">
                    <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-6 border border-border">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold text-foreground">Preview</h2>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${isPublished ? 'bg-green-500/10 text-green-400' : 'bg-yellow-500/10 text-yellow-400'}`}>
                                {isPublished ? 'Published' : 'Draft'}
                            </span>
                        </div>

                        {/* Mini Preview */}
                        <div className="bg-gradient-dark rounded-xl p-6 min-h-[300px]">
                            <h3 className="text-xl font-bold text-foreground text-center mb-6">
                                {content.sectionTitle}
                            </h3>
                            <div className="space-y-4">
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    {content.paragraph1}
                                </p>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    {content.paragraph2}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
