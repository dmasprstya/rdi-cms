'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
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
import { Plus, Pencil, Trash2, BookOpen, Eye, EyeOff, Upload, X, FileText, Download } from 'lucide-react';
import { toast } from 'react-toastify';
import { DataTable } from '@/components/ui/data-table';
import { validatePDFFile, formatFileSize, getErrorMessage } from '@/lib/client-file-utils';

interface Module {
    id: string;
    title: string;
    description: string | null;
    content: string | null;
    fileUrl: string | null;
    fileName: string | null;
    fileSize: number | null;
    subjectId: string;
    classId: string | null;
    isPublished: boolean;
    createdAt: string;
    updatedAt: string;
    subjectName: string | null;
    subjectCode: string | null;
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

interface ModuleFormData {
    title: string;
    description: string;
    content: string;
    fileUrl: string;
    fileName: string;
    fileSize: number;
    subjectId: string;
    classId: string;
    isPublished: boolean;
}

interface ModulesManagementProps {
    rolePrefix?: 'guru' | 'staff';
}

export default function ModulesManagement({ rolePrefix = 'guru' }: ModulesManagementProps = {}) {
    const [modules, setModules] = useState<Module[]>([]);
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [classes, setClasses] = useState<Class[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedModule, setSelectedModule] = useState<Module | null>(null);
    const [formData, setFormData] = useState<ModuleFormData>({
        title: '',
        description: '',
        content: '',
        fileUrl: '',
        fileName: '',
        fileSize: 0,
        subjectId: '',
        classId: 'all',
        isPublished: true,
    });

    // File upload states
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);

    const fetchModules = useCallback(async () => {
        try {
            const response = await fetch(`/api/${rolePrefix}/modules`);
            if (!response.ok) throw new Error('Failed to fetch modules');
            const data = await response.json();
            setModules(data);
        } catch (error) {
            toast.error('Gagal memuat data modul');
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, [rolePrefix]);

    const fetchSubjects = useCallback(async () => {
        try {
            const response = await fetch(`/api/${rolePrefix}/subjects`);
            if (response.ok) {
                const data = await response.json();
                setSubjects(data);
            }
        } catch (error) {
            console.error('Error fetching subjects:', error);
        }
    }, [rolePrefix]);

    const fetchClasses = useCallback(async () => {
        try {
            const response = await fetch(`/api/${rolePrefix}/classes`);
            if (response.ok) {
                const data = await response.json();
                setClasses(data);
            }
        } catch (error) {
            console.error('Error fetching classes:', error);
        }
    }, [rolePrefix]);

    useEffect(() => {
        fetchModules();
        fetchSubjects();
        fetchClasses();
    }, [fetchModules, fetchSubjects, fetchClasses]);

    // File upload handlers
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file
        const validation = validatePDFFile(file);
        if (!validation.valid) {
            toast.error(getErrorMessage(validation.error!));
            e.target.value = ''; // Reset input
            return;
        }

        setSelectedFile(file);
        toast.success(`File "${file.name}" siap diupload`);
    };

    const handleFileUpload = async (): Promise<{ fileUrl: string; fileName: string; fileSize: number } | null> => {
        if (!selectedFile) return null;

        try {
            setIsUploading(true);
            setUploadProgress(0);

            const formData = new FormData();
            formData.append('file', selectedFile);

            // Simulate progress (actual progress tracking would need XMLHttpRequest)
            const progressInterval = setInterval(() => {
                setUploadProgress((prev) => Math.min(prev + 10, 90));
            }, 100);

            const response = await fetch(`/api/${rolePrefix}/upload`, {
                method: 'POST',
                body: formData,
            });

            clearInterval(progressInterval);
            setUploadProgress(100);

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.code || 'UPLOAD_FAILED');
            }

            const data = await response.json();
            toast.success('File berhasil diupload');

            return {
                fileUrl: data.fileUrl,
                fileName: data.fileName,
                fileSize: data.fileSize,
            };
        } catch (error: any) {
            const errorCode = error.message;
            toast.error(getErrorMessage(errorCode));
            return null;
        } finally {
            setIsUploading(false);
            setUploadProgress(0);
        }
    };

    const handleRemoveFile = useCallback(() => {
        setSelectedFile(null);
        setFormData((prev) => ({ ...prev, fileUrl: '', fileName: '', fileSize: 0 }));
        toast.info('File dihapus');
    }, []);

    const handleAdd = async () => {
        try {
            if (!formData.title || !formData.subjectId) {
                toast.error('Judul dan mata pelajaran harus diisi');
                return;
            }

            let fileMetadata = {
                fileUrl: formData.fileUrl,
                fileName: formData.fileName,
                fileSize: formData.fileSize,
            };

            // Upload file if selected
            if (selectedFile) {
                const uploadResult = await handleFileUpload();
                if (!uploadResult) {
                    // Upload failed, don't proceed
                    return;
                }
                fileMetadata = uploadResult;
            }

            const response = await fetch(`/api/${rolePrefix}/modules`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    ...fileMetadata,
                    classId: formData.classId === 'all' ? null : formData.classId,
                }),
            });

            if (!response.ok) throw new Error('Failed to create module');

            toast.success('Modul berhasil ditambahkan');
            setIsAddOpen(false);
            resetForm();
            fetchModules();
        } catch (error) {
            toast.error('Gagal menambahkan modul');
            console.error(error);
        }
    };

    const handleEdit = async () => {
        if (!selectedModule) return;

        try {
            if (!formData.title || !formData.subjectId) {
                toast.error('Judul dan mata pelajaran harus diisi');
                return;
            }

            let fileMetadata = {
                fileUrl: formData.fileUrl,
                fileName: formData.fileName,
                fileSize: formData.fileSize,
            };

            // Upload new file if selected
            if (selectedFile) {
                const uploadResult = await handleFileUpload();
                if (!uploadResult) {
                    // Upload failed, don't proceed
                    return;
                }
                fileMetadata = uploadResult;
            }

            const response = await fetch(`/api/${rolePrefix}/modules/${selectedModule.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    ...fileMetadata,
                    classId: formData.classId === 'all' ? null : formData.classId,
                }),
            });

            if (!response.ok) throw new Error('Failed to update module');

            toast.success('Modul berhasil diupdate');
            setIsEditOpen(false);
            setSelectedModule(null);
            resetForm();
            fetchModules();
        } catch (error) {
            toast.error('Gagal mengupdate modul');
            console.error(error);
        }
    };

    const handleDelete = async () => {
        if (!selectedModule) return;

        try {
            const response = await fetch(`/api/${rolePrefix}/modules/${selectedModule.id}`, {
                method: 'DELETE',
            });

            if (!response.ok) throw new Error('Failed to delete module');

            toast.success('Modul berhasil dihapus');
            setIsDeleteOpen(false);
            setSelectedModule(null);
            fetchModules();
        } catch (error) {
            toast.error('Gagal menghapus modul');
            console.error(error);
        }
    };

    const openEditDialog = (module: Module) => {
        setSelectedModule(module);
        setFormData({
            title: module.title,
            description: module.description || '',
            content: module.content || '',
            fileUrl: module.fileUrl || '',
            fileName: module.fileName || '',
            fileSize: module.fileSize || 0,
            subjectId: module.subjectId,
            classId: module.classId || 'all',
            isPublished: module.isPublished,
        });
        setSelectedFile(null); // Reset file selection
        setIsEditOpen(true);
    };

    const openDeleteDialog = (module: Module) => {
        setSelectedModule(module);
        setIsDeleteOpen(true);
    };

    const resetForm = () => {
        setFormData({
            title: '',
            description: '',
            content: '',
            fileUrl: '',
            fileName: '',
            fileSize: 0,
            subjectId: '',
            classId: 'all',
            isPublished: true,
        });
        setSelectedFile(null);
        setUploadProgress(0);
    };

    const columns = [
        {
            header: 'Judul Modul',
            accessor: (row: Module) => (
                <div>
                    <div className="font-medium text-foreground">{row.title}</div>
                    {row.description && (
                        <div className="text-xs text-muted-foreground mt-1 line-clamp-1">
                            {row.description}
                        </div>
                    )}
                </div>
            ),
        },
        {
            header: 'Mata Pelajaran',
            accessor: (row: Module) => (
                <div className="text-muted-foreground">
                    {row.subjectName || '-'}
                    {row.subjectCode && (
                        <span className="text-xs ml-1">({row.subjectCode})</span>
                    )}
                </div>
            ),
        },
        {
            header: 'Kelas',
            accessor: (row: Module) => (
                <div className="text-muted-foreground">
                    {row.className || 'Semua Kelas'}
                </div>
            ),
        },
        {
            header: 'Status',
            accessor: (row: Module) => (
                <div className="flex items-center gap-2">
                    {row.isPublished ? (
                        <>
                            <Eye className="w-4 h-4 text-green-500" />
                            <span className="text-sm text-green-600 dark:text-green-400">Dipublikasi</span>
                        </>
                    ) : (
                        <>
                            <EyeOff className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-500">Draft</span>
                        </>
                    )}
                </div>
            ),
        },
        {
            header: 'Aksi',
            accessor: (row: Module) => (
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

    // Memoize form fields to prevent re-render issues
    const moduleFormFields = useMemo(() => (
        <div className="space-y-4 py-4">
            <div className="space-y-2">
                <Label htmlFor="title">Judul Modul <span className="text-red-500">*</span></Label>
                <Input
                    id="title"
                    placeholder="Contoh: Pengenalan Matematika Dasar"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
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
            <div className="space-y-2">
                <Label htmlFor="classId">Kelas (Opsional)</Label>
                <Select value={formData.classId} onValueChange={(value) => setFormData({ ...formData, classId: value })}>
                    <SelectTrigger>
                        <SelectValue placeholder="Semua kelas atau pilih spesifik" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Semua Kelas</SelectItem>
                        {classes.map((cls) => (
                            <SelectItem key={cls.id} value={cls.id}>
                                {cls.name} - Kelas {cls.grade}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <div className="space-y-2">
                <Label htmlFor="description">Deskripsi</Label>
                <Textarea
                    id="description"
                    placeholder="Deskripsi singkat modul"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="content">Konten</Label>
                <Textarea
                    id="content"
                    placeholder="Konten atau instruksi modul"
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    rows={5}
                />
            </div>

            {/* PDF File Upload Section */}
            <div className="space-y-2">
                <Label>File PDF (Opsional)</Label>

                {/* Show existing file if present */}
                {formData.fileUrl && !selectedFile && (
                    <div className="flex items-center gap-2 p-3 border rounded-lg bg-muted/50">
                        <FileText className="w-5 h-5 text-blue-500" />
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{formData.fileName}</p>
                            <p className="text-xs text-muted-foreground">
                                {formatFileSize(formData.fileSize)}
                            </p>
                        </div>
                        <a
                            href={formData.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:text-blue-600"
                        >
                            <Download className="w-4 h-4" />
                        </a>
                        <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            onClick={handleRemoveFile}
                            disabled={isUploading}
                        >
                            <X className="w-4 h-4" />
                        </Button>
                    </div>
                )}

                {/* Show selected file if present */}
                {selectedFile && (
                    <div className="flex items-center gap-2 p-3 border rounded-lg bg-blue-50 dark:bg-blue-950/20">
                        <FileText className="w-5 h-5 text-blue-500" />
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{selectedFile.name}</p>
                            <p className="text-xs text-muted-foreground">
                                {formatFileSize(selectedFile.size)}
                            </p>
                        </div>
                        <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            onClick={() => setSelectedFile(null)}
                            disabled={isUploading}
                        >
                            <X className="w-4 h-4" />
                        </Button>
                    </div>
                )}

                {/* Upload progress */}
                {isUploading && (
                    <div className="space-y-2">
                        <div className="flex justify-between text-xs text-muted-foreground">
                            <span>Mengupload...</span>
                            <span>{uploadProgress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${uploadProgress}%` }}
                            />
                        </div>
                    </div>
                )}

                {/* File input */}
                {!formData.fileUrl && !selectedFile && (
                    <div>
                        <label
                            htmlFor="pdf-upload"
                            className="flex items-center justify-center gap-2 p-4 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                        >
                            <Upload className="w-5 h-5 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">
                                Klik untuk upload PDF (maks 10MB)
                            </span>
                        </label>
                        <input
                            id="pdf-upload"
                            type="file"
                            accept=".pdf,application/pdf"
                            onChange={handleFileChange}
                            disabled={isUploading}
                            className="hidden"
                        />
                    </div>
                )}
            </div>

            <div className="flex items-center space-x-2">
                <input
                    type="checkbox"
                    id="isPublished"
                    checked={formData.isPublished}
                    onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                    className="w-4 h-4"
                />
                <Label htmlFor="isPublished" className="cursor-pointer">Publikasikan modul</Label>
            </div>
        </div>
    ), [formData, subjects, classes, selectedFile, isUploading, uploadProgress, handleRemoveFile]);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-foreground">Kelola Modul</h2>
                    <p className="text-muted-foreground">Manajemen modul pembelajaran Anda</p>
                </div>
                <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                    <DialogTrigger asChild>
                        <Button
                            className="gap-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                            onClick={resetForm}
                        >
                            <Plus className="w-4 h-4" />
                            Tambah Modul
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>Tambah Modul Baru</DialogTitle>
                            <DialogDescription>
                                Buat modul pembelajaran baru dengan mengunggah file PDF atau menambahkan konten langsung.
                            </DialogDescription>
                        </DialogHeader>
                        {moduleFormFields}
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsAddOpen(false)}>
                                Batal
                            </Button>
                            <Button onClick={handleAdd} className="bg-gradient-to-r from-green-500 to-green-600">
                                Simpan
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <DataTable
                columns={columns}
                data={modules}
                loading={loading}
                emptyMessage="Belum ada modul. Klik 'Tambah Modul' untuk membuat modul baru."
            />

            {/* Edit Dialog */}
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Edit Modul</DialogTitle>
                        <DialogDescription>
                            Perbarui informasi modul atau ganti file PDF yang sudah ada.
                        </DialogDescription>
                    </DialogHeader>
                    {moduleFormFields}
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsEditOpen(false)}>
                            Batal
                        </Button>
                        <Button onClick={handleEdit} className="bg-gradient-to-r from-green-500 to-green-600">
                            Update
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Dialog */}
            <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Hapus Modul</AlertDialogTitle>
                        <AlertDialogDescription>
                            Apakah Anda yakin ingin menghapus modul{' '}
                            <span className="font-semibold">{selectedModule?.title}</span>?
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
