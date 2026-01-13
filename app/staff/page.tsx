'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Users, GraduationCap, Plus, School, Settings } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface Stats {
    totalClasses: number;
    totalStudents: number;
    totalTeachers: number;
}

export default function StaffDashboardPage() {
    const [stats, setStats] = useState<Stats>({
        totalClasses: 0,
        totalStudents: 0,
        totalTeachers: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const response = await fetch('/api/staff/stats');
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
                <h2 className="text-3xl font-bold text-foreground">Dashboard Staff</h2>
                <p className="text-muted-foreground mt-1">
                    Kelola data akademik sekolah
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-6 md:grid-cols-3">
                <StatCard
                    title="Total Kelas"
                    value={stats.totalClasses}
                    icon={<School className="w-6 h-6" />}
                    gradient="from-cyan-500 to-cyan-600"
                    loading={loading}
                />
                <StatCard
                    title="Total Siswa"
                    value={stats.totalStudents}
                    icon={<Users className="w-6 h-6" />}
                    gradient="from-blue-500 to-blue-600"
                    loading={loading}
                />
                <StatCard
                    title="Total Guru"
                    value={stats.totalTeachers}
                    icon={<GraduationCap className="w-6 h-6" />}
                    gradient="from-purple-500 to-purple-600"
                    loading={loading}
                />
            </div>

            {/* Quick Actions */}
            <Card className="card-hover">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Plus className="w-5 h-5 text-cyan-500" />
                        Aksi Cepat
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <Link href="/dashboard/classes">
                            <Button className="w-full h-20 flex-col gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white">
                                <School className="w-6 h-6" />
                                <span className="font-semibold">Kelola Kelas</span>
                            </Button>
                        </Link>
                        <Link href="/staff/subjects-management">
                            <Button className="w-full h-20 flex-col gap-2 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white">
                                <BookOpen className="w-6 h-6" />
                                <span className="font-semibold">Kelola Mata Pelajaran</span>
                            </Button>
                        </Link>
                        <Link href="/staff/students">
                            <Button className="w-full h-20 flex-col gap-2" variant="outline">
                                <Users className="w-6 h-6 text-blue-500" />
                                <span className="font-semibold">Lihat Data Siswa</span>
                            </Button>
                        </Link>
                        <Link href="/staff/teachers">
                            <Button className="w-full h-20 flex-col gap-2" variant="outline">
                                <GraduationCap className="w-6 h-6 text-purple-500" />
                                <span className="font-semibold">Lihat Data Guru</span>
                            </Button>
                        </Link>
                    </div>
                </CardContent>
            </Card>

            {/* Info Card */}
            <Card className="bg-blue-500/10 border-blue-500/30">
                <CardContent className="pt-6">
                    <div className="flex gap-4">
                        <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                            <Settings className="w-6 h-6 text-blue-400" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-foreground mb-2">Role Staff - Admin Assistant</h3>
                            <p className="text-sm text-muted-foreground">
                                Sebagai staff, Anda dapat mengelola kelas dan mata pelajaran.
                                Untuk input nilai dan modul pembelajaran, silakan gunakan akun guru.
                            </p>
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
