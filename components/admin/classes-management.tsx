'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Pencil, Trash2, Users } from 'lucide-react';
import { toast } from 'react-toastify';
import { DataTable } from '@/components/ui/data-table';

interface Class {
    id: string;
    name: string;
    grade: number;
    academicYear: string;
    studentCount: number;
    createdAt: string;
}

interface ClassFormData {
    name: string;
    academicYear: string;
}

export function ClassesManagement() {
    const [classes, setClasses] = useState<Class[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedClass, setSelectedClass] = useState<Class | null>(null);
    const [formData, setFormData] = useState<ClassFormData>({
        name: '',
        academicYear: new Date().getFullYear() + '/' + (new Date().getFullYear() + 1),
    });

    useEffect(() => {
        fetchClasses();
    }, []);

    const fetchClasses = async () => {
        try {
            const response = await fetch('/api/classes');
            if (!response.ok) throw new Error('Failed to fetch classes');
            const data = await response.json();
            setClasses(data);
        } catch (error) {
            toast.error('Gagal memuat data kelas');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = async () => {
        try {
            if (!formData.name || !formData.academicYear) {
                toast.error('Semua field harus diisi');
                return;
            }

            const response = await fetch('/api/classes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    grade: 10, // Default grade value
                }),
            });

            if (!response.ok) throw new Error('Failed to create class');

            toast.success('Kelas berhasil ditambahkan');
            setIsAddOpen(false);
            setFormData({
                name: '',
                academicYear: new Date().getFullYear() + '/' + (new Date().getFullYear() + 1),
            });
            fetchClasses();
        } catch (error) {
            toast.error('Gagal menambahkan kelas');
            console.error(error);
        }
    };

    const handleEdit = async () => {
        if (!selectedClass) return;

        try {
            if (!formData.name || !formData.academicYear) {
                toast.error('Semua field harus diisi');
                return;
            }

            const response = await fetch(`/api/classes/${selectedClass.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    grade: selectedClass.grade, // Keep existing grade
                }),
            });

            if (!response.ok) throw new Error('Failed to update class');

            toast.success('Kelas berhasil diupdate');
            setIsEditOpen(false);
            setSelectedClass(null);
            fetchClasses();
        } catch (error) {
            toast.error('Gagal mengupdate kelas');
            console.error(error);
        }
    };

    const handleDelete = async () => {
        if (!selectedClass) return;

        try {
            const response = await fetch(`/api/classes/${selectedClass.id}`, {
                method: 'DELETE',
            });

            if (!response.ok) throw new Error('Failed to delete class');

            toast.success('Kelas berhasil dihapus');
            setIsDeleteOpen(false);
            setSelectedClass(null);
            fetchClasses();
        } catch (error) {
            toast.error('Gagal menghapus kelas');
            console.error(error);
        }
    };

    const openEditDialog = (classData: Class) => {
        setSelectedClass(classData);
        setFormData({
            name: classData.name,
            academicYear: classData.academicYear,
        });
        setIsEditOpen(true);
    };

    const openDeleteDialog = (classData: Class) => {
        setSelectedClass(classData);
        setIsDeleteOpen(true);
    };

    const columns = [
        {
            header: 'Nama Kelas',
            accessor: (row: Class) => (
                <div className="font-medium text-foreground">{row.name}</div>
            ),
        },
        {
            header: 'Tahun Ajaran',
            accessor: (row: Class) => (
                <div className="text-muted-foreground">{row.academicYear}</div>
            ),
        },
        {
            header: 'Jumlah Siswa',
            accessor: (row: Class) => (
                <div className="flex items-center gap-2 text-muted-foreground">
                    <Users className="w-4 h-4 text-blue-500" />
                    <span>{row.studentCount} siswa</span>
                </div>
            ),
        },
        {
            header: 'Aksi',
            accessor: (row: Class) => (
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
            <div className="flex justify-end items-center">
                <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                    <DialogTrigger asChild>
                        <Button className="gap-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700">
                            <Plus className="w-4 h-4" />
                            Tambah Kelas
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Tambah Kelas Baru</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Nama Kelas</Label>
                                <Input
                                    id="name"
                                    placeholder="Contoh: Jepang, Taiwan"
                                    value={formData.name}
                                    onChange={(e) =>
                                        setFormData({ ...formData, name: e.target.value })
                                    }
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="academicYear">Tahun Ajaran</Label>
                                <Input
                                    id="academicYear"
                                    placeholder="Contoh: 2024/2025"
                                    value={formData.academicYear}
                                    onChange={(e) =>
                                        setFormData({ ...formData, academicYear: e.target.value })
                                    }
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsAddOpen(false)}>
                                Batal
                            </Button>
                            <Button onClick={handleAdd} className="bg-gradient-to-r from-orange-500 to-orange-600">
                                Simpan
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <DataTable
                columns={columns}
                data={classes}
                loading={loading}
                emptyMessage="Belum ada data kelas"
            />

            {/* Edit Dialog */}
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Kelas</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="edit-name">Nama Kelas</Label>
                            <Input
                                id="edit-name"
                                placeholder="Contoh: Jepang, Taiwan"
                                value={formData.name}
                                onChange={(e) =>
                                    setFormData({ ...formData, name: e.target.value })
                                }
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-academicYear">Tahun Ajaran</Label>
                            <Input
                                id="edit-academicYear"
                                placeholder="Contoh: 2024/2025"
                                value={formData.academicYear}
                                onChange={(e) =>
                                    setFormData({ ...formData, academicYear: e.target.value })
                                }
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsEditOpen(false)}>
                            Batal
                        </Button>
                        <Button onClick={handleEdit} className="bg-gradient-to-r from-orange-500 to-orange-600">
                            Update
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Dialog */}
            <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Hapus Kelas</AlertDialogTitle>
                        <AlertDialogDescription>
                            Apakah Anda yakin ingin menghapus kelas{' '}
                            <span className="font-semibold">{selectedClass?.name}</span>?
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
