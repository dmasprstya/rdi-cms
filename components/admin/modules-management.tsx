'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { PlusCircle, Search, Pencil, Trash2, Loader2, BookOpen, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Module {
    id: string;
    title: string;
    description: string | null;
    content: string | null;
    fileUrl: string | null;
    subjectId: string;
    subjectName: string | null;
    subjectCode: string | null;
    classId: string | null;
    className: string | null;
    classGrade: number | null;
    teacherId: string;
    teacherName: string | null;
    isPublished: boolean;
    createdAt: string;
    updatedAt: string;
}

interface Subject {
    id: string;
    name: string;
    code: string;
}

interface Class {
    id: string;
    name: string;
    grade: number;
}

interface Teacher {
    id: string;
    name: string;
    nip: string;
}

interface ModuleFormData {
    id?: string;
    title: string;
    description: string;
    content: string;
    fileUrl: string;
    subjectId: string;
    classId: string;
    teacherId: string;
    isPublished: boolean;
}

const initialFormData: ModuleFormData = {
    title: '',
    description: '',
    content: '',
    fileUrl: '',
    subjectId: '',
    classId: 'ALL_CLASSES',
    teacherId: '',
    isPublished: true,
};

export function ModulesManagement() {
    const [modules, setModules] = useState<Module[]>([]);
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [classes, setClasses] = useState<Class[]>([]);
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterSubject, setFilterSubject] = useState('');
    const [filterClass, setFilterClass] = useState('');
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [formData, setFormData] = useState<ModuleFormData>(initialFormData);
    const { toast } = useToast();

    const fetchModules = useCallback(async () => {
        try {
            const response = await fetch('/api/modules');
            if (response.ok) {
                const data = await response.json();
                setModules(data);
            } else {
                toast({
                    title: 'Error',
                    description: 'Gagal memuat data modul',
                    variant: 'destructive',
                });
            }
        } catch (error) {
            console.error('Error fetching modules:', error);
            toast({
                title: 'Error',
                description: 'Gagal memuat data modul',
                variant: 'destructive',
            });
        }
    }, [toast]);

    const fetchSubjects = useCallback(async () => {
        try {
            const response = await fetch('/api/subjects');
            if (response.ok) {
                const data = await response.json();
                setSubjects(data);
            }
        } catch (error) {
            console.error('Error fetching subjects:', error);
        }
    }, []);

    const fetchClasses = useCallback(async () => {
        try {
            const response = await fetch('/api/classes');
            if (response.ok) {
                const data = await response.json();
                setClasses(data);
            }
        } catch (error) {
            console.error('Error fetching classes:', error);
        }
    }, []);

    const fetchTeachers = useCallback(async () => {
        try {
            const response = await fetch('/api/teachers');
            if (response.ok) {
                const data = await response.json();
                setTeachers(data.map((t: any) => ({
                    id: t.id,
                    name: t.userName,
                    nip: t.nip,
                })));
            }
        } catch (error) {
            console.error('Error fetching teachers:', error);
        }
    }, []);

    useEffect(() => {
        async function loadData() {
            setIsLoading(true);
            await Promise.all([
                fetchModules(),
                fetchSubjects(),
                fetchClasses(),
                fetchTeachers(),
            ]);
            setIsLoading(false);
        }
        loadData();
    }, [fetchModules, fetchSubjects, fetchClasses, fetchTeachers]);

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (name: string, value: string) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const resetForm = () => {
        setFormData(initialFormData);
    };

    const handleAddModule = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.title || !formData.subjectId || !formData.teacherId) {
            toast({
                title: 'Error',
                description: 'Judul, mata pelajaran, dan guru wajib diisi',
                variant: 'destructive',
            });
            return;
        }

        try {
            setIsSubmitting(true);

            const response = await fetch('/api/modules', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    classId: formData.classId === 'ALL_CLASSES' ? null : formData.classId,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                toast({
                    title: 'Berhasil',
                    description: 'Modul berhasil ditambahkan',
                });
                setIsAddDialogOpen(false);
                resetForm();
                fetchModules();
            } else {
                toast({
                    title: 'Error',
                    description: data.error || 'Gagal menambahkan modul',
                    variant: 'destructive',
                });
            }
        } catch (error) {
            console.error('Error adding module:', error);
            toast({
                title: 'Error',
                description: 'Gagal menambahkan modul',
                variant: 'destructive',
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEditClick = (module: Module) => {
        setFormData({
            id: module.id,
            title: module.title,
            description: module.description || '',
            content: module.content || '',
            fileUrl: module.fileUrl || '',
            subjectId: module.subjectId,
            classId: module.classId || 'ALL_CLASSES',
            teacherId: module.teacherId,
            isPublished: module.isPublished,
        });
        setIsEditDialogOpen(true);
    };

    const handleUpdateModule = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.title || !formData.subjectId || !formData.teacherId) {
            toast({
                title: 'Error',
                description: 'Judul, mata pelajaran, dan guru wajib diisi',
                variant: 'destructive',
            });
            return;
        }

        try {
            setIsSubmitting(true);

            const response = await fetch('/api/modules', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    classId: formData.classId === 'ALL_CLASSES' ? null : formData.classId,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                toast({
                    title: 'Berhasil',
                    description: 'Modul berhasil diperbarui',
                });
                setIsEditDialogOpen(false);
                resetForm();
                fetchModules();
            } else {
                toast({
                    title: 'Error',
                    description: data.error || 'Gagal memperbarui modul',
                    variant: 'destructive',
                });
            }
        } catch (error) {
            console.error('Error updating module:', error);
            toast({
                title: 'Error',
                description: 'Gagal memperbarui modul',
                variant: 'destructive',
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteModule = async (moduleId: string) => {
        try {
            const response = await fetch(`/api/modules?id=${moduleId}`, {
                method: 'DELETE',
            });

            const data = await response.json();

            if (response.ok) {
                toast({
                    title: 'Berhasil',
                    description: 'Modul berhasil dihapus',
                });
                fetchModules();
            } else {
                toast({
                    title: 'Error',
                    description: data.error || 'Gagal menghapus modul',
                    variant: 'destructive',
                });
            }
        } catch (error) {
            console.error('Error deleting module:', error);
            toast({
                title: 'Error',
                description: 'Gagal menghapus modul',
                variant: 'destructive',
            });
        }
    };

    // Filter modules
    const filteredModules = modules.filter(module => {
        const matchesSearch =
            module.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (module.subjectName && module.subjectName.toLowerCase().includes(searchQuery.toLowerCase()));

        const matchesSubject = !filterSubject || filterSubject === 'all' || module.subjectId === filterSubject;
        const matchesClass = !filterClass || filterClass === 'all' ||
            (filterClass === 'none' ? !module.classId : module.classId === filterClass);

        return matchesSearch && matchesSubject && matchesClass;
    });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold text-foreground">Kelola Modul Belajar</h2>
                    <p className="text-muted-foreground mt-1">
                        Tambah, edit, dan kelola modul pembelajaran
                    </p>
                </div>
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                    <DialogTrigger asChild>
                        <Button
                            className="bg-yellow-400 hover:bg-yellow-500 text-black"
                            onClick={() => {
                                resetForm();
                                setIsAddDialogOpen(true);
                            }}
                        >
                            <PlusCircle className="w-4 h-4 mr-2" />
                            Tambah Modul
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[600px] bg-card max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle className="text-foreground">Tambah Modul Baru</DialogTitle>
                            <DialogDescription className="text-muted-foreground">
                                Masukkan informasi modul pembelajaran baru
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleAddModule}>
                            <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="title" className="text-gray-700 dark:text-gray-300">
                                        Judul Modul <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="title"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleInputChange}
                                        placeholder="Contoh: Pengenalan Algoritma Dasar"
                                        required
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="description" className="text-gray-700 dark:text-gray-300">
                                        Deskripsi
                                    </Label>
                                    <Textarea
                                        id="description"
                                        name="description"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        placeholder="Deskripsi singkat tentang modul ini..."
                                        rows={3}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="subjectId" className="text-gray-700 dark:text-gray-300">
                                            Mata Pelajaran <span className="text-red-500">*</span>
                                        </Label>
                                        <Select
                                            value={formData.subjectId}
                                            onValueChange={(value) => handleSelectChange('subjectId', value)}
                                        >
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

                                    <div className="grid gap-2">
                                        <Label htmlFor="classId" className="text-gray-700 dark:text-gray-300">
                                            Kelas (Opsional)
                                        </Label>
                                        <Select
                                            value={formData.classId}
                                            onValueChange={(value) => handleSelectChange('classId', value)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Semua kelas" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="ALL_CLASSES">Semua Kelas</SelectItem>
                                                {classes.map((cls) => (
                                                    <SelectItem key={cls.id} value={cls.id}>
                                                        {cls.name} (Tingkat {cls.grade})
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="teacherId" className="text-gray-700 dark:text-gray-300">
                                        Guru/Pengupload <span className="text-red-500">*</span>
                                    </Label>
                                    <Select
                                        value={formData.teacherId}
                                        onValueChange={(value) => handleSelectChange('teacherId', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Pilih guru" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {teachers.map((teacher) => (
                                                <SelectItem key={teacher.id} value={teacher.id}>
                                                    {teacher.name} (NIP: {teacher.nip})
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="fileUrl" className="text-gray-700 dark:text-gray-300">
                                        URL File/Link Download
                                    </Label>
                                    <Input
                                        id="fileUrl"
                                        name="fileUrl"
                                        type="url"
                                        value={formData.fileUrl}
                                        onChange={handleInputChange}
                                        placeholder="https://drive.google.com/file/d/..."
                                    />
                                    <p className="text-xs text-gray-500">
                                        Masukkan link Google Drive, Dropbox, atau file hosting lainnya
                                    </p>
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="content" className="text-gray-700 dark:text-gray-300">
                                        Konten/Catatan Tambahan
                                    </Label>
                                    <Textarea
                                        id="content"
                                        name="content"
                                        value={formData.content}
                                        onChange={handleInputChange}
                                        placeholder="Tambahkan catatan atau instruksi untuk siswa..."
                                        rows={4}
                                    />
                                </div>

                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        id="isPublished"
                                        checked={formData.isPublished}
                                        onChange={(e) => setFormData(prev => ({ ...prev, isPublished: e.target.checked }))}
                                        className="w-4 h-4 text-yellow-400 border-gray-300 rounded focus:ring-yellow-400"
                                    />
                                    <Label htmlFor="isPublished" className="text-gray-700 dark:text-gray-300 cursor-pointer">
                                        Publikasikan modul (siswa dapat melihat)
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
                                    className="bg-yellow-400 hover:bg-yellow-500 text-black"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                    Simpan Modul
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Search and Filter */}
            <Card>
                <CardContent className="pt-6">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Cari modul berdasarkan judul atau mata pelajaran..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                            />
                        </div>
                        <select
                            value={filterSubject}
                            onChange={(e) => setFilterSubject(e.target.value)}
                            className="px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-yellow-400"
                        >
                            <option value="">Semua Mata Pelajaran</option>
                            {subjects.map((subject) => (
                                <option key={subject.id} value={subject.id}>
                                    {subject.name}
                                </option>
                            ))}
                        </select>
                        <select
                            value={filterClass}
                            onChange={(e) => setFilterClass(e.target.value)}
                            className="px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-yellow-400"
                        >
                            <option value="">Semua Kelas</option>
                            <option value="none">Tidak Ada Kelas Spesifik</option>
                            {classes.map((cls) => (
                                <option key={cls.id} value={cls.id}>
                                    {cls.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </CardContent>
            </Card>

            {/* Modules Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Daftar Modul ({filteredModules.length})</CardTitle>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="flex justify-center items-center py-8">
                            <Loader2 className="w-8 h-8 animate-spin text-yellow-400" />
                            <span className="ml-2 text-muted-foreground">Memuat data...</span>
                        </div>
                    ) : filteredModules.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                            {modules.length === 0
                                ? 'Belum ada modul. Klik "Tambah Modul" untuk membuat modul baru.'
                                : 'Tidak ada modul yang sesuai dengan filter.'}
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="border-b border-border">
                                    <tr>
                                        <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Judul</th>
                                        <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Mata Pelajaran</th>
                                        <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Kelas</th>
                                        <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Guru</th>
                                        <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Status</th>
                                        <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                    {filteredModules.map((module) => (
                                        <tr key={module.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                                            <td className="py-3 px-4 text-sm text-foreground">
                                                <div className="font-medium">{module.title}</div>
                                                {module.description && (
                                                    <div className="text-xs text-gray-500 line-clamp-1 mt-1">
                                                        {module.description}
                                                    </div>
                                                )}
                                            </td>
                                            <td className="py-3 px-4 text-sm text-muted-foreground">
                                                {module.subjectName || '-'}
                                            </td>
                                            <td className="py-3 px-4 text-sm text-muted-foreground">
                                                {module.className || 'Semua Kelas'}
                                            </td>
                                            <td className="py-3 px-4 text-sm text-muted-foreground">
                                                {module.teacherName || '-'}
                                            </td>
                                            <td className="py-3 px-4 text-sm">
                                                {module.isPublished ? (
                                                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-green-100 text-green-700 text-xs font-medium">
                                                        <Eye className="w-3 h-3" />
                                                        Dipublikasi
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-medium">
                                                        <EyeOff className="w-3 h-3" />
                                                        Draft
                                                    </span>
                                                )}
                                            </td>
                                            <td className="py-3 px-4 text-sm">
                                                <div className="flex gap-2">
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => handleEditClick(module)}
                                                    >
                                                        <Pencil className="w-3 h-3 mr-1" />
                                                        Edit
                                                    </Button>
                                                    <AlertDialog>
                                                        <AlertDialogTrigger asChild>
                                                            <Button size="sm" variant="destructive">
                                                                <Trash2 className="w-3 h-3 mr-1" />
                                                                Hapus
                                                            </Button>
                                                        </AlertDialogTrigger>
                                                        <AlertDialogContent className="bg-card">
                                                            <AlertDialogHeader>
                                                                <AlertDialogTitle className="text-foreground">
                                                                    Hapus Modul?
                                                                </AlertDialogTitle>
                                                                <AlertDialogDescription className="text-muted-foreground">
                                                                    Apakah Anda yakin ingin menghapus modul <strong>{module.title}</strong>?
                                                                    Tindakan ini tidak dapat dibatalkan.
                                                                </AlertDialogDescription>
                                                            </AlertDialogHeader>
                                                            <AlertDialogFooter>
                                                                <AlertDialogCancel>Batal</AlertDialogCancel>
                                                                <AlertDialogAction
                                                                    className="bg-red-600 hover:bg-red-700 text-white"
                                                                    onClick={() => handleDeleteModule(module.id)}
                                                                >
                                                                    Ya, Hapus
                                                                </AlertDialogAction>
                                                            </AlertDialogFooter>
                                                        </AlertDialogContent>
                                                    </AlertDialog>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Edit Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="sm:max-w-[600px] bg-card max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="text-foreground">Edit Modul</DialogTitle>
                        <DialogDescription className="text-muted-foreground">
                            Perbarui informasi modul pembelajaran
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleUpdateModule}>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="edit-title" className="text-gray-700 dark:text-gray-300">
                                    Judul Modul <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="edit-title"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="edit-description" className="text-gray-700 dark:text-gray-300">
                                    Deskripsi
                                </Label>
                                <Textarea
                                    id="edit-description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    rows={3}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="edit-subjectId" className="text-gray-700 dark:text-gray-300">
                                        Mata Pelajaran <span className="text-red-500">*</span>
                                    </Label>
                                    <Select
                                        value={formData.subjectId}
                                        onValueChange={(value) => handleSelectChange('subjectId', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
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

                                <div className="grid gap-2">
                                    <Label htmlFor="edit-classId" className="text-gray-700 dark:text-gray-300">
                                        Kelas (Opsional)
                                    </Label>
                                    <Select
                                        value={formData.classId}
                                        onValueChange={(value) => handleSelectChange('classId', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="ALL_CLASSES">Semua Kelas</SelectItem>
                                            {classes.map((cls) => (
                                                <SelectItem key={cls.id} value={cls.id}>
                                                    {cls.name} (Tingkat {cls.grade})
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="edit-teacherId" className="text-gray-700 dark:text-gray-300">
                                    Guru/Pengupload <span className="text-red-500">*</span>
                                </Label>
                                <Select
                                    value={formData.teacherId}
                                    onValueChange={(value) => handleSelectChange('teacherId', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {teachers.map((teacher) => (
                                            <SelectItem key={teacher.id} value={teacher.id}>
                                                {teacher.name} (NIP: {teacher.nip})
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="edit-fileUrl" className="text-gray-700 dark:text-gray-300">
                                    URL File/Link Download
                                </Label>
                                <Input
                                    id="edit-fileUrl"
                                    name="fileUrl"
                                    type="url"
                                    value={formData.fileUrl}
                                    onChange={handleInputChange}
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="edit-content" className="text-gray-700 dark:text-gray-300">
                                    Konten/Catatan Tambahan
                                </Label>
                                <Textarea
                                    id="edit-content"
                                    name="content"
                                    value={formData.content}
                                    onChange={handleInputChange}
                                    rows={4}
                                />
                            </div>

                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="edit-isPublished"
                                    checked={formData.isPublished}
                                    onChange={(e) => setFormData(prev => ({ ...prev, isPublished: e.target.checked }))}
                                    className="w-4 h-4 text-yellow-400 border-gray-300 rounded focus:ring-yellow-400"
                                />
                                <Label htmlFor="edit-isPublished" className="text-gray-700 dark:text-gray-300 cursor-pointer">
                                    Publikasikan modul (siswa dapat melihat)
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
                                className="bg-yellow-400 hover:bg-yellow-500 text-black"
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
