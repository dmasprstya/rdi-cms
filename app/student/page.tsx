'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, BookOpen, Calendar, Bell, Loader2, Book } from 'lucide-react';
import Link from 'next/link';

interface StudentProfile {
    id: string;
    nis: string;
    userName: string;
    userEmail: string;
    className: string | null;
    classGrade: number | null;
}

interface Announcement {
    id: string;
    title: string;
    content: string;
    createdAt: string;
    authorName: string;
}

export default function StudentPortalPage() {
    const [student, setStudent] = useState<StudentProfile | null>(null);
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchData() {
            try {
                setIsLoading(true);

                // Fetch profile
                const profileResponse = await fetch('/api/student/profile');
                if (!profileResponse.ok) {
                    throw new Error('Gagal memuat profil');
                }
                const profileData = await profileResponse.json();
                setStudent(profileData);

                // Fetch announcements
                const announcementsResponse = await fetch('/api/announcements');
                if (announcementsResponse.ok) {
                    const announcementsData = await announcementsResponse.json();
                    // Filter only active announcements and sort by newest first
                    const activeAnnouncements = announcementsData
                        .filter((a: any) => a.isActive)
                        .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                        .slice(0, 3); // Show only latest 3
                    setAnnouncements(activeAnnouncements);
                }
            } catch (err) {
                console.error('Error fetching data:', err);
                setError(err instanceof Error ? err.message : 'Gagal memuat data');
            } finally {
                setIsLoading(false);
            }
        }

        fetchData();
    }, []);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-yellow-400" />
                <span className="ml-3 text-muted-foreground">Memuat data...</span>
            </div>
        );
    }

    if (error || !student) {
        return (
            <div className="space-y-6">
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

    // Format date
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - date.getTime());
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return 'Hari ini';
        if (diffDays === 1) return 'Kemarin';
        if (diffDays < 7) return `${diffDays} hari yang lalu`;

        return date.toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <div className="space-y-8">
            {/* Welcome Section */}
            <div className="text-center space-y-4 animate-fade-in-up">
                <div className="mx-auto w-24 h-24 bg-yellow-400/10 rounded-full flex items-center justify-center border-4 border-yellow-400/20 glow-primary">
                    <User className="w-12 h-12 text-yellow-400" />
                </div>
                <div>
                    <h2 className="text-3xl font-bold text-foreground">Selamat Datang, {student.userName}!</h2>
                    <p className="text-muted-foreground mt-2">NIS: {student.nis} | Kelas: {classDisplay}</p>
                </div>
            </div>

            {/* Quick Menu */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <MenuCard
                    href="/student/profile"
                    icon={<User className="w-8 h-8" />}
                    title="Profil Saya"
                    description="Lihat data pribadi Anda"
                    gradient="from-blue-500 to-blue-600"
                />
                <MenuCard
                    href="/student/grades"
                    icon={<BookOpen className="w-8 h-8" />}
                    title="Nilai Akademik"
                    description="Lihat nilai per mata pelajaran"
                    gradient="from-green-500 to-green-600"
                />
                <MenuCard
                    href="/student/modules"
                    icon={<Book className="w-8 h-8" />}
                    title="Modul Belajar"
                    description="Akses materi pembelajaran Anda"
                    gradient="from-purple-500 to-purple-600"
                />
            </div>

            {/* Announcements */}
            <Card className="bg-card border-border">
                <CardHeader>
                    <CardTitle className="text-card-foreground flex items-center gap-2">
                        <Bell className="w-5 h-5 text-yellow-400" />
                        Pengumuman Terbaru
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {announcements.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                            Belum ada pengumuman
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {announcements.map((announcement) => (
                                <div key={announcement.id} className="p-4 bg-secondary rounded-lg border border-border">
                                    <h4 className="font-semibold text-card-foreground mb-1">{announcement.title}</h4>
                                    <p className="text-sm text-muted-foreground line-clamp-2">{announcement.content}</p>
                                    <div className="flex items-center justify-between mt-2">
                                        <p className="text-xs text-muted-foreground">
                                            {formatDate(announcement.createdAt)}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            Oleh: {announcement.authorName}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

function MenuCard({
    href,
    icon,
    title,
    description,
    gradient
}: {
    href: string;
    icon: React.ReactNode;
    title: string;
    description: string;
    gradient: string;
}) {
    return (
        <Link href={href}>
            <Card className="bg-card border-border card-hover group cursor-pointer h-full">
                <CardContent className="pt-6">
                    <div className="space-y-4">
                        <div className={`w-16 h-16 rounded-lg bg-gradient-to-r ${gradient} text-white flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                            {icon}
                        </div>
                        <div>
                            <h3 className="text-xl font-semibold text-card-foreground group-hover:text-yellow-600 transition-colors">
                                {title}
                            </h3>
                            <p className="text-muted-foreground mt-1 text-sm">{description}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </Link>
    );
}
