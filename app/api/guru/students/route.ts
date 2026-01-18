import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/db';
import { teachers, guruKelas, students, users, classes } from '@/db/schema';
import { eq, inArray } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

// GET /api/guru/students - Get all students taught by logged-in teacher
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

        // Get all classes taught by this teacher
        const teacherClasses = await db
            .select({
                classId: guruKelas.classId,
            })
            .from(guruKelas)
            .where(eq(guruKelas.teacherId, teacher.id));

        // If teacher doesn't teach any classes, return empty array
        if (teacherClasses.length === 0) {
            return NextResponse.json([]);
        }

        // Extract class IDs
        const classIds = teacherClasses.map(tc => tc.classId);

        // Get all students from these classes
        const studentsData = await db
            .select({
                id: students.id,
                nis: students.nis,
                phone: students.phone,
                address: students.address,
                dateOfBirth: students.dateOfBirth,
                photoUrl: students.photoUrl,
                userId: students.userId,
                classId: students.classId,
                userName: users.name,
                userEmail: users.email,
                className: classes.name,
            })
            .from(students)
            .leftJoin(users, eq(students.userId, users.id))
            .leftJoin(classes, eq(students.classId, classes.id))
            .where(inArray(students.classId, classIds))
            .orderBy(students.nis);

        return NextResponse.json(studentsData);
    } catch (error) {
        console.error('Error fetching teacher students:', error);
        return NextResponse.json(
            { error: 'Failed to fetch students' },
            { status: 500 }
        );
    }
}
