'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
    ArrowLeft,
    Plus,
    Edit,
    Trash2,
    Eye,
    Loader2,
    Upload,
    X,
    ChevronLeft,
    ChevronRight,
    Search,
    FileText,
    ChevronDown,
    Save,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { RichTextEditor } from '@/components/editor/rich-text-editor';

interface NewsImage {
    imageUrl: string;
    caption: string | null;
    order: number;
}

interface NewsItem {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    featuredImage: string;
    status: 'draft' | 'published';
    category?: string;
    tags?: string[];
    publishedAt?: string;
    viewCount: number;
    createdAt: string;
    updatedAt: string;
    author: {
        id: string;
        name: string;
        email: string;
    };
    images?: NewsImage[];
}

interface LatestNewsContent {
    title: string;
    subtitle: string;
    viewAllText: string;
    viewAllLink: string;
}

// Helper function to generate slug from title
function generateSlug(title: string): string {
    return title
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '')
        .replace(/-+/g, '-')
        .trim();
}

export default function NewsEditor() {
    const { toast } = useToast();
    const [loading, setLoading] = useState(true);
    const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
    const [filteredNews, setFilteredNews] = useState<NewsItem[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const itemsPerPage = 10;

    // Filters
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');

    // Latest News Section Config
    const [sectionConfigOpen, setSectionConfigOpen] = useState(false);
    const [sectionLoading, setSectionLoading] = useState(true);
    const [savingSectionConfig, setSavingSectionConfig] = useState(false);
    const [sectionContent, setSectionContent] = useState<LatestNewsContent>({
        title: 'Update Kegiatan Terbaru',
        subtitle: 'Ikuti perkembangan dan pencapaian terbaru kami',
        viewAllText: 'Lihat Semua Berita',
        viewAllLink: '/berita',
    });

    // Form state
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [uploadingFeatured, setUploadingFeatured] = useState(false);
    const [uploadingContent, setUploadingContent] = useState(false);

    // Delete state
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [newsToDelete, setNewsToDelete] = useState<string | null>(null);

    const [formData, setFormData] = useState<Partial<NewsItem>>({
        title: '',
        slug: '',
        excerpt: '',
        content: '',
        featuredImage: '',
        status: 'draft',
        category: '',
        tags: [],
        images: [],
    });

    useEffect(() => {
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPage, statusFilter]);

    useEffect(() => {
        // Apply search filter
        if (searchQuery) {
            const filtered = newsItems.filter((item) =>
                item.title.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setFilteredNews(filtered);
        } else {
            setFilteredNews(newsItems);
        }
    }, [searchQuery, newsItems]);

    const fetchData = async () => {
        setLoading(true);

        // Fetch both news and section config in parallel
        const [newsResult, sectionResult] = await Promise.allSettled([
            fetchNews(),
            fetchSectionContent()
        ]);

        // Handle news result
        if (newsResult.status === 'rejected') {
            console.error('Error fetching news:', newsResult.reason);
            toast({
                title: 'Error',
                description: 'Gagal memuat berita',
                variant: 'destructive',
            });
        }

        // Handle section result independently
        if (sectionResult.status === 'rejected') {
            console.error('Error fetching section config:', sectionResult.reason);
            // Don't show error toast - section config is optional
        }

        setLoading(false);
        setSectionLoading(false);
    };

    const fetchNews = async () => {
        try {
            const params = new URLSearchParams({
                page: currentPage.toString(),
                limit: itemsPerPage.toString(),
            });

            if (statusFilter && statusFilter !== 'all') {
                params.append('status', statusFilter);
            }

            const response = await fetch(`/api/cms/news?${params}`);
            const data = await response.json();

            if (data.success) {
                setNewsItems(data.data.items);
                setFilteredNews(data.data.items);
                setTotalPages(data.data.pagination.totalPages);
            }
        } catch (error) {
            throw error;
        }
    };

    const fetchSectionContent = async () => {
        try {
            const response = await fetch('/api/cms/rdi?section=rdi-latest-news');
            const data = await response.json();

            if (data.success && data.data) {
                setSectionContent(data.data.content as LatestNewsContent);
            }
        } catch (error) {
            throw error;
        }
    };

    const handleSaveSectionConfig = async () => {
        setSavingSectionConfig(true);
        try {
            const response = await fetch('/api/cms/rdi', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    section: 'rdi-latest-news',
                    content: sectionContent,
                    isPublished: true,
                }),
            });

            const data = await response.json();

            if (data.success) {
                toast({
                    title: 'Berhasil',
                    description: 'Konfigurasi section berita berhasil disimpan',
                });
            } else {
                throw new Error(data.error || 'Failed to save');
            }
        } catch (error) {
            console.error('Error saving section config:', error);
            toast({
                title: 'Error',
                description: 'Gagal menyimpan konfigurasi section',
                variant: 'destructive',
            });
        } finally {
            setSavingSectionConfig(false);
        }
    };

    const openCreateForm = () => {
        setFormData({
            title: '',
            slug: '',
            excerpt: '',
            content: '',
            featuredImage: '',
            status: 'draft',
            category: '',
            tags: [],
            images: [],
        });
        setIsEditing(false);
        setIsFormOpen(true);
    };

    const openEditForm = async (newsId: string) => {
        try {
            const response = await fetch(`/api/cms/news/${newsId}`);
            const data = await response.json();

            if (data.success) {
                setFormData(data.data);
                setIsEditing(true);
                setIsFormOpen(true);
            }
        } catch (error) {
            console.error('Error fetching news:', error);
            toast({
                title: 'Error',
                description: 'Gagal memuat berita',
                variant: 'destructive',
            });
        }
    };

    const handleSave = async () => {
        // Validation
        if (!formData.title || !formData.excerpt || !formData.content || !formData.featuredImage) {
            toast({
                title: 'Error',
                description: 'Judul, ringkasan, konten, dan gambar utama wajib diisi',
                variant: 'destructive',
            });
            return;
        }

        setSaving(true);
        try {
            const url = isEditing ? `/api/cms/news/${formData.id}` : '/api/cms/news';
            const method = isEditing ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (data.success) {
                toast({
                    title: 'Berhasil',
                    description: isEditing ? 'Berita berhasil diupdate' : 'Berita berhasil dibuat',
                });
                setIsFormOpen(false);
                fetchNews();
            } else {
                throw new Error(data.error);
            }
        } catch (error: any) {
            console.error('Error saving news:', error);
            toast({
                title: 'Error',
                description: error.message || 'Gagal menyimpan berita',
                variant: 'destructive',
            });
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!newsToDelete) return;

        try {
            const response = await fetch(`/api/cms/news/${newsToDelete}`, {
                method: 'DELETE',
            });

            const data = await response.json();

            if (data.success) {
                toast({
                    title: 'Berhasil',
                    description: 'Berita berhasil dihapus',
                });
                fetchNews();
            } else {
                throw new Error(data.error);
            }
        } catch (error: any) {
            console.error('Error deleting news:', error);
            toast({
                title: 'Error',
                description: error.message || 'Gagal menghapus berita',
                variant: 'destructive',
            });
        } finally {
            setDeleteDialogOpen(false);
            setNewsToDelete(null);
        }
    };

    const handleFeaturedImageUpload = async (file: File) => {
        if (!file.type.startsWith('image/')) {
            toast({
                title: 'Error',
                description: 'File harus berupa gambar',
                variant: 'destructive',
            });
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            toast({
                title: 'Error',
                description: 'Ukuran file maksimal 5MB',
                variant: 'destructive',
            });
            return;
        }

        setUploadingFeatured(true);
        try {
            const formDataUpload = new FormData();
            formDataUpload.append('file', file);

            const response = await fetch('/api/upload/image?type=news', {
                method: 'POST',
                body: formDataUpload,
            });

            const data = await response.json();

            if (data.success) {
                setFormData({ ...formData, featuredImage: data.url });
                toast({
                    title: 'Berhasil',
                    description: 'Gambar berhasil diupload',
                });
            } else {
                throw new Error(data.error);
            }
        } catch (error: any) {
            console.error('Error uploading image:', error);
            toast({
                title: 'Error',
                description: error.message || 'Gagal mengupload gambar',
                variant: 'destructive',
            });
        } finally {
            setUploadingFeatured(false);
        }
    };

    const handleContentImagesUpload = async (files: FileList) => {
        const validFiles = Array.from(files).filter((file) => {
            if (!file.type.startsWith('image/')) return false;
            if (file.size > 5 * 1024 * 1024) return false;
            return true;
        });

        if (validFiles.length === 0) {
            toast({
                title: 'Error',
                description: 'Tidak ada gambar valid untuk diupload',
                variant: 'destructive',
            });
            return;
        }

        const currentImages = formData.images || [];
        if (currentImages.length + validFiles.length > 10) {
            toast({
                title: 'Error',
                description: 'Maksimal 10 gambar per berita',
                variant: 'destructive',
            });
            return;
        }

        setUploadingContent(true);
        try {
            const uploadPromises = validFiles.map(async (file) => {
                const formDataUpload = new FormData();
                formDataUpload.append('file', file);

                const response = await fetch('/api/upload/image?type=newsContent', {
                    method: 'POST',
                    body: formDataUpload,
                });

                const data = await response.json();
                if (data.success) {
                    return {
                        imageUrl: data.url,
                        caption: null,
                        order: currentImages.length,
                    } as NewsImage;
                }
                return null;
            });

            const uploadedImages = await Promise.all(uploadPromises);
            const validImages = uploadedImages.filter((img): img is NewsImage => img !== null);

            setFormData({
                ...formData,
                images: [...currentImages, ...validImages],
            });

            toast({
                title: 'Berhasil',
                description: `${validImages.length} gambar berhasil diupload`,
            });
        } catch (error: any) {
            console.error('Error uploading images:', error);
            toast({
                title: 'Error',
                description: error.message || 'Gagal mengupload gambar',
                variant: 'destructive',
            });
        } finally {
            setUploadingContent(false);
        }
    };

    const removeContentImage = (index: number) => {
        const images = [...(formData.images || [])];
        images.splice(index, 1);
        // Reorder
        images.forEach((img, idx) => {
            img.order = idx;
        });
        setFormData({ ...formData, images });
    };

    return (
        <div className="space-y-6 pb-20 lg:pb-0">
            {/* Latest News Section Configuration - Collapsible */}
            <Collapsible open={sectionConfigOpen} onOpenChange={setSectionConfigOpen}>
                <Card className="border-2 border-primary/40 bg-gradient-to-r from-primary/5 to-blue-500/5 shadow-md hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-3">
                        <CollapsibleTrigger className="flex items-center justify-between w-full group hover:opacity-80 transition-opacity">
                            <div className="text-left flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20">
                                        <span className="text-2xl">⚙️</span>
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <CardTitle className="text-lg font-bold text-foreground">
                                                Konfigurasi Section Berita
                                            </CardTitle>
                                            <span className="px-2.5 py-0.5 bg-primary text-primary-foreground text-xs font-semibold rounded-full">
                                                CONFIG
                                            </span>
                                        </div>
                                        <CardDescription className="mt-1 text-sm">
                                            📝 Pengaturan tampilan section berita di landing page
                                        </CardDescription>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-muted-foreground font-medium">
                                    {sectionConfigOpen ? 'Tutup' : 'Buka'}
                                </span>
                                <ChevronDown
                                    className={`w-6 h-6 text-primary transition-transform ${sectionConfigOpen ? 'rotate-180' : ''
                                        }`}
                                />
                            </div>
                        </CollapsibleTrigger>
                    </CardHeader>
                    <CollapsibleContent>
                        <CardContent className="space-y-4 pt-4 border-t">
                            {sectionLoading ? (
                                <div className="flex items-center justify-center py-8">
                                    <Loader2 className="w-6 h-6 animate-spin text-primary" />
                                </div>
                            ) : (
                                <>
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="section-title">Judul Section</Label>
                                            <Input
                                                id="section-title"
                                                value={sectionContent.title}
                                                onChange={(e) => setSectionContent({ ...sectionContent, title: e.target.value })}
                                                placeholder="Update Kegiatan Terbaru"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="section-subtitle">Sub-judul</Label>
                                            <Input
                                                id="section-subtitle"
                                                value={sectionContent.subtitle}
                                                onChange={(e) => setSectionContent({ ...sectionContent, subtitle: e.target.value })}
                                                placeholder="Ikuti perkembangan dan pencapaian terbaru kami"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="section-viewAllText">Text Button &quot;Lihat Semua&quot;</Label>
                                            <Input
                                                id="section-viewAllText"
                                                value={sectionContent.viewAllText}
                                                onChange={(e) => setSectionContent({ ...sectionContent, viewAllText: e.target.value })}
                                                placeholder="Lihat Semua Berita"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="section-viewAllLink">Link Button &quot;Lihat Semua&quot;</Label>
                                            <Input
                                                id="section-viewAllLink"
                                                value={sectionContent.viewAllLink}
                                                onChange={(e) => setSectionContent({ ...sectionContent, viewAllLink: e.target.value })}
                                                placeholder="/berita"
                                            />
                                        </div>
                                    </div>

                                    <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                                        <p className="text-sm text-blue-900 dark:text-blue-100">
                                            <strong>ℹ️ Info:</strong> Konten berita yang ditampilkan di landing page <strong>diambil secara otomatis</strong> dari 3 berita terbaru yang dipublikasikan. Untuk mengelola berita, gunakan form di bawah.
                                        </p>
                                    </div>

                                    <div className="flex justify-end pt-2">
                                        <Button onClick={handleSaveSectionConfig} disabled={savingSectionConfig}>
                                            {savingSectionConfig ? (
                                                <>
                                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                    Menyimpan...
                                                </>
                                            ) : (
                                                <>
                                                    <Save className="w-4 h-4 mr-2" />
                                                    Simpan Konfigurasi
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </>
                            )}
                        </CardContent>
                    </CollapsibleContent>
                </Card>
            </Collapsible>

            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                    <Link
                        href="/editor"
                        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-2"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Kembali ke Dashboard
                    </Link>
                    <h1 className="text-lg sm:text-2xl lg:text-3xl font-bold text-foreground">Editor Berita</h1>
                    <p className="mt-1 text-muted-foreground">Kelola berita dan kegiatan perusahaan</p>
                </div>
                <Button onClick={openCreateForm} className="shrink-0">
                    <Plus className="w-4 h-4 mr-2" />
                    Buat Berita
                </Button>
            </div>

            {/* Filters */}
            <Card>
                <CardContent className="pt-6">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                                placeholder="Cari berita..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-full sm:w-[200px]">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Semua Status</SelectItem>
                                <SelectItem value="published">Published</SelectItem>
                                <SelectItem value="draft">Draft</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* News Table */}
            <Card>
                <CardContent className="p-0">
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 className="w-8 h-8 animate-spin text-primary" />
                        </div>
                    ) : filteredNews.length === 0 ? (
                        <div className="py-12 text-center">
                            <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                            <p className="text-muted-foreground">
                                {searchQuery
                                    ? 'Tidak ada berita yang cocok dengan pencarian'
                                    : 'Belum ada berita. Klik "Buat Berita" untuk memulai.'}
                            </p>
                        </div>
                    ) : (
                        <>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="border-b bg-muted/50">
                                        <tr>
                                            <th className="px-4 py-3 text-left text-sm font-medium w-[300px]">Judul</th>
                                            <th className="px-4 py-3 text-left text-sm font-medium w-[100px]">Status</th>
                                            <th className="px-4 py-3 text-left text-sm font-medium w-[120px] hidden md:table-cell">Kategori</th>
                                            <th className="px-4 py-3 text-left text-sm font-medium w-[120px] hidden lg:table-cell">Tanggal</th>
                                            <th className="px-4 py-3 text-left text-sm font-medium w-[80px] hidden xl:table-cell">Views</th>
                                            <th className="px-4 py-3 text-right text-sm font-medium w-[140px]">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                        {filteredNews.map((item) => (
                                            <tr key={item.id} className="hover:bg-muted/50">
                                                <td className="px-4 py-3 max-w-[300px]">
                                                    <div className="flex items-center gap-3">
                                                        <div className="relative w-12 h-12 rounded overflow-hidden flex-shrink-0 bg-muted">
                                                            <Image
                                                                src={item.featuredImage}
                                                                alt={item.title}
                                                                fill
                                                                sizes="48px"
                                                                className="object-cover"
                                                                onError={(e) => {
                                                                    (e.target as HTMLImageElement).src =
                                                                        'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="48" height="48"%3E%3Crect width="48" height="48" fill="%23ddd"/%3E%3C/svg%3E';
                                                                }}
                                                            />
                                                        </div>
                                                        <div className="min-w-0 flex-1">
                                                            <p className="font-medium truncate">{item.title}</p>
                                                            <p className="text-sm text-muted-foreground truncate">
                                                                {item.slug}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span
                                                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${item.status === 'published'
                                                            ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                                                            : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
                                                            }`}
                                                    >
                                                        {item.status === 'published' ? 'Published' : 'Draft'}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 hidden md:table-cell">
                                                    {item.category || '-'}
                                                </td>
                                                <td className="px-4 py-3 text-sm hidden lg:table-cell">
                                                    {item.publishedAt
                                                        ? format(new Date(item.publishedAt), 'dd MMM yyyy')
                                                        : format(new Date(item.createdAt), 'dd MMM yyyy')}
                                                </td>
                                                <td className="px-4 py-3 text-sm hidden xl:table-cell">{item.viewCount}</td>
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center justify-end gap-2">
                                                        {item.status === 'published' && (
                                                            <Button
                                                                size="sm"
                                                                variant="ghost"
                                                                asChild
                                                            >
                                                                <Link
                                                                    href={`/berita/${item.slug}`}
                                                                    target="_blank"
                                                                >
                                                                    <Eye className="w-4 h-4" />
                                                                </Link>
                                                            </Button>
                                                        )}
                                                        <Button
                                                            size="sm"
                                                            variant="ghost"
                                                            onClick={() => openEditForm(item.id)}
                                                        >
                                                            <Edit className="w-4 h-4" />
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="ghost"
                                                            onClick={() => {
                                                                setNewsToDelete(item.id);
                                                                setDeleteDialogOpen(true);
                                                            }}
                                                        >
                                                            <Trash2 className="w-4 h-4 text-destructive" />
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="border-t p-4 flex items-center justify-between">
                                    <p className="text-sm text-muted-foreground">
                                        Halaman {currentPage} dari {totalPages}
                                    </p>
                                    <div className="flex gap-2">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => setCurrentPage(currentPage - 1)}
                                            disabled={currentPage === 1}
                                        >
                                            <ChevronLeft className="w-4 h-4" />
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => setCurrentPage(currentPage + 1)}
                                            disabled={currentPage === totalPages}
                                        >
                                            <ChevronRight className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </CardContent>
            </Card>

            {/* Form Dialog */}
            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>{isEditing ? 'Edit Berita' : 'Buat Berita Baru'}</DialogTitle>
                        <DialogDescription>
                            {isEditing ? 'Perbarui informasi berita' : 'Buat berita baru untuk website'}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-6 py-4">
                        {/* Title & Slug */}
                        <div className="grid gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="title">
                                    Judul <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="title"
                                    value={formData.title}
                                    onChange={(e) => {
                                        const title = e.target.value;
                                        setFormData({
                                            ...formData,
                                            title,
                                            slug: generateSlug(title),
                                        });
                                    }}
                                    placeholder="Judul berita"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="slug">Slug (URL)</Label>
                                <Input
                                    id="slug"
                                    value={formData.slug}
                                    onChange={(e) =>
                                        setFormData({ ...formData, slug: generateSlug(e.target.value) })
                                    }
                                    placeholder="judul-berita"
                                />
                                <p className="text-xs text-muted-foreground">
                                    URL: /berita/{formData.slug || 'judul-berita'}
                                </p>
                            </div>
                        </div>

                        {/* Excerpt */}
                        <div className="space-y-2">
                            <Label htmlFor="excerpt">
                                Ringkasan <span className="text-destructive">*</span>
                            </Label>
                            <Textarea
                                id="excerpt"
                                value={formData.excerpt}
                                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                                placeholder="Ringkasan singkat untuk ditampilkan di card berita (max 200 karakter)"
                                rows={3}
                                maxLength={200}
                            />
                            <p className="text-xs text-muted-foreground text-right">
                                {formData.excerpt?.length || 0}/200
                            </p>
                        </div>

                        {/* Rich Text Content */}
                        <div className="space-y-2">
                            <Label>
                                Konten <span className="text-destructive">*</span>
                            </Label>
                            <RichTextEditor
                                content={formData.content || ''}
                                onChange={(content) => setFormData({ ...formData, content })}
                                placeholder="Tulis konten berita di sini..."
                            />
                        </div>

                        {/* Featured Image */}
                        <div className="space-y-2">
                            <Label>
                                Gambar Utama (Thumbnail) <span className="text-destructive">*</span>
                            </Label>
                            <div className="flex gap-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="w-full"
                                    disabled={uploadingFeatured}
                                    onClick={() => {
                                        const input = document.createElement('input');
                                        input.type = 'file';
                                        input.accept = 'image/*';
                                        input.onchange = (e) => {
                                            const file = (e.target as HTMLInputElement).files?.[0];
                                            if (file) handleFeaturedImageUpload(file);
                                        };
                                        input.click();
                                    }}
                                >
                                    {uploadingFeatured ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            Uploading...
                                        </>
                                    ) : (
                                        <>
                                            <Upload className="w-4 h-4 mr-2" />
                                            Upload Gambar
                                        </>
                                    )}
                                </Button>
                            </div>
                            {formData.featuredImage && (
                                <div className="relative w-full aspect-video bg-muted rounded overflow-hidden">
                                    <Image
                                        src={formData.featuredImage}
                                        alt="Featured"
                                        fill
                                        sizes="(max-width: 768px) 100vw, 768px"
                                        className="object-cover"
                                    />
                                </div>
                            )}
                        </div>

                        {/* Content Images */}
                        <div className="space-y-2">
                            <Label>Gambar Konten (Opsional, max 10)</Label>
                            <div className="flex gap-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="w-full"
                                    disabled={uploadingContent || (formData.images?.length || 0) >= 10}
                                    onClick={() => {
                                        const input = document.createElement('input');
                                        input.type = 'file';
                                        input.accept = 'image/*';
                                        input.multiple = true;
                                        input.onchange = (e) => {
                                            const files = (e.target as HTMLInputElement).files;
                                            if (files) handleContentImagesUpload(files);
                                        };
                                        input.click();
                                    }}
                                >
                                    {uploadingContent ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            Uploading...
                                        </>
                                    ) : (
                                        <>
                                            <Upload className="w-4 h-4 mr-2" />
                                            Upload Gambar ({formData.images?.length || 0}/10)
                                        </>
                                    )}
                                </Button>
                            </div>
                            {formData.images && formData.images.length > 0 && (
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                    {formData.images.map((img, index) => (
                                        <div key={index} className="relative group">
                                            <div className="relative w-full aspect-video bg-muted rounded overflow-hidden">
                                                <Image
                                                    src={img.imageUrl}
                                                    alt={`Content ${index + 1}`}
                                                    fill
                                                    sizes="(max-width: 640px) 50vw, 33vw"
                                                    className="object-cover"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => removeContentImage(index)}
                                                    className="absolute top-2 right-2 p-1 bg-destructive text-destructive-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                            <Input
                                                value={img.caption || ''}
                                                onChange={(e) => {
                                                    const images = [...(formData.images || [])];
                                                    images[index].caption = e.target.value;
                                                    setFormData({ ...formData, images });
                                                }}
                                                placeholder="Caption (opsional)"
                                                className="mt-2"
                                            />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Category & Tags */}
                        <div className="grid sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="category">Kategori (Opsional)</Label>
                                <Input
                                    id="category"
                                    value={formData.category || ''}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    placeholder="Contoh: Kegiatan, Pengumuman, dll"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="tags">Tags (Opsional, pisahkan dengan koma)</Label>
                                <Input
                                    id="tags"
                                    value={formData.tags?.join(', ') || ''}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            tags: e.target.value
                                                .split(',')
                                                .map((t) => t.trim())
                                                .filter((t) => t),
                                        })
                                    }
                                    placeholder="tag1, tag2, tag3"
                                />
                            </div>
                        </div>

                        {/* Status */}
                        <div className="space-y-2">
                            <Label htmlFor="status">Status</Label>
                            <Select
                                value={formData.status}
                                onValueChange={(value: 'draft' | 'published') =>
                                    setFormData({ ...formData, status: value })
                                }
                            >
                                <SelectTrigger id="status">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="draft">Draft</SelectItem>
                                    <SelectItem value="published">Published</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Footer Buttons */}
                    <div className="flex justify-end gap-2 pt-4 border-t">
                        <Button variant="outline" onClick={() => setIsFormOpen(false)}>
                            Batal
                        </Button>
                        <Button onClick={handleSave} disabled={saving}>
                            {saving ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Menyimpan...
                                </>
                            ) : (
                                'Simpan'
                            )}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Hapus Berita?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Tindakan ini tidak dapat dibatalkan. Berita dan semua gambar terkait akan dihapus
                            permanen.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
                            Hapus
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
