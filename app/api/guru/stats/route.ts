import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/db';
import { teachers, modules, students, guruKelas, announcements } from '@/db/schema';
import { eq, and, sql } from 'drizzle-orm';

// GET /api/guru/stats - Get dashboard statistics for logged-in teacher
export async function GET(req: NextRequest) {
    try {
        const session = await auth();

        if (!session || session.user.role !== 'guru') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Get the teacher record for the logged-in user
        const [teacher] = await db
            .select()
            .from(teachers)
            .where(eq(teachers.userId, session.user.id))
            .limit(1);

        if (!teacher) {
            return NextResponse.json({ error: 'Teacher profile not found' }, { status: 404 });
        }

        // Get total modules created by this teacher
        const [modulesCount] = await db
            .select({ count: sql<number>`cast(count(*) as int)` })
            .from(modules)
            .where(eq(modules.teacherId, teacher.id));

        // Get total students in classes taught by this teacher
        const classesWithStudents = await db
            .select({
                studentCount: sql<number>`cast(count(distinct ${students.id}) as int)`,
            })
            .from(guruKelas)
            .leftJoin(students, eq(guruKelas.classId, students.classId))
            .where(eq(guruKelas.teacherId, teacher.id));

        const totalStudents = classesWithStudents[0]?.studentCount || 0;

        // Get total active announcements created by this teacher
        const [announcementsCount] = await db
            .select({ count: sql<number>`cast(count(*) as int)` })
            .from(announcements)
            .where(
                and(
                    eq(announcements.authorId, session.user.id),
                    eq(announcements.isActive, true)
                )
            );

        // Get total classes taught by this teacher
        const [classesCount] = await db
            .select({ count: sql<number>`cast(count(*) as int)` })
            .from(guruKelas)
            .where(eq(guruKelas.teacherId, teacher.id));

        return NextResponse.json({
            totalModules: modulesCount?.count || 0,
            totalStudents: totalStudents,
            totalAnnouncements: announcementsCount?.count || 0,
            totalClasses: classesCount?.count || 0,
        });
    } catch (error) {
        console.error('Error fetching guru stats:', error);
        return NextResponse.json(
            { error: 'Failed to fetch statistics' },
            { status: 500 }
        );
    }
}
