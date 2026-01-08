'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Download, Calendar, User, Search, BookOpen, Eye, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';


interface Module {
    id: string;
    title: string;
    description: string | null;
    content: string | null;
    fileUrl: string | null;
    createdAt: string;
    subjectName: string | null;
    subjectCode: string | null;
    teacherName: string | null;
}

export default function StudentModulesPage() {
    const [modules, setModules] = useState<Module[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedModule, setSelectedModule] = useState<Module | null>(null);
    const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

    useEffect(() => {
        async function fetchModules() {
            try {
                setIsLoading(true);
                const response = await fetch('/api/student/modules');

                if (!response.ok) {
                    throw new Error('Gagal memuat modul');
                }

                const data = await response.json();
                setModules(data);
            } catch (err) {
                console.error('Error fetching modules:', err);
                setError(err instanceof Error ? err.message : 'Gagal memuat modul');
            } finally {
                setIsLoading(false);
            }
        }

        fetchModules();
    }, []);

    const filteredModules = modules.filter(module =>
        module.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (module.subjectName && module.subjectName.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const handleViewModule = (module: Module) => {
        setSelectedModule(module);
        setIsViewDialogOpen(true);
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                <p className="text-muted-foreground">Memuat modul pembelajaran...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-4 text-center">
                <div className="bg-destructive/10 text-destructive p-4 rounded-lg inline-block">
                    <p>{error}</p>
                    <Button
                        variant="outline"
                        className="mt-4 border-destructive/20 hover:bg-destructive/20"
                        onClick={() => window.location.reload()}
                    >
                        Coba Lagi
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Modul Belajar</h1>
                    <p className="text-muted-foreground mt-1">
                        Akses materi pembelajaran dan tugas dari guru Anda.
                    </p>
                </div>
                <div className="relative w-full md:w-64">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Cari modul..."
                        className="pl-9"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {filteredModules.length === 0 ? (
                <Card className="border-dashed">
                    <CardContent className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
                        <BookOpen className="h-12 w-12 mb-4 opacity-20" />
                        <p className="text-lg font-medium">Belum ada modul tersedia</p>
                        <p className="text-sm">
                            {searchTerm ? 'Tidak ada modul yang cocok dengan pencarian Anda.' : 'Silakan periksa kembali nanti.'}
                        </p>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {filteredModules.map((module) => (
                        <Card key={module.id} className="flex flex-col hover:shadow-md transition-shadow">
                            <CardHeader>
                                <div className="flex justify-between items-start gap-4">
                                    <span className="mb-2 inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80">
                                        {module.subjectName || 'Umum'}
                                    </span>
                                    <span className="text-xs text-muted-foreground whitespace-nowrap flex items-center gap-1">
                                        <Calendar className="h-3 w-3" />
                                        {new Date(module.createdAt).toLocaleDateString('id-ID')}
                                    </span>
                                </div>
                                <CardTitle className="line-clamp-2 text-lg leading-tight">
                                    {module.title}
                                </CardTitle>
                                <CardDescription className="line-clamp-2 mt-2">
                                    {module.description || 'Tidak ada deskripsi'}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="mt-auto pt-0 space-y-3">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <User className="h-4 w-4" />
                                    <span>{module.teacherName || 'Guru'}</span>
                                </div>

                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        className="flex-1"
                                        onClick={() => handleViewModule(module)}
                                    >
                                        <Eye className="mr-2 h-4 w-4" />
                                        Lihat
                                    </Button>
                                    {module.fileUrl ? (
                                        <Button className="flex-1" asChild>
                                            <a href={module.fileUrl} target="_blank" rel="noopener noreferrer">
                                                <Download className="mr-2 h-4 w-4" />
                                                Unduh
                                            </a>
                                        </Button>
                                    ) : (
                                        <Button variant="secondary" className="flex-1" disabled>
                                            <FileText className="mr-2 h-4 w-4" />
                                            Tidak Ada File
                                        </Button>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {/* View Module Dialog */}
            <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
                <DialogContent className="max-w-3xl max-h-[85vh] overflow-hidden flex flex-col">
                    <DialogHeader>
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                                <div className="mb-2">
                                    <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold border-transparent bg-secondary text-secondary-foreground">
                                        {selectedModule?.subjectName || 'Umum'}
                                    </span>
                                </div>
                                <DialogTitle className="text-2xl">{selectedModule?.title}</DialogTitle>
                                <DialogDescription className="mt-2">
                                    {selectedModule?.description || 'Tidak ada deskripsi'}
                                </DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>

                    <div className="flex-1 overflow-y-auto px-1">
                        <div className="space-y-4">
                            {/* Module Info */}
                            <div className="grid grid-cols-2 gap-4 p-4 bg-secondary/30 rounded-lg">
                                <div>
                                    <p className="text-sm text-muted-foreground">Guru Pengampu</p>
                                    <p className="font-medium flex items-center gap-2 mt-1">
                                        <User className="h-4 w-4" />
                                        {selectedModule?.teacherName || 'Tidak diketahui'}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Tanggal Dibuat</p>
                                    <p className="font-medium flex items-center gap-2 mt-1">
                                        <Calendar className="h-4 w-4" />
                                        {selectedModule ? new Date(selectedModule.createdAt).toLocaleDateString('id-ID', {
                                            day: 'numeric',
                                            month: 'long',
                                            year: 'numeric'
                                        }) : '-'}
                                    </p>
                                </div>
                            </div>

                            {/* Module Content */}
                            {selectedModule?.content ? (
                                <div>
                                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                                        <BookOpen className="h-5 w-5" />
                                        Konten Modul
                                    </h3>
                                    <div className="prose prose-sm max-w-none p-4 bg-secondary/20 rounded-lg border">
                                        <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-foreground">
                                            {selectedModule.content}
                                        </pre>
                                    </div>
                                </div>
                            ) : (
                                <div className="p-8 text-center text-muted-foreground bg-secondary/20 rounded-lg border-dashed border-2">
                                    <FileText className="h-12 w-12 mx-auto mb-3 opacity-30" />
                                    <p>Tidak ada konten tambahan untuk modul ini.</p>
                                    <p className="text-sm mt-1">Silakan unduh file materi jika tersedia.</p>
                                </div>
                            )}

                            {/* Download Section */}
                            {selectedModule?.fileUrl && (
                                <div className="pt-2">
                                    <Button className="w-full" size="lg" asChild>
                                        <a href={selectedModule.fileUrl} target="_blank" rel="noopener noreferrer">
                                            <Download className="mr-2 h-5 w-5" />
                                            Unduh File Materi
                                        </a>
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
