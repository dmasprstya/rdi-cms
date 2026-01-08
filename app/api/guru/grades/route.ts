import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/db';
import { grades, teachers, guruKelas } from '@/db/schema';
import { eq, and } from 'drizzle-orm';

// GET /api/guru/grades - Get grades for a class and subject
export async function GET(req: NextRequest) {
    try {
        const session = await auth();

        if (!session || session.user.role !== 'guru') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const classId = searchParams.get('classId');
        const subjectId = searchParams.get('subjectId');

        if (!classId || !subjectId) {
            return NextResponse.json(
                { error: 'classId and subjectId are required' },
                { status: 400 }
            );
        }

        // Get the teacher record
        const [teacher] = await db
            .select()
            .from(teachers)
            .where(eq(teachers.userId, session.user.id))
            .limit(1);

        if (!teacher) {
            return NextResponse.json({ error: 'Teacher profile not found' }, { status: 404 });
        }

        // Verify teacher teaches this class
        const [teaches] = await db
            .select()
            .from(guruKelas)
            .where(
                and(
                    eq(guruKelas.teacherId, teacher.id),
                    eq(guruKelas.classId, classId)
                )
            )
            .limit(1);

        if (!teaches) {
            return NextResponse.json({ error: 'You do not teach this class' }, { status: 403 });
        }

        // Get existing grades
        const existingGrades = await db
            .select()
            .from(grades)
            .where(
                and(
                    eq(grades.classId, classId),
                    eq(grades.subjectId, subjectId)
                )
            );

        return NextResponse.json(existingGrades);
    } catch (error) {
        console.error('Error fetching grades:', error);
        return NextResponse.json(
            { error: 'Failed to fetch grades' },
            { status: 500 }
        );
    }
}

// POST /api/guru/grades - Create or update grades (batch)
export async function POST(req: NextRequest) {
    try {
        const session = await auth();

        if (!session || session.user.role !== 'guru') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Get the teacher record
        const [teacher] = await db
            .select()
            .from(teachers)
            .where(eq(teachers.userId, session.user.id))
            .limit(1);

        if (!teacher) {
            return NextResponse.json({ error: 'Teacher profile not found' }, { status: 404 });
        }

        const body = await req.json();
        const { classId, subjectId, semester, academicYear, gradesData } = body;

        if (!classId || !subjectId || !semester || !academicYear || !gradesData || !Array.isArray(gradesData)) {
            return NextResponse.json(
                { error: 'Invalid request data' },
                { status: 400 }
            );
        }

        // Verify teacher teaches this class
        const [teaches] = await db
            .select()
            .from(guruKelas)
            .where(
                and(
                    eq(guruKelas.teacherId, teacher.id),
                    eq(guruKelas.classId, classId)
                )
            )
            .limit(1);

        if (!teaches) {
            return NextResponse.json({ error: 'You do not teach this class' }, { status: 403 });
        }

        // Process each grade
        const results = [];
        for (const gradeData of gradesData) {
            const { studentId, score, remarks } = gradeData;

            if (score < 0 || score > 100) {
                continue; // Skip invalid scores
            }

            // Check if grade exists
            const [existing] = await db
                .select()
                .from(grades)
                .where(
                    and(
                        eq(grades.studentId, studentId),
                        eq(grades.subjectId, subjectId),
                        eq(grades.classId, classId),
                        eq(grades.semester, semester),
                        eq(grades.academicYear, academicYear)
                    )
                )
                .limit(1);

            if (existing) {
                // Update existing grade
                const [updated] = await db
                    .update(grades)
                    .set({
                        score,
                        remarks: remarks || null,
                    })
                    .where(eq(grades.id, existing.id))
                    .returning();

                results.push(updated);
            } else {
                // Create new grade
                const [created] = await db
                    .insert(grades)
                    .values({
                        studentId,
                        subjectId,
                        classId,
                        teacherId: teacher.id,
                        score,
                        semester,
                        academicYear,
                        remarks: remarks || null,
                    })
                    .returning();

                results.push(created);
            }
        }

        return NextResponse.json({
            success: true,
            count: results.length,
            grades: results
        }, { status: 201 });
    } catch (error) {
        console.error('Error saving grades:', error);
        return NextResponse.json(
            { error: 'Failed to save grades' },
            { status: 500 }
        );
    }
}
