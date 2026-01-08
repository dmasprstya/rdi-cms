import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/db';
import { classes, students } from '@/db/schema';
import { eq, sql } from 'drizzle-orm';

// GET /api/classes - List all classes with student count
export async function GET(req: NextRequest) {
    try {
        const session = await auth();

        if (!session || (session.user.role !== 'admin' && session.user.role !== 'staff')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Get all classes with student count
        const allClasses = await db
            .select({
                id: classes.id,
                name: classes.name,
                grade: classes.grade,
                academicYear: classes.academicYear,
                createdAt: classes.createdAt,
                studentCount: sql<number>`cast(count(${students.id}) as int)`,
            })
            .from(classes)
            .leftJoin(students, eq(classes.id, students.classId))
            .groupBy(classes.id, classes.name, classes.grade, classes.academicYear, classes.createdAt)
            .orderBy(classes.grade, classes.name);

        return NextResponse.json(allClasses);
    } catch (error) {
        console.error('Error fetching classes:', error);
        return NextResponse.json(
            { error: 'Failed to fetch classes' },
            { status: 500 }
        );
    }
}

// POST /api/classes - Create a new class
export async function POST(req: NextRequest) {
    try {
        const session = await auth();

        if (!session || (session.user.role !== 'admin' && session.user.role !== 'staff')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { name, grade, academicYear } = body;

        if (!name || !grade || !academicYear) {
            return NextResponse.json(
                { error: 'Name, grade, and academic year are required' },
                { status: 400 }
            );
        }

        const [newClass] = await db.insert(classes).values({
            name,
            grade: parseInt(grade),
            academicYear,
        }).returning();

        return NextResponse.json(newClass, { status: 201 });
    } catch (error) {
        console.error('Error creating class:', error);
        return NextResponse.json(
            { error: 'Failed to create class' },
            { status: 500 }
        );
    }
}
