import { NextResponse } from 'next/server';
import { db } from '@/db';
import { users, students, classes } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { auth } from '@/auth';

export const dynamic = 'force-dynamic';

// GET - Fetch current student's profile
export async function GET() {
    try {
        const session = await auth();
        if (!session || session.user.role !== 'student') {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        // Get the student's user ID from session
        const userId = session.user.id;

        // Fetch student data with user info and class info
        const studentData = await db
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
                classGrade: classes.grade,
            })
            .from(students)
            .leftJoin(users, eq(students.userId, users.id))
            .leftJoin(classes, eq(students.classId, classes.id))
            .where(eq(students.userId, userId))
            .limit(1);

        if (studentData.length === 0) {
            return NextResponse.json(
                { error: 'Student profile not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(studentData[0]);
    } catch (error) {
        console.error('Error fetching student profile:', error);
        return NextResponse.json(
            { error: 'Failed to fetch student profile' },
            { status: 500 }
        );
    }
}
