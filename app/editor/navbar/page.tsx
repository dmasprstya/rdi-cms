'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Save, Eye, Loader2, Plus, Trash2, Upload, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface MenuItem {
    label: string;
    href: string;
}

interface ProgramItem {
    title: string;
    description: string;
    href: string;
}

interface NavbarContent {
    logoText: string;
    logoTextColor?: string;
    logoUrl?: string;
    menuItems: MenuItem[];
    programItems: ProgramItem[];
    loginText: string;
    contactText: string;
}

export default function NavbarEditor() {
    const { toast } = useToast();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [content, setContent] = useState<NavbarContent>({
        logoText: 'Rosman Djohan Institute',
        logoTextColor: '#000000',
        logoUrl: '/logos/rdi-logo.png',
        menuItems: [
            { label: 'Beranda', href: '/' },
            { label: 'Berita', href: '/#berita' },
            { label: 'Tentang Kami', href: '/#tentang-kami' },
        ],
        programItems: [
            {
                title: 'Program Luar Negeri',
                description: 'Kuliah & kerja di Jerman, Taiwan, dan Jepang',
                href: '/program/luar-negeri',
            },
            {
                title: 'HALTEC (Halal Training)',
                description: 'Pelatihan & sertifikasi profesi halal untuk industri',
                href: '/program/haltec',
            },
        ],
        loginText: 'LOGIN',
        contactText: 'DAFTAR',
    });

    useEffect(() => {
        const fetchContent = async () => {
            try {
                const response = await fetch('/api/cms/rdi?section=rdi-navbar');
                const data = await response.json();

                if (data.success && data.data) {
                    setContent(data.data.content as NavbarContent);
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
                    section: 'rdi-navbar',
                    content,
                    isPublished: true,
                }),
            });

            const data = await response.json();

            if (data.success) {
                toast({
                    title: 'Berhasil',
                    description: 'Konten navbar berhasil disimpan',
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

    const addMenuItem = () => {
        setContent({
            ...content,
            menuItems: [...content.menuItems, { label: 'New Menu', href: '/' }]
        });
    };

    const removeMenuItem = (index: number) => {
        setContent({
            ...content,
            menuItems: content.menuItems.filter((_, i) => i !== index)
        });
    };

    const updateMenuItem = (index: number, field: keyof MenuItem, value: string) => {
        const newItems = [...content.menuItems];
        newItems[index] = { ...newItems[index], [field]: value };
        setContent({ ...content, menuItems: newItems });
    };

    const addProgramItem = () => {
        setContent({
            ...content,
            programItems: [...content.programItems, { title: 'New Program', description: '', href: '/' }]
        });
    };

    const removeProgramItem = (index: number) => {
        setContent({
            ...content,
            programItems: content.programItems.filter((_, i) => i !== index)
        });
    };

    const updateProgramItem = (index: number, field: keyof ProgramItem, value: string) => {
        const newItems = [...content.programItems];
        newItems[index] = { ...newItems[index], [field]: value };
        setContent({ ...content, programItems: newItems });
    };

    const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
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

        setUploading(true);
        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('folder', 'logos');

            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (data.success) {
                setContent({ ...content, logoUrl: data.url });
                toast({
                    title: 'Berhasil',
                    description: 'Logo berhasil diupload',
                });
            } else {
                throw new Error(data.error || 'Failed to upload');
            }
        } catch (error) {
            console.error('Error uploading logo:', error);
            toast({
                title: 'Error',
                description: 'Gagal mengupload logo',
                variant: 'destructive',
            });
        } finally {
            setUploading(false);
        }
    };

    const removeLogo = () => {
        setContent({ ...content, logoUrl: undefined });
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
                    <h1 className="text-lg sm:text-2xl lg:text-3xl font-bold text-foreground">Edit Navbar</h1>
                    <p className="mt-1 text-muted-foreground">
                        Kelola menu navigasi dan logo RDI
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

            {/* Logo Section */}
            <Card>
                <CardHeader>
                    <CardTitle>Logo & Brand</CardTitle>
                    <CardDescription>
                        Edit text logo yang ditampilkan di navbar
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid md:grid-cols-[1fr,auto] gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="logoText">Text Logo</Label>
                            <Input
                                id="logoText"
                                value={content.logoText}
                                onChange={(e) => setContent({ ...content, logoText: e.target.value })}
                                placeholder="Rosman Djohan Institute"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="logoTextColor">Warna Text</Label>
                            <div className="flex gap-2">
                                <Input
                                    type="color"
                                    id="logoTextColor"
                                    value={content.logoTextColor || '#000000'}
                                    onChange={(e) => setContent({ ...content, logoTextColor: e.target.value })}
                                    className="w-16 h-10 p-1 cursor-pointer"
                                />
                                <Input
                                    type="text"
                                    value={content.logoTextColor || '#000000'}
                                    onChange={(e) => setContent({ ...content, logoTextColor: e.target.value })}
                                    placeholder="#000000"
                                    className="w-28 h-10 font-mono text-sm"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Logo Upload */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <Label>Logo Image</Label>
                            {content.logoUrl && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={removeLogo}
                                    className="text-destructive hover:text-destructive"
                                >
                                    <X className="w-4 h-4 mr-1" />
                                    Hapus Logo
                                </Button>
                            )}
                        </div>

                        {/* Logo Preview */}
                        {content.logoUrl && (
                            <div className="relative w-32 h-32 border-2 border-border rounded-lg overflow-hidden bg-muted">
                                <Image
                                    src={content.logoUrl}
                                    alt="Logo Preview"
                                    fill
                                    className="object-contain p-2"
                                />
                            </div>
                        )}

                        {/* Upload Button */}
                        <div>
                            <Input
                                type="file"
                                id="logo-upload"
                                accept="image/*"
                                onChange={handleLogoUpload}
                                className="hidden"
                            />
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => document.getElementById('logo-upload')?.click()}
                                disabled={uploading}
                                className="w-full"
                            >
                                {uploading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Mengupload...
                                    </>
                                ) : (
                                    <>
                                        <Upload className="w-4 h-4 mr-2" />
                                        Upload Logo Baru
                                    </>
                                )}
                            </Button>
                            <p className="text-xs text-muted-foreground mt-2">
                                Format: JPG, PNG, SVG (Max 5MB)
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Menu Items */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-foreground">Menu Navigasi</h2>
                    <Button onClick={addMenuItem} size="sm">
                        <Plus className="w-4 h-4 mr-2" />
                        Tambah Menu
                    </Button>
                </div>

                {content.menuItems.map((item, index) => (
                    <Card key={index}>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-lg">Menu #{index + 1}</CardTitle>
                                {content.menuItems.length > 1 && (
                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        onClick={() => removeMenuItem(index)}
                                    >
                                        <Trash2 className="w-4 h-4 mr-2" />
                                        Hapus
                                    </Button>
                                )}
                            </div>
                        </CardHeader>
                        <CardContent className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Label Menu</Label>
                                <Input
                                    value={item.label}
                                    onChange={(e) => updateMenuItem(index, 'label', e.target.value)}
                                    placeholder="Beranda"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Link URL</Label>
                                <Input
                                    value={item.href}
                                    onChange={(e) => updateMenuItem(index, 'href', e.target.value)}
                                    placeholder="/"
                                />
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Program Dropdown Items */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-foreground">Dropdown Program</h2>
                    <Button onClick={addProgramItem} size="sm">
                        <Plus className="w-4 h-4 mr-2" />
                        Tambah Program
                    </Button>
                </div>

                {content.programItems.map((item, index) => (
                    <Card key={index}>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-lg">Program #{index + 1}</CardTitle>
                                {content.programItems.length > 1 && (
                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        onClick={() => removeProgramItem(index)}
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
                                    <Label>Judul Program</Label>
                                    <Input
                                        value={item.title}
                                        onChange={(e) => updateProgramItem(index, 'title', e.target.value)}
                                        placeholder="Program Luar Negeri"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Link URL</Label>
                                    <Input
                                        value={item.href}
                                        onChange={(e) => updateProgramItem(index, 'href', e.target.value)}
                                        placeholder="/program/luar-negeri"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Deskripsi</Label>
                                <Input
                                    value={item.description}
                                    onChange={(e) => updateProgramItem(index, 'description', e.target.value)}
                                    placeholder="Kuliah & kerja di Jerman, Taiwan, dan Jepang"
                                />
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Action Buttons */}
            <Card>
                <CardHeader>
                    <CardTitle>Tombol Aksi</CardTitle>
                    <CardDescription>
                        Edit text untuk tombol login dan kontak
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="loginText">Text Tombol Login</Label>
                        <Input
                            id="loginText"
                            value={content.loginText}
                            onChange={(e) => setContent({ ...content, loginText: e.target.value })}
                            placeholder="LOGIN"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="contactText">Text Tombol Kontak</Label>
                        <Input
                            id="contactText"
                            value={content.contactText}
                            onChange={(e) => setContent({ ...content, contactText: e.target.value })}
                            placeholder="DAFTAR"
                        />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
