'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
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
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { BookMarked, Trash2, Plus, AlertCircle, BookOpen, Edit2, Search, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import SubjectManager from '@/components/guru/subject-manager';

interface Class {
    id: string;
    name: string;
    academicYear: string;
}

interface Subject {
    id: string;
    name: string;
    code: string;
    credits: number;
    description: string | null;
}

interface SubjectFormData {
    name: string;
    code: string;
    credits: number;
    description: string;
}

interface ClassSubjectAssignment {
    id: string;
    classId: string;
    subjectId: string;
    subjectName: string;
    subjectCode: string;
}

interface DeleteConfirmation {
    subject: Subject;
    canDelete: boolean;
    details?: {
        classCount: number;
        moduleCount: number;
        gradeCount: number;
        scheduleCount: number;
    };
}

export default function GuruSubjectsManagementPage() {
    // Existing states
    const [classes, setClasses] = useState<Class[]>([]);
    const [allSubjects, setAllSubjects] = useState<Subject[]>([]);
    const [assignedSubjects, setAssignedSubjects] = useState<ClassSubjectAssignment[]>([]);
    const [selectedClassId, setSelectedClassId] = useState<string>('');
    const [selectedSubjectId, setSelectedSubjectId] = useState<string>('');

    const [loadingClasses, setLoadingClasses] = useState(true);
    const [loadingSubjects, setLoadingSubjects] = useState(true);
    const [loadingAssignments, setLoadingAssignments] = useState(false);
    const [adding, setAdding] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    // Subject CRUD states
    const [showSubjectsManager, setShowSubjectsManager] = useState(false);
    const [showCreateDialog, setShowCreateDialog] = useState(false);
    const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
    const [subjectForm, setSubjectForm] = useState<SubjectFormData>({
        name: '',
        code: '',
        credits: 2,
        description: '',
    });
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});
    const [savingSubject, setSavingSubject] = useState(false);
    const [deletingSubjectId, setDeletingSubjectId] = useState<string | null>(null);

    // Search & filter with debouncing
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');

    // Delete confirmation with details
    const [deleteConfirmation, setDeleteConfirmation] = useState<DeleteConfirmation | null>(null);

    // Subject to delete from class assignment (different from subject CRUD delete)
    const [subjectToDelete, setSubjectToDelete] = useState<{ id: string; name: string } | null>(null);

    const { toast } = useToast();

    // Debounce effect (300ms delay)
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchQuery);
        }, 300);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    const fetchClasses = useCallback(async () => {
        try {
            const response = await fetch('/api/guru/classes');
            if (!response.ok) {
                if (response.status === 401) {
                    toast({
                        title: 'Sesi berakhir',
                        description: 'Silakan login kembali',
                        variant: 'destructive',
                    });
                    return;
                }
                throw new Error('Failed to fetch classes');
            }
            const data = await response.json();
            setClasses(data);
        } catch (error) {
            console.error('Error fetching classes:', error);
            toast({
                title: 'Gagal memuat data kelas',
                description: 'Terjadi kesalahan saat memuat data kelas',
                variant: 'destructive',
            });
        } finally {
            setLoadingClasses(false);
        }
    }, [toast]);

    const fetchAllSubjects = useCallback(async () => {
        try {
            const response = await fetch('/api/guru/subjects');
            if (!response.ok) {
                throw new Error('Failed to fetch subjects');
            }
            const data = await response.json();
            setAllSubjects(data);
        } catch (error) {
            console.error('Error fetching subjects:', error);
            toast({
                title: 'Gagal memuat mata pelajaran',
                description: 'Terjadi kesalahan saat memuat data mata pelajaran',
                variant: 'destructive',
            });
        } finally {
            setLoadingSubjects(false);
        }
    }, [toast]);

    const fetchAssignedSubjects = useCallback(async () => {
        if (!selectedClassId) return;

        setLoadingAssignments(true);
        try {
            const response = await fetch('/api/kelas-mata-pelajaran');
            if (!response.ok) {
                throw new Error('Failed to fetch assignments');
            }
            const data = await response.json();
            const filtered = data.filter((a: ClassSubjectAssignment) => a.classId === selectedClassId);
            setAssignedSubjects(filtered);
        } catch (error) {
            console.error('Error fetching assignments:', error);
            toast({
                title: 'Gagal memuat data',
                description: 'Terjadi kesalahan saat memuat mata pelajaran kelas',
                variant: 'destructive',
            });
        } finally {
            setLoadingAssignments(false);
        }
    }, [selectedClassId, toast]);

    useEffect(() => {
        fetchClasses();
        fetchAllSubjects();
    }, [fetchClasses, fetchAllSubjects]);

    useEffect(() => {
        if (selectedClassId) {
            fetchAssignedSubjects();
        } else {
            setAssignedSubjects([]);
        }
    }, [selectedClassId, fetchAssignedSubjects]);

    const handleAddSubject = async () => {
        if (!selectedClassId || !selectedSubjectId) return;

        setAdding(true);
        try {
            const response = await fetch('/api/kelas-mata-pelajaran', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    classId: selectedClassId,
                    subjectId: selectedSubjectId,
                }),
            });

            if (!response.ok) {
                const error = await response.json();
                toast({
                    title: 'Gagal menambahkan',
                    description: error.error || 'Terjadi kesalahan saat menambahkan mata pelajaran',
                    variant: 'destructive',
                });
                return;
            }

            toast({
                title: 'Berhasil',
                description: 'Mata pelajaran berhasil ditambahkan',
            });

            setSelectedSubjectId('');
            await fetchAssignedSubjects();
        } catch (error) {
            console.error('Error adding subject:', error);
            toast({
                title: 'Gagal menambahkan',
                description: 'Terjadi kesalahan saat menambahkan mata pelajaran',
                variant: 'destructive',
            });
        } finally {
            setAdding(false);
        }
    };

    const handleDeleteSubject = async (assignmentId: string) => {
        setDeletingId(assignmentId);
        try {
            const response = await fetch(`/api/kelas-mata-pelajaran?id=${assignmentId}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                const error = await response.json();
                toast({
                    title: 'Gagal menghapus',
                    description: error.error || 'Terjadi kesalahan saat menghapus mata pelajaran',
                    variant: 'destructive',
                });
                return;
            }

            toast({
                title: 'Berhasil',
                description: 'Mata pelajaran berhasil dihapus dari kelas',
            });

            await fetchAssignedSubjects();
        } catch (error) {
            console.error('Error deleting subject:', error);
            toast({
                title: 'Gagal menghapus',
                description: 'Terjadi kesalahan saat menghapus mata pelajaran',
                variant: 'destructive',
            });
        } finally {
            setDeletingId(null);
            setSubjectToDelete(null);
        }
    };

    const getAvailableSubjects = () => {
        const assignedIds = assignedSubjects.map(a => a.subjectId);
        return allSubjects.filter(s => !assignedIds.includes(s.id));
    };

    const getAssignedSubjectDetails = () => {
        return assignedSubjects.map(assignment => {
            const subject = allSubjects.find(s => s.id === assignment.subjectId);
            return {
                ...assignment,
                subject,
            };
        });
    };

    const selectedClass = classes.find(c => c.id === selectedClassId);
    const availableSubjects = getAvailableSubjects();
    const assignedWithDetails = getAssignedSubjectDetails();

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold text-foreground">Kelola Mata Pelajaran</h2>
                <p className="text-muted-foreground mt-1">
                    Tambah atau hapus mata pelajaran yang diajar di setiap kelas
                </p>
            </div>

            {/* Subject Manager - Create, Edit, Delete Subjects */}
            <SubjectManager onSubjectsChange={fetchAllSubjects} />

            {/* Class Selector */}
            <Card>
                <CardHeader>
                    <CardTitle>Pilih Kelas</CardTitle>
                    <CardDescription>
                        Pilih kelas untuk melihat dan mengelola mata pelajaran
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Select
                        value={selectedClassId}
                        onValueChange={setSelectedClassId}
                        disabled={loadingClasses}
                    >
                        <SelectTrigger className="w-full md:w-96">
                            <SelectValue placeholder={loadingClasses ? 'Memuat kelas...' : 'Pilih kelas'} />
                        </SelectTrigger>
                        <SelectContent>
                            {classes.map((cls) => (
                                <SelectItem key={cls.id} value={cls.id}>
                                    {cls.name} - {cls.academicYear}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </CardContent>
            </Card>

            {/* No Class Selected State */}
            {!selectedClassId && (
                <Card className="border-dashed">
                    <CardContent className="flex flex-col items-center justify-center py-12">
                        <BookMarked className="w-16 h-16 text-muted-foreground mb-4" />
                        <p className="text-lg font-medium text-muted-foreground">
                            Pilih kelas untuk melihat mata pelajaran
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                            Gunakan dropdown di atas untuk memilih kelas
                        </p>
                    </CardContent>
                </Card>
            )}

            {/* Add Subject Section */}
            {selectedClassId && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Plus className="w-5 h-5 text-orange-500" />
                            Tambah Mata Pelajaran
                        </CardTitle>
                        <CardDescription>
                            Tambahkan mata pelajaran baru ke {selectedClass?.name}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {availableSubjects.length === 0 ? (
                            <div className="flex items-center gap-3 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
                                <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                <p className="text-sm text-blue-700 dark:text-blue-300">
                                    Semua mata pelajaran sudah ditambahkan ke kelas ini
                                </p>
                            </div>
                        ) : (
                            <div className="flex flex-col sm:flex-row gap-3">
                                <Select
                                    value={selectedSubjectId}
                                    onValueChange={setSelectedSubjectId}
                                    disabled={loadingSubjects || adding}
                                >
                                    <SelectTrigger className="flex-1">
                                        <SelectValue placeholder="Pilih mata pelajaran" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {availableSubjects.map((subject) => (
                                            <SelectItem key={subject.id} value={subject.id}>
                                                {subject.code} - {subject.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <Button
                                    onClick={handleAddSubject}
                                    disabled={!selectedSubjectId || adding}
                                    className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700"
                                >
                                    {adding ? 'Menambahkan...' : 'Tambah'}
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}

            {/* Assigned Subjects List */}
            {selectedClassId && (
                <Card>
                    <CardHeader>
                        <CardTitle>
                            Mata Pelajaran di {selectedClass?.name}
                        </CardTitle>
                        <CardDescription>
                            Daftar mata pelajaran yang diajar di kelas ini
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {loadingAssignments ? (
                            <div className="space-y-3">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="h-24 bg-muted animate-pulse rounded-lg" />
                                ))}
                            </div>
                        ) : assignedWithDetails.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed rounded-lg">
                                <BookOpen className="w-16 h-16 text-muted-foreground mb-4" />
                                <p className="text-lg font-medium text-muted-foreground">
                                    Belum ada mata pelajaran untuk kelas ini
                                </p>
                                <p className="text-sm text-muted-foreground mt-1">
                                    Gunakan form di atas untuk menambahkan mata pelajaran
                                </p>
                            </div>
                        ) : (
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                {assignedWithDetails.map((item) => (
                                    <Card key={item.id} className="overflow-hidden">
                                        <div className="h-1 bg-gradient-to-r from-orange-500 to-red-600" />
                                        <CardContent className="pt-6">
                                            <div className="flex items-start justify-between mb-3">
                                                <div className="flex-1">
                                                    <h3 className="font-semibold text-foreground">
                                                        {item.subject?.name || item.subjectName}
                                                    </h3>
                                                    <p className="text-sm text-muted-foreground">
                                                        Kode: {item.subject?.code || item.subjectCode}
                                                    </p>
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => setSubjectToDelete({
                                                        id: item.id,
                                                        name: item.subject?.name || item.subjectName
                                                    })}
                                                    disabled={deletingId === item.id}
                                                    className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                            {item.subject?.credits && (
                                                <p className="text-sm text-muted-foreground">
                                                    SKS: {item.subject.credits}
                                                </p>
                                            )}
                                            {item.subject?.description && (
                                                <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
                                                    {item.subject.description}
                                                </p>
                                            )}
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={!!subjectToDelete} onOpenChange={() => setSubjectToDelete(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Hapus Mata Pelajaran</AlertDialogTitle>
                        <AlertDialogDescription>
                            Apakah Anda yakin ingin menghapus <strong>{subjectToDelete?.name}</strong> dari kelas ini?
                            Tindakan ini tidak dapat dibatalkan.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => subjectToDelete && handleDeleteSubject(subjectToDelete.id)}
                            className="bg-red-500 hover:bg-red-600"
                        >
                            Hapus
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
