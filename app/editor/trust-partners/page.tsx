'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Save, Eye, Loader2, Plus, Trash2, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Partner {
    name: string;
    logo: string;
}

interface TrustPartnersContent {
    tagline: string;
    title: string;
    partners: Partner[];
}

export default function TrustPartnersEditor() {
    const { toast } = useToast();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);
    const [content, setContent] = useState<TrustPartnersContent>({
        tagline: 'Dipercaya Oleh',
        title: 'Institusi Pendidikan Internasional & Lembaga Halal Terkemuka',
        partners: [
            { name: 'Goethe Institut', logo: '/logos/goethe.png' },
            { name: 'Chunghua University', logo: '/logos/chunghua.png' },
            { name: 'Izumi Corporation', logo: '/logos/izumi.png' },
        ],
    });

    useEffect(() => {
        const fetchContent = async () => {
            try {
                const response = await fetch('/api/cms/rdi?section=rdi-trust-partners');
                const data = await response.json();

                if (data.success && data.data) {
                    setContent(data.data.content as TrustPartnersContent);
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
                    section: 'rdi-trust-partners',
                    content,
                    isPublished: true,
                }),
            });

            const data = await response.json();

            if (data.success) {
                toast({
                    title: 'Berhasil',
                    description: 'Konten Trust Partners berhasil disimpan',
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

    const addPartner = () => {
        setContent({
            ...content,
            partners: [...content.partners, { name: 'New Partner', logo: '/logos/partner.png' }]
        });
    };

    const removePartner = (index: number) => {
        setContent({
            ...content,
            partners: content.partners.filter((_, i) => i !== index)
        });
    };

    const updatePartner = (index: number, field: keyof Partner, value: string) => {
        const newPartners = [...content.partners];
        newPartners[index] = { ...newPartners[index], [field]: value };
        setContent({ ...content, partners: newPartners });
    };

    const handleFileUpload = async (index: number, file: File) => {
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

        setUploadingIndex(index);

        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await fetch('/api/upload/image?type=logo', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (data.success) {
                updatePartner(index, 'logo', data.url);
                toast({
                    title: 'Berhasil',
                    description: 'Logo berhasil diupload',
                });
            } else {
                throw new Error(data.error || 'Upload failed');
            }
        } catch (error) {
            console.error('Error uploading file:', error);
            toast({
                title: 'Error',
                description: 'Gagal mengupload logo',
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
                    <h1 className="text-lg sm:text-2xl lg:text-3xl font-bold text-foreground">Edit Trust Partners Section</h1>
                    <p className="mt-1 text-muted-foreground">
                        Kelola partner dan institusi yang dipercaya RDI
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
                        Edit tagline dan judul untuk Trust Partners section
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="tagline">Tagline</Label>
                        <Input
                            id="tagline"
                            value={content.tagline}
                            onChange={(e) => setContent({ ...content, tagline: e.target.value })}
                            placeholder="Dipercaya Oleh"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="title">Judul Section</Label>
                        <Input
                            id="title"
                            value={content.title}
                            onChange={(e) => setContent({ ...content, title: e.target.value })}
                            placeholder="Institusi Pendidikan Internasional..."
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Partners */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-foreground">List Partner</h2>
                    <Button onClick={addPartner} size="sm">
                        <Plus className="w-4 h-4 mr-2" />
                        Tambah Partner
                    </Button>
                </div>

                {content.partners.map((partner, index) => (
                    <Card key={index}>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-lg">Partner #{index + 1}</CardTitle>
                                {content.partners.length > 1 && (
                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        onClick={() => removePartner(index)}
                                    >
                                        <Trash2 className="w-4 h-4 mr-2" />
                                        Hapus
                                    </Button>
                                )}
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>Nama Partner</Label>
                                <Input
                                    value={partner.name}
                                    onChange={(e) => updatePartner(index, 'name', e.target.value)}
                                    placeholder="Goethe Institut"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Logo Partner</Label>

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
                                                if (file) handleFileUpload(index, file);
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
                                                Upload Logo
                                            </>
                                        )}
                                    </Button>
                                </div>

                                {/* Or Manual URL */}
                                <div className="space-y-2">
                                    <Label className="text-xs text-muted-foreground">Atau masukkan URL manual</Label>
                                    <Input
                                        value={partner.logo}
                                        onChange={(e) => updatePartner(index, 'logo', e.target.value)}
                                        placeholder="/logos/partner.png"
                                    />
                                </div>

                                {/* Image Preview */}
                                {partner.logo && (
                                    <div className="mt-2 p-4 border rounded-lg bg-muted/30">
                                        <Label className="text-xs text-muted-foreground mb-2 block">Preview</Label>
                                        <div className="relative w-32 h-16 mx-auto bg-white rounded flex items-center justify-center">
                                            <Image
                                                src={partner.logo}
                                                alt={partner.name}
                                                width={128}
                                                height={64}
                                                className="object-contain"
                                                onError={(e) => {
                                                    (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="128" height="64"%3E%3Crect width="128" height="64" fill="%23ddd"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="12" fill="%23999"%3ENo Image%3C/text%3E%3C/svg%3E';
                                                }}
                                            />
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
