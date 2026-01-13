'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Search, Mail, Phone, Calendar } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

interface Student {
    id: string;
    nis: string;
    phone: string | null;
    address: string | null;
    dateOfBirth: string | null;
    userName: string;
    userEmail: string;
    className: string | null;
}

export default function StaffStudentsPage() {
    const [students, setStudents] = useState<Student[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        try {
            const response = await fetch('/api/students');
            if (response.ok) {
                const data = await response.json();
                setStudents(data);
            }
        } catch (error) {
            console.error('Error fetching students:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredStudents = students.filter(student =>
        student.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.nis.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.className?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold text-foreground">Data Siswa</h2>
                <p className="text-muted-foreground mt-1">
                    Lihat data semua siswa (read-only)
                </p>
            </div>

            {/* Search */}
            <Card>
                <CardContent className="pt-6">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input
                            placeholder="Cari berdasarkan nama, NIS, atau kelas..."
                            className="pl-10"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Students List */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Users className="w-5 h-5 text-blue-500" />
                        Daftar Siswa ({filteredStudents.length})
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="text-center py-8 text-muted-foreground">
                            Memuat data siswa...
                        </div>
                    ) : filteredStudents.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                            {searchTerm ? 'Tidak ada siswa yang cocok dengan pencarian' : 'Belum ada data siswa'}
                        </div>
                    ) : (
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {filteredStudents.map((student) => (
                                <Card key={student.id} className="card-hover">
                                    <CardContent className="pt-6">
                                        <div className="space-y-3">
                                            <div>
                                                <h3 className="font-semibold text-foreground">{student.userName}</h3>
                                                <Badge variant="outline" className="mt-1">
                                                    {student.className || 'Belum ada kelas'}
                                                </Badge>
                                            </div>

                                            <div className="space-y-2 text-sm text-muted-foreground">
                                                <div className="flex items-center gap-2">
                                                    <Users className="w-4 h-4" />
                                                    <span>NIS: {student.nis}</span>
                                                </div>

                                                <div className="flex items-center gap-2">
                                                    <Mail className="w-4 h-4" />
                                                    <span className="truncate">{student.userEmail}</span>
                                                </div>

                                                {student.phone && (
                                                    <div className="flex items-center gap-2">
                                                        <Phone className="w-4 h-4" />
                                                        <span>{student.phone}</span>
                                                    </div>
                                                )}

                                                {student.dateOfBirth && (
                                                    <div className="flex items-center gap-2">
                                                        <Calendar className="w-4 h-4" />
                                                        <span>{new Date(student.dateOfBirth).toLocaleDateString('id-ID')}</span>
                                                    </div>
                                                )}
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
