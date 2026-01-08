'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Mail, Phone, MapPin, Calendar, Loader2 } from 'lucide-react';

interface StudentProfile {
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
    classGrade: number | null;
}

export default function StudentProfilePage() {
    const [student, setStudent] = useState<StudentProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchProfile() {
            try {
                setIsLoading(true);
                const response = await fetch('/api/student/profile');

                if (!response.ok) {
                    throw new Error('Gagal memuat profil');
                }

                const data = await response.json();
                setStudent(data);
            } catch (err) {
                console.error('Error fetching profile:', err);
                setError(err instanceof Error ? err.message : 'Gagal memuat profil');
            } finally {
                setIsLoading(false);
            }
        }

        fetchProfile();
    }, []);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-yellow-400" />
                <span className="ml-3 text-muted-foreground">Memuat profil...</span>
            </div>
        );
    }

    if (error || !student) {
        return (
            <div className="space-y-6">
                <div>
                    <h2 className="text-3xl font-bold text-foreground">Profil Saya</h2>
                    <p className="text-muted-foreground mt-1">Informasi data pribadi Anda</p>
                </div>
                <Card className="bg-card border-border">
                    <CardContent className="py-12 text-center">
                        <p className="text-red-600">
                            {error || 'Data profil tidak ditemukan. Silakan hubungi administrator.'}
                        </p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    // Format class display
    const classDisplay = student.className
        ? `${student.className}`
        : 'Belum ada kelas';

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold text-foreground">Profil Saya</h2>
                <p className="text-muted-foreground mt-1">Informasi data pribadi Anda</p>
            </div>

            <Card className="bg-card border-border">
                <CardHeader>
                    <CardTitle className="text-card-foreground">Data Pribadi</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex items-center gap-6">
                        <div className="w-24 h-24 bg-yellow-400/10 rounded-full flex items-center justify-center border-4 border-yellow-400/20 relative overflow-hidden">
                            {student.photoUrl ? (
                                <Image
                                    src={student.photoUrl}
                                    alt={student.userName}
                                    fill
                                    className="object-cover"
                                    sizes="96px"
                                    priority
                                />
                            ) : (
                                <User className="w-12 h-12 text-yellow-400" />
                            )}
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-2xl font-bold text-foreground">{student.userName}</h3>
                            <p className="text-muted-foreground">NIS: {student.nis}</p>
                            <p className="text-yellow-600 font-medium">Kelas {classDisplay}</p>
                        </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        <InfoItem
                            icon={<Mail className="w-5 h-5" />}
                            label="Email"
                            value={student.userEmail}
                        />
                        <InfoItem
                            icon={<Phone className="w-5 h-5" />}
                            label="No. Telepon"
                            value={student.phone || 'Belum diisi'}
                        />
                        <InfoItem
                            icon={<Calendar className="w-5 h-5" />}
                            label="Tanggal Lahir"
                            value={student.dateOfBirth
                                ? new Date(student.dateOfBirth).toLocaleDateString('id-ID', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })
                                : 'Belum diisi'
                            }
                        />
                        <InfoItem
                            icon={<MapPin className="w-5 h-5" />}
                            label="Alamat"
                            value={student.address || 'Belum diisi'}
                            className="md:col-span-2"
                        />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

function InfoItem({ icon, label, value, className = '' }: { icon: React.ReactNode; label: string; value: string; className?: string }) {
    return (
        <div className={`flex items-start gap-3 p-4 bg-secondary rounded-lg border border-border ${className}`}>
            <div className="w-10 h-10 bg-yellow-400/10 rounded-lg flex items-center justify-center text-yellow-400">
                {icon}
            </div>
            <div className="flex-1">
                <p className="text-sm text-muted-foreground">{label}</p>
                <p className="text-foreground font-medium mt-1">{value}</p>
            </div>
        </div>
    );
}
