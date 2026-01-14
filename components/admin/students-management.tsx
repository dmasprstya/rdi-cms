'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { UserPlus, Search, Pencil, Trash2, Loader2, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Student {
    id: string;
    nis: string;
    phone: string | null;
    address: string | null;
    dateOfBirth: string | null;
    photoUrl: string | null;
    userId: string;
    classId: string | null;
    userName: string;
    userEmail: string;
    className: string | null;
}

interface Class {
    id: string;
    name: string;
    grade: number;
    academicYear: string;
}

interface StudentFormData {
    id?: string;
    name: string;
    email: string;
    password: string;
    nis: string;
    classId: string;
    phone: string;
    address: string;
    dateOfBirth: string;
}

const initialFormData: StudentFormData = {
    name: '',
    email: '',
    password: '',
    nis: '',
    classId: '',
    phone: '',
    address: '',
    dateOfBirth: '',
};

export function StudentsManagement() {
    const [students, setStudents] = useState<Student[]>([]);
    const [classes, setClasses] = useState<Class[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterClass, setFilterClass] = useState('');
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [formData, setFormData] = useState<StudentFormData>(initialFormData);
    const [editingStudent, setEditingStudent] = useState<Student | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const { toast } = useToast();

    const fetchStudents = useCallback(async () => {
        try {
            setIsLoading(true);
            const response = await fetch('/api/students');
            if (response.ok) {
                const data = await response.json();
                setStudents(data);
            } else {
                toast({
                    title: 'Error',
                    description: 'Gagal memuat data siswa',
                    variant: 'destructive',
                });
            }
        } catch (error) {
            console.error('Error fetching students:', error);
            toast({
                title: 'Error',
                description: 'Gagal memuat data siswa',
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

    // Fetch students and classes on mount
    useEffect(() => {
        fetchStudents();
        fetchClasses();
    }, [fetchStudents, fetchClasses]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (value: string) => {
        setFormData(prev => ({ ...prev, classId: value }));
    };

    const resetForm = () => {
        setFormData(initialFormData);
        setEditingStudent(null);
    };

    const handleAddStudent = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name || !formData.email || !formData.password || !formData.nis) {
            toast({
                title: 'Error',
                description: 'Nama, email, password, dan NIS wajib diisi',
                variant: 'destructive',
            });
            return;
        }

        try {
            setIsSubmitting(true);

            const response = await fetch('/api/students', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                toast({
                    title: 'Berhasil',
                    description: 'Data siswa berhasil ditambahkan',
                });
                setIsAddDialogOpen(false);
                resetForm();
                fetchStudents();
            } else {
                toast({
                    title: 'Error',
                    description: data.error || 'Gagal menambahkan data siswa',
                    variant: 'destructive',
                });
            }
        } catch (error) {
            console.error('Error adding student:', error);
            toast({
                title: 'Error',
                description: 'Gagal menambahkan data siswa',
                variant: 'destructive',
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEditClick = (student: Student) => {
        setEditingStudent(student);
        setFormData({
            id: student.id,
            name: student.userName,
            email: student.userEmail,
            password: '',
            nis: student.nis,
            classId: student.classId || '',
            phone: student.phone || '',
            address: student.address || '',
            dateOfBirth: student.dateOfBirth ? new Date(student.dateOfBirth).toISOString().split('T')[0] : '',
        });
        setIsEditDialogOpen(true);
    };

    const handleUpdateStudent = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name || !formData.email || !formData.nis) {
            toast({
                title: 'Error',
                description: 'Nama, email, dan NIS wajib diisi',
                variant: 'destructive',
            });
            return;
        }

        try {
            setIsSubmitting(true);

            const response = await fetch('/api/students', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                toast({
                    title: 'Berhasil',
                    description: 'Data siswa berhasil diperbarui',
                });
                setIsEditDialogOpen(false);
                resetForm();
                fetchStudents();
            } else {
                toast({
                    title: 'Error',
                    description: data.error || 'Gagal memperbarui data siswa',
                    variant: 'destructive',
                });
            }
        } catch (error) {
            console.error('Error updating student:', error);
            toast({
                title: 'Error',
                description: 'Gagal memperbarui data siswa',
                variant: 'destructive',
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteStudent = async (studentId: string) => {
        try {
            const response = await fetch(`/api/students?id=${studentId}`, {
                method: 'DELETE',
            });

            const data = await response.json();

            if (response.ok) {
                toast({
                    title: 'Berhasil',
                    description: 'Data siswa berhasil dihapus',
                });
                fetchStudents();
            } else {
                toast({
                    title: 'Error',
                    description: data.error || 'Gagal menghapus data siswa',
                    variant: 'destructive',
                });
            }
        } catch (error) {
            console.error('Error deleting student:', error);
            toast({
                title: 'Error',
                description: 'Gagal menghapus data siswa',
                variant: 'destructive',
            });
        }
    };

    // Filter students based on search and class filter - Memoized for performance
    const filteredStudents = useMemo(() => {
        return students.filter(student => {
            const matchesSearch =
                student.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                student.nis.toLowerCase().includes(searchQuery.toLowerCase()) ||
                student.userEmail.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesClass = filterClass === '' || filterClass === 'all' || student.classId === filterClass;

            return matchesSearch && matchesClass;
        });
    }, [students, searchQuery, filterClass]);

    // Get unique classes from students for filter dropdown - Memoized
    const uniqueClasses = useMemo(
        () => Array.from(new Set(students.map(s => s.classId).filter(Boolean))),
        [students]
    );

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold text-foreground">Kelola Siswa</h2>
                    <p className="text-muted-foreground mt-1">
                        Tambah, edit, dan kelola data siswa
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
                            Tambah Siswa
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px] bg-card">
                        <DialogHeader>
                            <DialogTitle className="text-foreground">Tambah Siswa Baru</DialogTitle>
                            <DialogDescription className="text-muted-foreground">
                                Masukkan data siswa baru di bawah ini
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleAddStudent}>
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
                                        placeholder="Nama lengkap siswa"
                                        required
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="nis" className="text-right text-foreground">
                                        NIS <span className="text-destructive">*</span>
                                    </Label>
                                    <Input
                                        id="nis"
                                        name="nis"
                                        value={formData.nis}
                                        onChange={handleInputChange}
                                        className="col-span-3"
                                        placeholder="Nomor Induk Siswa"
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
                                    <Label htmlFor="classId" className="text-right text-foreground">
                                        Kelas
                                    </Label>
                                    <Select value={formData.classId} onValueChange={handleSelectChange}>
                                        <SelectTrigger className="col-span-3">
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
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="address" className="text-right text-foreground">
                                        Alamat
                                    </Label>
                                    <Input
                                        id="address"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleInputChange}
                                        className="col-span-3"
                                        placeholder="Alamat lengkap"
                                    />
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
                                id="searchStudents"
                                name="searchStudents"
                                type="text"
                                placeholder="Cari siswa berdasarkan nama, NIS, atau email..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-yellow-400"
                            />
                        </div>
                        <select
                            id="filterClass"
                            name="filterClass"
                            value={filterClass}
                            onChange={(e) => setFilterClass(e.target.value)}
                            className="px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-yellow-400"
                        >
                            <option value="">Semua Kelas</option>
                            <option value="all">Semua Kelas</option>
                            {classes.map((cls) => (
                                <option key={cls.id} value={cls.id}>
                                    {cls.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </CardContent>
            </Card>

            {/* Students Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Daftar Siswa ({filteredStudents.length})</CardTitle>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="flex justify-center items-center py-8">
                            <Loader2 className="w-8 h-8 animate-spin text-primary" />
                            <span className="ml-2 text-muted-foreground">Memuat data...</span>
                        </div>
                    ) : filteredStudents.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                            {students.length === 0
                                ? 'Belum ada data siswa. Klik "Tambah Siswa" untuk menambahkan data.'
                                : 'Tidak ada siswa yang sesuai dengan filter.'}
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="border-b border-border">
                                    <tr>
                                        <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">NIS</th>
                                        <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Nama</th>
                                        <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Kelas</th>
                                        <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Email</th>
                                        <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">No. Telepon</th>
                                        <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {filteredStudents.map((student) => (
                                        <tr key={student.id} className="hover:bg-muted/50">
                                            <td className="py-3 px-4 text-sm text-foreground font-medium">{student.nis}</td>
                                            <td className="py-3 px-4 text-sm text-foreground">{student.userName}</td>
                                            <td className="py-3 px-4 text-sm text-muted-foreground">
                                                {student.className || '-'}
                                            </td>
                                            <td className="py-3 px-4 text-sm text-muted-foreground">{student.userEmail}</td>
                                            <td className="py-3 px-4 text-sm text-muted-foreground">
                                                {student.phone || '-'}
                                            </td>
                                            <td className="py-3 px-4 text-sm">
                                                <div className="flex gap-2">
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => handleEditClick(student)}
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
                                                                    Hapus Data Siswa?
                                                                </AlertDialogTitle>
                                                                <AlertDialogDescription className="text-muted-foreground">
                                                                    Apakah Anda yakin ingin menghapus data siswa <strong>{student.userName}</strong> (NIS: {student.nis})?
                                                                    Tindakan ini tidak dapat dibatalkan dan akan menghapus semua data terkait termasuk akun login siswa.
                                                                </AlertDialogDescription>
                                                            </AlertDialogHeader>
                                                            <AlertDialogFooter>
                                                                <AlertDialogCancel>Batal</AlertDialogCancel>
                                                                <AlertDialogAction
                                                                    className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                                                                    onClick={() => handleDeleteStudent(student.id)}
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
                        <DialogTitle className="text-foreground">Edit Data Siswa</DialogTitle>
                        <DialogDescription className="text-muted-foreground">
                            Perbarui data siswa di bawah ini
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleUpdateStudent}>
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
                                    placeholder="Nama lengkap siswa"
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="edit-nis" className="text-right text-foreground">
                                    NIS <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="edit-nis"
                                    name="nis"
                                    value={formData.nis}
                                    onChange={handleInputChange}
                                    className="col-span-3"
                                    placeholder="Nomor Induk Siswa"
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
                                <Label htmlFor="edit-classId" className="text-right text-foreground">
                                    Kelas
                                </Label>
                                <Select value={formData.classId} onValueChange={handleSelectChange}>
                                    <SelectTrigger className="col-span-3">
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
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="edit-address" className="text-right text-foreground">
                                    Alamat
                                </Label>
                                <Input
                                    id="edit-address"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleInputChange}
                                    className="col-span-3"
                                    placeholder="Alamat lengkap"
                                />
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
