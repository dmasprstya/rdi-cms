import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, TrendingUp } from 'lucide-react';

export default function StudentGradesPage() {
    // In a real app, fetch from database
    const grades = [
        { subject: 'Matematika', score: 85, semester: 1, year: '2023/2024' },
        { subject: 'Bahasa Indonesia', score: 90, semester: 1, year: '2023/2024' },
        { subject: 'Bahasa Inggris', score: 88, semester: 1, year: '2023/2024' },
        { subject: 'Fisika', score: 82, semester: 1, year: '2023/2024' },
        { subject: 'Kimia', score: 86, semester: 1, year: '2023/2024' },
    ];

    const average = Math.round(grades.reduce((acc, g) => acc + g.score, 0) / grades.length);

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold text-foreground">Nilai Akademik</h2>
                <p className="text-muted-foreground mt-1">Nilai per mata pelajaran</p>
            </div>

            {/* Average Score */}
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
                            <p className="text-sm text-muted-foreground">Semester</p>
                            <p className="text-xl font-semibold text-foreground">1 (2023/2024)</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Grades Table */}
            <Card className="bg-card border-border">
                <CardHeader>
                    <CardTitle className="text-card-foreground flex items-center gap-2">
                        <BookOpen className="w-5 h-5 text-yellow-400" />
                        Daftar Nilai
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="border-b border-border">
                                <tr>
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Mata Pelajaran</th>
                                    <th className="text-center py-3 px-4 text-sm font-semibold text-foreground">Nilai</th>
                                    <th className="text-center py-3 px-4 text-sm font-semibold text-foreground">Grade</th>
                                    <th className="text-center py-3 px-4 text-sm font-semibold text-foreground">Semester</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {grades.map((grade, idx) => (
                                    <tr key={idx} className="hover:bg-secondary/50">
                                        <td className="py-3 px-4 text-sm text-foreground">{grade.subject}</td>
                                        <td className="py-3 px-4 text-sm text-center">
                                            <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-yellow-400/10 text-yellow-600 font-bold">
                                                {grade.score}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 text-sm text-center">
                                            <span className={`inline-block px-3 py-1 rounded-full font-semibold ${getGradeColor(grade.score)}`}>
                                                {getGradeLetter(grade.score)}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 text-sm text-muted-foreground text-center">{grade.semester}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
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
