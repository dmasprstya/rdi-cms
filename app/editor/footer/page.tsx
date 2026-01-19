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

interface SocialMedia {
    facebook: string;
    instagram: string;
    tiktok: string;
}

interface Legalitas {
    nib: string;
    izinLpk: string;
    npwp: string;
    status: string;
}

interface Contact {
    address: string;
    email: string;
    phone: string;
}

interface FooterContent {
    description: string;
    socialMedia: SocialMedia;
    legalitas: Legalitas;
    contact: Contact;
    copyright: string;
}

export default function FooterEditor() {
    const { toast } = useToast();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [content, setContent] = useState<FooterContent>({
        description: 'Rosman Djohan Institute - Lembaga pendidikan vokasi terpadu untuk karir internasional dan sertifikasi halal.',
        socialMedia: {
            facebook: '#',
            instagram: '#',
            tiktok: '#',
        },
        legalitas: {
            nib: '1234567890123456',
            izinLpk: 'SK/012/2024',
            npwp: '12.345.678.9-012.000',
            status: 'Terakreditasi Resmi',
        },
        contact: {
            address: 'Jl. Pendidikan No. 123, Jakarta Selatan, DKI Jakarta 12345',
            email: 'info@rosmandjohan.id',
            phone: '+62 21 1234 5678',
        },
        copyright: 'Rosman Djohan Institute. All rights reserved.',
    });

    useEffect(() => {
        const fetchContent = async () => {
            try {
                const response = await fetch('/api/cms/rdi?section=rdi-footer');
                const data = await response.json();

                if (data.success && data.data) {
                    setContent(data.data.content as FooterContent);
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
                    section: 'rdi-footer',
                    content,
                    isPublished: true,
                }),
            });

            const data = await response.json();

            if (data.success) {
                toast({
                    title: 'Berhasil',
                    description: 'Konten footer berhasil disimpan',
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
                    <h1 className="text-lg sm:text-2xl lg:text-3xl font-bold text-foreground">Edit Footer</h1>
                    <p className="mt-1 text-muted-foreground">
                        Kelola informasi footer dan kontak RDI
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

            {/* Brand Description */}
            <Card>
                <CardHeader>
                    <CardTitle>Deskripsi Brand</CardTitle>
                    <CardDescription>
                        Deskripsi singkat tentang RDI yang ditampilkan di footer
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        <Label htmlFor="description">Deskripsi</Label>
                        <Textarea
                            id="description"
                            value={content.description}
                            onChange={(e) => setContent({ ...content, description: e.target.value })}
                            placeholder="Deskripsi institusi..."
                            rows={3}
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Social Media */}
            <Card>
                <CardHeader>
                    <CardTitle>Social Media Links</CardTitle>
                    <CardDescription>
                        Link ke akun social media RDI
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="facebook">Facebook URL</Label>
                        <Input
                            id="facebook"
                            value={content.socialMedia.facebook}
                            onChange={(e) => setContent({
                                ...content,
                                socialMedia: { ...content.socialMedia, facebook: e.target.value }
                            })}
                            placeholder="https://facebook.com/rosmandjohan"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="instagram">Instagram URL</Label>
                        <Input
                            id="instagram"
                            value={content.socialMedia.instagram}
                            onChange={(e) => setContent({
                                ...content,
                                socialMedia: { ...content.socialMedia, instagram: e.target.value }
                            })}
                            placeholder="https://instagram.com/rosmandjohan"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="tiktok">TikTok URL</Label>
                        <Input
                            id="tiktok"
                            value={content.socialMedia.tiktok}
                            onChange={(e) => setContent({
                                ...content,
                                socialMedia: { ...content.socialMedia, tiktok: e.target.value }
                            })}
                            placeholder="https://tiktok.com/@rosmandjohan"
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Legalitas */}
            <Card>
                <CardHeader>
                    <CardTitle>Informasi Legalitas</CardTitle>
                    <CardDescription>
                        Dokumen legal dan izin institusi
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="nib">NIB</Label>
                        <Input
                            id="nib"
                            value={content.legalitas.nib}
                            onChange={(e) => setContent({
                                ...content,
                                legalitas: { ...content.legalitas, nib: e.target.value }
                            })}
                            placeholder="1234567890123456"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="izinLpk">Izin LPK</Label>
                        <Input
                            id="izinLpk"
                            value={content.legalitas.izinLpk}
                            onChange={(e) => setContent({
                                ...content,
                                legalitas: { ...content.legalitas, izinLpk: e.target.value }
                            })}
                            placeholder="SK/012/2024"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="npwp">NPWP</Label>
                        <Input
                            id="npwp"
                            value={content.legalitas.npwp}
                            onChange={(e) => setContent({
                                ...content,
                                legalitas: { ...content.legalitas, npwp: e.target.value }
                            })}
                            placeholder="12.345.678.9-012.000"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="status">Status Akreditasi</Label>
                        <Input
                            id="status"
                            value={content.legalitas.status}
                            onChange={(e) => setContent({
                                ...content,
                                legalitas: { ...content.legalitas, status: e.target.value }
                            })}
                            placeholder="Terakreditasi Resmi"
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
                <CardHeader>
                    <CardTitle>Informasi Kontak</CardTitle>
                    <CardDescription>
                        Detail kontak institusi
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="address">Alamat</Label>
                        <Textarea
                            id="address"
                            value={content.contact.address}
                            onChange={(e) => setContent({
                                ...content,
                                contact: { ...content.contact, address: e.target.value }
                            })}
                            placeholder="Alamat lengkap institusi..."
                            rows={2}
                        />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                value={content.contact.email}
                                onChange={(e) => setContent({
                                    ...content,
                                    contact: { ...content.contact, email: e.target.value }
                                })}
                                placeholder="info@rosmandjohan.id"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="phone">Telepon</Label>
                            <Input
                                id="phone"
                                value={content.contact.phone}
                                onChange={(e) => setContent({
                                    ...content,
                                    contact: { ...content.contact, phone: e.target.value }
                                })}
                                placeholder="+62 21 1234 5678"
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Copyright */}
            <Card>
                <CardHeader>
                    <CardTitle>Copyright</CardTitle>
                    <CardDescription>
                        Text copyright di bottom footer
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        <Label htmlFor="copyright">Copyright Text</Label>
                        <Input
                            id="copyright"
                            value={content.copyright}
                            onChange={(e) => setContent({ ...content, copyright: e.target.value })}
                            placeholder="Rosman Djohan Institute. All rights reserved."
                        />
                        <p className="text-xs text-muted-foreground">
                            Tahun akan otomatis ditambahkan: © {new Date().getFullYear()}
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
