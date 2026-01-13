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

        // Log incoming request
        console.log('POST /api/guru/grades - Request:', {
            teacherId: teacher.id,
            classId,
            subjectId,
            semester,
            academicYear,
            gradesCount: gradesData?.length
        });

        if (!classId || !subjectId || !semester || !academicYear || !gradesData || !Array.isArray(gradesData)) {
            console.error('Invalid request data:', { classId, subjectId, semester, academicYear, gradesData: !!gradesData });
            return NextResponse.json(
                { error: 'Invalid request data - missing required fields' },
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
            console.error('Teacher does not teach this class:', { teacherId: teacher.id, classId });
            return NextResponse.json({ error: 'You do not teach this class' }, { status: 403 });
        }

        // Process each grade with detailed error tracking
        const results = [];
        const errors = [];
        const skipped = [];

        for (let i = 0; i < gradesData.length; i++) {
            const gradeData = gradesData[i];
            const { studentId, score, remarks } = gradeData;

            // Validate studentId
            if (!studentId || typeof studentId !== 'string') {
                errors.push({
                    index: i,
                    studentId: studentId || 'undefined',
                    reason: 'Invalid or missing studentId'
                });
                continue;
            }

            // Validate score type and value
            if (typeof score !== 'number' || isNaN(score)) {
                errors.push({
                    index: i,
                    studentId,
                    score,
                    scoreType: typeof score,
                    reason: `Invalid score type (expected number, got ${typeof score})`
                });
                continue;
            }

            if (score < 0 || score > 100) {
                skipped.push({
                    index: i,
                    studentId,
                    score,
                    reason: 'Score out of valid range (0-100)'
                });
                continue;
            }

            try {
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
            } catch (dbError: any) {
                console.error(`Database error for student ${studentId}:`, dbError);
                errors.push({
                    index: i,
                    studentId,
                    reason: dbError.message || 'Database error',
                    code: dbError.code
                });
            }
        }

        // Log results
        console.log('Grade save results:', {
            total: gradesData.length,
            saved: results.length,
            errors: errors.length,
            skipped: skipped.length
        });

        // Return detailed response
        const hasErrors = errors.length > 0;
        const response = {
            success: !hasErrors,
            count: results.length,
            grades: results,
            summary: {
                total: gradesData.length,
                saved: results.length,
                failed: errors.length,
                skipped: skipped.length
            },
            ...(errors.length > 0 && { errors }),
            ...(skipped.length > 0 && { skipped })
        };

        return NextResponse.json(response, {
            status: hasErrors ? 400 : 201
        });
    } catch (error: any) {
        console.error('Error saving grades:', error);
        return NextResponse.json(
            {
                error: 'Failed to save grades',
                details: error.message
            },
            { status: 500 }
        );
    }
}
