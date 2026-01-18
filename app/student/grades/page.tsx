'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, TrendingUp, Loader2, AlertCircle } from 'lucide-react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';

interface GradeItem {
    id: string;
    subject: string;
    subjectCode: string;
    score: number;
    remarks: string | null;
    createdAt: string;
}

interface GradePeriod {
    academicYear: string;
    semester: number;
    grades: GradeItem[];
}

interface GradesResponse {
    grades: GradePeriod[];
    studentInfo: {
        name: string;
        classId: string;
    };
    isEmpty: boolean;
    totalGrades: number;
    message?: string;
}

export default function StudentGradesPage() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [gradesData, setGradesData] = useState<GradesResponse | null>(null);
    const [selectedPeriod, setSelectedPeriod] = useState<string>('all');

    useEffect(() => {
        fetchGrades();
    }, []);

    const fetchGrades = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await fetch('/api/student/grades');

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to fetch grades');
            }

            const data: GradesResponse = await response.json();
            setGradesData(data);

            // Auto-select most recent period if available
            if (data.grades && data.grades.length > 0) {
                const mostRecent = data.grades[0];
                setSelectedPeriod(`${mostRecent.academicYear}-${mostRecent.semester}`);
            }
        } catch (err) {
            console.error('Error fetching grades:', err);
            setError(err instanceof Error ? err.message : 'Gagal memuat data nilai');
        } finally {
            setLoading(false);
        }
    };

    // Filter grades based on selected period
    const filteredGrades = gradesData?.grades.filter((period) => {
        if (selectedPeriod === 'all') return true;
        return `${period.academicYear}-${period.semester}` === selectedPeriod;
    }) || [];

    // Calculate average for displayed grades
    const calculateAverage = (periods: GradePeriod[]): string => {
        const allGrades = periods.flatMap(p => p.grades);
        if (allGrades.length === 0) return '0.00';
        const sum = allGrades.reduce((acc, g) => acc + g.score, 0);
        return (sum / allGrades.length).toFixed(2);
    };

    const average = calculateAverage(filteredGrades);

    // Loading skeleton
    if (loading) {
        return (
            <div className="space-y-6">
                <div>
                    <Skeleton className="h-9 w-48 mb-2" />
                    <Skeleton className="h-5 w-64" />
                </div>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-4">
                            <Skeleton className="w-16 h-16 rounded-full" />
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-32" />
                                <Skeleton className="h-10 w-20" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <Skeleton className="h-6 w-40" />
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {[1, 2, 3].map((i) => (
                                <Skeleton key={i} className="h-16 w-full" />
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="space-y-6">
                <div>
                    <h2 className="text-3xl font-bold text-foreground">Nilai Akademik</h2>
                    <p className="text-muted-foreground mt-1">Nilai per mata pelajaran</p>
                </div>
                <Card className="bg-card border-border">
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-4 text-red-500">
                            <AlertCircle className="w-12 h-12" />
                            <div>
                                <p className="font-semibold text-lg">Gagal Memuat Data</p>
                                <p className="text-sm text-muted-foreground">{error}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    // Empty state
    if (gradesData?.isEmpty) {
        return (
            <div className="space-y-6">
                <div>
                    <h2 className="text-3xl font-bold text-foreground">Nilai Akademik</h2>
                    <p className="text-muted-foreground mt-1">Nilai per mata pelajaran</p>
                </div>
                <Card className="bg-card border-border">
                    <CardContent className="pt-6">
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <BookOpen className="w-16 h-16 text-muted-foreground mb-4" />
                            <p className="text-lg font-semibold text-foreground mb-2">
                                Belum Ada Nilai
                            </p>
                            <p className="text-sm text-muted-foreground max-w-md">
                                {gradesData.message || 'Nilai Anda akan muncul di sini setelah guru memasukkan nilai.'}
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold text-foreground">Nilai Akademik</h2>
                    <p className="text-muted-foreground mt-1">Nilai per mata pelajaran</p>
                </div>

                {/* Period Filter */}
                {gradesData && gradesData.grades.length > 1 && (
                    <div className="w-64">
                        <Label className="text-sm text-muted-foreground mb-2 block">
                            Filter Periode
                        </Label>
                        <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Semua Periode</SelectItem>
                                {gradesData.grades.map((period) => (
                                    <SelectItem
                                        key={`${period.academicYear}-${period.semester}`}
                                        value={`${period.academicYear}-${period.semester}`}
                                    >
                                        Semester {period.semester} ({period.academicYear})
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                )}
            </div>

            {/* Average Score */}
            {filteredGrades.length > 0 && (
                <Card className="bg-card border-border bg-gradient-to-r from-yellow-400/10 to-yellow-600/10">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center">
                                    <TrendingUp className="w-8 h-8 text-black" />
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Rata-rata Nilai</p>
                                    <p className="text-4xl font-bold text-foreground mt-1">{average}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-sm text-muted-foreground">Total Mata Pelajaran</p>
                                <p className="text-xl font-semibold text-foreground">
                                    {filteredGrades.reduce((acc, p) => acc + p.grades.length, 0)}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Grades by Period */}
            {filteredGrades.map((period) => (
                <Card key={`${period.academicYear}-${period.semester}`} className="bg-card border-border">
                    <CardHeader>
                        <CardTitle className="text-card-foreground flex items-center gap-2">
                            <BookOpen className="w-5 h-5 text-yellow-400" />
                            Semester {period.semester} - {period.academicYear}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="border-b border-border">
                                    <tr>
                                        <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">
                                            Mata Pelajaran
                                        </th>
                                        <th className="text-center py-3 px-4 text-sm font-semibold text-foreground">
                                            Kode
                                        </th>
                                        <th className="text-center py-3 px-4 text-sm font-semibold text-foreground">
                                            Nilai
                                        </th>
                                        <th className="text-center py-3 px-4 text-sm font-semibold text-foreground">
                                            Grade
                                        </th>
                                        <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">
                                            Catatan
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {period.grades
                                        .sort((a, b) => a.subject.localeCompare(b.subject))
                                        .map((grade) => (
                                            <tr key={grade.id} className="hover:bg-secondary/50">
                                                <td className="py-3 px-4 text-sm text-foreground">
                                                    {grade.subject}
                                                </td>
                                                <td className="py-3 px-4 text-sm text-center text-muted-foreground">
                                                    {grade.subjectCode}
                                                </td>
                                                <td className="py-3 px-4 text-sm text-center">
                                                    <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-yellow-400/10 text-yellow-600 font-bold">
                                                        {grade.score}
                                                    </span>
                                                </td>
                                                <td className="py-3 px-4 text-sm text-center">
                                                    <span
                                                        className={`inline-block px-3 py-1 rounded-full font-semibold ${getGradeColor(
                                                            grade.score
                                                        )}`}
                                                    >
                                                        {getGradeLetter(grade.score)}
                                                    </span>
                                                </td>
                                                <td className="py-3 px-4 text-sm text-muted-foreground">
                                                    {grade.remarks || '-'}
                                                </td>
                                            </tr>
                                        ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}

function getGradeLetter(score: number): string {
    if (score >= 90) return 'A';
    if (score >= 80) return 'B';
    if (score >= 70) return 'C';
    if (score >= 60) return 'D';
    return 'E';
}

function getGradeColor(score: number): string {
    if (score >= 90) return 'bg-green-500/20 text-green-400';
    if (score >= 80) return 'bg-blue-500/20 text-blue-400';
    if (score >= 70) return 'bg-yellow-500/20 text-yellow-400';
    if (score >= 60) return 'bg-orange-500/20 text-orange-400';
    return 'bg-red-500/20 text-red-400';
}
