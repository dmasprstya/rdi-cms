'use client';

import { useState, useEffect } from 'react';
import { Save, Eye, RotateCcw, Plus, Trash2, User, Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';

interface Testimonial {
    id: string;
    quote: string;
    name: string;
    role: string;
    school: string;
}

interface TestimonialsContent {
    sectionTitle: string;
    sectionSubtitle: string;
    testimonials: Testimonial[];
}

const defaultContent: TestimonialsContent = {
    sectionTitle: 'Testimoni Pengguna',
    sectionSubtitle: 'Apa yang mereka katakan tentang sistem kami',
    testimonials: [
        {
            id: '1',
            quote: 'Sistem ini sangat membantu dalam mengelola data siswa dan nilai. Interface yang mudah dipahami membuat pekerjaan admin menjadi lebih efisien.',
            name: 'Budi Santoso',
            role: 'Kepala Sekolah',
            school: 'SMA Negeri 1'
        },
        {
            id: '2',
            quote: 'Fitur analytics dan reporting sangat powerful. Kami bisa membuat keputusan berbasis data dengan lebih cepat dan akurat.',
            name: 'Siti Nurhaliza',
            role: 'Staff Admin',
            school: 'SMP Islam Al-Azhar'
        },
        {
            id: '3',
            quote: 'Sebagai guru, saya terbantu dengan fitur manajemen nilai dan jadwal. Semuanya terintegrasi dengan baik dan mudah diakses.',
            name: 'Ahmad Dhani',
            role: 'Guru Matematika',
            school: 'SMK Teknologi 45'
        },
    ],
};

export default function TestimonialsEditorPage() {
    const [content, setContent] = useState<TestimonialsContent>(defaultContent);
    const [isSaving, setIsSaving] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isPublished, setIsPublished] = useState(false);

    // Load content from API on mount
    useEffect(() => {
        const loadContent = async () => {
            try {
                const response = await fetch('/api/cms?section=testimonials');
                if (response.ok) {
                    const data = await response.json();
                    if (data && data.content) {
                        setContent(data.content);
                        setIsPublished(data.isPublished ?? false);
                    }
                }
            } catch (error) {
                console.error('Error loading testimonials content:', error);
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
                    section: 'testimonials',
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
                toast.success('Testimonial berhasil dipublikasikan!');
            } else {
                toast.success('Perubahan berhasil disimpan!');
            }
        } catch (error) {
            console.error('Error saving testimonials content:', error);
            toast.error('Gagal menyimpan perubahan');
        } finally {
            setIsSaving(false);
        }
    };

    const handleReset = () => {
        setContent(defaultContent);
        toast.info('Konten direset ke default');
    };

    const addTestimonial = () => {
        const newTestimonial: Testimonial = {
            id: crypto.randomUUID(),
            quote: 'Testimoni baru...',
            name: 'Nama Lengkap',
            role: 'Jabatan',
            school: 'Nama Sekolah',
        };
        setContent({
            ...content,
            testimonials: [...content.testimonials, newTestimonial],
        });
    };

    const removeTestimonial = (id: string) => {
        setContent({
            ...content,
            testimonials: content.testimonials.filter(t => t.id !== id),
        });
    };

    const updateTestimonial = (id: string, field: keyof Testimonial, value: string) => {
        setContent({
            ...content,
            testimonials: content.testimonials.map(t =>
                t.id === id ? { ...t, [field]: value } : t
            ),
        });
    };

    return (
        <div className="space-y-6 pb-20 lg:pb-0">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-foreground">Edit Testimonial</h1>
                    <p className="mt-1 text-sm sm:text-base text-muted-foreground">Kelola testimoni pengguna sistem</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={handleReset}
                        className="px-4 py-2 bg-muted hover:bg-muted/80 text-muted-foreground rounded-lg text-xs sm:text-sm font-medium transition-colors flex items-center gap-2"
                    >
                        <RotateCcw className="w-4 h-4" />
                        Reset
                    </button>
                    <button
                        onClick={() => handleSave(false)}
                        disabled={isSaving}
                        className="px-4 py-2 bg-card hover:bg-muted border border-border text-foreground rounded-lg text-xs sm:text-sm font-medium transition-colors flex items-center gap-2 disabled:opacity-50"
                    >
                        <Save className="w-4 h-4" />
                        Draft
                    </button>
                    <button
                        onClick={() => handleSave(true)}
                        disabled={isSaving}
                        className="px-4 py-2 bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-400 hover:to-amber-400 text-black rounded-lg text-xs sm:text-sm font-medium transition-colors flex items-center gap-2 disabled:opacity-50"
                    >
                        <Eye className="w-4 h-4" />
                        {isSaving ? 'Menyimpan...' : 'Publikasikan'}
                    </button>
                </div>
            </div>

            {/* Section Header */}
            <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-6 border border-border">
                <h2 className="text-lg font-semibold text-foreground mb-4">Header Section</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs sm:text-sm font-medium text-muted-foreground mb-2">Judul Section</label>
                        <input
                            type="text"
                            value={content.sectionTitle}
                            onChange={(e) => setContent({ ...content, sectionTitle: e.target.value })}
                            className="w-full px-4 py-3 bg-muted/50 border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-yellow-500/50"
                        />
                    </div>
                    <div>
                        <label className="block text-xs sm:text-sm font-medium text-muted-foreground mb-2">Sub-Judul</label>
                        <input
                            type="text"
                            value={content.sectionSubtitle}
                            onChange={(e) => setContent({ ...content, sectionSubtitle: e.target.value })}
                            className="w-full px-4 py-3 bg-muted/50 border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-yellow-500/50"
                        />
                    </div>
                </div>
            </div>

            {/* Testimonials List */}
            <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-6 border border-border">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-foreground">Daftar Testimoni ({content.testimonials.length})</h2>
                    <button
                        onClick={addTestimonial}
                        className="px-3 py-2 bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-400 rounded-lg text-xs sm:text-sm font-medium transition-colors flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        Tambah Testimoni
                    </button>
                </div>

                <div className="space-y-4">
                    {content.testimonials.map((testimonial, index) => (
                        <div
                            key={testimonial.id}
                            className="bg-muted/50 rounded-xl p-4 border border-border"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-600 rounded-full flex items-center justify-center text-foreground font-semibold">
                                        {index + 1}
                                    </div>
                                    <span className="text-sm text-muted-foreground">Testimoni #{index + 1}</span>
                                </div>
                                <button
                                    onClick={() => removeTestimonial(testimonial.id)}
                                    className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs text-muted-foreground mb-1">Quote / Testimoni</label>
                                    <textarea
                                        value={testimonial.quote}
                                        onChange={(e) => updateTestimonial(testimonial.id, 'quote', e.target.value)}
                                        rows={3}
                                        className="w-full px-3 py-2 bg-card border border-border rounded-lg text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500/50 resize-none"
                                    />
                                </div>
                                <div className="grid sm:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-xs text-muted-foreground mb-1">Nama</label>
                                        <input
                                            type="text"
                                            value={testimonial.name}
                                            onChange={(e) => updateTestimonial(testimonial.id, 'name', e.target.value)}
                                            className="w-full px-3 py-2 bg-card border border-border rounded-lg text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500/50"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs text-muted-foreground mb-1">Jabatan</label>
                                        <input
                                            type="text"
                                            value={testimonial.role}
                                            onChange={(e) => updateTestimonial(testimonial.id, 'role', e.target.value)}
                                            className="w-full px-3 py-2 bg-card border border-border rounded-lg text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500/50"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs text-muted-foreground mb-1">Sekolah</label>
                                        <input
                                            type="text"
                                            value={testimonial.school}
                                            onChange={(e) => updateTestimonial(testimonial.id, 'school', e.target.value)}
                                            className="w-full px-3 py-2 bg-card border border-border rounded-lg text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500/50"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Preview */}
            <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-6 border border-border">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-foreground">Preview</h2>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${isPublished ? 'bg-green-500/10 text-green-400' : 'bg-yellow-500/10 text-yellow-400'}`}>
                        {isPublished ? 'Published' : 'Draft'}
                    </span>
                </div>

                <div className="bg-gradient-dark rounded-xl p-6">
                    <div className="text-center mb-6">
                        <h3 className="text-xl font-bold text-foreground mb-2">{content.sectionTitle}</h3>
                        <p className="text-sm text-muted-foreground">{content.sectionSubtitle}</p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-4">
                        {content.testimonials.slice(0, 3).map((testimonial) => (
                            <div key={testimonial.id} className="bg-card/50 rounded-xl p-4 border border-border">
                                <p className="text-sm text-muted-foreground mb-4 line-clamp-3">&ldquo;{testimonial.quote}&rdquo;</p>
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-yellow-500/20 rounded-full flex items-center justify-center">
                                        <User className="w-4 h-4 text-yellow-400" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-medium text-foreground">{testimonial.name}</p>
                                        <p className="text-xs text-muted-foreground">{testimonial.role}, {testimonial.school}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
