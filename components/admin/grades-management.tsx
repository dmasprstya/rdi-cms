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
import { PlusCircle, Search, Pencil, Trash2, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Grade {
    id: string;
    studentId: string;
    subjectId: string;
    score: number;
    semester: number;
    academicYear: string;
    remarks: string | null;
    studentNis: string;
    studentName: string;
    className: string | null;
    subjectName: string;
    subjectCode: string;
}

interface Student {
    id: string;
    nis: string;
    userName: string;
    classId: string | null;
    className: string | null;
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
    academicYear: string;
}

interface GradeFormData {
    id?: string;
    studentId: string;
    subjectId: string;
    score: string;
    semester: string;
    academicYear: string;
    remarks: string;
}

const initialFormData: GradeFormData = {
    studentId: '',
    subjectId: '',
    score: '',
    semester: '1',
    academicYear: '',
    remarks: '',
};

export function GradesManagement() {
    const [grades, setGrades] = useState<Grade[]>([]);
    const [students, setStudents] = useState<Student[]>([]);
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [classes, setClasses] = useState<Class[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterClass, setFilterClass] = useState('');
    const [filterSubject, setFilterSubject] = useState('');
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [formData, setFormData] = useState<GradeFormData>(initialFormData);
    const { toast } = useToast();

    const fetchGrades = useCallback(async () => {
        try {
            setIsLoading(true);
            const params = new URLSearchParams();
            if (filterClass) params.append('classId', filterClass);
            if (filterSubject) params.append('subjectId', filterSubject);

            const response = await fetch(`/api/grades?${params}`);
            if (response.ok) {
                const data = await response.json();
                setGrades(data);
            } else {
                toast({
                    title: 'Error',
                    description: 'Gagal memuat data nilai',
                    variant: 'destructive',
                });
            }
        } catch (error) {
            console.error('Error fetching grades:', error);
            toast({
                title: 'Error',
                description: 'Gagal memuat data nilai',
                variant: 'destructive',
            });
        } finally {
            setIsLoading(false);
        }
    }, [toast, filterClass, filterSubject]);

    const fetchStudents = useCallback(async () => {
        try {
            const response = await fetch('/api/students');
            if (response.ok) {
                const data = await response.json();
                setStudents(data);
            }
        } catch (error) {
            console.error('Error fetching students:', error);
        }
    }, []);

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

    useEffect(() => {
        fetchGrades();
        fetchStudents();
        fetchSubjects();
        fetchClasses();
    }, [fetchGrades, fetchStudents, fetchSubjects, fetchClasses]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (name: string, value: string) => {
        setFormData(prev => ({ ...prev, [name]: value }));

        // Auto-populate academic year when student is selected
        if (name === 'studentId') {
            const student = students.find(s => s.id === value);
            if (student && student.classId) {
                const studentClass = classes.find(c => c.id === student.classId);
                if (studentClass) {
                    setFormData(prev => ({ ...prev, academicYear: studentClass.academicYear }));
                }
            }
        }
    };

    const resetForm = () => {
        setFormData(initialFormData);
    };

    const handleAddGrade = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.studentId || !formData.subjectId || !formData.score || !formData.semester || !formData.academicYear) {
            toast({
                title: 'Error',
                description: 'Semua field wajib diisi',
                variant: 'destructive',
            });
            return;
        }

        const score = parseInt(formData.score);
        if (isNaN(score) || score < 0 || score > 100) {
            toast({
                title: 'Error',
                description: 'Nilai harus antara 0-100',
                variant: 'destructive',
            });
            return;
        }

        try {
            setIsSubmitting(true);

            const response = await fetch('/api/grades', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    score,
                    semester: parseInt(formData.semester),
                }),
            });

            const data = await response.json();

            if (response.ok) {
                toast({
                    title: 'Berhasil',
                    description: 'Nilai berhasil ditambahkan',
                });
                setIsAddDialogOpen(false);
                resetForm();
                fetchGrades();
            } else {
                toast({
                    title: 'Error',
                    description: data.error || 'Gagal menambahkan nilai',
                    variant: 'destructive',
                });
            }
        } catch (error) {
            console.error('Error adding grade:', error);
            toast({
                title: 'Error',
                description: 'Gagal menambahkan nilai',
                variant: 'destructive',
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEditClick = (grade: Grade) => {
        setFormData({
            id: grade.id,
            studentId: grade.studentId,
            subjectId: grade.subjectId,
            score: grade.score.toString(),
            semester: grade.semester.toString(),
            academicYear: grade.academicYear,
            remarks: grade.remarks || '',
        });
        setIsEditDialogOpen(true);
    };

    const handleUpdateGrade = async (e: React.FormEvent) => {
        e.preventDefault();

        const score = parseInt(formData.score);
        if (isNaN(score) || score < 0 || score > 100) {
            toast({
                title: 'Error',
                description: 'Nilai harus antara 0-100',
                variant: 'destructive',
            });
            return;
        }

        try {
            setIsSubmitting(true);

            const response = await fetch('/api/grades', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    score,
                    semester: parseInt(formData.semester),
                }),
            });

            const data = await response.json();

            if (response.ok) {
                toast({
                    title: 'Berhasil',
                    description: 'Nilai berhasil diperbarui',
                });
                setIsEditDialogOpen(false);
                resetForm();
                fetchGrades();
            } else {
                toast({
                    title: 'Error',
                    description: data.error || 'Gagal memperbarui nilai',
                    variant: 'destructive',
                });
            }
        } catch (error) {
            console.error('Error updating grade:', error);
            toast({
                title: 'Error',
                description: 'Gagal memperbarui nilai',
                variant: 'destructive',
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteGrade = async (gradeId: string) => {
        try {
            const response = await fetch(`/api/grades?id=${gradeId}`, {
                method: 'DELETE',
            });

            const data = await response.json();

            if (response.ok) {
                toast({
                    title: 'Berhasil',
                    description: 'Nilai berhasil dihapus',
                });
                fetchGrades();
            } else {
                toast({
                    title: 'Error',
                    description: data.error || 'Gagal menghapus nilai',
                    variant: 'destructive',
                });
            }
        } catch (error) {
            console.error('Error deleting grade:', error);
            toast({
                title: 'Error',
                description: 'Gagal menghapus nilai',
                variant: 'destructive',
            });
        }
    };

    // Filter grades based on search
    const filteredGrades = grades.filter(grade => {
        const matchesSearch =
            grade.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            grade.studentNis.toLowerCase().includes(searchQuery.toLowerCase()) ||
            grade.subjectName.toLowerCase().includes(searchQuery.toLowerCase());

        return matchesSearch;
    });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold text-foreground">Input Nilai</h2>
                    <p className="text-muted-foreground mt-1">
                        Tambah, edit, dan kelola nilai siswa
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
                            <PlusCircle className="w-4 h-4 mr-2" />
                            Input Nilai
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px] bg-card">
                        <DialogHeader>
                            <DialogTitle className="text-foreground">Input Nilai Baru</DialogTitle>
                            <DialogDescription className="text-muted-foreground">
                                Masukkan nilai siswa di bawah ini
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleAddGrade}>
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="studentId" className="text-right text-foreground">
                                        Siswa <span className="text-destructive">*</span>
                                    </Label>
                                    <Select value={formData.studentId} onValueChange={(value) => handleSelectChange('studentId', value)}>
                                        <SelectTrigger className="col-span-3">
                                            <SelectValue placeholder="Pilih siswa" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {students.map((student) => (
                                                <SelectItem key={student.id} value={student.id}>
                                                    {student.userName} ({student.nis}) - {student.className || 'Tanpa kelas'}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="subjectId" className="text-right text-foreground">
                                        Mata Pelajaran <span className="text-destructive">*</span>
                                    </Label>
                                    <Select value={formData.subjectId} onValueChange={(value) => handleSelectChange('subjectId', value)}>
                                        <SelectTrigger className="col-span-3">
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
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="score" className="text-right text-foreground">
                                        Nilai <span className="text-destructive">*</span>
                                    </Label>
                                    <Input
                                        id="score"
                                        name="score"
                                        type="number"
                                        min="0"
                                        max="100"
                                        value={formData.score}
                                        onChange={handleInputChange}
                                        className="col-span-3"
                                        placeholder="0-100"
                                        required
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="semester" className="text-right text-foreground">
                                        Semester <span className="text-destructive">*</span>
                                    </Label>
                                    <Select value={formData.semester} onValueChange={(value) => handleSelectChange('semester', value)}>
                                        <SelectTrigger className="col-span-3">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="1">Semester 1</SelectItem>
                                            <SelectItem value="2">Semester 2</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="academicYear" className="text-right text-foreground">
                                        Tahun Akademik <span className="text-destructive">*</span>
                                    </Label>
                                    <Input
                                        id="academicYear"
                                        name="academicYear"
                                        value={formData.academicYear}
                                        onChange={handleInputChange}
                                        className="col-span-3"
                                        placeholder="2023/2024"
                                        required
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="remarks" className="text-right text-foreground">
                                        Catatan
                                    </Label>
                                    <Textarea
                                        id="remarks"
                                        name="remarks"
                                        value={formData.remarks}
                                        onChange={handleInputChange}
                                        className="col-span-3"
                                        placeholder="Catatan tambahan (opsional)"
                                        rows={3}
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
                                type="text"
                                placeholder="Cari berdasarkan nama siswa, NIS, atau mata pelajaran..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-yellow-400"
                            />
                        </div>
                        <select
                            value={filterClass}
                            onChange={(e) => setFilterClass(e.target.value)}
                            className="px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-yellow-400"
                        >
                            <option value="">Semua Kelas</option>
                            {classes.map((cls) => (
                                <option key={cls.id} value={cls.id}>
                                    {cls.name}
                                </option>
                            ))}
                        </select>
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
                    </div>
                </CardContent>
            </Card>

            {/* Grades Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Daftar Nilai ({filteredGrades.length})</CardTitle>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="flex justify-center items-center py-8">
                            <Loader2 className="w-8 h-8 animate-spin text-primary" />
                            <span className="ml-2 text-muted-foreground">Memuat data...</span>
                        </div>
                    ) : filteredGrades.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                            {grades.length === 0
                                ? 'Belum ada data nilai. Klik "Input Nilai" untuk menambahkan data.'
                                : 'Tidak ada nilai yang sesuai dengan filter.'}
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="border-b border-border">
                                    <tr>
                                        <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">NIS</th>
                                        <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Nama Siswa</th>
                                        <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Kelas</th>
                                        <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Mata Pelajaran</th>
                                        <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Nilai</th>
                                        <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Semester</th>
                                        <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Tahun</th>
                                        <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {filteredGrades.map((grade) => (
                                        <tr key={grade.id} className="hover:bg-muted/50">
                                            <td className="py-3 px-4 text-sm text-foreground font-medium">{grade.studentNis}</td>
                                            <td className="py-3 px-4 text-sm text-foreground">{grade.studentName}</td>
                                            <td className="py-3 px-4 text-sm text-muted-foreground">{grade.className || '-'}</td>
                                            <td className="py-3 px-4 text-sm text-muted-foreground">{grade.subjectName}</td>
                                            <td className="py-3 px-4 text-sm text-foreground font-semibold">{grade.score}</td>
                                            <td className="py-3 px-4 text-sm text-muted-foreground">Semester {grade.semester}</td>
                                            <td className="py-3 px-4 text-sm text-muted-foreground">{grade.academicYear}</td>
                                            <td className="py-3 px-4 text-sm">
                                                <div className="flex gap-2">
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => handleEditClick(grade)}
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
                                                                    Hapus Nilai?
                                                                </AlertDialogTitle>
                                                                <AlertDialogDescription className="text-muted-foreground">
                                                                    Apakah Anda yakin ingin menghapus nilai <strong>{grade.subjectName}</strong> untuk <strong>{grade.studentName}</strong>?
                                                                    Tindakan ini tidak dapat dibatalkan.
                                                                </AlertDialogDescription>
                                                            </AlertDialogHeader>
                                                            <AlertDialogFooter>
                                                                <AlertDialogCancel>Batal</AlertDialogCancel>
                                                                <AlertDialogAction
                                                                    className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                                                                    onClick={() => handleDeleteGrade(grade.id)}
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
                        <DialogTitle className="text-foreground">Edit Nilai</DialogTitle>
                        <DialogDescription className="text-muted-foreground">
                            Perbarui nilai siswa di bawah ini
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleUpdateGrade}>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="edit-score" className="text-right text-foreground">
                                    Nilai <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="edit-score"
                                    name="score"
                                    type="number"
                                    min="0"
                                    max="100"
                                    value={formData.score}
                                    onChange={handleInputChange}
                                    className="col-span-3"
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="edit-remarks" className="text-right text-foreground">
                                    Catatan
                                </Label>
                                <Textarea
                                    id="edit-remarks"
                                    name="remarks"
                                    value={formData.remarks}
                                    onChange={handleInputChange}
                                    className="col-span-3"
                                    placeholder="Catatan tambahan (opsional)"
                                    rows={3}
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
