'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Save, Eye, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CTAContent {
    title: string;
    subtitle: string;
    button1Text: string;
    button2Text: string;
    waNumberOverseas: string;
    waNumberHaltec: string;
    messageOverseas: string;
    messageHaltec: string;
    additionalInfo: string;
}

export default function CTAEditor() {
    const { toast } = useToast();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [content, setContent] = useState<CTAContent>({
        title: 'Mulai Langkah Anda Sekarang',
        subtitle: 'Hubungi kami untuk konsultasi gratis dan dapatkan informasi lengkap tentang program yang Anda minati',
        button1Text: 'Konsultasi Program Luar Negeri',
        button2Text: 'Daftar Training Halal',
        waNumberOverseas: '6281234567890',
        waNumberHaltec: '6281234567891',
        messageOverseas: 'Halo, saya ingin konsultasi tentang Program Luar Negeri',
        messageHaltec: 'Halo, saya ingin mendaftar Training Halal (HALTEC)',
        additionalInfo: '💬 Tim kami siap membantu Anda 24/7',
    });

    useEffect(() => {
        const fetchContent = async () => {
            try {
                const response = await fetch('/api/cms/rdi?section=rdi-cta');
                const data = await response.json();

                if (data.success && data.data) {
                    setContent(data.data.content as CTAContent);
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
                    section: 'rdi-cta',
                    content,
                    isPublished: true,
                }),
            });

            const data = await response.json();

            if (data.success) {
                toast({
                    title: 'Berhasil',
                    description: 'Konten CTA berhasil disimpan',
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
                    <h1 className="text-lg sm:text-2xl lg:text-3xl font-bold text-foreground">Edit CTA Section</h1>
                    <p className="mt-1 text-muted-foreground">
                        Kelola call-to-action dan kontak WhatsApp
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" asChild>
                        <Link href="/#kontak" target="_blank">
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
                        Edit judul dan deskripsi CTA section
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="title">Judul CTA</Label>
                        <Input
                            id="title"
                            value={content.title}
                            onChange={(e) => setContent({ ...content, title: e.target.value })}
                            placeholder="Mulai Langkah Anda Sekarang"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="subtitle">Sub-judul</Label>
                        <Textarea
                            id="subtitle"
                            value={content.subtitle}
                            onChange={(e) => setContent({ ...content, subtitle: e.target.value })}
                            placeholder="Deskripsi call to action..."
                            rows={3}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="additionalInfo">Info Tambahan</Label>
                        <Input
                            id="additionalInfo"
                            value={content.additionalInfo}
                            onChange={(e) => setContent({ ...content, additionalInfo: e.target.value })}
                            placeholder="💬 Tim kami siap membantu Anda 24/7"
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Program Luar Negeri CTA */}
            <Card>
                <CardHeader>
                    <CardTitle>CTA Program Luar Negeri</CardTitle>
                    <CardDescription>
                        Konfigurasi tombol WhatsApp untuk program luar negeri
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="button1Text">Text Tombol</Label>
                        <Input
                            id="button1Text"
                            value={content.button1Text}
                            onChange={(e) => setContent({ ...content, button1Text: e.target.value })}
                            placeholder="Konsultasi Program Luar Negeri"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="waNumberOverseas">Nomor WhatsApp</Label>
                        <Input
                            id="waNumberOverseas"
                            value={content.waNumberOverseas}
                            onChange={(e) => setContent({ ...content, waNumberOverseas: e.target.value })}
                            placeholder="6281234567890"
                        />
                        <p className="text-xs text-muted-foreground">
                            Format: 62xxxxxxxxxx (tanpa +, spasi, atau tanda hubung)
                        </p>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="messageOverseas">Pesan Default</Label>
                        <Textarea
                            id="messageOverseas"
                            value={content.messageOverseas}
                            onChange={(e) => setContent({ ...content, messageOverseas: e.target.value })}
                            placeholder="Pesan yang otomatis muncul saat klik tombol..."
                            rows={2}
                        />
                    </div>
                </CardContent>
            </Card>

            {/* HALTEC CTA */}
            <Card>
                <CardHeader>
                    <CardTitle>CTA Training Halal (HALTEC)</CardTitle>
                    <CardDescription>
                        Konfigurasi tombol WhatsApp untuk training halal
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="button2Text">Text Tombol</Label>
                        <Input
                            id="button2Text"
                            value={content.button2Text}
                            onChange={(e) => setContent({ ...content, button2Text: e.target.value })}
                            placeholder="Daftar Training Halal"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="waNumberHaltec">Nomor WhatsApp</Label>
                        <Input
                            id="waNumberHaltec"
                            value={content.waNumberHaltec}
                            onChange={(e) => setContent({ ...content, waNumberHaltec: e.target.value })}
                            placeholder="6281234567891"
                        />
                        <p className="text-xs text-muted-foreground">
                            Format: 62xxxxxxxxxx (tanpa +, spasi, atau tanda hubung)
                        </p>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="messageHaltec">Pesan Default</Label>
                        <Textarea
                            id="messageHaltec"
                            value={content.messageHaltec}
                            onChange={(e) => setContent({ ...content, messageHaltec: e.target.value })}
                            placeholder="Pesan yang otomatis muncul saat klik tombol..."
                            rows={2}
                        />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
