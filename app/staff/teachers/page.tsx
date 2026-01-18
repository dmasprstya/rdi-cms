'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GraduationCap, Search, Mail, BookOpen, Users, Download } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { generateTeachersPDF } from '@/lib/pdf-utils';

interface Teacher {
    id: string;
    nip: string;
    subject: string | null;
    phone: string | null;
    dateOfBirth: string | null;
    userName: string;
    userEmail: string;
    classIds: string[];
}

export default function StaffTeachersPage() {
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [downloading, setDownloading] = useState(false);

    useEffect(() => {
        fetchTeachers();
    }, []);

    const fetchTeachers = async () => {
        try {
            const response = await fetch('/api/teachers');
            if (response.ok) {
                const data = await response.json();
                setTeachers(data);
            }
        } catch (error) {
            console.error('Error fetching teachers:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredTeachers = teachers.filter(teacher =>
        teacher.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        teacher.nip.toLowerCase().includes(searchTerm.toLowerCase()) ||
        teacher.subject?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleDownloadPDF = async () => {
        try {
            setDownloading(true);
            // Small delay to show loading state
            await new Promise(resolve => setTimeout(resolve, 300));
            generateTeachersPDF(filteredTeachers);
        } catch (error) {
            console.error('Error generating PDF:', error);
        } finally {
            setDownloading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-foreground">Data Guru</h2>
                    <p className="text-muted-foreground mt-1">
                        Lihat data semua guru (read-only)
                    </p>
                </div>
                <Button
                    onClick={handleDownloadPDF}
                    disabled={downloading || filteredTeachers.length === 0}
                    className="flex items-center gap-2"
                >
                    <Download className="w-4 h-4" />
                    {downloading ? 'Generating...' : 'Download PDF'}
                </Button>
            </div>

            {/* Search */}
            <Card>
                <CardContent className="pt-6">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input
                            placeholder="Cari berdasarkan nama, NIP, atau mata pelajaran..."
                            className="pl-10"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Teachers List */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <GraduationCap className="w-5 h-5 text-purple-500" />
                        Daftar Guru ({filteredTeachers.length})
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="text-center py-8 text-muted-foreground">
                            Memuat data guru...
                        </div>
                    ) : filteredTeachers.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                            {searchTerm ? 'Tidak ada guru yang cocok dengan pencarian' : 'Belum ada data guru'}
                        </div>
                    ) : (
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {filteredTeachers.map((teacher) => (
                                <Card key={teacher.id} className="card-hover">
                                    <CardContent className="pt-6">
                                        <div className="space-y-3">
                                            <div>
                                                <h3 className="font-semibold text-foreground">{teacher.userName}</h3>
                                                <div className="flex gap-2 mt-2">
                                                    {teacher.subject && (
                                                        <Badge variant="secondary">
                                                            {teacher.subject}
                                                        </Badge>
                                                    )}
                                                    <Badge variant="outline">
                                                        {teacher.classIds?.length || 0} Kelas
                                                    </Badge>
                                                </div>
                                            </div>

                                            <div className="space-y-2 text-sm text-muted-foreground">
                                                <div className="flex items-center gap-2">
                                                    <GraduationCap className="w-4 h-4" />
                                                    <span>NIP: {teacher.nip}</span>
                                                </div>

                                                <div className="flex items-center gap-2">
                                                    <Mail className="w-4 h-4" />
                                                    <span className="truncate">{teacher.userEmail}</span>
                                                </div>

                                                <div className="flex items-center gap-2">
                                                    <Users className="w-4 h-4" />
                                                    <span>Mengajar {teacher.classIds?.length || 0} kelas</span>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
