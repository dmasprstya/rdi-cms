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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Plus, Trash2, BookText } from 'lucide-react';
import { toast } from 'react-toastify';
import { DataTable } from '@/components/ui/data-table';

interface Assignment {
    id: string;
    classId: string;
    subjectId: string;
    className: string;
    classAcademicYear: string;
    subjectName: string;
    subjectCode: string;
    createdAt: string;
}

interface Class {
    id: string;
    name: string;
    grade: number;
    academicYear: string;
}

interface Subject {
    id: string;
    name: string;
    code: string;
}

export function KelasMataPelajaranManagement() {
    const [assignments, setAssignments] = useState<Assignment[]>([]);
    const [classes, setClasses] = useState<Class[]>([]);
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
    const [formData, setFormData] = useState({
        classId: '',
        subjectId: '',
    });

    useEffect(() => {
        fetchAssignments();
        fetchClasses();
        fetchSubjects();
    }, []);

    const fetchAssignments = async () => {
        try {
            const response = await fetch('/api/kelas-mata-pelajaran');
            if (!response.ok) throw new Error('Failed to fetch assignments');
            const data = await response.json();
            setAssignments(data);
        } catch (error) {
            toast.error('Gagal memuat data');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const fetchClasses = async () => {
        try {
            const response = await fetch('/api/classes');
            if (response.ok) {
                const data = await response.json();
                setClasses(data);
            }
        } catch (error) {
            console.error('Error fetching classes:', error);
        }
    };

    const fetchSubjects = async () => {
        try {
            const response = await fetch('/api/subjects');
            if (response.ok) {
                const data = await response.json();
                setSubjects(data);
            }
        } catch (error) {
            console.error('Error fetching subjects:', error);
        }
    };

    const handleAdd = async () => {
        try {
            if (!formData.classId || !formData.subjectId) {
                toast.error('Kelas dan mata pelajaran harus dipilih');
                return;
            }

            const response = await fetch('/api/kelas-mata-pelajaran', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                toast.error(data.error || 'Gagal menambahkan assignment');
                return;
            }

            toast.success('Mata pelajaran berhasil ditambahkan ke kelas');
            setIsAddOpen(false);
            setFormData({ classId: '', subjectId: '' });
            fetchAssignments();
        } catch (error) {
            toast.error('Gagal menambahkan assignment');
            console.error(error);
        }
    };

    const handleDelete = async () => {
        if (!selectedAssignment) return;

        try {
            const response = await fetch(`/api/kelas-mata-pelajaran?id=${selectedAssignment.id}`, {
                method: 'DELETE',
            });

            if (!response.ok) throw new Error('Failed to delete');

            toast.success('Assignment berhasil dihapus');
            setIsDeleteOpen(false);
            setSelectedAssignment(null);
            fetchAssignments();
        } catch (error) {
            toast.error('Gagal menghapus assignment');
            console.error(error);
        }
    };

    const openDeleteDialog = (assignment: Assignment) => {
        setSelectedAssignment(assignment);
        setIsDeleteOpen(true);
    };

    const columns = [
        {
            header: 'Kelas',
            accessor: (row: Assignment) => (
                <div>
                    <div className="font-medium text-foreground">{row.className}</div>
                    <div className="text-xs text-muted-foreground">
                        {row.classAcademicYear}
                    </div>
                </div>
            ),
        },
        {
            header: 'Mata Pelajaran',
            accessor: (row: Assignment) => (
                <div>
                    <div className="font-medium text-foreground">{row.subjectName}</div>
                    <div className="text-xs text-muted-foreground">{row.subjectCode}</div>
                </div>
            ),
        },
        {
            header: 'Aksi',
            accessor: (row: Assignment) => (
                <Button
                    size="sm"
                    variant="outline"
                    onClick={() => openDeleteDialog(row)}
                    className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                >
                    <Trash2 className="w-4 h-4" />
                    Hapus
                </Button>
            ),
        },
    ];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-foreground">Kelola Mata Pelajaran Kelas</h2>
                    <p className="text-muted-foreground">Atur mata pelajaran yang diajarkan di setiap kelas</p>
                </div>
                <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                    <DialogTrigger asChild>
                        <Button className="gap-2 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700">
                            <Plus className="w-4 h-4" />
                            Tambah Assignment
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Tambah Mata Pelajaran ke Kelas</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="classId">Kelas <span className="text-red-500">*</span></Label>
                                <Select value={formData.classId} onValueChange={(value) => setFormData({ ...formData, classId: value })}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih kelas" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {classes.map((cls) => (
                                            <SelectItem key={cls.id} value={cls.id}>
                                                {cls.name} ({cls.academicYear})
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="subjectId">Mata Pelajaran <span className="text-red-500">*</span></Label>
                                <Select value={formData.subjectId} onValueChange={(value) => setFormData({ ...formData, subjectId: value })}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih mata pelajaran" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {subjects.map((subject) => (
                                            <SelectItem key={subject.id} value={subject.id}>
                                                {subject.name} ({subject.code})
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsAddOpen(false)}>
                                Batal
                            </Button>
                            <Button onClick={handleAdd} className="bg-gradient-to-r from-purple-500 to-purple-600">
                                Simpan
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <DataTable
                columns={columns}
                data={assignments}
                loading={loading}
                emptyMessage="Belum ada mata pelajaran yang ditugaskan ke kelas"
            />

            {/* Delete Dialog */}
            <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Hapus Assignment</AlertDialogTitle>
                        <AlertDialogDescription>
                            Apakah Anda yakin ingin menghapus{' '}
                            <span className="font-semibold">{selectedAssignment?.subjectName}</span>{' '}
                            dari kelas{' '}
                            <span className="font-semibold">{selectedAssignment?.className}</span>?
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
