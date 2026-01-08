import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/db';
import { teachers, guruKelas, students } from '@/db/schema';
import { eq, and } from 'drizzle-orm';

// GET /api/guru/classes/[classId]/students - Get students in a class (that teacher teaches)
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

        // Get students in this class
        const classStudents = await db
            .select({
                id: students.id,
                nis: students.nis,
                userId: students.userId,
                phone: students.phone,
                address: students.address,
                dateOfBirth: students.dateOfBirth,
            })
            .from(students)
            .where(eq(students.classId, params.classId))
            .orderBy(students.nis);

        // Get user info for each student
        const { users } = await import('@/db/schema');
        const studentsWithUsers = await Promise.all(
            classStudents.map(async (student) => {
                const [user] = await db
                    .select({ name: users.name, email: users.email })
                    .from(users)
                    .where(eq(users.id, student.userId))
                    .limit(1);

                return {
                    ...student,
                    name: user?.name || '',
                    email: user?.email || '',
                };
            })
        );

        return NextResponse.json(studentsWithUsers);
    } catch (error) {
        console.error('Error fetching class students:', error);
        return NextResponse.json(
            { error: 'Failed to fetch students' },
            { status: 500 }
        );
    }
}
