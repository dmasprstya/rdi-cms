import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/db';
import { teachers, guruKelas, kelasMataPelajaran, subjects } from '@/db/schema';
import { eq, and } from 'drizzle-orm';

// GET /api/guru/classes/[classId]/subjects - Get subjects assigned to a class (that teacher teaches)
export async function GET(
    req: NextRequest,
    { params }: { params: { classId: string } }
) {
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

        // Verify teacher teaches this class
        const [teaches] = await db
            .select()
            .from(guruKelas)
            .where(
                and(
                    eq(guruKelas.teacherId, teacher.id),
                    eq(guruKelas.classId, params.classId)
                )
            )
            .limit(1);

        if (!teaches) {
            return NextResponse.json({ error: 'You do not teach this class' }, { status: 403 });
        }

        // Get subjects assigned to this class
        const classSubjects = await db
            .select({
                id: subjects.id,
                name: subjects.name,
                code: subjects.code,
                description: subjects.description,
            })
            .from(kelasMataPelajaran)
            .innerJoin(subjects, eq(kelasMataPelajaran.subjectId, subjects.id))
            .where(eq(kelasMataPelajaran.classId, params.classId))
            .orderBy(subjects.name);

        return NextResponse.json(classSubjects);
    } catch (error) {
        console.error('Error fetching class subjects:', error);
        return NextResponse.json(
            { error: 'Failed to fetch subjects' },
            { status: 500 }
        );
    }
}
