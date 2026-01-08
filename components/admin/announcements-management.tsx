'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
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
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Megaphone, Search, Pencil, Trash2, Loader2, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { StatusBadge } from '@/components/ui/status-badge';

interface Announcement {
    id: string;
    title: string;
    content: string;
    authorId: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    authorName: string;
}

interface AnnouncementFormData {
    id?: string;
    title: string;
    content: string;
    isActive: boolean;
}

const initialFormData: AnnouncementFormData = {
    title: '',
    content: '',
    isActive: true,
};

export function AnnouncementsManagement() {
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [formData, setFormData] = useState<AnnouncementFormData>(initialFormData);
    const { toast } = useToast();

    const fetchAnnouncements = useCallback(async () => {
        try {
            setIsLoading(true);
            const response = await fetch('/api/announcements');
            if (response.ok) {
                const data = await response.json();
                setAnnouncements(data);
            } else {
                toast({
                    title: 'Error',
                    description: 'Gagal memuat data pengumuman',
                    variant: 'destructive',
                });
            }
        } catch (error) {
            console.error('Error fetching announcements:', error);
            toast({
                title: 'Error',
                description: 'Gagal memuat data pengumuman',
                variant: 'destructive',
            });
        } finally {
            setIsLoading(false);
        }
    }, [toast]);

    useEffect(() => {
        fetchAnnouncements();
    }, [fetchAnnouncements]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSwitchChange = (checked: boolean) => {
        setFormData(prev => ({ ...prev, isActive: checked }));
    };

    const resetForm = () => {
        setFormData(initialFormData);
    };

    const handleAddAnnouncement = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.title || !formData.content) {
            toast({
                title: 'Error',
                description: 'Judul dan konten wajib diisi',
                variant: 'destructive',
            });
            return;
        }

        try {
            setIsSubmitting(true);

            const response = await fetch('/api/announcements', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                toast({
                    title: 'Berhasil',
                    description: 'Pengumuman berhasil ditambahkan',
                });
                setIsAddDialogOpen(false);
                resetForm();
                fetchAnnouncements();
            } else {
                toast({
                    title: 'Error',
                    description: data.error || 'Gagal menambahkan pengumuman',
                    variant: 'destructive',
                });
            }
        } catch (error) {
            console.error('Error adding announcement:', error);
            toast({
                title: 'Error',
                description: 'Gagal menambahkan pengumuman',
                variant: 'destructive',
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEditClick = (announcement: Announcement) => {
        setFormData({
            id: announcement.id,
            title: announcement.title,
            content: announcement.content,
            isActive: announcement.isActive,
        });
        setIsEditDialogOpen(true);
    };

    const handleUpdateAnnouncement = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.title || !formData.content) {
            toast({
                title: 'Error',
                description: 'Judul dan konten wajib diisi',
                variant: 'destructive',
            });
            return;
        }

        try {
            setIsSubmitting(true);

            const response = await fetch('/api/announcements', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                toast({
                    title: 'Berhasil',
                    description: 'Pengumuman berhasil diperbarui',
                });
                setIsEditDialogOpen(false);
                resetForm();
                fetchAnnouncements();
            } else {
                toast({
                    title: 'Error',
                    description: data.error || 'Gagal memperbarui pengumuman',
                    variant: 'destructive',
                });
            }
        } catch (error) {
            console.error('Error updating announcement:', error);
            toast({
                title: 'Error',
                description: 'Gagal memperbarui pengumuman',
                variant: 'destructive',
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteAnnouncement = async (announcementId: string) => {
        try {
            const response = await fetch(`/api/announcements?id=${announcementId}`, {
                method: 'DELETE',
            });

            const data = await response.json();

            if (response.ok) {
                toast({
                    title: 'Berhasil',
                    description: 'Pengumuman berhasil dihapus',
                });
                fetchAnnouncements();
            } else {
                toast({
                    title: 'Error',
                    description: data.error || 'Gagal menghapus pengumuman',
                    variant: 'destructive',
                });
            }
        } catch (error) {
            console.error('Error deleting announcement:', error);
            toast({
                title: 'Error',
                description: 'Gagal menghapus pengumuman',
                variant: 'destructive',
            });
        }
    };

    const handleToggleActive = async (announcement: Announcement) => {
        try {
            const response = await fetch('/api/announcements', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: announcement.id,
                    title: announcement.title,
                    content: announcement.content,
                    isActive: !announcement.isActive,
                }),
            });

            if (response.ok) {
                toast({
                    title: 'Berhasil',
                    description: `Pengumuman ${!announcement.isActive ? 'diaktifkan' : 'dinonaktifkan'}`,
                });
                fetchAnnouncements();
            } else {
                toast({
                    title: 'Error',
                    description: 'Gagal mengubah status pengumuman',
                    variant: 'destructive',
                });
            }
        } catch (error) {
            console.error('Error toggling announcement:', error);
            toast({
                title: 'Error',
                description: 'Gagal mengubah status pengumuman',
                variant: 'destructive',
            });
        }
    };

    // Filter announcements based on search
    const filteredAnnouncements = announcements.filter(announcement =>
        announcement.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        announcement.content.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold text-foreground">Buat Pengumuman</h2>
                    <p className="text-muted-foreground mt-1">
                        Tambah, edit, dan kelola pengumuman sekolah
                    </p>
                </div>
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                    <DialogTrigger asChild>
                        <Button
                            className="bg-primary hover:bg-primary/90 text-primary-foreground"
                            onClick={() => {
                                resetForm();
                                setIsAddDialogOpen(true);
                            }}
                        >
                            <Megaphone className="w-4 h-4 mr-2" />
                            Buat Pengumuman
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[600px]">
                        <DialogHeader>
                            <DialogTitle>Buat Pengumuman Baru</DialogTitle>
                            <DialogDescription>
                                Masukkan detail pengumuman di bawah ini
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleAddAnnouncement}>
                            <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="title">
                                        Judul <span className="text-destructive">*</span>
                                    </Label>
                                    <Input
                                        id="title"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleInputChange}
                                        placeholder="Judul pengumuman"
                                        required
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="content">
                                        Konten <span className="text-destructive">*</span>
                                    </Label>
                                    <Textarea
                                        id="content"
                                        name="content"
                                        value={formData.content}
                                        onChange={handleInputChange}
                                        placeholder="Isi pengumuman..."
                                        rows={8}
                                        required
                                    />
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Switch
                                        id="isActive"
                                        checked={formData.isActive}
                                        onCheckedChange={handleSwitchChange}
                                    />
                                    <Label htmlFor="isActive">
                                        Aktifkan pengumuman
                                    </Label>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setIsAddDialogOpen(false)}
                                >
                                    Batal
                                </Button>
                                <Button
                                    type="submit"
                                    className="bg-primary hover:bg-primary/90 text-primary-foreground"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                    Simpan
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Search */}
            <Card>
                <CardContent className="pt-6">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Cari pengumuman berdasarkan judul atau konten..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-input rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Announcements List */}
            <Card>
                <CardHeader>
                    <CardTitle>Daftar Pengumuman ({filteredAnnouncements.length})</CardTitle>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="flex justify-center items-center py-8">
                            <Loader2 className="w-8 h-8 animate-spin text-primary" />
                            <span className="ml-2 text-muted-foreground">Memuat data...</span>
                        </div>
                    ) : filteredAnnouncements.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                            {announcements.length === 0
                                ? 'Belum ada pengumuman. Klik "Buat Pengumuman" untuk menambahkan.'
                                : 'Tidak ada pengumuman yang sesuai dengan pencarian.'}
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {filteredAnnouncements.map((announcement) => (
                                <div
                                    key={announcement.id}
                                    className="border border-border rounded-lg p-4 hover:shadow-md transition-shadow"
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-2">
                                                <h3 className="text-lg font-semibold text-foreground">
                                                    {announcement.title}
                                                </h3>
                                                <StatusBadge variant={announcement.isActive ? "success" : "neutral"}>
                                                    {announcement.isActive ? 'Aktif' : 'Nonaktif'}
                                                </StatusBadge>
                                            </div>
                                            <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                                                {announcement.content}
                                            </p>
                                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                                <span>Oleh: {announcement.authorName}</span>
                                                <span>•</span>
                                                <span>{formatDate(announcement.createdAt)}</span>
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => handleToggleActive(announcement)}
                                                className="w-full"
                                            >
                                                {announcement.isActive ? (
                                                    <>
                                                        <EyeOff className="w-3 h-3 mr-1" />
                                                        Nonaktifkan
                                                    </>
                                                ) : (
                                                    <>
                                                        <Eye className="w-3 h-3 mr-1" />
                                                        Aktifkan
                                                    </>
                                                )}
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => handleEditClick(announcement)}
                                                className="w-full"
                                            >
                                                <Pencil className="w-3 h-3 mr-1" />
                                                Edit
                                            </Button>
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button size="sm" variant="destructive" className="w-full">
                                                        <Trash2 className="w-3 h-3 mr-1" />
                                                        Hapus
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>
                                                            Hapus Pengumuman?
                                                        </AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            Apakah Anda yakin ingin menghapus pengumuman <strong>{announcement.title}</strong>?
                                                            Tindakan ini tidak dapat dibatalkan.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>Batal</AlertDialogCancel>
                                                        <AlertDialogAction
                                                            className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                                                            onClick={() => handleDeleteAnnouncement(announcement.id)}
                                                        >
                                                            Ya, Hapus
                                                        </AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Edit Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle>Edit Pengumuman</DialogTitle>
                        <DialogDescription>
                            Perbarui detail pengumuman di bawah ini
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleUpdateAnnouncement}>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="edit-title">
                                    Judul <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="edit-title"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    placeholder="Judul pengumuman"
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="edit-content">
                                    Konten <span className="text-destructive">*</span>
                                </Label>
                                <Textarea
                                    id="edit-content"
                                    name="content"
                                    value={formData.content}
                                    onChange={handleInputChange}
                                    placeholder="Isi pengumuman..."
                                    rows={8}
                                    required
                                />
                            </div>
                            <div className="flex items-center space-x-2">
                                <Switch
                                    id="edit-isActive"
                                    checked={formData.isActive}
                                    onCheckedChange={handleSwitchChange}
                                />
                                <Label htmlFor="edit-isActive">
                                    Aktifkan pengumuman
                                </Label>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                    setIsEditDialogOpen(false);
                                    resetForm();
                                }}
                            >
                                Batal
                            </Button>
                            <Button
                                type="submit"
                                className="bg-primary hover:bg-primary/90 text-primary-foreground"
                                disabled={isSubmitting}
                            >
                                {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                Simpan Perubahan
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
