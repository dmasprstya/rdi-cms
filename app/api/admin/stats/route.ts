import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/db';
import { students, teachers, classes, subjects, users } from '@/db/schema';
import { sql, desc, eq, or } from 'drizzle-orm';

export type ActivityType = 'student' | 'teacher' | 'class' | 'staff';

export interface RecentActivity {
    id: string;
    type: ActivityType;
    title: string;
    timestamp: Date;
}

// GET /api/admin/stats - Get dashboard statistics for admin
export async function GET(req: NextRequest) {
    try {
        const session = await auth();

        if (!session || session.user.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Get total students
        const [studentsCount] = await db
            .select({ count: sql<number>`cast(count(*) as int)` })
            .from(students);

        // Get total teachers
        const [teachersCount] = await db
            .select({ count: sql<number>`cast(count(*) as int)` })
            .from(teachers);

        // Get total classes
        const [classesCount] = await db
            .select({ count: sql<number>`cast(count(*) as int)` })
            .from(classes);

        // Get total subjects
        const [subjectsCount] = await db
            .select({ count: sql<number>`cast(count(*) as int)` })
            .from(subjects);

        // Get recent activities (last 5)
        // We'll fetch from multiple tables and combine them

        // Recent students (with user info)
        const recentStudents = await db
            .select({
                id: students.id,
                name: users.name,
                createdAt: students.createdAt,
            })
            .from(students)
            .innerJoin(users, eq(students.userId, users.id))
            .orderBy(desc(students.createdAt))
            .limit(5);

        // Recent teachers (with user info)
        const recentTeachers = await db
            .select({
                id: teachers.id,
                name: users.name,
                createdAt: teachers.createdAt,
            })
            .from(teachers)
            .innerJoin(users, eq(teachers.userId, users.id))
            .orderBy(desc(teachers.createdAt))
            .limit(5);

        // Recent classes
        const recentClasses = await db
            .select({
                id: classes.id,
                name: classes.name,
                createdAt: classes.createdAt,
            })
            .from(classes)
            .orderBy(desc(classes.createdAt))
            .limit(5);

        // Recent staff users
        const recentStaff = await db
            .select({
                id: users.id,
                name: users.name,
                createdAt: users.createdAt,
            })
            .from(users)
            .where(eq(users.role, 'staff'))
            .orderBy(desc(users.createdAt))
            .limit(5);

        // Combine and format all activities
        const activities: RecentActivity[] = [
            ...recentStudents.map(s => ({
                id: s.id,
                type: 'student' as ActivityType,
                title: `Siswa ${s.name} ditambahkan`,
                timestamp: s.createdAt,
            })),
            ...recentTeachers.map(t => ({
                id: t.id,
                type: 'teacher' as ActivityType,
                title: `Guru ${t.name} ditambahkan`,
                timestamp: t.createdAt,
            })),
            ...recentClasses.map(c => ({
                id: c.id,
                type: 'class' as ActivityType,
                title: `Kelas ${c.name} dibuat`,
                timestamp: c.createdAt,
            })),
            ...recentStaff.map(s => ({
                id: s.id,
                type: 'staff' as ActivityType,
                title: `Staff ${s.name} ditambahkan`,
                timestamp: s.createdAt,
            })),
        ];

        // Sort by timestamp descending and take top 5
        const sortedActivities = activities
            .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
            .slice(0, 5);

        return NextResponse.json({
            students: studentsCount?.count || 0,
            teachers: teachersCount?.count || 0,
            classes: classesCount?.count || 0,
            subjects: subjectsCount?.count || 0,
            recentActivities: sortedActivities,
        });
    } catch (error) {
        console.error('Error fetching admin stats:', error);
        return NextResponse.json(
            { error: 'Failed to fetch statistics' },
            { status: 500 }
        );
    }
}
