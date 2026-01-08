'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Save, Eye, Loader2, Plus, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Feature {
    icon: string;
    title: string;
    description: string;
}

interface WhyRDIContent {
    title: string;
    subtitle: string;
    features: Feature[];
}

const iconOptions = [
    { value: 'Network', label: 'Network (Jaringan)' },
    { value: 'Users', label: 'Users (Pengguna)' },
    { value: 'Shield', label: 'Shield (Perisai)' },
    { value: 'Award', label: 'Award (Penghargaan)' },
    { value: 'Target', label: 'Target (Sasaran)' },
    { value: 'CheckCircle', label: 'CheckCircle (Centang)' },
    { value: 'Globe', label: 'Globe (Dunia)' },
    { value: 'BookOpen', label: 'BookOpen (Buku)' },
];

export default function WhyRDIEditor() {
    const { toast } = useToast();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [content, setContent] = useState<WhyRDIContent>({
        title: 'Mengapa Rosman Djohan Institute?',
        subtitle: 'Komitmen kami untuk memberikan pendidikan berkualitas dan pelatihan profesional',
        features: [
            {
                icon: 'Network',
                title: 'Jaringan Luas',
                description: 'Koneksi langsung ke Universitas & Industri Global serta Lembaga Halal terpercaya.',
            },
            {
                icon: 'Users',
                title: 'Didirikan oleh Ahli',
                description: 'Dipimpin langsung oleh praktisi berpengalaman di bidang pendidikan internasional dan sertifikasi halal.',
            },
            {
                icon: 'Shield',
                title: 'Resmi & Terpercaya',
                description: 'Berizin resmi untuk pengiriman siswa ke luar negeri & pelatihan kompetensi profesi halal.',
            },
        ],
    });

    useEffect(() => {
        const fetchContent = async () => {
            try {
                const response = await fetch('/api/cms/rdi?section=rdi-why-rdi');
                const data = await response.json();

                if (data.success && data.data) {
                    setContent(data.data.content as WhyRDIContent);
                }
            } catch (error) {
                console.error('Error fetching content:', error);
                toast({
                    title: 'Error',
                    description: 'Gagal memuat konten',
                    variant: 'destructive',
                });
            } finally {
                setLoading(false);
            }
        };

        fetchContent();
    }, [toast]);

    const handleSave = async () => {
        setSaving(true);
        try {
            const response = await fetch('/api/cms/rdi', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    section: 'rdi-why-rdi',
                    content,
                    isPublished: true,
                }),
            });

            const data = await response.json();

            if (data.success) {
                toast({
                    title: 'Berhasil',
                    description: 'Konten Why RDI berhasil disimpan',
                });
            } else {
                throw new Error(data.error || 'Failed to save');
            }
        } catch (error) {
            console.error('Error saving content:', error);
            toast({
                title: 'Error',
                description: 'Gagal menyimpan konten',
                variant: 'destructive',
            });
        } finally {
            setSaving(false);
        }
    };

    const addFeature = () => {
        setContent({
            ...content,
            features: [
                ...content.features,
                {
                    icon: 'Award',
                    title: 'New Feature',
                    description: 'Feature description',
                }
            ]
        });
    };

    const removeFeature = (index: number) => {
        setContent({
            ...content,
            features: content.features.filter((_, i) => i !== index)
        });
    };

    const updateFeature = (index: number, field: keyof Feature, value: string) => {
        const newFeatures = [...content.features];
        newFeatures[index] = {
            ...newFeatures[index],
            [field]: value
        };
        setContent({
            ...content,
            features: newFeatures
        });
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-6 pb-20 lg:pb-0">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <Link
                        href="/editor"
                        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-2"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Kembali ke Dashboard
                    </Link>
                    <h1 className="text-lg sm:text-2xl lg:text-3xl font-bold text-foreground">Edit Why RDI Section</h1>
                    <p className="mt-1 text-muted-foreground">
                        Kelola keunggulan dan alasan memilih RDI
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" asChild>
                        <Link href="/" target="_blank">
                            <Eye className="w-4 h-4 mr-2" />
                            Preview
                        </Link>
                    </Button>
                    <Button onClick={handleSave} disabled={saving}>
                        {saving ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Menyimpan...
                            </>
                        ) : (
                            <>
                                <Save className="w-4 h-4 mr-2" />
                                Simpan
                            </>
                        )}
                    </Button>
                </div>
            </div>

            {/* Section Header */}
            <Card>
                <CardHeader>
                    <CardTitle>Header Section</CardTitle>
                    <CardDescription>
                        Edit judul dan deskripsi untuk Why RDI section
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="title">Judul Section</Label>
                        <Input
                            id="title"
                            value={content.title}
                            onChange={(e) => setContent({ ...content, title: e.target.value })}
                            placeholder="Mengapa Rosman Djohan Institute?"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="subtitle">Sub-judul</Label>
                        <Textarea
                            id="subtitle"
                            value={content.subtitle}
                            onChange={(e) => setContent({ ...content, subtitle: e.target.value })}
                            placeholder="Deskripsi singkat section"
                            rows={2}
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Features List */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-foreground">Keunggulan RDI</h2>
                    <Button onClick={addFeature} size="sm">
                        <Plus className="w-4 h-4 mr-2" />
                        Tambah Keunggulan
                    </Button>
                </div>

                {content.features.map((feature, index) => (
                    <Card key={index}>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-lg">Keunggulan #{index + 1}</CardTitle>
                                {content.features.length > 1 && (
                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        onClick={() => removeFeature(index)}
                                    >
                                        <Trash2 className="w-4 h-4 mr-2" />
                                        Hapus
                                    </Button>
                                )}
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Icon</Label>
                                    <Select
                                        value={feature.icon}
                                        onValueChange={(value) => updateFeature(index, 'icon', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Pilih icon" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {iconOptions.map((option) => (
                                                <SelectItem key={option.value} value={option.value}>
                                                    {option.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label>Judul</Label>
                                    <Input
                                        value={feature.title}
                                        onChange={(e) => updateFeature(index, 'title', e.target.value)}
                                        placeholder="Judul keunggulan"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Deskripsi</Label>
                                <Textarea
                                    value={feature.description}
                                    onChange={(e) => updateFeature(index, 'description', e.target.value)}
                                    placeholder="Deskripsi keunggulan..."
                                    rows={3}
                                />
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
