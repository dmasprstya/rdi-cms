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

interface NewsItem {
    title: string;
    excerpt: string;
    category: string;
    date: string;
    image: string;
    slug: string;
}

interface LatestNewsContent {
    title: string;
    subtitle: string;
    newsItems: NewsItem[];
    viewAllText: string;
    viewAllLink: string;
}

export default function LatestNewsEditor() {
    const { toast } = useToast();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [content, setContent] = useState<LatestNewsContent>({
        title: 'Update Kegiatan Terbaru',
        subtitle: 'Ikuti perkembangan dan pencapaian terbaru kami',
        newsItems: [
            {
                title: '30 Siswa Rosman Djohan Berangkat ke Taiwan',
                excerpt: 'Keberangkatan gelombang pertama siswa program kuliah sambil kerja di Taiwan...',
                category: 'Overseas',
                date: '2024-12-15',
                image: '/images/news-taiwan.jpg',
                slug: 'siswa-berangkat-taiwan',
            },
            {
                title: 'Pelatihan Juru Sembelih Halal Batch 5 Sukses Dilaksanakan',
                excerpt: 'Program pelatihan JULEHA batch 5 telah sukses meluluskan 25 peserta dengan sertifikasi resmi...',
                category: 'Haltec',
                date: '2024-12-10',
                image: '/images/news-juleha.jpg',
                slug: 'pelatihan-juleha-batch-5',
            },
            {
                title: 'Kunjungan Mitra dari Jerman untuk Kerjasama Ausbildung',
                excerpt: 'Delegasi dari Jerman berkunjung untuk membahas kerjasama program Ausbildung tahun 2025...',
                category: 'Overseas',
                date: '2024-12-05',
                image: '/images/news-germany.jpg',
                slug: 'kunjungan-mitra-jerman',
            },
        ],
        viewAllText: 'Lihat Semua Berita',
        viewAllLink: '/berita',
    });

    useEffect(() => {
        const fetchContent = async () => {
            try {
                const response = await fetch('/api/cms/rdi?section=rdi-latest-news');
                const data = await response.json();

                if (data.success && data.data) {
                    setContent(data.data.content as LatestNewsContent);
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
                    section: 'rdi-latest-news',
                    content,
                    isPublished: true,
                }),
            });

            const data = await response.json();

            if (data.success) {
                toast({
                    title: 'Berhasil',
                    description: 'Konten Latest News berhasil disimpan',
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

    const addNews = () => {
        setContent({
            ...content,
            newsItems: [
                ...content.newsItems,
                {
                    title: 'Berita Baru',
                    excerpt: 'Deskripsi singkat berita...',
                    category: 'Overseas',
                    date: new Date().toISOString().split('T')[0],
                    image: '/images/news.jpg',
                    slug: 'berita-baru',
                }
            ]
        });
    };

    const removeNews = (index: number) => {
        setContent({
            ...content,
            newsItems: content.newsItems.filter((_, i) => i !== index)
        });
    };

    const updateNews = (index: number, field: keyof NewsItem, value: string) => {
        const newNews = [...content.newsItems];
        newNews[index] = { ...newNews[index], [field]: value };
        setContent({ ...content, newsItems: newNews });
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
                    <h1 className="text-lg sm:text-2xl lg:text-3xl font-bold text-foreground">Edit Latest News Section</h1>
                    <p className="mt-1 text-muted-foreground">
                        Kelola berita dan update kegiatan RDI
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" asChild>
                        <Link href="/#berita" target="_blank">
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
                        Edit judul dan subtitle untuk Latest News section
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="title">Judul Section</Label>
                        <Input
                            id="title"
                            value={content.title}
                            onChange={(e) => setContent({ ...content, title: e.target.value })}
                            placeholder="Update Kegiatan Terbaru"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="subtitle">Sub-judul</Label>
                        <Input
                            id="subtitle"
                            value={content.subtitle}
                            onChange={(e) => setContent({ ...content, subtitle: e.target.value })}
                            placeholder="Ikuti perkembangan dan pencapaian terbaru kami"
                        />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="viewAllText">Text Button &quot;View All&quot;</Label>
                            <Input
                                id="viewAllText"
                                value={content.viewAllText}
                                onChange={(e) => setContent({ ...content, viewAllText: e.target.value })}
                                placeholder="Lihat Semua Berita"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="viewAllLink">Link Button &quot;View All&quot;</Label>
                            <Input
                                id="viewAllLink"
                                value={content.viewAllLink}
                                onChange={(e) => setContent({ ...content, viewAllLink: e.target.value })}
                                placeholder="/berita"
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* News Items */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-foreground">Berita & Update</h2>
                    <Button onClick={addNews} size="sm">
                        <Plus className="w-4 h-4 mr-2" />
                        Tambah Berita
                    </Button>
                </div>

                {content.newsItems.map((news, index) => (
                    <Card key={index}>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-lg">Berita #{index + 1}</CardTitle>
                                {content.newsItems.length > 1 && (
                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        onClick={() => removeNews(index)}
                                    >
                                        <Trash2 className="w-4 h-4 mr-2" />
                                        Hapus
                                    </Button>
                                )}
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>Judul Berita</Label>
                                <Input
                                    value={news.title}
                                    onChange={(e) => updateNews(index, 'title', e.target.value)}
                                    placeholder="Judul berita..."
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Excerpt (Ringkasan)</Label>
                                <Textarea
                                    value={news.excerpt}
                                    onChange={(e) => updateNews(index, 'excerpt', e.target.value)}
                                    placeholder="Ringkasan singkat berita..."
                                    rows={2}
                                />
                            </div>

                            <div className="grid md:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label>Kategori</Label>
                                    <Select
                                        value={news.category}
                                        onValueChange={(value) => updateNews(index, 'category', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Pilih kategori" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Overseas">Overseas</SelectItem>
                                            <SelectItem value="Haltec">Haltec</SelectItem>
                                            <SelectItem value="General">General</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label>Tanggal</Label>
                                    <Input
                                        type="date"
                                        value={news.date}
                                        onChange={(e) => updateNews(index, 'date', e.target.value)}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label>Slug URL</Label>
                                    <Input
                                        value={news.slug}
                                        onChange={(e) => updateNews(index, 'slug', e.target.value)}
                                        placeholder="berita-slug"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Image URL</Label>
                                <Input
                                    value={news.image}
                                    onChange={(e) => updateNews(index, 'image', e.target.value)}
                                    placeholder="/images/news.jpg"
                                />
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
