import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/db';
import { classes, teachers, guruKelas } from '@/db/schema';
import { eq } from 'drizzle-orm';

// GET /api/guru/classes - Get classes taught by logged-in teacher
export async function GET(req: NextRequest) {
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

        // Get classes taught by this teacher
        const teacherClasses = await db
            .select({
                id: classes.id,
                name: classes.name,
                academicYear: classes.academicYear,
            })
            .from(guruKelas)
            .innerJoin(classes, eq(guruKelas.classId, classes.id))
            .where(eq(guruKelas.teacherId, teacher.id))
            .orderBy(classes.name);

        return NextResponse.json(teacherClasses);
    } catch (error) {
        console.error('Error fetching teacher classes:', error);
        return NextResponse.json(
            { error: 'Failed to fetch classes' },
            { status: 500 }
        );
    }
}
