'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
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
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Pencil, Trash2, Bell, Eye, EyeOff } from 'lucide-react';
import { toast } from 'react-toastify';
import { DataTable } from '@/components/ui/data-table';

interface Announcement {
    id: string;
    title: string;
    content: string;
    authorId: string;
    targetRole: string | null;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

interface AnnouncementFormData {
    title: string;
    content: string;
    targetRole: string;
    isActive: boolean;
}

interface AnnouncementsProps {
    rolePrefix?: 'guru' | 'staff';
}

// Move form fields component outside to prevent re-creation on every render
interface AnnouncementFormFieldsProps {
    formData: AnnouncementFormData;
    setFormData: React.Dispatch<React.SetStateAction<AnnouncementFormData>>;
}

function AnnouncementFormFields({ formData, setFormData }: AnnouncementFormFieldsProps) {
    return (
        <div className="space-y-4 py-4">
            <div className="space-y-2">
                <Label htmlFor="title">Judul Pengumuman <span className="text-red-500">*</span></Label>
                <Input
                    id="title"
                    placeholder="Contoh: Pengumuman Ujian Tengah Semester"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="content">Konten Pengumuman <span className="text-red-500">*</span></Label>
                <Textarea
                    id="content"
                    placeholder="Tulis isi pengumuman di sini..."
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    rows={6}
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="targetRole">Target Penerima</Label>
                <Select value={formData.targetRole} onValueChange={(value) => setFormData({ ...formData, targetRole: value })}>
                    <SelectTrigger>
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="student">Siswa</SelectItem>
                        <SelectItem value="all">Semua</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className="flex items-center space-x-2">
                <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="w-4 h-4"
                />
                <Label htmlFor="isActive" className="cursor-pointer">Aktifkan pengumuman</Label>
            </div>
        </div>
    );
}

export default function AnnouncementsManagement({ rolePrefix = 'guru' }: AnnouncementsProps = {}) {
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);
    const [formData, setFormData] = useState<AnnouncementFormData>({
        title: '',
        content: '',
        targetRole: 'student',
        isActive: true,
    });

    const fetchAnnouncements = useCallback(async () => {
        try {
            const response = await fetch(`/api/${rolePrefix}/announcements`);
            if (!response.ok) throw new Error('Failed to fetch announcements');
            const data = await response.json();
            setAnnouncements(data);
        } catch (error) {
            toast.error('Gagal memuat data pengumuman');
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, [rolePrefix]);

    useEffect(() => {
        fetchAnnouncements();
    }, [fetchAnnouncements]);

    const handleAdd = async () => {
        try {
            if (!formData.title || !formData.content) {
                toast.error('Judul dan konten harus diisi');
                return;
            }

            const response = await fetch(`/api/${rolePrefix}/announcements`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (!response.ok) throw new Error('Failed to create announcement');

            toast.success('Pengumuman berhasil dibuat');
            setIsAddOpen(false);
            resetForm();
            fetchAnnouncements();
        } catch (error) {
            toast.error('Gagal membuat pengumuman');
            console.error(error);
        }
    };

    const handleEdit = async () => {
        if (!selectedAnnouncement) return;

        try {
            if (!formData.title || !formData.content) {
                toast.error('Judul dan konten harus diisi');
                return;
            }

            const response = await fetch(`/api/${rolePrefix}/announcements/${selectedAnnouncement.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (!response.ok) throw new Error('Failed to update announcement');

            toast.success('Pengumuman berhasil diupdate');
            setIsEditOpen(false);
            setSelectedAnnouncement(null);
            resetForm();
            fetchAnnouncements();
        } catch (error) {
            toast.error('Gagal mengupdate pengumuman');
            console.error(error);
        }
    };

    const handleDelete = async () => {
        if (!selectedAnnouncement) return;

        try {
            const response = await fetch(`/api/${rolePrefix}/announcements/${selectedAnnouncement.id}`, {
                method: 'DELETE',
            });

            if (!response.ok) throw new Error('Failed to delete announcement');

            toast.success('Pengumuman berhasil dihapus');
            setIsDeleteOpen(false);
            setSelectedAnnouncement(null);
            fetchAnnouncements();
        } catch (error) {
            toast.error('Gagal menghapus pengumuman');
            console.error(error);
        }
    };

    const openEditDialog = (announcement: Announcement) => {
        setSelectedAnnouncement(announcement);
        setFormData({
            title: announcement.title,
            content: announcement.content,
            targetRole: announcement.targetRole || 'student',
            isActive: announcement.isActive,
        });
        setIsEditOpen(true);
    };

    const openDeleteDialog = (announcement: Announcement) => {
        setSelectedAnnouncement(announcement);
        setIsDeleteOpen(true);
    };

    const resetForm = () => {
        setFormData({
            title: '',
            content: '',
            targetRole: 'student',
            isActive: true,
        });
    };

    const columns = [
        {
            header: 'Judul Pengumuman',
            accessor: (row: Announcement) => (
                <div>
                    <div className="font-medium text-foreground">{row.title}</div>
                    <div className="text-xs text-muted-foreground mt-1 line-clamp-2">
                        {row.content}
                    </div>
                </div>
            ),
        },
        {
            header: 'Target',
            accessor: (row: Announcement) => (
                <div className="text-sm">
                    <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded">
                        {row.targetRole === 'student' ? 'Siswa' : row.targetRole || 'Semua'}
                    </span>
                </div>
            ),
        },
        {
            header: 'Status',
            accessor: (row: Announcement) => (
                <div className="flex items-center gap-2">
                    {row.isActive ? (
                        <>
                            <Eye className="w-4 h-4 text-green-500" />
                            <span className="text-sm text-green-600 dark:text-green-400">Aktif</span>
                        </>
                    ) : (
                        <>
                            <EyeOff className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-500">Non-aktif</span>
                        </>
                    )}
                </div>
            ),
        },
        {
            header: 'Tanggal Dibuat',
            accessor: (row: Announcement) => (
                <div className="text-sm text-muted-foreground">
                    {new Date(row.createdAt).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                    })}
                </div>
            ),
        },
        {
            header: 'Aksi',
            accessor: (row: Announcement) => (
                <div className="flex gap-2">
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openEditDialog(row)}
                        className="gap-2"
                    >
                        <Pencil className="w-4 h-4" />
                        Edit
                    </Button>
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openDeleteDialog(row)}
                        className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                    >
                        <Trash2 className="w-4 h-4" />
                        Hapus
                    </Button>
                </div>
            ),
        },
    ];



    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-foreground">Buat Pengumuman</h2>
                    <p className="text-muted-foreground">Kelola pengumuman untuk siswa Anda</p>
                </div>
                <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                    <DialogTrigger asChild>
                        <Button
                            className="gap-2 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700"
                            onClick={resetForm}
                        >
                            <Plus className="w-4 h-4" />
                            Buat Pengumuman
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                        <DialogHeader>
                            <DialogTitle>Buat Pengumuman Baru</DialogTitle>
                            <DialogDescription>
                                Buat pengumuman untuk siswa Anda
                            </DialogDescription>
                        </DialogHeader>
                        <AnnouncementFormFields formData={formData} setFormData={setFormData} />
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsAddOpen(false)}>
                                Batal
                            </Button>
                            <Button onClick={handleAdd} className="bg-gradient-to-r from-yellow-500 to-yellow-600">
                                Simpan
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <DataTable
                columns={columns}
                data={announcements}
                loading={loading}
                emptyMessage="Belum ada pengumuman. Klik 'Buat Pengumuman' untuk membuat yang baru."
            />

            {/* Edit Dialog */}
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Edit Pengumuman</DialogTitle>
                        <DialogDescription>
                            Ubah informasi pengumuman yang sudah ada
                        </DialogDescription>
                    </DialogHeader>
                    <AnnouncementFormFields formData={formData} setFormData={setFormData} />
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsEditOpen(false)}>
                            Batal
                        </Button>
                        <Button onClick={handleEdit} className="bg-gradient-to-r from-yellow-500 to-yellow-600">
                            Update
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Dialog */}
            <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Hapus Pengumuman</AlertDialogTitle>
                        <AlertDialogDescription>
                            Apakah Anda yakin ingin menghapus pengumuman{' '}
                            <span className="font-semibold">{selectedAnnouncement?.title}</span>?
                            Tindakan ini tidak dapat dibatalkan.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
                        >
                            Hapus
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
