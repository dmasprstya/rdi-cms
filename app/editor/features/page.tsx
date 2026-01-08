'use client';

import { useState, useEffect } from 'react';
import { Save, Eye, RotateCcw, Plus, Trash2, GripVertical, Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';

interface Feature {
    id: string;
    icon: string;
    title: string;
    description: string;
}

interface FeaturesContent {
    sectionTitle: string;
    sectionSubtitle: string;
    features: Feature[];
}

const iconOptions = ['Users', 'BookOpen', 'BarChart3', 'Shield', 'Calendar', 'Bell', 'Settings', 'Star'];

const defaultContent: FeaturesContent = {
    sectionTitle: 'Fitur Unggulan',
    sectionSubtitle: 'Dirancang untuk memenuhi kebutuhan sekolah modern dengan teknologi terkini',
    features: [
        { id: '1', icon: 'Users', title: 'Manajemen Siswa', description: 'Kelola data siswa dengan mudah, termasuk profil, kelas, dan informasi pribadi' },
        { id: '2', icon: 'BookOpen', title: 'Nilai & Jadwal', description: 'Catat nilai akademik dan atur jadwal pelajaran secara efisien' },
        { id: '3', icon: 'BarChart3', title: 'Dashboard Analytics', description: 'Visualisasi data dengan grafik dan statistik yang informatif' },
        { id: '4', icon: 'Shield', title: 'Role-Based Access', description: 'Keamanan berlapis dengan akses berbasis peran pengguna' },
    ],
};

export default function FeaturesEditorPage() {
    const [content, setContent] = useState<FeaturesContent>(defaultContent);
    const [isSaving, setIsSaving] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isPublished, setIsPublished] = useState(true);

    // Load content from API on mount
    useEffect(() => {
        const loadContent = async () => {
            try {
                const response = await fetch('/api/cms?section=features');
                if (response.ok) {
                    const data = await response.json();
                    if (data && data.content) {
                        setContent(data.content);
                        setIsPublished(data.isPublished ?? true);
                    }
                }
            } catch (error) {
                console.error('Error loading features content:', error);
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
                    section: 'features',
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
                toast.success('Fitur Layanan berhasil dipublikasikan!');
            } else {
                toast.success('Perubahan berhasil disimpan!');
            }
        } catch (error) {
            console.error('Error saving features content:', error);
            toast.error('Gagal menyimpan perubahan');
        } finally {
            setIsSaving(false);
        }
    };

    const handleReset = () => {
        setContent(defaultContent);
        toast.info('Konten direset ke default');
    };

    const addFeature = () => {
        const newFeature: Feature = {
            id: crypto.randomUUID(),
            icon: 'Star',
            title: 'Fitur Baru',
            description: 'Deskripsi fitur baru',
        };
        setContent({
            ...content,
            features: [...content.features, newFeature],
        });
    };

    const removeFeature = (id: string) => {
        setContent({
            ...content,
            features: content.features.filter(f => f.id !== id),
        });
    };

    const updateFeature = (id: string, field: keyof Feature, value: string) => {
        setContent({
            ...content,
            features: content.features.map(f =>
                f.id === id ? { ...f, [field]: value } : f
            ),
        });
    };

    return (
        <div className="space-y-6 pb-20 lg:pb-0">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Edit Fitur Layanan</h1>
                    <p className="mt-1 text-muted-foreground">Kelola daftar fitur unggulan sistem</p>
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

            {/* Section Header Editor */}
            <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-6 border border-border">
                <h2 className="text-lg font-semibold text-foreground mb-4">Header Section</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-2">Judul Section</label>
                        <input
                            type="text"
                            value={content.sectionTitle}
                            onChange={(e) => setContent({ ...content, sectionTitle: e.target.value })}
                            className="w-full px-4 py-3 bg-muted/50 border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-yellow-500/50"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-2">Sub-Judul</label>
                        <input
                            type="text"
                            value={content.sectionSubtitle}
                            onChange={(e) => setContent({ ...content, sectionSubtitle: e.target.value })}
                            className="w-full px-4 py-3 bg-muted/50 border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-yellow-500/50"
                        />
                    </div>
                </div>
            </div>

            {/* Features List */}
            <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-6 border border-border">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-foreground">Daftar Fitur ({content.features.length})</h2>
                    <button
                        onClick={addFeature}
                        className="px-3 py-2 bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-400 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        Tambah Fitur
                    </button>
                </div>

                <div className="space-y-4">
                    {content.features.map((feature, index) => (
                        <div
                            key={feature.id}
                            className="bg-muted/50 rounded-xl p-4 border border-border"
                        >
                            <div className="flex items-start gap-4">
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <GripVertical className="w-5 h-5 cursor-grab" />
                                    <span className="text-sm font-medium">{index + 1}</span>
                                </div>
                                <div className="flex-1 grid sm:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-xs text-muted-foreground mb-1">Icon</label>
                                        <select
                                            value={feature.icon}
                                            onChange={(e) => updateFeature(feature.id, 'icon', e.target.value)}
                                            className="w-full px-3 py-2 bg-card border border-border rounded-lg text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500/50"
                                        >
                                            {iconOptions.map(icon => (
                                                <option key={icon} value={icon}>{icon}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs text-muted-foreground mb-1">Judul</label>
                                        <input
                                            type="text"
                                            value={feature.title}
                                            onChange={(e) => updateFeature(feature.id, 'title', e.target.value)}
                                            className="w-full px-3 py-2 bg-card border border-border rounded-lg text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500/50"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs text-muted-foreground mb-1">Deskripsi</label>
                                        <input
                                            type="text"
                                            value={feature.description}
                                            onChange={(e) => updateFeature(feature.id, 'description', e.target.value)}
                                            className="w-full px-3 py-2 bg-card border border-border rounded-lg text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500/50"
                                        />
                                    </div>
                                </div>
                                <button
                                    onClick={() => removeFeature(feature.id)}
                                    className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
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
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {content.features.map((feature) => (
                            <div key={feature.id} className="bg-card/50 rounded-xl p-4 border border-border">
                                <div className="w-10 h-10 bg-yellow-500/10 rounded-lg flex items-center justify-center mb-3">
                                    <span className="text-yellow-400 text-sm">{feature.icon.substring(0, 2)}</span>
                                </div>
                                <h4 className="text-sm font-semibold text-foreground mb-1">{feature.title}</h4>
                                <p className="text-xs text-muted-foreground line-clamp-2">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
