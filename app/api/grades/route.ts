import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { grades, students, subjects, users, classes, teachers } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { auth } from '@/auth';

export const dynamic = 'force-dynamic';

// GET - Fetch grades with filters
export async function GET(request: NextRequest) {
    try {
        const session = await auth();
        if (!session || session.user.role !== 'admin') {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const { searchParams } = new URL(request.url);
        const studentId = searchParams.get('studentId');
        const subjectId = searchParams.get('subjectId');
        const classId = searchParams.get('classId');

        let query = db
            .select({
                id: grades.id,
                studentId: grades.studentId,
                subjectId: grades.subjectId,
                score: grades.score,
                semester: grades.semester,
                academicYear: grades.academicYear,
                remarks: grades.remarks,
                createdAt: grades.createdAt,
                studentNis: students.nis,
                studentName: users.name,
                studentClassId: students.classId,
                className: classes.name,
                subjectName: subjects.name,
                subjectCode: subjects.code,
            })
            .from(grades)
            .leftJoin(students, eq(grades.studentId, students.id))
            .leftJoin(users, eq(students.userId, users.id))
            .leftJoin(classes, eq(students.classId, classes.id))
            .leftJoin(subjects, eq(grades.subjectId, subjects.id));

        // Apply filters
        const conditions = [];
        if (studentId) {
            conditions.push(eq(grades.studentId, studentId));
        }
        if (subjectId) {
            conditions.push(eq(grades.subjectId, subjectId));
        }
        if (classId) {
            conditions.push(eq(students.classId, classId));
        }

        if (conditions.length > 0) {
            query = query.where(and(...conditions)) as any;
        }

        const gradesData = await query;

        return NextResponse.json(gradesData);
    } catch (error) {
        console.error('Error fetching grades:', error);
        return NextResponse.json(
            { error: 'Failed to fetch grades' },
            { status: 500 }
        );
    }
}

// POST - Create new grade
export async function POST(request: NextRequest) {
    try {
        const session = await auth();
        if (!session || session.user.role !== 'admin') {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const body = await request.json();
        const {
            studentId,
            subjectId,
            score,
            semester,
            academicYear,
            remarks,
            teacherId // Optional override
        } = body;

        // Validate required fields
        if (!studentId || !subjectId || score === undefined || !semester || !academicYear) {
            return NextResponse.json(
                { error: 'Siswa, mata pelajaran, nilai, semester, dan tahun akademik wajib diisi' },
                { status: 400 }
            );
        }

        // Validate score range
        if (score < 0 || score > 100) {
            return NextResponse.json(
                { error: 'Nilai harus antara 0-100' },
                { status: 400 }
            );
        }

        // Validate subject exists
        const [subject] = await db
            .select()
            .from(subjects)
            .where(eq(subjects.id, subjectId))
            .limit(1);

        if (!subject) {
            return NextResponse.json(
                { error: 'Mata pelajaran tidak ditemukan' },
                { status: 400 }
            );
        }

        // Get student's class ID
        const student = await db
            .select({ classId: students.classId })
            .from(students)
            .where(eq(students.id, studentId))
            .limit(1);

        if (student.length === 0 || !student[0].classId) {
            return NextResponse.json(
                { error: 'Siswa atau kelas tidak ditemukan' },
                { status: 400 }
            );
        }

        const classId = student[0].classId;

        // Get a teacher (use provided teacherId or get first available teacher)
        let finalTeacherId = teacherId;
        if (!finalTeacherId) {
            const teacher = await db
                .select({ id: teachers.id })
                .from(teachers)
                .limit(1);

            if (teacher.length === 0) {
                return NextResponse.json(
                    { error: 'Tidak ada guru tersedia' },
                    { status: 400 }
                );
            }
            finalTeacherId = teacher[0].id;
        }

        // Check if grade already exists for this student, subject, semester, and academic year
        const existingGrade = await db
            .select()
            .from(grades)
            .where(
                and(
                    eq(grades.studentId, studentId),
                    eq(grades.subjectId, subjectId),
                    eq(grades.semester, semester),
                    eq(grades.academicYear, academicYear)
                )
            )
            .limit(1);

        if (existingGrade.length > 0) {
            return NextResponse.json(
                { error: 'Nilai untuk siswa, mata pelajaran, semester, dan tahun akademik ini sudah ada' },
                { status: 400 }
            );
        }

        // Create grade
        const [newGrade] = await db
            .insert(grades)
            .values({
                studentId,
                subjectId,
                classId,
                teacherId: finalTeacherId,
                score,
                semester,
                academicYear,
                remarks: remarks || null,
            })
            .returning();

        return NextResponse.json({
            success: true,
            grade: newGrade
        }, { status: 201 });
    } catch (error) {
        console.error('Error creating grade:', error);
        return NextResponse.json(
            { error: 'Gagal membuat data nilai' },
            { status: 500 }
        );
    }
}

// PUT - Update grade
export async function PUT(request: NextRequest) {
    try {
        const session = await auth();
        if (!session || session.user.role !== 'admin') {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const body = await request.json();
        const {
            id,
            studentId,
            subjectId,
            score,
            semester,
            academicYear,
            remarks
        } = body;

        if (!id) {
            return NextResponse.json(
                { error: 'ID nilai wajib diisi' },
                { status: 400 }
            );
        }

        // Validate score range
        if (score !== undefined && (score < 0 || score > 100)) {
            return NextResponse.json(
                { error: 'Nilai harus antara 0-100' },
                { status: 400 }
            );
        }

        // Check if grade exists
        const existingGrade = await db
            .select()
            .from(grades)
            .where(eq(grades.id, id))
            .limit(1);

        if (existingGrade.length === 0) {
            return NextResponse.json(
                { error: 'Nilai tidak ditemukan' },
                { status: 404 }
            );
        }

        // Update grade
        await db
            .update(grades)
            .set({
                ...(studentId && { studentId }),
                ...(subjectId && { subjectId }),
                ...(score !== undefined && { score }),
                ...(semester && { semester }),
                ...(academicYear && { academicYear }),
                remarks: remarks || null,
            })
            .where(eq(grades.id, id));

        return NextResponse.json({
            success: true,
            message: 'Nilai berhasil diperbarui'
        });
    } catch (error) {
        console.error('Error updating grade:', error);
        return NextResponse.json(
            { error: 'Gagal memperbarui nilai' },
            { status: 500 }
        );
    }
}

// DELETE - Delete grade
export async function DELETE(request: NextRequest) {
    try {
        const session = await auth();
        if (!session || session.user.role !== 'admin') {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json(
                { error: 'ID nilai wajib diisi' },
                { status: 400 }
            );
        }

        // Check if grade exists
        const grade = await db
            .select()
            .from(grades)
            .where(eq(grades.id, id))
            .limit(1);

        if (grade.length === 0) {
            return NextResponse.json(
                { error: 'Nilai tidak ditemukan' },
                { status: 404 }
            );
        }

        // Delete grade
        await db
            .delete(grades)
            .where(eq(grades.id, id));

        return NextResponse.json({
            success: true,
            message: 'Nilai berhasil dihapus'
        });
    } catch (error) {
        console.error('Error deleting grade:', error);
        return NextResponse.json(
            { error: 'Gagal menghapus nilai' },
            { status: 500 }
        );
    }
}
