'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Save, Eye, Loader2, Plus, Trash2, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Founder {
    name: string;
    role: string;
    vision: string;
    quote: string;
    image: string;
}

interface FoundersContent {
    title: string;
    subtitle: string;
    founders: Founder[];
}

export default function RDIFoundersEditor() {
    const { toast } = useToast();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);
    const [content, setContent] = useState<FoundersContent>({
        title: "Bertemu Para Pendiri",
        subtitle: "Visi dan dedikasi untuk membentuk masa depan pendidikan Indonesia",
        founders: [
            {
                name: "Rosman Djohan",
                role: "Founder & CEO",
                vision: "Visi Global",
                quote: "Membawa talenta Indonesia ke panggung dunia melalui pendidikan berkualitas.",
                image: "/images/founder-rosman.jpg",
            },
            {
                name: "Co-Founder",
                role: "Director of Operations",
                vision: "Komitmen Kualitas",
                quote: "Menjamin setiap program kami memenuhi standar internasional tertinggi.",
                image: "/images/founder-2.jpg",
            },
        ]
    });

    // Fetch existing content
    useEffect(() => {
        const fetchContent = async () => {
            try {
                const response = await fetch('/api/cms/rdi?section=rdi-founders');
                const data = await response.json();

                if (data.success && data.data) {
                    setContent(data.data.content as FoundersContent);
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
                    section: 'rdi-founders',
                    content,
                    isPublished: true,
                }),
            });

            const data = await response.json();

            if (data.success) {
                toast({
                    title: 'Berhasil',
                    description: 'Konten founders section berhasil disimpan',
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

    const addFounder = () => {
        setContent({
            ...content,
            founders: [
                ...content.founders,
                {
                    name: '',
                    role: '',
                    vision: '',
                    quote: '',
                    image: '/images/founder-placeholder.jpg',
                }
            ]
        });
    };

    const removeFounder = (index: number) => {
        setContent({
            ...content,
            founders: content.founders.filter((_, i) => i !== index)
        });
    };

    const updateFounder = (index: number, field: keyof Founder, value: string) => {
        const newFounders = [...content.founders];
        newFounders[index] = {
            ...newFounders[index],
            [field]: value
        };
        setContent({
            ...content,
            founders: newFounders
        });
    };

    const handleImageUpload = async (founderIndex: number, file: File) => {
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            toast({
                title: 'Error',
                description: 'File harus berupa gambar',
                variant: 'destructive',
            });
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            toast({
                title: 'Error',
                description: 'Ukuran file maksimal 5MB',
                variant: 'destructive',
            });
            return;
        }

        setUploadingIndex(founderIndex);

        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await fetch('/api/upload/image?type=founder', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (data.success) {
                updateFounder(founderIndex, 'image', data.url);
                toast({
                    title: 'Berhasil',
                    description: 'Foto berhasil diupload',
                });
            } else {
                throw new Error(data.error || 'Upload failed');
            }
        } catch (error) {
            console.error('Error uploading image:', error);
            toast({
                title: 'Error',
                description: 'Gagal mengupload foto',
                variant: 'destructive',
            });
        } finally {
            setUploadingIndex(null);
        }
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
                    <h1 className="text-lg sm:text-2xl lg:text-3xl font-bold text-foreground">Edit Founders Section</h1>
                    <p className="mt-1 text-muted-foreground">
                        Kelola informasi para pendiri Rosman Djohan Institute
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" asChild>
                        <Link href="/#tentang-kami" target="_blank">
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
                        Edit judul dan deskripsi untuk founders section
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="title">Judul Section</Label>
                        <Input
                            id="title"
                            value={content.title}
                            onChange={(e) => setContent({ ...content, title: e.target.value })}
                            placeholder="Bertemu Para Pendiri"
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

            {/* Founders List */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-foreground">Daftar Pendiri</h2>
                    <Button onClick={addFounder} size="sm">
                        <Plus className="w-4 h-4 mr-2" />
                        Tambah Pendiri
                    </Button>
                </div>

                {content.founders.map((founder, index) => (
                    <Card key={index}>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-lg">Pendiri #{index + 1}</CardTitle>
                                {content.founders.length > 1 && (
                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        onClick={() => removeFounder(index)}
                                    >
                                        <Trash2 className="w-4 h-4 mr-2" />
                                        Hapus
                                    </Button>
                                )}
                            </div>
                        </CardHeader>
                        <CardContent className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Nama Lengkap</Label>
                                <Input
                                    value={founder.name}
                                    onChange={(e) => updateFounder(index, 'name', e.target.value)}
                                    placeholder="Nama pendiri"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Jabatan</Label>
                                <Input
                                    value={founder.role}
                                    onChange={(e) => updateFounder(index, 'role', e.target.value)}
                                    placeholder="Founder & CEO"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Label Visi</Label>
                                <Input
                                    value={founder.vision}
                                    onChange={(e) => updateFounder(index, 'vision', e.target.value)}
                                    placeholder="Visi Global"
                                />
                            </div>


                            <div className="space-y-2 md:col-span-2">
                                <Label>Foto Pendiri</Label>

                                {/* Upload Button */}
                                <div className="flex gap-2">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="w-full"
                                        disabled={uploadingIndex === index}
                                        onClick={() => {
                                            const input = document.createElement('input');
                                            input.type = 'file';
                                            input.accept = 'image/*';
                                            input.onchange = (e) => {
                                                const file = (e.target as HTMLInputElement).files?.[0];
                                                if (file) handleImageUpload(index, file);
                                            };
                                            input.click();
                                        }}
                                    >
                                        {uploadingIndex === index ? (
                                            <>
                                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                Uploading...
                                            </>
                                        ) : (
                                            <>
                                                <Upload className="w-4 h-4 mr-2" />
                                                Upload Foto
                                            </>
                                        )}
                                    </Button>
                                </div>

                                {/* Manual URL Input */}
                                <div className="space-y-2">
                                    <Label className="text-xs text-muted-foreground">Atau masukkan URL manual</Label>
                                    <Input
                                        value={founder.image}
                                        onChange={(e) => updateFounder(index, 'image', e.target.value)}
                                        placeholder="/media/founders/photo.jpg"
                                    />
                                </div>

                                {/* Photo Preview */}
                                {founder.image && (
                                    <div className="mt-2 p-4 border rounded-lg bg-muted/30">
                                        <Label className="text-xs text-muted-foreground mb-2 block">Preview</Label>
                                        <div className="flex items-center gap-4">
                                            <div className="relative w-24 h-24 rounded-full overflow-hidden bg-muted border-2 border-border">
                                                <Image
                                                    src={founder.image}
                                                    alt={founder.name}
                                                    fill
                                                    className="object-cover"
                                                    onError={(e) => {
                                                        (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="96" height="96"%3E%3Ccircle cx="48" cy="48" r="48" fill="%23ddd"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="12" fill="%23999"%3ENo Photo%3C/text%3E%3C/svg%3E';
                                                    }}
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-sm font-medium">{founder.name || 'Nama Pendiri'}</p>
                                                <p className="text-xs text-muted-foreground">{founder.role || 'Jabatan'}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
