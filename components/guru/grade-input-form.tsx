'use client';

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Save, GraduationCap } from 'lucide-react';
import { toast } from 'react-toastify';

interface Class {
    id: string;
    name: string;
    academicYear: string;
}

interface Subject {
    id: string;
    name: string;
    code: string;
    description: string | null;
}

interface Student {
    id: string;
    nis: string;
    name: string;
    email: string;
}

interface Grade {
    id: string;
    studentId: string;
    subjectId: string;
    classId: string;
    score: number;
    semester: number;
    academicYear: string;
    remarks: string | null;
}

interface GradeInputData {
    classes: Class[];
    subjectsByClass: Record<string, Subject[]>;
    studentsByClass: Record<string, Student[]>;
    existingGrades: Record<string, Grade[]>;
}

interface GradeInputFormProps {
    initialData: GradeInputData;
}

interface GradeInput {
    studentId: string;
    score: number;
    remarks: string;
}

export default function GradeInputForm({ initialData }: GradeInputFormProps) {
    const [selectedClassId, setSelectedClassId] = useState('');
    const [selectedSubjectId, setSelectedSubjectId] = useState('');
    const [semester, setSemester] = useState('1');
    const [academicYear, setAcademicYear] = useState(
        new Date().getFullYear() + '/' + (new Date().getFullYear() + 1)
    );
    const [gradesInput, setGradesInput] = useState<Record<string, GradeInput>>({});
    const [saving, setSaving] = useState(false);

    // Get subjects for selected class
    const subjects = useMemo(() => {
        if (!selectedClassId) return [];
        return initialData.subjectsByClass[selectedClassId] || [];
    }, [selectedClassId, initialData.subjectsByClass]);

    // Get students for selected class
    const students = useMemo(() => {
        if (!selectedClassId) return [];
        return initialData.studentsByClass[selectedClassId] || [];
    }, [selectedClassId, initialData.studentsByClass]);

    // Get existing grades for current selection
    const existingGradesMap = useMemo(() => {
        if (!selectedClassId || !selectedSubjectId) return new Map<string, Grade>();

        const key = `${selectedClassId}-${selectedSubjectId}-${semester}-${academicYear}`;
        const grades = initialData.existingGrades[key] || [];

        return new Map(grades.map(g => [g.studentId, g]));
    }, [selectedClassId, selectedSubjectId, semester, academicYear, initialData.existingGrades]);

    // Handle class selection
    const handleClassChange = (classId: string) => {
        setSelectedClassId(classId);
        setSelectedSubjectId(''); // Reset subject
        setGradesInput({}); // Reset grades
    };

    // Handle subject selection
    const handleSubjectChange = (subjectId: string) => {
        setSelectedSubjectId(subjectId);

        // Initialize grades with existing data or empty
        const initialGrades: Record<string, GradeInput> = {};
        students.forEach(student => {
            const existingGrade = existingGradesMap.get(student.id);
            initialGrades[student.id] = {
                studentId: student.id,
                score: existingGrade?.score || 0,
                remarks: existingGrade?.remarks || '',
            };
        });
        setGradesInput(initialGrades);
    };

    // Handle score change
    const handleScoreChange = (studentId: string, value: string) => {
        if (value === '') {
            setGradesInput(prev => ({
                ...prev,
                [studentId]: {
                    studentId,
                    score: 0,
                    remarks: prev[studentId]?.remarks || '',
                },
            }));
            return;
        }

        const numScore = parseInt(value);

        if (isNaN(numScore) || numScore < 0 || numScore > 100) {
            toast.error('Nilai harus antara 0-100');
            return;
        }

        setGradesInput(prev => ({
            ...prev,
            [studentId]: {
                studentId,
                score: numScore,
                remarks: prev[studentId]?.remarks || '',
            },
        }));
    };

    // Handle remarks change
    const handleRemarksChange = (studentId: string, remarks: string) => {
        setGradesInput(prev => ({
            ...prev,
            [studentId]: {
                studentId,
                score: prev[studentId]?.score || 0,
                remarks,
            },
        }));
    };

    // Handle save
    const handleSave = async () => {
        if (!selectedClassId || !selectedSubjectId) {
            toast.error('Pilih kelas dan mata pelajaran terlebih dahulu');
            return;
        }

        try {
            setSaving(true);

            const gradesData = Object.values(gradesInput);

            const response = await fetch('/api/guru/grades', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    classId: selectedClassId,
                    subjectId: selectedSubjectId,
                    semester: parseInt(semester),
                    academicYear,
                    gradesData,
                }),
            });

            const result = await response.json();

            if (!response.ok) {
                const errorMsg = result.error || 'Failed to save grades';
                if (result.errors && result.errors.length > 0) {
                    toast.error(`${errorMsg} - ${result.errors.length} error(s)`);
                } else {
                    toast.error(errorMsg);
                }
                throw new Error(errorMsg);
            }

            if (result.skipped && result.skipped.length > 0) {
                toast.warning(`${result.skipped.length} nilai di-skip`);
            }

            toast.success(`Berhasil menyimpan ${result.count} nilai`);

            // Refresh the page to get updated data
            window.location.reload();
        } catch (error: any) {
            console.error('Grade save error:', error);
        } finally {
            setSaving(false);
        }
    };

    const selectedClass = initialData.classes.find(c => c.id === selectedClassId);
    const selectedSubject = subjects.find(s => s.id === selectedSubjectId);
    const showTable = selectedClassId && selectedSubjectId && students.length > 0;

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
                    <GraduationCap className="w-6 h-6 text-purple-500" />
                    Input Nilai Siswa
                </h2>
                <p className="text-muted-foreground">
                    Pilih kelas dan mata pelajaran, lalu input nilai siswa secara langsung
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Filter & Pengaturan</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Class Selection */}
                        <div className="space-y-2">
                            <Label>Kelas</Label>
                            <Select value={selectedClassId} onValueChange={handleClassChange}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih kelas yang Anda ajar" />
                                </SelectTrigger>
                                <SelectContent>
                                    {initialData.classes.map(cls => (
                                        <SelectItem key={cls.id} value={cls.id}>
                                            {cls.name} ({cls.academicYear})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Subject Selection */}
                        <div className="space-y-2">
                            <Label>Mata Pelajaran</Label>
                            <Select
                                value={selectedSubjectId}
                                onValueChange={handleSubjectChange}
                                disabled={!selectedClassId || subjects.length === 0}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih mata pelajaran" />
                                </SelectTrigger>
                                <SelectContent>
                                    {subjects.map(subject => (
                                        <SelectItem key={subject.id} value={subject.id}>
                                            {subject.name} ({subject.code})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Semester */}
                        <div className="space-y-2">
                            <Label>Semester</Label>
                            <Select value={semester} onValueChange={setSemester}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="1">Semester 1</SelectItem>
                                    <SelectItem value="2">Semester 2</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Academic Year */}
                        <div className="space-y-2">
                            <Label>Tahun Ajaran</Label>
                            <Input
                                value={academicYear}
                                onChange={e => setAcademicYear(e.target.value)}
                                placeholder="2024/2025"
                            />
                        </div>
                    </div>

                    {/* Selection Summary - Show progressive feedback */}
                    {selectedClassId && (
                        <div className="p-4 bg-muted rounded-lg">
                            <p className="text-sm font-semibold">
                                {selectedClass?.name}
                                {selectedSubject && ` • ${selectedSubject.name}`}
                                {` • Semester ${semester} • ${academicYear}`}
                            </p>
                            {selectedSubjectId && students.length > 0 && (
                                <p className="text-sm text-muted-foreground">
                                    {students.length} siswa
                                </p>
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Grade Input Table */}
            {showTable && (
                <Card>
                    <CardHeader>
                        <CardTitle>Daftar Nilai Siswa</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-12">No</TableHead>
                                        <TableHead>NIS</TableHead>
                                        <TableHead>Nama Siswa</TableHead>
                                        <TableHead className="w-32">Nilai (0-100)</TableHead>
                                        <TableHead className="w-48">Catatan</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {students.map((student, index) => (
                                        <TableRow key={student.id}>
                                            <TableCell className="font-medium">{index + 1}</TableCell>
                                            <TableCell>{student.nis}</TableCell>
                                            <TableCell className="font-semibold">{student.name}</TableCell>
                                            <TableCell>
                                                <Input
                                                    type="text"
                                                    inputMode="numeric"
                                                    pattern="[0-9]*"
                                                    placeholder="0-100"
                                                    value={
                                                        gradesInput[student.id]?.score === 0
                                                            ? ''
                                                            : gradesInput[student.id]?.score || ''
                                                    }
                                                    onChange={e =>
                                                        handleScoreChange(student.id, e.target.value)
                                                    }
                                                    className="w-full"
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Input
                                                    type="text"
                                                    placeholder="Catatan (opsional)"
                                                    value={gradesInput[student.id]?.remarks || ''}
                                                    onChange={e =>
                                                        handleRemarksChange(student.id, e.target.value)
                                                    }
                                                    className="w-full"
                                                />
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>

                        <div className="mt-4 flex justify-end">
                            <Button
                                onClick={handleSave}
                                disabled={saving}
                                className="gap-2 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700"
                                size="lg"
                            >
                                <Save className="w-4 h-4" />
                                {saving ? 'Menyimpan...' : 'Simpan Semua Nilai'}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Empty State */}
            {!showTable && selectedClassId && selectedSubjectId && (
                <Card>
                    <CardContent className="py-12 text-center text-muted-foreground">
                        <p>Tidak ada siswa di kelas ini</p>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
