'use client';

import { useState, useEffect } from 'react';
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
import { Textarea } from '@/components/ui/textarea';
import { ArrowRight, Save, ArrowLeft, GraduationCap } from 'lucide-react';
import { toast } from 'react-toastify';

interface Class {
    id: string;
    name: string;
    grade: number;
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

interface GradeData {
    studentId: string;
    score: number;
    remarks: string;
}

export function GradeInputManagement() {
    const [step, setStep] = useState(1);
    const [classes, setClasses] = useState<Class[]>([]);
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [students, setStudents] = useState<Student[]>([]);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    // Form data
    const [selectedClassId, setSelectedClassId] = useState('');
    const [selectedSubjectId, setSelectedSubjectId] = useState('');
    const [semester, setSemester] = useState('1');
    const [academicYear, setAcademicYear] = useState(new Date().getFullYear() + '/' + (new Date().getFullYear() + 1));
    const [gradesInput, setGradesInput] = useState<Record<string, GradeData>>({});

    useEffect(() => {
        fetchClasses();
    }, []);

    const fetchClasses = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/guru/classes');
            if (!response.ok) throw new Error('Failed to fetch classes');
            const data = await response.json();
            setClasses(data);
        } catch (error) {
            toast.error('Gagal memuat data kelas');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const fetchSubjects = async (classId: string) => {
        try {
            setLoading(true);
            const response = await fetch(`/api/guru/classes/${classId}/subjects`);
            if (!response.ok) throw new Error('Failed to fetch subjects');
            const data = await response.json();
            setSubjects(data);
        } catch (error) {
            toast.error('Gagal memuat mata pelajaran');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const fetchStudents = async (classId: string) => {
        try {
            setLoading(true);
            const response = await fetch(`/api/guru/classes/${classId}/students`);
            if (!response.ok) throw new Error('Failed to fetch students');
            const data = await response.json();
            setStudents(data);

            // Initialize grades input
            const initialGrades: Record<string, GradeData> = {};
            data.forEach((student: Student) => {
                initialGrades[student.id] = {
                    studentId: student.id,
                    score: 0,
                    remarks: '',
                };
            });
            setGradesInput(initialGrades);
        } catch (error) {
            toast.error('Gagal memuat data siswa');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const fetchExistingGrades = async () => {
        try {
            const response = await fetch(`/api/guru/grades?classId=${selectedClassId}&subjectId=${selectedSubjectId}`);
            if (!response.ok) return;

            const existingGrades = await response.json();
            const gradesMap: Record<string, GradeData> = { ...gradesInput };

            existingGrades.forEach((grade: any) => {
                if (grade.semester === parseInt(semester) && grade.academicYear === academicYear) {
                    gradesMap[grade.studentId] = {
                        studentId: grade.studentId,
                        score: grade.score,
                        remarks: grade.remarks || '',
                    };
                }
            });

            setGradesInput(gradesMap);
        } catch (error) {
            console.error('Error fetching existing grades:', error);
        }
    };

    const handleClassSelect = async (classId: string) => {
        setSelectedClassId(classId);
        await fetchSubjects(classId);
    };

    const handleNextToSubject = () => {
        if (!selectedClassId) {
            toast.error('Pilih kelas terlebih dahulu');
            return;
        }
        setStep(2);
    };

    const handleNextToGrades = async () => {
        if (!selectedSubjectId) {
            toast.error('Pilih mata pelajaran terlebih dahulu');
            return;
        }
        await fetchStudents(selectedClassId);
        await fetchExistingGrades();
        setStep(3);
    };

    const handleScoreChange = (studentId: string, score: string) => {
        const numScore = parseInt(score) || 0;
        if (numScore < 0 || numScore > 100) {
            toast.error('Nilai harus antara 0-100');
            return;
        }

        setGradesInput(prev => ({
            ...prev,
            [studentId]: {
                ...prev[studentId],
                score: numScore,
            }
        }));
    };

    const handleRemarksChange = (studentId: string, remarks: string) => {
        setGradesInput(prev => ({
            ...prev,
            [studentId]: {
                ...prev[studentId],
                remarks,
            }
        }));
    };

    const handleSaveGrades = async () => {
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

            if (!response.ok) throw new Error('Failed to save grades');

            const result = await response.json();
            toast.success(`Berhasil menyimpan ${result.count} nilai`);

            // Reset
            setStep(1);
            setSelectedClassId('');
            setSelectedSubjectId('');
            setGradesInput({});
        } catch (error) {
            toast.error('Gagal menyimpan nilai');
            console.error(error);
        } finally {
            setSaving(false);
        }
    };

    const selectedClass = classes.find(c => c.id === selectedClassId);
    const selectedSubject = subjects.find(s => s.id === selectedSubjectId);

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-foreground">Input Nilai</h2>
                <p className="text-muted-foreground">Input nilai siswa untuk mata pelajaran</p>
            </div>

            {/* Progress Steps */}
            <div className="flex items-center justify-center gap-4 mb-8">
                <StepIndicator number={1} label="Pilih Kelas" active={step === 1} completed={step > 1} />
                <ArrowRight className="w-5 h-5 text-muted-foreground" />
                <StepIndicator number={2} label="Pilih Mapel" active={step === 2} completed={step > 2} />
                <ArrowRight className="w-5 h-5 text-muted-foreground" />
                <StepIndicator number={3} label="Input Nilai" active={step === 3} completed={false} />
            </div>

            {/* Step 1: Select Class */}
            {step === 1 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Langkah 1: Pilih Kelas</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label>Kelas</Label>
                            <Select value={selectedClassId} onValueChange={handleClassSelect}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih kelas yang Anda ajar" />
                                </SelectTrigger>
                                <SelectContent>
                                    {classes.map((cls) => (
                                        <SelectItem key={cls.id} value={cls.id}>
                                            {cls.name} - Kelas {cls.grade} ({cls.academicYear})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <Button onClick={handleNextToSubject} disabled={!selectedClassId} className="w-full gap-2">
                            Lanjut ke Pilih Mata Pelajaran
                            <ArrowRight className="w-4 h-4" />
                        </Button>
                    </CardContent>
                </Card>
            )}

            {/* Step 2: Select Subject */}
            {step === 2 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Langkah 2: Pilih Mata Pelajaran</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="p-4 bg-muted rounded-lg">
                            <p className="text-sm text-muted-foreground">Kelas dipilih:</p>
                            <p className="font-semibold">{selectedClass?.name} - Kelas {selectedClass?.grade}</p>
                        </div>

                        <div className="space-y-2">
                            <Label>Mata Pelajaran</Label>
                            <Select value={selectedSubjectId} onValueChange={setSelectedSubjectId}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih mata pelajaran" />
                                </SelectTrigger>
                                <SelectContent>
                                    {subjects.map((subject) => (
                                        <SelectItem key={subject.id} value={subject.id}>
                                            {subject.name} ({subject.code})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
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
                            <div className="space-y-2">
                                <Label>Tahun Ajaran</Label>
                                <Input
                                    value={academicYear}
                                    onChange={(e) => setAcademicYear(e.target.value)}
                                    placeholder="2024/2025"
                                />
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <Button variant="outline" onClick={() => setStep(1)} className="gap-2">
                                <ArrowLeft className="w-4 h-4" />
                                Kembali
                            </Button>
                            <Button onClick={handleNextToGrades} disabled={!selectedSubjectId} className="flex-1 gap-2">
                                Lanjut ke Input Nilai
                                <ArrowRight className="w-4 h-4" />
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Step 3: Input Grades */}
            {step === 3 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <GraduationCap className="w-5 h-5 text-purple-500" />
                            Langkah 3: Input Nilai Siswa
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4 p-4 bg-muted rounded-lg">
                            <div>
                                <p className="text-sm text-muted-foreground">Kelas:</p>
                                <p className="font-semibold">{selectedClass?.name}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Mata Pelajaran:</p>
                                <p className="font-semibold">{selectedSubject?.name}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Semester:</p>
                                <p className="font-semibold">Semester {semester}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Tahun Ajaran:</p>
                                <p className="font-semibold">{academicYear}</p>
                            </div>
                        </div>

                        <div className="space-y-4 max-h-[500px] overflow-y-auto">
                            {students.map((student) => (
                                <div key={student.id} className="p-4 border border-border rounded-lg space-y-3">
                                    <div>
                                        <p className="font-semibold text-foreground">{student.name}</p>
                                        <p className="text-sm text-muted-foreground">NIS: {student.nis}</p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor={`score-${student.id}`}>Nilai (0-100)</Label>
                                            <Input
                                                id={`score-${student.id}`}
                                                type="number"
                                                min="0"
                                                max="100"
                                                value={gradesInput[student.id]?.score || 0}
                                                onChange={(e) => handleScoreChange(student.id, e.target.value)}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor={`remarks-${student.id}`}>Catatan (Opsional)</Label>
                                            <Input
                                                id={`remarks-${student.id}`}
                                                value={gradesInput[student.id]?.remarks || ''}
                                                onChange={(e) => handleRemarksChange(student.id, e.target.value)}
                                                placeholder="Catatan nilai"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="flex gap-2 pt-4 border-t">
                            <Button variant="outline" onClick={() => setStep(2)} className="gap-2">
                                <ArrowLeft className="w-4 h-4" />
                                Kembali
                            </Button>
                            <Button
                                onClick={handleSaveGrades}
                                disabled={saving}
                                className="flex-1 gap-2 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700"
                            >
                                <Save className="w-4 h-4" />
                                {saving ? 'Menyimpan...' : 'Simpan Semua Nilai'}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}

function StepIndicator({ number, label, active, completed }: { number: number; label: string; active: boolean; completed: boolean }) {
    return (
        <div className="flex flex-col items-center gap-2">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${completed ? 'bg-green-500 text-white' :
                    active ? 'bg-purple-500 text-white' :
                        'bg-muted text-muted-foreground'
                }`}>
                {completed ? '✓' : number}
            </div>
            <span className={`text-sm ${active ? 'font-semibold text-foreground' : 'text-muted-foreground'}`}>
                {label}
            </span>
        </div>
    );
}
