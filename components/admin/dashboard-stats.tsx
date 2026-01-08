'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, BookOpen, GraduationCap, Calendar, Bell } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { StatCard } from '@/components/ui/stat-card';

interface StatsData {
    students: number;
    teachers: number;
    classes: number;
    subjects: number;
}

export function DashboardStats({ stats }: { stats: StatsData }) {
    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold text-foreground">Dashboard</h2>
                <p className="text-muted-foreground mt-1">
                    Ringkasan data sekolah
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    title="Total Siswa"
                    value={stats.students}
                    icon={Users}
                    variant="info"
                />
                <StatCard
                    title="Total Guru"
                    value={stats.teachers}
                    icon={GraduationCap}
                    variant="success"
                />
                <StatCard
                    title="Total Kelas"
                    value={stats.classes}
                    icon={BookOpen}
                    variant="warning"
                />
                <StatCard
                    title="Mata Pelajaran"
                    value={stats.subjects}
                    icon={Calendar}
                    variant="primary"
                />
            </div>

            {/* Quick Actions */}
            <Card className="card-hover">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Bell className="w-5 h-5 text-primary" />
                        Aksi Cepat
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <Link href="/dashboard/students">
                            <Button className="w-full" variant="outline">
                                Kelola Siswa
                            </Button>
                        </Link>
                        <Link href="/dashboard/teachers">
                            <Button className="w-full" variant="outline">
                                Kelola Guru
                            </Button>
                        </Link>
                        <Link href="/dashboard/grades">
                            <Button className="w-full" variant="outline">
                                Input Nilai
                            </Button>
                        </Link>
                        <Link href="/dashboard/announcements">
                            <Button className="w-full" variant="outline">
                                Buat Pengumuman
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
                            <div className="w-10 h-10 bg-info/20 rounded-full flex items-center justify-center">
                                <Users className="w-5 h-5 text-info" />
                            </div>
                            <div className="flex-1">
                                <p className="font-medium text-foreground">Siswa baru ditambahkan</p>
                                <p className="text-sm text-muted-foreground">2 jam yang lalu</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4 p-4 bg-muted rounded-lg">
                            <div className="w-10 h-10 bg-success/20 rounded-full flex items-center justify-center">
                                <BookOpen className="w-5 h-5 text-success" />
                            </div>
                            <div className="flex-1">
                                <p className="font-medium text-foreground">Nilai semester diupdate</p>
                                <p className="text-sm text-muted-foreground">5 jam yang lalu</p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

