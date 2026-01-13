'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
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
import { Edit2, Trash2, Plus, Search, X, AlertCircle, BookOpen, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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

interface SubjectManagerProps {
    onSubjectsChange?: () => void;
    apiBasePath?: string; // Optional API base path, defaults to '/api/guru/subjects'
}

export default function SubjectManager({ onSubjectsChange, apiBasePath = '/api/guru/subjects' }: SubjectManagerProps) {
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [loading, setLoading] = useState(true);
    const [showManager, setShowManager] = useState(false);
    const [showDialog, setShowDialog] = useState(false);
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

    // Search with debouncing
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');

    const [deleteConfirmation, setDeleteConfirmation] = useState<DeleteConfirmation | null>(null);

    const { toast } = useToast();

    // Debounce effect (300ms delay)
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchQuery);
        }, 300);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    // Fetch subjects
    const fetchSubjects = useCallback(async () => {
        try {
            const response = await fetch(apiBasePath);
            if (!response.ok) throw new Error('Failed to fetch');
            const data = await response.json();
            setSubjects(data);
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Gagal memuat mata pelajaran',
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    }, [apiBasePath, toast]);

    useEffect(() => {
        if (showManager) {
            fetchSubjects();
        }
    }, [showManager, fetchSubjects]);

    // Validation
    const validateSubjectForm = (data: SubjectFormData): Record<string, string> => {
        const errors: Record<string, string> = {};

        const cleanName = data.name?.trim() || '';
        const cleanCode = data.code?.trim().toUpperCase() || '';
        const cleanDescription = data.description?.trim() || '';

        if (cleanName.length === 0) {
            errors.name = 'Nama mata pelajaran wajib diisi';
        } else if (cleanName.length > 100) {
            errors.name = 'Nama maksimal 100 karakter';
        }

        if (cleanCode.length === 0) {
            errors.code = 'Kode mata pelajaran wajib diisi';
        } else if (!/^[A-Z0-9_-]+$/.test(cleanCode)) {
            errors.code = 'Kode hanya boleh huruf, angka, dash, dan underscore';
        } else if (cleanCode.length > 20) {
            errors.code = 'Kode maksimal 20 karakter';
        }

        if (!data.credits || data.credits < 1 || data.credits > 8) {
            errors.credits = 'SKS harus antara 1-8';
        }

        if (cleanDescription.length > 500) {
            errors.description = 'Deskripsi maksimal 500 karakter';
        }

        return errors;
    };

    // Create subject
    const handleCreateSubmit = async () => {
        const errors = validateSubjectForm(subjectForm);
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }

        setSavingSubject(true);
        try {
            const sanitizedData = {
                name: subjectForm.name.trim(),
                code: subjectForm.code.trim().toUpperCase(),
                credits: subjectForm.credits,
                description: subjectForm.description?.trim() || null,
            };

            const response = await fetch(apiBasePath, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(sanitizedData),
            });

            if (!response.ok) {
                const error = await response.json();
                if (response.status === 409) {
                    setFormErrors({ code: error.message });
                } else {
                    toast({
                        title: 'Gagal membuat mata pelajaran',
                        description: error.message || 'Terjadi kesalahan',
                        variant: 'destructive',
                    });
                }
                return;
            }

            toast({
                title: 'Berhasil',
                description: 'Mata pelajaran berhasil dibuat',
            });

            setShowDialog(false);
            resetForm();
            await fetchSubjects();
            onSubjectsChange?.();
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Gagal terhubung ke server',
                variant: 'destructive',
            });
        } finally {
            setSavingSubject(false);
        }
    };

    // Edit subject
    const handleEditSubmit = async () => {
        if (!editingSubject) return;

        const errors = validateSubjectForm(subjectForm);
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }

        setSavingSubject(true);
        try {
            const sanitizedData = {
                id: editingSubject.id,
                name: subjectForm.name.trim(),
                code: subjectForm.code.trim().toUpperCase(),
                credits: subjectForm.credits,
                description: subjectForm.description?.trim() || null,
            };

            const response = await fetch(apiBasePath, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(sanitizedData),
            });

            if (!response.ok) {
                const error = await response.json();
                if (response.status === 409) {
                    setFormErrors({ code: error.message });
                } else {
                    toast({
                        title: 'Gagal mengupdate mata pelajaran',
                        description: error.message || 'Terjadi kesalahan',
                        variant: 'destructive',
                    });
                }
                return;
            }

            const result = await response.json();
            const hasRelatedData = result.relatedDataCount &&
                (result.relatedDataCount.classes > 0 || result.relatedDataCount.modules > 0 ||
                    result.relatedDataCount.grades > 0 || result.relatedDataCount.schedules > 0);

            toast({
                title: 'Berhasil',
                description: hasRelatedData
                    ? 'Mata pelajaran diupdate. Perubahan akan mempengaruhi data terkait.'
                    : 'Mata pelajaran berhasil diupdate',
            });

            setShowDialog(false);
            resetForm();
            await fetchSubjects();
            onSubjectsChange?.();
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Gagal terhubung ke server',
                variant: 'destructive',
            });
        } finally {
            setSavingSubject(false);
        }
    };

    // Delete with pre-check
    const handleDeleteClick = async (subject: Subject) => {
        try {
            const checkDeletePath = apiBasePath.includes('/guru/')
                ? `${apiBasePath}/check-delete?id=${subject.id}`
                : `${apiBasePath}/check-delete?id=${subject.id}`;
            const response = await fetch(checkDeletePath);
            const data = await response.json();

            setDeleteConfirmation({
                subject,
                canDelete: data.canDelete,
                details: data.details,
            });
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Gagal memeriksa data terkait',
                variant: 'destructive',
            });
        }
    };

    const confirmDeleteSubject = async () => {
        if (!deleteConfirmation) return;

        setDeletingSubjectId(deleteConfirmation.subject.id);
        try {
            const response = await fetch(`${apiBasePath}?id=${deleteConfirmation.subject.id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                const error = await response.json();

                if (response.status === 409 && error.details) {
                    setDeleteConfirmation({
                        subject: deleteConfirmation.subject,
                        canDelete: false,
                        details: error.details,
                    });

                    toast({
                        title: 'Tidak dapat menghapus',
                        description: 'Data terkait bertambah. Dialog telah diupdate.',
                        variant: 'destructive',
                    });
                } else {
                    toast({
                        title: 'Gagal menghapus',
                        description: error.message || 'Terjadi kesalahan',
                        variant: 'destructive',
                    });
                    setDeleteConfirmation(null);
                }
                return;
            }

            toast({
                title: 'Berhasil',
                description: 'Mata pelajaran berhasil dihapus',
            });

            setDeleteConfirmation(null);
            await fetchSubjects();
            onSubjectsChange?.();
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Gagal terhubung ke server',
                variant: 'destructive',
            });
        } finally {
            setDeletingSubjectId(null);
        }
    };

    const openEditDialog = (subject: Subject) => {
        setEditingSubject(subject);
        setSubjectForm({
            name: subject.name,
            code: subject.code,
            credits: subject.credits,
            description: subject.description || '',
        });
        setFormErrors({});
        setShowDialog(true);
    };

    const openCreateDialog = () => {
        setEditingSubject(null);
        resetForm();
        setShowDialog(true);
    };

    const resetForm = () => {
        setSubjectForm({
            name: '',
            code: '',
            credits: 2,
            description: '',
        });
        setFormErrors({});
        setEditingSubject(null);
    };

    // Filter subjects
    const filteredSubjects = subjects.filter(s =>
        debouncedSearch.length === 0 ||
        s.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        s.code.toLowerCase().includes(debouncedSearch.toLowerCase())
    );

    return (
        <>
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>Daftar Mata Pelajaran</CardTitle>
                            <CardDescription>Kelola master data mata pelajaran</CardDescription>
                        </div>
                        <Button
                            onClick={() => setShowManager(!showManager)}
                            variant={showManager ? "secondary" : "default"}
                        >
                            {showManager ? 'Sembunyikan' : 'Kelola Mata Pelajaran'}
                        </Button>
                    </div>
                </CardHeader>

                {showManager && (
                    <CardContent className="space-y-4">
                        {/* Search Bar */}
                        <div className="flex items-center gap-3">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input
                                    placeholder="Cari mata pelajaran..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-9 pr-9"
                                />
                                {searchQuery && (
                                    <button
                                        onClick={() => setSearchQuery('')}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                            <Button onClick={openCreateDialog} className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700">
                                <Plus className="w-4 h-4 mr-2" />
                                Tambah Mata Pelajaran
                            </Button>
                        </div>

                        {/* Results count */}
                        <p className="text-sm text-muted-foreground">
                            Menampilkan {filteredSubjects.length} dari {subjects.length} mata pelajaran
                        </p>

                        {/* Subjects List */}
                        {loading ? (
                            <div className="space-y-3">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="h-24 bg-muted animate-pulse rounded-lg" />
                                ))}
                            </div>
                        ) : filteredSubjects.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed rounded-lg">
                                <BookOpen className="w-16 h-16 text-muted-foreground mb-4" />
                                <p className="text-lg font-medium text-muted-foreground">
                                    {searchQuery ? 'Tidak ada hasil pencarian' : 'Belum ada mata pelajaran'}
                                </p>
                                <p className="text-sm text-muted-foreground mt-1">
                                    {searchQuery ? 'Coba kata kunci lain' : 'Klik tombol di atas untuk menambah'}
                                </p>
                            </div>
                        ) : (
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                {filteredSubjects.map((subject) => (
                                    <Card key={subject.id} className="overflow-hidden">
                                        <div className="h-1 bg-gradient-to-r from-orange-500 to-red-600" />
                                        <CardContent className="pt-6">
                                            <div className="flex items-start justify-between mb-3">
                                                <div className="flex-1">
                                                    <h3 className="font-semibold text-foreground">
                                                        {subject.name}
                                                    </h3>
                                                    <p className="text-sm text-muted-foreground">
                                                        Kode: {subject.code}
                                                    </p>
                                                    <p className="text-sm text-muted-foreground">
                                                        SKS: {subject.credits}
                                                    </p>
                                                </div>
                                                <div className="flex gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => openEditDialog(subject)}
                                                        className="text-blue-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950"
                                                    >
                                                        <Edit2 className="w-4 h-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => handleDeleteClick(subject)}
                                                        disabled={deletingSubjectId === subject.id}
                                                        className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
                                                    >
                                                        {deletingSubjectId === subject.id ? (
                                                            <Loader2 className="w-4 h-4 animate-spin" />
                                                        ) : (
                                                            <Trash2 className="w-4 h-4" />
                                                        )}
                                                    </Button>
                                                </div>
                                            </div>
                                            {subject.description && (
                                                <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
                                                    {subject.description}
                                                </p>
                                            )}
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </CardContent>
                )}
            </Card>

            {/* Create/Edit Dialog */}
            <Dialog open={showDialog} onOpenChange={setShowDialog}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>
                            {editingSubject ? 'Edit Mata Pelajaran' : 'Tambah Mata Pelajaran Baru'}
                        </DialogTitle>
                        <DialogDescription>
                            {editingSubject
                                ? 'Ubah informasi mata pelajaran yang sudah ada'
                                : 'Isi form di bawah untuk membuat mata pelajaran baru'}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">
                                Nama Mata Pelajaran <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="name"
                                placeholder="cth: Matematika Lanjutan"
                                value={subjectForm.name}
                                onChange={(e) => {
                                    setSubjectForm({ ...subjectForm, name: e.target.value });
                                    setFormErrors({ ...formErrors, name: '' });
                                }}
                                disabled={savingSubject}
                                maxLength={100}
                                aria-label="Nama mata pelajaran"
                                aria-describedby="name-error"
                                className={formErrors.name ? 'border-red-500' : ''}
                            />
                            {formErrors.name && (
                                <p id="name-error" className="text-sm text-red-500">{formErrors.name}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="code">
                                Kode Mata Pelajaran <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="code"
                                placeholder="cth: MTK-L"
                                value={subjectForm.code}
                                onChange={(e) => {
                                    setSubjectForm({ ...subjectForm, code: e.target.value.toUpperCase() });
                                    setFormErrors({ ...formErrors, code: '' });
                                }}
                                disabled={savingSubject}
                                maxLength={20}
                                style={{ textTransform: 'uppercase' }}
                                aria-label="Kode mata pelajaran"
                                aria-describedby="code-error"
                                className={formErrors.code ? 'border-red-500' : ''}
                            />
                            {formErrors.code && (
                                <p id="code-error" className="text-sm text-red-500">{formErrors.code}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="credits">
                                SKS / Credits <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="credits"
                                type="number"
                                min={1}
                                max={8}
                                value={subjectForm.credits}
                                onChange={(e) => {
                                    setSubjectForm({ ...subjectForm, credits: parseInt(e.target.value) || 0 });
                                    setFormErrors({ ...formErrors, credits: '' });
                                }}
                                disabled={savingSubject}
                                aria-label="Jumlah SKS"
                                className={formErrors.credits ? 'border-red-500' : ''}
                            />
                            {formErrors.credits && (
                                <p className="text-sm text-red-500">{formErrors.credits}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Deskripsi (Opsional)</Label>
                            <Textarea
                                id="description"
                                placeholder="Deskripsi singkat mata pelajaran..."
                                value={subjectForm.description}
                                onChange={(e) => {
                                    setSubjectForm({ ...subjectForm, description: e.target.value });
                                    setFormErrors({ ...formErrors, description: '' });
                                }}
                                disabled={savingSubject}
                                maxLength={500}
                                rows={3}
                                aria-label="Deskripsi mata pelajaran"
                                className={formErrors.description ? 'border-red-500' : ''}
                            />
                            {formErrors.description && (
                                <p className="text-sm text-red-500">{formErrors.description}</p>
                            )}
                            <p className="text-xs text-muted-foreground">
                                {subjectForm.description.length}/500 karakter
                            </p>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setShowDialog(false)}
                            disabled={savingSubject}
                        >
                            Batal
                        </Button>
                        <Button
                            onClick={editingSubject ? handleEditSubmit : handleCreateSubmit}
                            disabled={savingSubject}
                            className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700"
                        >
                            {savingSubject ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Menyimpan...
                                </>
                            ) : (
                                editingSubject ? 'Update' : 'Simpan'
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={!!deleteConfirmation} onOpenChange={() => setDeleteConfirmation(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Hapus Mata Pelajaran?</AlertDialogTitle>
                        <AlertDialogDescription asChild>
                            <div className="space-y-3">
                                {deleteConfirmation?.canDelete ? (
                                    <>
                                        Apakah Anda yakin ingin menghapus <strong>{deleteConfirmation.subject.name}</strong>?
                                        <p className="text-sm text-muted-foreground mt-2">
                                            Tindakan ini tidak dapat dibatalkan.
                                        </p>
                                    </>
                                ) : (
                                    <>
                                        <Alert variant="warning">
                                            <AlertCircle className="h-4 w-4" />
                                            <AlertTitle>Tidak dapat dihapus</AlertTitle>
                                            <AlertDescription>
                                                <strong>{deleteConfirmation?.subject.name}</strong> masih digunakan oleh:
                                            </AlertDescription>
                                        </Alert>
                                        <ul className="space-y-1 text-sm">
                                            {deleteConfirmation?.details && deleteConfirmation.details.classCount > 0 && (
                                                <li>• {deleteConfirmation.details.classCount} kelas</li>
                                            )}
                                            {deleteConfirmation?.details && deleteConfirmation.details.moduleCount > 0 && (
                                                <li>• {deleteConfirmation.details.moduleCount} modul pembelajaran</li>
                                            )}
                                            {deleteConfirmation?.details && deleteConfirmation.details.gradeCount > 0 && (
                                                <li>• {deleteConfirmation.details.gradeCount} nilai siswa</li>
                                            )}
                                            {deleteConfirmation?.details && deleteConfirmation.details.scheduleCount > 0 && (
                                                <li>• {deleteConfirmation.details.scheduleCount} jadwal pelajaran</li>
                                            )}
                                        </ul>
                                        <p className="text-sm text-muted-foreground mt-3">
                                            Hapus semua data terkait terlebih dahulu, atau hubungi admin untuk mengarsip mata pelajaran ini.
                                        </p>
                                    </>
                                )}
                            </div>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>
                            {deleteConfirmation?.canDelete ? 'Batal' : 'Tutup'}
                        </AlertDialogCancel>
                        {deleteConfirmation?.canDelete && (
                            <AlertDialogAction
                                onClick={confirmDeleteSubject}
                                className="bg-red-500 hover:bg-red-600"
                                disabled={!!deletingSubjectId}
                            >
                                {deletingSubjectId ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Menghapus...
                                    </>
                                ) : (
                                    'Hapus'
                                )}
                            </AlertDialogAction>
                        )}
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
