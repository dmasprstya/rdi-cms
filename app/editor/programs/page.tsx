'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Save, Eye, Loader2, Plus, Trash2, Upload, ChevronUp, ChevronDown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Import only types, not runtime code
type ProgramCategory = {
    id: string;
    title: string;
    slug: string;
    description: string;
    badge: string;
    icon: string;
    gradientFrom: string;
    gradientTo: string;
    order: number;
};

type ProgramItem = {
    id: string;
    categoryId: string;
    title: string;
    slug: string;
    shortDescription: string;
    fullDescription: string;
    featuredImage: string;
    keyFeatures: string[];
    ctaButtonText: string;
    ctaButtonLink: string;
    order: number;
    metadata?: {
        duration?: string;
        certification?: string;
        requirements?: string[];
        salary?: string;
        benefits?: string[];
    };
};

type ProgramsContent = {
    sectionTitle: string;
    sectionSubtitle: string;
    categories: ProgramCategory[];
    items: ProgramItem[];
};

// Helper function to generate slug from title
function generateSlug(title: string): string {
    return title
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '')
        .replace(/-+/g, '-')
        .trim();
}

export default function ProgramsEditor() {
    const { toast } = useToast();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploadingId, setUploadingId] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState('categories');
    const [content, setContent] = useState<ProgramsContent>({
        sectionTitle: 'Dua Pilar Keahlian Kami',
        sectionSubtitle: 'Pilih jalur pengembangan diri yang sesuai dengan kebutuhan Anda',
        categories: [],
        items: [],
    });

    useEffect(() => {
        const fetchContent = async () => {
            try {
                const response = await fetch('/api/cms/programs');
                const data = await response.json();

                if (data.success && data.data && data.data.content) {
                    setContent(data.data.content as ProgramsContent);
                }
            } catch (error) {
                console.error('Error fetching content:', error);
                toast({
                    title: 'Error',
                    description: 'Gagal memuat konten program',
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
            const response = await fetch('/api/cms/programs', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    content,
                    isPublished: true,
                }),
            });

            const data = await response.json();

            if (data.success) {
                toast({
                    title: 'Berhasil',
                    description: 'Konten program berhasil disimpan',
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

    // Category Functions
    const addCategory = () => {
        const newCategory: ProgramCategory = {
            id: `category-${Date.now()}`,
            title: 'Kategori Baru',
            slug: `kategori-baru-${Date.now()}`,
            description: '',
            badge: 'New Category',
            icon: 'Briefcase',
            gradientFrom: 'blue-500',
            gradientTo: 'blue-700',
            order: content.categories.length + 1,
        };
        setContent({ ...content, categories: [...content.categories, newCategory] });
    };

    const updateCategory = (id: string, field: keyof ProgramCategory, value: string | number) => {
        const newCategories = content.categories.map(cat => {
            if (cat.id === id) {
                const updated = { ...cat, [field]: value };
                // Auto-update slug when title changes
                if (field === 'title') {
                    updated.slug = generateSlug(value as string);
                }
                return updated;
            }
            return cat;
        });
        setContent({ ...content, categories: newCategories });
    };

    const deleteCategory = (id: string) => {
        if (!confirm('Apakah Anda yakin ingin menghapus kategori ini? Semua item dalam kategori akan kehilangan relasinya.')) {
            return;
        }
        setContent({
            ...content,
            categories: content.categories.filter(cat => cat.id !== id),
        });
    };

    const moveCategoryUp = (index: number) => {
        if (index === 0) return;
        const newCategories = [...content.categories];
        [newCategories[index - 1], newCategories[index]] = [newCategories[index], newCategories[index - 1]];
        // Update order
        newCategories.forEach((cat, idx) => {
            cat.order = idx + 1;
        });
        setContent({ ...content, categories: newCategories });
    };

    const moveCategoryDown = (index: number) => {
        if (index === content.categories.length - 1) return;
        const newCategories = [...content.categories];
        [newCategories[index], newCategories[index + 1]] = [newCategories[index + 1], newCategories[index]];
        // Update order
        newCategories.forEach((cat, idx) => {
            cat.order = idx + 1;
        });
        setContent({ ...content, categories: newCategories });
    };

    // Item Functions
    const addItem = () => {
        if (content.categories.length === 0) {
            toast({
                title: 'Peringatan',
                description: 'Buat kategori terlebih dahulu',
                variant: 'destructive',
            });
            return;
        }

        const newItem: ProgramItem = {
            id: `item-${Date.now()}`,
            categoryId: content.categories[0].id,
            title: 'Program Baru',
            slug: `program-baru-${Date.now()}`,
            shortDescription: '',
            fullDescription: '',
            featuredImage: '/images/programs/placeholder.jpg',
            keyFeatures: ['Feature 1'],
            ctaButtonText: 'Daftar Program →',
            ctaButtonLink: '',
            order: content.items.length + 1,
        };
        setContent({ ...content, items: [...content.items, newItem] });
        setActiveTab('items');
    };

    const updateItem = (id: string, field: keyof ProgramItem, value: any) => {
        const newItems = content.items.map(item => {
            if (item.id === id) {
                const updated = { ...item, [field]: value };
                // Auto-update slug when title changes
                if (field === 'title') {
                    updated.slug = generateSlug(value as string);
                }
                // Auto-update CTA link when category or slug changes
                if (field === 'categoryId' || field === 'slug') {
                    const category = content.categories.find(c => c.id === (field === 'categoryId' ? value : item.categoryId));
                    if (category) {
                        updated.ctaButtonLink = `/program/${category.slug}/${field === 'slug' ? value : item.slug}`;
                    }
                }
                return updated;
            }
            return item;
        });
        setContent({ ...content, items: newItems });
    };

    const deleteItem = (id: string) => {
        if (!confirm('Apakah Anda yakin ingin menghapus program ini?')) {
            return;
        }
        setContent({
            ...content,
            items: content.items.filter(item => item.id !== id),
        });
    };

    const addFeature = (itemId: string) => {
        const newItems = content.items.map(item => {
            if (item.id === itemId) {
                return { ...item, keyFeatures: [...item.keyFeatures, 'Feature baru'] };
            }
            return item;
        });
        setContent({ ...content, items: newItems });
    };

    const updateFeature = (itemId: string, featureIndex: number, value: string) => {
        const newItems = content.items.map(item => {
            if (item.id === itemId) {
                const newFeatures = [...item.keyFeatures];
                newFeatures[featureIndex] = value;
                return { ...item, keyFeatures: newFeatures };
            }
            return item;
        });
        setContent({ ...content, items: newItems });
    };

    const deleteFeature = (itemId: string, featureIndex: number) => {
        const newItems = content.items.map(item => {
            if (item.id === itemId) {
                return {
                    ...item,
                    keyFeatures: item.keyFeatures.filter((_, idx) => idx !== featureIndex),
                };
            }
            return item;
        });
        setContent({ ...content, items: newItems });
    };

    const handleImageUpload = async (itemId: string, file: File) => {
        if (!file) return;

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

        setUploadingId(itemId);

        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await fetch('/api/upload/image?type=program', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (data.success) {
                updateItem(itemId, 'featuredImage', data.url);
                toast({
                    title: 'Berhasil',
                    description: 'Gambar berhasil diupload',
                });
            } else {
                throw new Error(data.error || 'Upload failed');
            }
        } catch (error) {
            console.error('Error uploading image:', error);
            toast({
                title: 'Error',
                description: 'Gagal mengupload gambar',
                variant: 'destructive',
            });
        } finally {
            setUploadingId(null);
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
                    <h1 className="text-lg sm:text-2xl lg:text-3xl font-bold text-foreground">Edit Programs Section</h1>
                    <p className="mt-1 text-muted-foreground">
                        Kelola kategori dan item program RDI
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" asChild>
                        <Link href="/program" target="_blank">
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

            {/* Section Header Card */}
            <Card>
                <CardHeader>
                    <CardTitle>Section Header</CardTitle>
                    <CardDescription>
                        Edit judul dan subtitle yang akan ditampilkan di landing page
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="section-title">Section Title</Label>
                        <Input
                            id="section-title"
                            value={content.sectionTitle}
                            onChange={(e) => setContent({ ...content, sectionTitle: e.target.value })}
                            placeholder="Dua Pilar Keahlian Kami"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="section-subtitle">Section Subtitle</Label>
                        <Textarea
                            id="section-subtitle"
                            value={content.sectionSubtitle}
                            onChange={(e) => setContent({ ...content, sectionSubtitle: e.target.value })}
                            placeholder="Pilih jalur pengembangan diri yang sesuai dengan kebutuhan Anda"
                            rows={2}
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="categories">
                        Kategori ({content.categories.length})
                    </TabsTrigger>
                    <TabsTrigger value="items">
                        Program Items ({content.items.length})
                    </TabsTrigger>
                </TabsList>

                {/* Categories Tab */}
                <TabsContent value="categories" className="space-y-4">
                    <div className="flex justify-between items-center">
                        <p className="text-sm text-muted-foreground">
                            Kelola kategori utama program (max 3-4 kategori)
                        </p>
                        <Button onClick={addCategory} size="sm">
                            <Plus className="w-4 h-4 mr-2" />
                            Tambah Kategori
                        </Button>
                    </div>

                    {content.categories.map((category, index) => (
                        <Card key={category.id}>
                            <CardHeader>
                                <div className="flex items-start justify-between">
                                    <div>
                                        <CardTitle className="text-xl">{category.title}</CardTitle>
                                        <CardDescription>Slug: /{category.slug}</CardDescription>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button
                                            size="icon"
                                            variant="outline"
                                            onClick={() => moveCategoryUp(index)}
                                            disabled={index === 0}
                                        >
                                            <ChevronUp className="w-4 h-4" />
                                        </Button>
                                        <Button
                                            size="icon"
                                            variant="outline"
                                            onClick={() => moveCategoryDown(index)}
                                            disabled={index === content.categories.length - 1}
                                        >
                                            <ChevronDown className="w-4 h-4" />
                                        </Button>
                                        <Button
                                            size="icon"
                                            variant="destructive"
                                            onClick={() => deleteCategory(category.id)}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Title</Label>
                                        <Input
                                            value={category.title}
                                            onChange={(e) => updateCategory(category.id, 'title', e.target.value)}
                                            placeholder="Pelatihan Kerja"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Badge</Label>
                                        <Input
                                            value={category.badge}
                                            onChange={(e) => updateCategory(category.id, 'badge', e.target.value)}
                                            placeholder="Global Opportunities"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label>Description</Label>
                                    <Textarea
                                        value={category.description}
                                        onChange={(e) => updateCategory(category.id, 'description', e.target.value)}
                                        placeholder="Deskripsi kategori..."
                                        rows={2}
                                    />
                                </div>

                                <div className="grid md:grid-cols-3 gap-4">
                                    <div className="space-y-2">
                                        <Label>Icon (Lucide)</Label>
                                        <Input
                                            value={category.icon}
                                            onChange={(e) => updateCategory(category.id, 'icon', e.target.value)}
                                            placeholder="Globe"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Gradient From</Label>
                                        <Input
                                            value={category.gradientFrom}
                                            onChange={(e) => updateCategory(category.id, 'gradientFrom', e.target.value)}
                                            placeholder="blue-500"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Gradient To</Label>
                                        <Input
                                            value={category.gradientTo}
                                            onChange={(e) => updateCategory(category.id, 'gradientTo', e.target.value)}
                                            placeholder="blue-700"
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}

                    {content.categories.length === 0 && (
                        <Card>
                            <CardContent className="py-12 text-center">
                                <p className="text-muted-foreground">Belum ada kategori. Klik &quot;Tambah Kategori&quot; untuk memulai.</p>
                            </CardContent>
                        </Card>
                    )}
                </TabsContent>

                {/* Items Tab */}
                <TabsContent value="items" className="space-y-4">
                    <div className="flex justify-between items-center">
                        <p className="text-sm text-muted-foreground">
                            Kelola program individual dalam setiap kategori
                        </p>
                        <Button onClick={addItem} size="sm" disabled={content.categories.length === 0}>
                            <Plus className="w-4 h-4 mr-2" />
                            Tambah Program
                        </Button>
                    </div>

                    {content.items.map((item) => {
                        const category = content.categories.find(c => c.id === item.categoryId);
                        return (
                            <Card key={item.id}>
                                <CardHeader>
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <CardTitle className="text-xl">{item.title}</CardTitle>
                                            <CardDescription>
                                                Kategori: {category?.title || 'Unknown'} | Slug: /{item.slug}
                                            </CardDescription>
                                        </div>
                                        <Button
                                            size="icon"
                                            variant="destructive"
                                            onClick={() => deleteItem(item.id)}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>Title</Label>
                                            <Input
                                                value={item.title}
                                                onChange={(e) => updateItem(item.id, 'title', e.target.value)}
                                                placeholder="Program Jepang"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Kategori</Label>
                                            <Select
                                                value={item.categoryId}
                                                onValueChange={(value) => updateItem(item.id, 'categoryId', value)}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {content.categories.map(cat => (
                                                        <SelectItem key={cat.id} value={cat.id}>
                                                            {cat.title}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Short Description (Card)</Label>
                                        <Textarea
                                            value={item.shortDescription}
                                            onChange={(e) => updateItem(item.id, 'shortDescription', e.target.value)}
                                            placeholder="Deskripsi singkat untuk card..."
                                            rows={2}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Full Description (Detail Page)</Label>
                                        <Textarea
                                            value={item.fullDescription}
                                            onChange={(e) => updateItem(item.id, 'fullDescription', e.target.value)}
                                            placeholder="Deskripsi lengkap untuk halaman detail..."
                                            rows={4}
                                        />
                                    </div>

                                    {/* Key Features */}
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <Label>Key Features</Label>
                                            <Button
                                                type="button"
                                                size="sm"
                                                variant="outline"
                                                onClick={() => addFeature(item.id)}
                                            >
                                                <Plus className="w-4 h-4 mr-2" />
                                                Add Feature
                                            </Button>
                                        </div>
                                        <div className="space-y-2">
                                            {item.keyFeatures.map((feature, featureIndex) => (
                                                <div key={featureIndex} className="flex gap-2">
                                                    <Input
                                                        value={feature}
                                                        onChange={(e) => updateFeature(item.id, featureIndex, e.target.value)}
                                                        placeholder="Feature text"
                                                    />
                                                    {item.keyFeatures.length > 1 && (
                                                        <Button
                                                            type="button"
                                                            size="icon"
                                                            variant="destructive"
                                                            onClick={() => deleteFeature(item.id, featureIndex)}
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </Button>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Featured Image */}
                                    <div className="space-y-2">
                                        <Label>Featured Image</Label>
                                        <div className="flex gap-2">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                className="w-full"
                                                disabled={uploadingId === item.id}
                                                onClick={() => {
                                                    const input = document.createElement('input');
                                                    input.type = 'file';
                                                    input.accept = 'image/*';
                                                    input.onchange = (e) => {
                                                        const file = (e.target as HTMLInputElement).files?.[0];
                                                        if (file) handleImageUpload(item.id, file);
                                                    };
                                                    input.click();
                                                }}
                                            >
                                                {uploadingId === item.id ? (
                                                    <>
                                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                        Uploading...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Upload className="w-4 h-4 mr-2" />
                                                        Upload Image
                                                    </>
                                                )}
                                            </Button>
                                        </div>
                                        <Input
                                            value={item.featuredImage}
                                            onChange={(e) => updateItem(item.id, 'featuredImage', e.target.value)}
                                            placeholder="/images/programs/placeholder.jpg"
                                        />
                                        {item.featuredImage && (
                                            <div className="relative w-full aspect-video bg-muted rounded overflow-hidden">
                                                <Image
                                                    src={item.featuredImage}
                                                    alt={item.title}
                                                    fill
                                                    className="object-cover"
                                                    onError={(e) => {
                                                        (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="225"%3E%3Crect width="400" height="225" fill="%23ddd"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="18" fill="%23999"%3ENo Image%3C/text%3E%3C/svg%3E';
                                                    }}
                                                />
                                            </div>
                                        )}
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>CTA Button Text</Label>
                                            <Input
                                                value={item.ctaButtonText}
                                                onChange={(e) => updateItem(item.id, 'ctaButtonText', e.target.value)}
                                                placeholder="Daftar Program →"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>CTA Button Link</Label>
                                            <Input
                                                value={item.ctaButtonLink}
                                                onChange={(e) => updateItem(item.id, 'ctaButtonLink', e.target.value)}
                                                placeholder="/program/kategori/item"
                                            />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}

                    {content.items.length === 0 && (
                        <Card>
                            <CardContent className="py-12 text-center">
                                <p className="text-muted-foreground">
                                    {content.categories.length === 0
                                        ? 'Buat kategori terlebih dahulu sebelum menambah program.'
                                        : 'Belum ada program. Klik &quot;Tambah Program&quot; untuk memulai.'}
                                </p>
                            </CardContent>
                        </Card>
                    )}
                </TabsContent>
            </Tabs>
        </div>
    );
}
