'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import { UserPlus, Search, Pencil, Trash2, Loader2, X, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

interface Teacher {
    id: string;
    nip: string;
    subject: string | null;
    phone: string | null;
    dateOfBirth: string | null;
    userId: string;
    userName: string;
    userEmail: string;
    classIds?: string[];
}

interface Class {
    id: string;
    name: string;
    grade: number;
    academicYear: string;
}

interface TeacherFormData {
    id?: string;
    name: string;
    email: string;
    password: string;
    nip: string;
    subject: string;
    phone: string;
    dateOfBirth: string;
    classIds: string[];
}

const initialFormData: TeacherFormData = {
    name: '',
    email: '',
    password: '',
    nip: '',
    subject: '',
    phone: '',
    dateOfBirth: '',
    classIds: [],
};

export function TeachersManagement() {
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [classes, setClasses] = useState<Class[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterSubject, setFilterSubject] = useState('');
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [formData, setFormData] = useState<TeacherFormData>(initialFormData);
    const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const { toast } = useToast();

    const fetchTeachers = useCallback(async () => {
        try {
            setIsLoading(true);
            const response = await fetch('/api/teachers');
            if (response.ok) {
                const data = await response.json();
                setTeachers(data);
            } else {
                toast({
                    title: 'Error',
                    description: 'Gagal memuat data guru',
                    variant: 'destructive',
                });
            }
        } catch (error) {
            console.error('Error fetching teachers:', error);
            toast({
                title: 'Error',
                description: 'Gagal memuat data guru',
                variant: 'destructive',
            });
        } finally {
            setIsLoading(false);
        }
    }, [toast]);

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

    useEffect(() => {
        fetchTeachers();
        fetchClasses();
    }, [fetchTeachers, fetchClasses]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const resetForm = () => {
        setFormData(initialFormData);
        setEditingTeacher(null);
    };

    const handleAddTeacher = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name || !formData.email || !formData.password || !formData.nip) {
            toast({
                title: 'Error',
                description: 'Nama, email, password, dan NIP wajib diisi',
                variant: 'destructive',
            });
            return;
        }

        try {
            setIsSubmitting(true);

            const response = await fetch('/api/teachers', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                toast({
                    title: 'Berhasil',
                    description: 'Data guru berhasil ditambahkan',
                });
                setIsAddDialogOpen(false);
                resetForm();
                fetchTeachers();
            } else {
                toast({
                    title: 'Error',
                    description: data.error || 'Gagal menambahkan data guru',
                    variant: 'destructive',
                });
            }
        } catch (error) {
            console.error('Error adding teacher:', error);
            toast({
                title: 'Error',
                description: 'Gagal menambahkan data guru',
                variant: 'destructive',
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEditClick = (teacher: Teacher) => {
        setEditingTeacher(teacher);
        setFormData({
            id: teacher.id,
            name: teacher.userName,
            email: teacher.userEmail,
            password: '',
            nip: teacher.nip,
            subject: teacher.subject || '',
            phone: teacher.phone || '',
            dateOfBirth: teacher.dateOfBirth ? new Date(teacher.dateOfBirth).toISOString().split('T')[0] : '',
            classIds: teacher.classIds || [],
        });
        setIsEditDialogOpen(true);
    };

    const handleClassToggle = (classId: string) => {
        setFormData(prev => {
            const isSelected = prev.classIds.includes(classId);
            if (isSelected) {
                return { ...prev, classIds: prev.classIds.filter(id => id !== classId) };
            } else {
                return { ...prev, classIds: [...prev.classIds, classId] };
            }
        });
    };

    const handleUpdateTeacher = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name || !formData.email || !formData.nip) {
            toast({
                title: 'Error',
                description: 'Nama, email, dan NIP wajib diisi',
                variant: 'destructive',
            });
            return;
        }

        try {
            setIsSubmitting(true);

            const response = await fetch('/api/teachers', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                toast({
                    title: 'Berhasil',
                    description: 'Data guru berhasil diperbarui',
                });
                setIsEditDialogOpen(false);
                resetForm();
                fetchTeachers();
            } else {
                toast({
                    title: 'Error',
                    description: data.error || 'Gagal memperbarui data guru',
                    variant: 'destructive',
                });
            }
        } catch (error) {
            console.error('Error updating teacher:', error);
            toast({
                title: 'Error',
                description: 'Gagal memperbarui data guru',
                variant: 'destructive',
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteTeacher = async (teacherId: string) => {
        try {
            const response = await fetch(`/api/teachers?id=${teacherId}`, {
                method: 'DELETE',
            });

            const data = await response.json();

            if (response.ok) {
                toast({
                    title: 'Berhasil',
                    description: 'Data guru berhasil dihapus',
                });
                fetchTeachers();
            } else {
                toast({
                    title: 'Error',
                    description: data.error || 'Gagal menghapus data guru',
                    variant: 'destructive',
                });
            }
        } catch (error) {
            console.error('Error deleting teacher:', error);
            toast({
                title: 'Error',
                description: 'Gagal menghapus data guru',
                variant: 'destructive',
            });
        }
    };

    // Filter teachers based on search and subject filter
    const filteredTeachers = teachers.filter(teacher => {
        const matchesSearch =
            teacher.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            teacher.nip.toLowerCase().includes(searchQuery.toLowerCase()) ||
            teacher.userEmail.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesSubject = filterSubject === '' || filterSubject === 'all' ||
            (teacher.subject && teacher.subject.toLowerCase().includes(filterSubject.toLowerCase()));

        return matchesSearch && matchesSubject;
    });

    // Get unique subjects for filter
    const uniqueSubjects = Array.from(new Set(teachers.map(t => t.subject).filter(Boolean)));

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold text-foreground">Kelola Guru</h2>
                    <p className="text-muted-foreground mt-1">
                        Tambah, edit, dan kelola data guru
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
                            <UserPlus className="w-4 h-4 mr-2" />
                            Tambah Guru
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px] bg-card">
                        <DialogHeader>
                            <DialogTitle className="text-foreground">Tambah Guru Baru</DialogTitle>
                            <DialogDescription className="text-muted-foreground">
                                Masukkan data guru baru di bawah ini
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleAddTeacher}>
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="name" className="text-right text-foreground">
                                        Nama <span className="text-destructive">*</span>
                                    </Label>
                                    <Input
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className="col-span-3"
                                        placeholder="Nama lengkap guru"
                                        required
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="nip" className="text-right text-foreground">
                                        NIP <span className="text-destructive">*</span>
                                    </Label>
                                    <Input
                                        id="nip"
                                        name="nip"
                                        value={formData.nip}
                                        onChange={handleInputChange}
                                        className="col-span-3"
                                        placeholder="Nomor Induk Pegawai"
                                        required
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="email" className="text-right text-foreground">
                                        Email <span className="text-destructive">*</span>
                                    </Label>
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className="col-span-3"
                                        placeholder="email@sekolah.com"
                                        required
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="password" className="text-right text-foreground">
                                        Password <span className="text-destructive">*</span>
                                    </Label>
                                    <div className="col-span-3 relative">
                                        <Input
                                            id="password"
                                            name="password"
                                            type={showPassword ? "text" : "password"}
                                            value={formData.password}
                                            onChange={handleInputChange}
                                            className="pr-10"
                                            placeholder="Password untuk login"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                        >
                                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                    </div>
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="phone" className="text-right text-foreground">
                                        No. Telepon
                                    </Label>
                                    <Input
                                        id="phone"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        className="col-span-3"
                                        placeholder="08xxxxxxxxxx"
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="dateOfBirth" className="text-right text-foreground">
                                        Tanggal Lahir
                                    </Label>
                                    <Input
                                        id="dateOfBirth"
                                        name="dateOfBirth"
                                        type="date"
                                        value={formData.dateOfBirth}
                                        onChange={handleInputChange}
                                        className="col-span-3"
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-start gap-4">
                                    <Label className="text-right text-foreground pt-2">
                                        Kelas
                                    </Label>
                                    <div className="col-span-3 space-y-2">
                                        <Select onValueChange={handleClassToggle}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Pilih kelas..." />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {classes.map((classItem) => (
                                                    <SelectItem
                                                        key={classItem.id}
                                                        value={classItem.id}
                                                        disabled={formData.classIds.includes(classItem.id)}
                                                    >
                                                        {classItem.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {formData.classIds.length > 0 && (
                                            <div className="flex flex-wrap gap-2">
                                                {formData.classIds.map((classId) => {
                                                    const classItem = classes.find(c => c.id === classId);
                                                    return classItem ? (
                                                        <Badge key={classId} variant="secondary" className="gap-1">
                                                            {classItem.name}
                                                            <X
                                                                className="w-3 h-3 cursor-pointer"
                                                                onClick={() => handleClassToggle(classId)}
                                                            />
                                                        </Badge>
                                                    ) : null;
                                                })}
                                            </div>
                                        )}
                                    </div>
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

            {/* Search and Filter */}
            <Card>
                <CardContent className="pt-6">
                    <div className="flex gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                            <input
                                id="searchTeachers"
                                name="searchTeachers"
                                type="text"
                                placeholder="Cari guru berdasarkan nama, NIP, atau email..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-yellow-400"
                            />
                        </div>
                        <select
                            id="filterSubject"
                            name="filterSubject"
                            value={filterSubject}
                            onChange={(e) => setFilterSubject(e.target.value)}
                            className="px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-yellow-400"
                        >
                            <option value="">Semua Mata Pelajaran</option>
                            <option value="all">Semua Mata Pelajaran</option>
                            {uniqueSubjects.map((subject) => (
                                <option key={subject} value={subject!}>
                                    {subject}
                                </option>
                            ))}
                        </select>
                    </div>
                </CardContent>
            </Card>

            {/* Teachers Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Daftar Guru ({filteredTeachers.length})</CardTitle>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="flex justify-center items-center py-8">
                            <Loader2 className="w-8 h-8 animate-spin text-primary" />
                            <span className="ml-2 text-muted-foreground">Memuat data...</span>
                        </div>
                    ) : filteredTeachers.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                            {teachers.length === 0
                                ? 'Belum ada data guru. Klik "Tambah Guru" untuk menambahkan data.'
                                : 'Tidak ada guru yang sesuai dengan filter.'}
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="border-b border-border">
                                    <tr>
                                        <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">NIP</th>
                                        <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Nama</th>
                                        <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Kelas yang Diajar</th>
                                        <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Email</th>
                                        <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">No. Telepon</th>
                                        <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {filteredTeachers.map((teacher) => (
                                        <tr key={teacher.id} className="hover:bg-muted/50">
                                            <td className="py-3 px-4 text-sm text-foreground font-medium">{teacher.nip}</td>
                                            <td className="py-3 px-4 text-sm text-foreground">{teacher.userName}</td>
                                            <td className="py-3 px-4 text-sm text-muted-foreground">
                                                {teacher.classIds && teacher.classIds.length > 0 ? (
                                                    <div className="flex flex-wrap gap-1">
                                                        {teacher.classIds.map((classId) => {
                                                            const classItem = classes.find(c => c.id === classId);
                                                            return classItem ? (
                                                                <Badge key={classId} variant="outline" className="text-xs">
                                                                    {classItem.name}
                                                                </Badge>
                                                            ) : null;
                                                        })}
                                                    </div>
                                                ) : '-'}
                                            </td>
                                            <td className="py-3 px-4 text-sm text-muted-foreground">{teacher.userEmail}</td>
                                            <td className="py-3 px-4 text-sm text-muted-foreground">
                                                {teacher.phone || '-'}
                                            </td>
                                            <td className="py-3 px-4 text-sm">
                                                <div className="flex gap-2">
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => handleEditClick(teacher)}
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
                                                                    Hapus Data Guru?
                                                                </AlertDialogTitle>
                                                                <AlertDialogDescription className="text-muted-foreground">
                                                                    Apakah Anda yakin ingin menghapus data guru <strong>{teacher.userName}</strong> (NIP: {teacher.nip})?
                                                                    Tindakan ini tidak dapat dibatalkan dan akan menghapus semua data terkait termasuk akun login guru.
                                                                </AlertDialogDescription>
                                                            </AlertDialogHeader>
                                                            <AlertDialogFooter>
                                                                <AlertDialogCancel>Batal</AlertDialogCancel>
                                                                <AlertDialogAction
                                                                    className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                                                                    onClick={() => handleDeleteTeacher(teacher.id)}
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
                <DialogContent className="sm:max-w-[500px] bg-card">
                    <DialogHeader>
                        <DialogTitle className="text-foreground">Edit Data Guru</DialogTitle>
                        <DialogDescription className="text-muted-foreground">
                            Perbarui data guru di bawah ini
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleUpdateTeacher}>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="edit-name" className="text-right text-foreground">
                                    Nama <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="edit-name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="col-span-3"
                                    placeholder="Nama lengkap guru"
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="edit-nip" className="text-right text-foreground">
                                    NIP <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="edit-nip"
                                    name="nip"
                                    value={formData.nip}
                                    onChange={handleInputChange}
                                    className="col-span-3"
                                    placeholder="Nomor Induk Pegawai"
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="edit-email" className="text-right text-foreground">
                                    Email <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="edit-email"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="col-span-3"
                                    placeholder="email@sekolah.com"
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="edit-password" className="text-right text-foreground">
                                    Password
                                </Label>
                                <div className="col-span-3 relative">
                                    <Input
                                        id="edit-password"
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        className="pr-10"
                                        placeholder="Kosongkan jika tidak ingin mengubah"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                    >
                                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="edit-phone" className="text-right text-foreground">
                                    No. Telepon
                                </Label>
                                <Input
                                    id="edit-phone"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    className="col-span-3"
                                    placeholder="08xxxxxxxxxx"
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="edit-dateOfBirth" className="text-right text-foreground">
                                    Tanggal Lahir
                                </Label>
                                <Input
                                    id="edit-dateOfBirth"
                                    name="dateOfBirth"
                                    type="date"
                                    value={formData.dateOfBirth}
                                    onChange={handleInputChange}
                                    className="col-span-3"
                                />
                            </div>
                            <div className="grid grid-cols-4 items-start gap-4">
                                <Label className="text-right text-foreground pt-2">
                                    Kelas
                                </Label>
                                <div className="col-span-3 space-y-2">
                                    <Select onValueChange={handleClassToggle}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Pilih kelas..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {classes.map((classItem) => (
                                                <SelectItem
                                                    key={classItem.id}
                                                    value={classItem.id}
                                                    disabled={formData.classIds.includes(classItem.id)}
                                                >
                                                    {classItem.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {formData.classIds.length > 0 && (
                                        <div className="flex flex-wrap gap-2">
                                            {formData.classIds.map((classId) => {
                                                const classItem = classes.find(c => c.id === classId);
                                                return classItem ? (
                                                    <Badge key={classId} variant="secondary" className="gap-1">
                                                        {classItem.name}
                                                        <X
                                                            className="w-3 h-3 cursor-pointer"
                                                            onClick={() => handleClassToggle(classId)}
                                                        />
                                                    </Badge>
                                                ) : null;
                                            })}
                                        </div>
                                    )}
                                </div>
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
