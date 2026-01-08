'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Users, Bell, GraduationCap, Plus, FileText, ClipboardList } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface Stats {
    totalModules: number;
    totalStudents: number;
    totalAnnouncements: number;
    totalClasses: number;
}

export default function GuruDashboardPage() {
    const [stats, setStats] = useState<Stats>({
        totalModules: 0,
        totalStudents: 0,
        totalAnnouncements: 0,
        totalClasses: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const response = await fetch('/api/guru/stats');
            if (response.ok) {
                const data = await response.json();
                setStats(data);
            }
        } catch (error) {
            console.error('Error fetching stats:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold text-foreground">Dashboard Guru</h2>
                <p className="text-muted-foreground mt-1">
                    Selamat datang! Kelola pembelajaran Anda di sini
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    title="Total Modul"
                    value={stats.totalModules}
                    icon={<BookOpen className="w-6 h-6" />}
                    gradient="from-green-500 to-green-600"
                    loading={loading}
                />
                <StatCard
                    title="Total Kelas"
                    value={stats.totalClasses}
                    icon={<GraduationCap className="w-6 h-6" />}
                    gradient="from-blue-500 to-blue-600"
                    loading={loading}
                />
                <StatCard
                    title="Total Siswa"
                    value={stats.totalStudents}
                    icon={<Users className="w-6 h-6" />}
                    gradient="from-purple-500 to-purple-600"
                    loading={loading}
                />
                <StatCard
                    title="Pengumuman Aktif"
                    value={stats.totalAnnouncements}
                    icon={<Bell className="w-6 h-6" />}
                    gradient="from-yellow-500 to-yellow-600"
                    loading={loading}
                />
            </div>

            {/* Quick Actions */}
            <Card className="card-hover">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Plus className="w-5 h-5 text-green-500" />
                        Aksi Cepat
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 md:grid-cols-3">
                        <Link href="/guru/modules">
                            <Button className="w-full h-20 flex-col gap-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white">
                                <BookOpen className="w-6 h-6" />
                                <span className="font-semibold">Kelola Modul</span>
                            </Button>
                        </Link>
                        <Link href="/guru/grades">
                            <Button className="w-full h-20 flex-col gap-2" variant="outline">
                                <FileText className="w-6 h-6 text-purple-500" />
                                <span className="font-semibold">Input Nilai</span>
                            </Button>
                        </Link>
                        <Link href="/guru/announcements">
                            <Button className="w-full h-20 flex-col gap-2" variant="outline">
                                <Bell className="w-6 h-6 text-yellow-500" />
                                <span className="font-semibold">Buat Pengumuman</span>
                            </Button>
                        </Link>
                    </div>
                </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
                <CardHeader>
                    <CardTitle>Aktivitas Terbaru</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="flex items-start gap-4 p-4 bg-muted rounded-lg">
                            <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                                <BookOpen className="w-5 h-5 text-green-600 dark:text-green-400" />
                            </div>
                            <div className="flex-1">
                                <p className="font-medium text-foreground">Selamat Datang!</p>
                                <p className="text-sm text-muted-foreground">
                                    Mulai kelola modul pembelajaran, input nilai, dan buat pengumuman
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4 p-4 bg-muted rounded-lg">
                            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                                <ClipboardList className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div className="flex-1">
                                <p className="font-medium text-foreground">Dashboard Guru</p>
                                <p className="text-sm text-muted-foreground">
                                    Akses cepat ke semua fitur yang Anda butuhkan untuk mengajar
                                </p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

function StatCard({
    title,
    value,
    icon,
    gradient,
    loading,
}: {
    title: string;
    value: number;
    icon: React.ReactNode;
    gradient: string;
    loading?: boolean;
}) {
    return (
        <Card className="card-hover overflow-hidden">
            <div className={`h-1 bg-gradient-to-r ${gradient}`}></div>
            <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-muted-foreground">{title}</p>
                        <p className="text-3xl font-bold text-foreground mt-2">
                            {loading ? '...' : value}
                        </p>
                    </div>
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${gradient} text-white flex items-center justify-center`}>
                        {icon}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
