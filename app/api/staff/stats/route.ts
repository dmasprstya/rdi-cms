import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/db';
import { classes, students, teachers } from '@/db/schema';
import { sql } from 'drizzle-orm';

// GET /api/staff/stats - Get dashboard statistics for staff (admin assistants)
export async function GET(req: NextRequest) {
    try {
        const session = await auth();

        if (!session || session.user.role !== 'staff') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Get total classes
        const [classesCount] = await db
            .select({ count: sql<number>`cast(count(*) as int)` })
            .from(classes);

        // Get total students
        const [studentsCount] = await db
            .select({ count: sql<number>`cast(count(*) as int)` })
            .from(students);

        // Get total teachers
        const [teachersCount] = await db
            .select({ count: sql<number>`cast(count(*) as int)` })
            .from(teachers);

        return NextResponse.json({
            totalClasses: classesCount?.count || 0,
            totalStudents: studentsCount?.count || 0,
            totalTeachers: teachersCount?.count || 0,
        });
    } catch (error) {
        console.error('Error fetching staff stats:', error);
        return NextResponse.json(
            { error: 'Failed to fetch statistics' },
            { status: 500 }
        );
    }
}
