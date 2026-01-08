import { NextResponse } from 'next/server';
import { db } from '@/db';
import { modules, students, subjects, teachers, users } from '@/db/schema';
import { eq, or, and, desc, isNull } from 'drizzle-orm';
import { auth } from '@/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const session = await auth();
        if (!session || session.user.role !== 'student') {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const userId = session.user.id;

        // 1. Get student's classId
        const student = await db
            .select({
                classId: students.classId,
            })
            .from(students)
            .where(eq(students.userId, userId))
            .limit(1);

        if (!student.length) {
            return NextResponse.json(
                { error: 'Student profile not found' },
                { status: 404 }
            );
        }

        const classId = student[0].classId;

        // 2. Fetch modules
        // Logic: Get modules where (module.classId is current Class OR module.classId is NULL)
        const whereClause = classId
            ? or(eq(modules.classId, classId), isNull(modules.classId))
            : isNull(modules.classId);

        const data = await db
            .select({
                id: modules.id,
                title: modules.title,
                description: modules.description,
                content: modules.content,
                fileUrl: modules.fileUrl,
                createdAt: modules.createdAt,
                subjectName: subjects.name,
                subjectCode: subjects.code,
                teacherName: users.name, // The user name of the teacher
            })
            .from(modules)
            .leftJoin(subjects, eq(modules.subjectId, subjects.id))
            .leftJoin(teachers, eq(modules.teacherId, teachers.id))
            .leftJoin(users, eq(teachers.userId, users.id)) // Get teacher's user profile
            .where(and(whereClause, eq(modules.isPublished, true)))
            .orderBy(desc(modules.createdAt));

        return NextResponse.json(data);

    } catch (error) {
        console.error('Error fetching modules:', error);
        return NextResponse.json(
            { error: 'Failed to fetch modules' },
            { status: 500 }
        );
    }
}
