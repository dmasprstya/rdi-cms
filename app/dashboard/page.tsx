import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, BookOpen, GraduationCap, Calendar, Bell } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default async function DashboardPage() {
    // In a real app, fetch these stats from the database
    const stats = {
        students: 150,
        teachers: 25,
        classes: 12,
        subjects: 15,
    };

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
                    icon={<Users className="w-6 h-6" />}
                    gradient="from-blue-500 to-blue-600"
                />
                <StatCard
                    title="Total Guru"
                    value={stats.teachers}
                    icon={<GraduationCap className="w-6 h-6" />}
                    gradient="from-green-500 to-green-600"
                />
                <StatCard
                    title="Total Kelas"
                    value={stats.classes}
                    icon={<BookOpen className="w-6 h-6" />}
                    gradient="from-yellow-500 to-yellow-600"
                />
                <StatCard
                    title="Mata Pelajaran"
                    value={stats.subjects}
                    icon={<Calendar className="w-6 h-6" />}
                    gradient="from-purple-500 to-purple-600"
                />
            </div>

            {/* Quick Actions */}
            <Card className="card-hover">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Bell className="w-5 h-5 text-yellow-400" />
                        Menu Utama
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 md:grid-cols-3">
                        <Link href="/dashboard/students">
                            <Button className="w-full h-20 flex-col gap-2" variant="outline">
                                <Users className="w-6 h-6 text-blue-500" />
                                <span className="font-semibold">Kelola Siswa</span>
                            </Button>
                        </Link>
                        <Link href="/dashboard/teachers">
                            <Button className="w-full h-20 flex-col gap-2" variant="outline">
                                <GraduationCap className="w-6 h-6 text-green-500" />
                                <span className="font-semibold">Kelola Guru</span>
                            </Button>
                        </Link>
                        <Link href="/dashboard/classes">
                            <Button className="w-full h-20 flex-col gap-2" variant="outline">
                                <BookOpen className="w-6 h-6 text-orange-500" />
                                <span className="font-semibold">Kelola Kelas</span>
                            </Button>
                        </Link>
                    </div>
                </CardContent>
            </Card>

            {/* Advanced Features */}
            <Card className="card-hover">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-purple-500" />
                        Fitur Lanjutan
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 md:grid-cols-2">
                        <Link href="/dashboard/kelas-mata-pelajaran">
                            <Button className="w-full h-16 flex-col gap-2" variant="outline">
                                <Calendar className="w-5 h-5 text-purple-500" />
                                <span className="font-semibold text-sm">Kelola Mata Pelajaran Kelas</span>
                            </Button>
                        </Link>
                        <div className="opacity-50">
                            <Button className="w-full h-16 flex-col gap-2" variant="outline" disabled>
                                <BookOpen className="w-5 h-5" />
                                <span className="font-semibold text-sm">Fitur Lainnya</span>
                            </Button>
                        </div>
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
                            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                                <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div className="flex-1">
                                <p className="font-medium text-foreground">Siswa baru ditambahkan</p>
                                <p className="text-sm text-muted-foreground">2 jam yang lalu</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4 p-4 bg-muted rounded-lg">
                            <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                                <BookOpen className="w-5 h-5 text-green-600 dark:text-green-400" />
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

function StatCard({
    title,
    value,
    icon,
    gradient
}: {
    title: string;
    value: number;
    icon: React.ReactNode;
    gradient: string;
}) {
    return (
        <Card className="card-hover overflow-hidden">
            <div className={`h-1 bg-gradient-to-r ${gradient}`}></div>
            <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-muted-foreground">{title}</p>
                        <p className="text-3xl font-bold text-foreground mt-2">{value}</p>
                    </div>
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${gradient} text-white flex items-center justify-center`}>
                        {icon}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
