import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/db';
import { kelasMataPelajaran, classes, subjects } from '@/db/schema';
import { eq, and } from 'drizzle-orm';

// GET /api/kelas-mata-pelajaran - Get all class-subject assignments
export async function GET(req: NextRequest) {
    try {
        const session = await auth();

        if (!session || (session.user.role !== 'admin' && session.user.role !== 'staff')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const assignments = await db
            .select({
                id: kelasMataPelajaran.id,
                classId: kelasMataPelajaran.classId,
                subjectId: kelasMataPelajaran.subjectId,
                className: classes.name,
                classGrade: classes.grade,
                classAcademicYear: classes.academicYear,
                subjectName: subjects.name,
                subjectCode: subjects.code,
                createdAt: kelasMataPelajaran.createdAt,
            })
            .from(kelasMataPelajaran)
            .innerJoin(classes, eq(kelasMataPelajaran.classId, classes.id))
            .innerJoin(subjects, eq(kelasMataPelajaran.subjectId, subjects.id))
            .orderBy(classes.grade, classes.name, subjects.name);

        return NextResponse.json(assignments);
    } catch (error) {
        console.error('Error fetching assignments:', error);
        return NextResponse.json(
            { error: 'Failed to fetch assignments' },
            { status: 500 }
        );
    }
}

// POST /api/kelas-mata-pelajaran - Create new assignment
export async function POST(req: NextRequest) {
    try {
        const session = await auth();

        if (!session || (session.user.role !== 'admin' && session.user.role !== 'staff')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { classId, subjectId } = body;

        if (!classId || !subjectId) {
            return NextResponse.json(
                { error: 'Class and subject are required' },
                { status: 400 }
            );
        }

        // Validate foreign keys
        const [classData] = await db
            .select()
            .from(classes)
            .where(eq(classes.id, classId))
            .limit(1);

        if (!classData) {
            return NextResponse.json(
                { error: 'Class not found' },
                { status: 400 }
            );
        }

        const [subject] = await db
            .select()
            .from(subjects)
            .where(eq(subjects.id, subjectId))
            .limit(1);

        if (!subject) {
            return NextResponse.json(
                { error: 'Subject not found' },
                { status: 400 }
            );
        }

        // Check if assignment already exists
        const [existing] = await db
            .select()
            .from(kelasMataPelajaran)
            .where(
                and(
                    eq(kelasMataPelajaran.classId, classId),
                    eq(kelasMataPelajaran.subjectId, subjectId)
                )
            )
            .limit(1);

        if (existing) {
            return NextResponse.json(
                { error: 'This subject is already assigned to this class' },
                { status: 400 }
            );
        }

        const [newAssignment] = await db.insert(kelasMataPelajaran).values({
            classId,
            subjectId,
        }).returning();

        return NextResponse.json(newAssignment, { status: 201 });
    } catch (error) {
        console.error('Error creating assignment:', error);
        return NextResponse.json(
            { error: 'Failed to create assignment' },
            { status: 500 }
        );
    }
}

// DELETE /api/kelas-mata-pelajaran - Delete assignment
export async function DELETE(req: NextRequest) {
    try {
        const session = await auth();

        if (!session || (session.user.role !== 'admin' && session.user.role !== 'staff')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json(
                { error: 'Assignment ID is required' },
                { status: 400 }
            );
        }

        const [deleted] = await db
            .delete(kelasMataPelajaran)
            .where(eq(kelasMataPelajaran.id, id))
            .returning();

        if (!deleted) {
            return NextResponse.json({ error: 'Assignment not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting assignment:', error);
        return NextResponse.json(
            { error: 'Failed to delete assignment' },
            { status: 500 }
        );
    }
}
