'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Save, Eye, Loader2, Upload, X, GripVertical, Pause, Play } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface HeroContent {
    title: string;
    subtitle: string;
    buttonText: string;
    displayMode?: 'slideshow' | 'video';
    videoUrl?: string;
    slideshowDuration?: number;
    enableAutoPlay?: boolean;
    aboutTitle?: string;
    aboutDescription?: string;
}

interface HeroImage {
    id: string;
    sectionId: string;
    imageUrl: string;
    altText: string;
    order: number;
    createdAt: Date;
}

// Sortable Image Item Component
function SortableImageItem({ image, onDelete, onUpdateAlt }: {
    image: HeroImage;
    onDelete: (id: string) => void;
    onUpdateAlt: (id: string, altText: string) => void;
}) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: image.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg border"
        >
            {/* Drag Handle */}
            <button
                className="cursor-grab active:cursor-grabbing mt-2"
                {...attributes}
                {...listeners}
            >
                <GripVertical className="w-5 h-5 text-muted-foreground" />
            </button>

            {/* Image Preview */}
            <div className="relative w-32 h-20 flex-shrink-0 rounded overflow-hidden border">
                <Image
                    src={image.imageUrl}
                    alt={image.altText}
                    fill
                    className="object-cover"
                />
            </div>

            {/* Alt Text Input */}
            <div className="flex-1">
                <Label htmlFor={`alt-${image.id}`} className="text-sm">Alt Text</Label>
                <Input
                    id={`alt-${image.id}`}
                    value={image.altText}
                    onChange={(e) => onUpdateAlt(image.id, e.target.value)}
                    placeholder="Describe this image for accessibility"
                    className="mt-1"
                />
                <p className="text-xs text-muted-foreground mt-1">
                    Order: {image.order + 1}
                </p>
            </div>

            {/* Delete Button */}
            <Button
                variant="ghost"
                size="icon"
                onClick={() => onDelete(image.id)}
                className="text-destructive hover:text-destructive hover:bg-destructive/10"
            >
                <X className="w-4 h-4" />
            </Button>
        </div>
    );
}

// Slideshow Preview Component
function SlideshowPreview({ images, duration }: { images: HeroImage[]; duration: number }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(true);

    useEffect(() => {
        if (!isPlaying || images.length === 0) return;

        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % images.length);
        }, duration);

        return () => clearInterval(interval);
    }, [isPlaying, duration, images.length]);

    if (images.length === 0) {
        return (
            <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                <p className="text-muted-foreground">Upload images to see preview</p>
            </div>
        );
    }

    return (
        <div className="relative aspect-video bg-black rounded-lg overflow-hidden group">
            {/* Images */}
            {images.map((image, index) => (
                <div
                    key={image.id}
                    className="absolute inset-0 transition-opacity duration-1000"
                    style={{ opacity: index === currentIndex ? 1 : 0 }}
                >
                    <Image
                        src={image.imageUrl}
                        alt={image.altText}
                        fill
                        className="object-cover"
                    />
                </div>
            ))}

            {/* Controls */}
            {images.length > 1 && (
                <>
                    <button
                        onClick={() => setIsPlaying(!isPlaying)}
                        className="absolute bottom-4 right-4 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                        {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    </button>

                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                        {images.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentIndex(index)}
                                className={`w-2 h-2 rounded-full transition-all ${index === currentIndex
                                    ? 'bg-white w-6'
                                    : 'bg-white/50 hover:bg-white/75'
                                    }`}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}

export default function RDIHeroEditor() {
    const router = useRouter();
    const { toast } = useToast();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [uploadingVideo, setUploadingVideo] = useState(false);

    const [content, setContent] = useState<HeroContent>({
        title: 'WUJUDKAN MASA DEPAN KOMPETEN DAN MENDUNIA',
        subtitle: 'Lembaga pendidikan vokasi terpadu untuk karir internasional dan sertifikasi kompetensi jaminan produk halal.',
        buttonText: 'JELAJAHI PROGRAM KAMI',
        slideshowDuration: 6000,
        enableAutoPlay: true,
    });

    const [images, setImages] = useState<HeroImage[]>([]);

    // Sensors for drag and drop
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    // Fetch existing content and images
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch hero content
                const contentRes = await fetch('/api/cms/rdi?section=rdi-hero');
                const contentData = await contentRes.json();

                if (contentData.success && contentData.data) {
                    setContent(contentData.data.content as HeroContent);
                }

                // Fetch hero images
                const imagesRes = await fetch('/api/cms/hero-images');
                const imagesData = await imagesRes.json();

                if (imagesData.success && imagesData.data) {
                    setImages(imagesData.data);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                toast({
                    title: 'Error',
                    description: 'Gagal memuat data',
                    variant: 'destructive',
                });
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [toast]);

    const handleSave = async () => {
        setSaving(true);
        try {
            // Save hero content
            const contentRes = await fetch('/api/cms/rdi', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    section: 'rdi-hero',
                    content,
                    isPublished: true,
                }),
            });

            const contentData = await contentRes.json();
            if (!contentData.success) {
                throw new Error(contentData.error || 'Failed to save content');
            }

            // Save images order
            if (images.length > 0) {
                const orderRes = await fetch('/api/cms/hero-images', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        images: images.map((img, index) => ({
                            id: img.id,
                            order: index
                        }))
                    }),
                });

                const orderData = await orderRes.json();
                if (!orderData.success) {
                    throw new Error('Failed to save image order');
                }
            }

            toast({
                title: 'Berhasil',
                description: 'Hero section berhasil disimpan',
            });
        } catch (error) {
            console.error('Error saving:', error);
            toast({
                title: 'Error',
                description: error instanceof Error ? error.message : 'Gagal menyimpan',
                variant: 'destructive',
            });
        } finally {
            setSaving(false);
        }
    };

    const handleImageUpload = async (file: File) => {
        if (!file) return;

        // Validate file type
        const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
        if (!validTypes.includes(file.type)) {
            toast({
                title: 'Error',
                description: 'File type tidak valid. Gunakan JPG, PNG, atau WebP',
                variant: 'destructive',
            });
            return;
        }

        // Validate file size (5MB)
        if (file.size > 5 * 1024 * 1024) {
            toast({
                title: 'Error',
                description: 'File terlalu besar. Maksimal 5MB',
                variant: 'destructive',
            });
            return;
        }

        // Check max images
        if (images.length >= 5) {
            toast({
                title: 'Error',
                description: 'Maksimal 5 gambar. Hapus gambar lama terlebih dahulu',
                variant: 'destructive',
            });
            return;
        }

        setUploadingImage(true);
        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('altText', `Hero image ${images.length + 1}`); // Default alt text

            const response = await fetch('/api/cms/hero-images', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (data.success) {
                setImages([...images, data.data]);
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
                description: error instanceof Error ? error.message : 'Gagal upload gambar',
                variant: 'destructive',
            });
        } finally {
            setUploadingImage(false);
        }
    };

    const handleDeleteImage = async (id: string) => {
        if (!confirm('Hapus gambar ini?')) return;

        try {
            const response = await fetch(`/api/cms/hero-images/${id}`, {
                method: 'DELETE',
            });

            const data = await response.json();

            if (data.success) {
                setImages(images.filter(img => img.id !== id));
                toast({
                    title: 'Berhasil',
                    description: 'Gambar berhasil dihapus',
                });
            } else {
                throw new Error(data.error || 'Delete failed');
            }
        } catch (error) {
            console.error('Error deleting image:', error);
            toast({
                title: 'Error',
                description: 'Gagal menghapus gambar',
                variant: 'destructive',
            });
        }
    };

    const handleUpdateAltText = (id: string, altText: string) => {
        setImages(images.map(img =>
            img.id === id ? { ...img, altText } : img
        ));
    };

    const handleVideoUpload = async (file: File) => {
        if (!file) return;

        //Validate file type
        if (!file.type.startsWith('video/')) {
            toast({
                title: 'Error',
                description: 'File type tidak valid. Gunakan video MP4',
                variant: 'destructive',
            });
            return;
        }

        // Validate file size (50MB)
        if (file.size > 50 * 1024 * 1024) {
            toast({
                title: 'Error',
                description: 'File terlalu besar. Maksimal 50MB',
                variant: 'destructive',
            });
            return;
        }

        setUploadingVideo(true);
        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await fetch('/api/upload/video', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (data.url) {
                setContent({ ...content, videoUrl: data.url });
                toast({
                    title: 'Berhasil',
                    description: 'Video berhasil diupload',
                });
            } else {
                throw new Error(data.error || 'Upload failed');
            }
        } catch (error) {
            console.error('Error uploading video:', error);
            toast({
                title: 'Error',
                description: error instanceof Error ? error.message : 'Gagal upload video',
                variant: 'destructive',
            });
        } finally {
            setUploadingVideo(false);
        }
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            setImages((items) => {
                const oldIndex = items.findIndex(item => item.id === active.id);
                const newIndex = items.findIndex(item => item.id === over.id);
                return arrayMove(items, oldIndex, newIndex);
            });
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin" />
            </div>
        );
    }

    return (
        <div className="container max-w-6xl mx-auto py-8 px-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <Link href="/editor">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="w-5 h-5" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold">Edit Hero Section</h1>
                        <p className="text-muted-foreground">Kelola konten dan slideshow hero section</p>
                    </div>
                </div>

                <div className="flex gap-2">
                    <Link href="/" target="_blank">
                        <Button variant="outline">
                            <Eye className="w-4 h-4 mr-2" />
                            Preview
                        </Button>
                    </Link>
                    <Button onClick={handleSave} disabled={saving}>
                        {saving ? (
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                            <Save className="w-4 h-4 mr-2" />
                        )}
                        Simpan
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column - Content Form */}
                <div className="space-y-6">
                    {/* Hero Content */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Hero Content</CardTitle>
                            <CardDescription>Teks utama hero section</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label htmlFor="title">Judul</Label>
                                <Input
                                    id="title"
                                    value={content.title}
                                    onChange={(e) => setContent({ ...content, title: e.target.value })}
                                    placeholder="Judul hero section"
                                />
                            </div>

                            <div>
                                <Label htmlFor="subtitle">Subtitle</Label>
                                <Textarea
                                    id="subtitle"
                                    value={content.subtitle}
                                    onChange={(e) => setContent({ ...content, subtitle: e.target.value })}
                                    placeholder="Deskripsi singkat"
                                    rows={3}
                                />
                            </div>

                            <div>
                                <Label htmlFor="buttonText">Teks Button</Label>
                                <Input
                                    id="buttonText"
                                    value={content.buttonText}
                                    onChange={(e) => setContent({ ...content, buttonText: e.target.value })}
                                    placeholder="Teks call-to-action"
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Sekilas Tentang RDI Institute */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Sekilas Tentang RDI Institute</CardTitle>
                            <CardDescription>Konten deskripsi singkat tentang institute</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label htmlFor="aboutTitle">Judul Sekilas Tentang</Label>
                                <Input
                                    id="aboutTitle"
                                    value={content.aboutTitle || ''}
                                    onChange={(e) => setContent({ ...content, aboutTitle: e.target.value })}
                                    placeholder="SEKILAS TENTANG ROSMAN DJOHAN INSTITUTE"
                                />
                            </div>

                            <div>
                                <Label htmlFor="aboutDescription">Deskripsi</Label>
                                <Textarea
                                    id="aboutDescription"
                                    value={content.aboutDescription || ''}
                                    onChange={(e) => setContent({ ...content, aboutDescription: e.target.value })}
                                    placeholder="Deskripsi singkat tentang institute..."
                                    rows={5}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Mode Selection */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Background Mode</CardTitle>
                            <CardDescription>Pilih tipe background hero section</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex gap-2 mb-4">
                                <Button
                                    type="button"
                                    variant={content.displayMode === 'slideshow' ? 'default' : 'outline'}
                                    onClick={() => setContent({ ...content, displayMode: 'slideshow' })}
                                    className="flex-1"
                                >
                                    📸 Slideshow
                                </Button>
                                <Button
                                    type="button"
                                    variant={content.displayMode === 'video' ? 'default' : 'outline'}
                                    onClick={() => setContent({ ...content, displayMode: 'video' })}
                                    className="flex-1"
                                >
                                    🎥 Video
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Conditional: Video Upload */}
                    {content.displayMode === 'video' && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Video Background</CardTitle>
                                <CardDescription>Upload video untuk background hero</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <Label htmlFor="video-url">Video URL (opsional - jika sudah ada)</Label>
                                    <Input
                                        id="video-url"
                                        value={content.videoUrl || ''}
                                        onChange={(e) => setContent({ ...content, videoUrl: e.target.value })}
                                        placeholder="/videos/hero-rdi.mp4"
                                    />
                                </div>

                                <div className="border-t pt-4">
                                    <Label>Atau Upload Video Baru</Label>
                                    <label htmlFor="video-upload">
                                        <div className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:bg-muted/50 transition-colors mt-2">
                                            {uploadingVideo ? (
                                                <Loader2 className="w-8 h-8 mx-auto animate-spin text-primary" />
                                            ) : (
                                                <>
                                                    <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                                                    <p className="text-sm font-medium">Click to upload video</p>
                                                    <p className="text-xs text-muted-foreground mt-1">
                                                        MP4 • Max 50MB
                                                    </p>
                                                </>
                                            )}
                                        </div>
                                    </label>
                                    <input
                                        id="video-upload"
                                        type="file"
                                        accept="video/mp4,video/webm"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) handleVideoUpload(file);
                                            e.target.value = '';
                                        }}
                                        className="hidden"
                                        disabled={uploadingVideo}
                                    />
                                </div>

                                {content.videoUrl && (
                                    <div className="bg-muted/50 p-3 rounded">
                                        <p className="text-sm text-muted-foreground">Current video:</p>
                                        <p className="text-sm font-mono">{content.videoUrl}</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    )}

                    {/* Conditional: Slideshow Settings */}
                    {content.displayMode === 'slideshow' && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Slideshow Settings</CardTitle>
                                <CardDescription>Konfigurasi slideshow images</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <Label htmlFor="duration">Durasi Slideshow (detik)</Label>
                                    <Input
                                        id="duration"
                                        type="number"
                                        min={3}
                                        max={10}
                                        step={1}
                                        value={(content.slideshowDuration || 6000) / 1000}
                                        onChange={(e) => setContent({
                                            ...content,
                                            slideshowDuration: parseInt(e.target.value) * 1000
                                        })}
                                    />
                                    <p className="text-xs text-muted-foreground mt-1">
                                        Waktu tampilan per foto (3-10 detik)
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Conditional: Slideshow Images */}
                    {content.displayMode === 'slideshow' && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Slideshow Images ({images.length}/5)</CardTitle>
                                <CardDescription>Upload dan atur urutan gambar slideshow</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {/* Upload Button */}
                                <div>
                                    <label htmlFor="image-upload">
                                        <div className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:bg-muted/50 transition-colors">
                                            {uploadingImage ? (
                                                <Loader2 className="w-8 h-8 mx-auto animate-spin text-primary" />
                                            ) : (
                                                <>
                                                    <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                                                    <p className="text-sm font-medium">Click to upload image</p>
                                                    <p className="text-xs text-muted-foreground mt-1">
                                                        JPG, PNG, WebP • Max 5MB • Min 1920x1080px
                                                    </p>
                                                </>
                                            )}
                                        </div>
                                    </label>
                                    <input
                                        id="image-upload"
                                        type="file"
                                        accept="image/jpeg,image/png,image/webp"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) handleImageUpload(file);
                                            e.target.value = ''; // Reset input
                                        }}
                                        className="hidden"
                                        disabled={uploadingImage || images.length >= 5}
                                    />
                                </div>

                                {/* Images List with Drag & Drop */}
                                {images.length > 0 && (
                                    <DndContext
                                        sensors={sensors}
                                        collisionDetection={closestCenter}
                                        onDragEnd={handleDragEnd}
                                    >
                                        <SortableContext
                                            items={images.map(img => img.id)}
                                            strategy={verticalListSortingStrategy}
                                        >
                                            <div className="space-y-3">
                                                {images.map((image) => (
                                                    <SortableImageItem
                                                        key={image.id}
                                                        image={image}
                                                        onDelete={handleDeleteImage}
                                                        onUpdateAlt={handleUpdateAltText}
                                                    />
                                                ))}
                                            </div>
                                        </SortableContext>
                                    </DndContext>
                                )}

                                {images.length === 0 && (
                                    <p className="text-sm text-muted-foreground text-center py-4">
                                        Belum ada gambar. Upload minimal 1 gambar untuk slideshow.
                                    </p>
                                )}
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Right Column - Preview */}
                <div className="space-y-6">
                    <Card className="sticky top-8">
                        <CardHeader>
                            <CardTitle>
                                {content.displayMode === 'video' ? 'Preview Video' : 'Preview Slideshow'}
                            </CardTitle>
                            <CardDescription>
                                {content.displayMode === 'video'
                                    ? 'Preview video background'
                                    : 'Real-time preview dengan timing aktual'
                                }
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {/* Video Preview */}
                            {content.displayMode === 'video' && (
                                <>
                                    {content.videoUrl ? (
                                        <div className="aspect-video bg-black rounded-lg overflow-hidden">
                                            <video
                                                src={content.videoUrl}
                                                controls
                                                loop
                                                muted
                                                className="w-full h-full object-cover"
                                            >
                                                Your browser does not support the video tag.
                                            </video>
                                        </div>
                                    ) : (
                                        <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                                            <p className="text-muted-foreground">Upload video untuk melihat preview</p>
                                        </div>
                                    )}

                                    {content.videoUrl && (
                                        <div className="mt-4 space-y-2 text-sm">
                                            <div className="flex justify-between">
                                                <span className="text-muted-foreground">Video URL</span>
                                                <span className="font-mono text-xs">{content.videoUrl}</span>
                                            </div>
                                            <p className="text-xs text-muted-foreground">
                                                Video akan auto-play, loop, dan muted di landing page
                                            </p>
                                        </div>
                                    )}
                                </>
                            )}

                            {/* Slideshow Preview */}
                            {content.displayMode === 'slideshow' && (
                                <>
                                    <SlideshowPreview
                                        images={images}
                                        duration={content.slideshowDuration || 6000}
                                    />

                                    {images.length > 0 && (
                                        <div className="mt-4 space-y-2">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-muted-foreground">Total Images</span>
                                                <span className="font-medium">{images.length}</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-muted-foreground">Duration per Image</span>
                                                <span className="font-medium">
                                                    {(content.slideshowDuration || 6000) / 1000}s
                                                </span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-muted-foreground">Full Cycle</span>
                                                <span className="font-medium">
                                                    {((content.slideshowDuration || 6000) * images.length) / 1000}s
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
