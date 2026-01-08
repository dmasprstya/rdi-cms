import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/db';
import { subjects, modules, grades } from '@/db/schema';
import { eq, sql } from 'drizzle-orm';

// GET /api/subjects - Get all subjects
export async function GET(req: NextRequest) {
    try {
        const session = await auth();

        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const allSubjects = await db
            .select()
            .from(subjects)
            .orderBy(subjects.name);

        return NextResponse.json(allSubjects);
    } catch (error) {
        console.error('Error fetching subjects:', error);
        return NextResponse.json(
            { error: 'Failed to fetch subjects' },
            { status: 500 }
        );
    }
}

// POST /api/subjects - Create new subject
export async function POST(req: NextRequest) {
    try {
        const session = await auth();

        if (!session || !['admin', 'staff'].includes(session.user.role)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { name, code, description, credits } = body;

        // Validation
        if (!name || !code) {
            return NextResponse.json(
                { error: 'Name and code are required' },
                { status: 400 }
            );
        }

        // Check if code already exists
        const existing = await db
            .select()
            .from(subjects)
            .where(eq(subjects.code, code))
            .limit(1);

        if (existing.length > 0) {
            return NextResponse.json(
                { error: 'Subject code already exists' },
                { status: 400 }
            );
        }

        // Create subject
        const [newSubject] = await db
            .insert(subjects)
            .values({
                name,
                code,
                description: description || null,
                credits: credits || null,
            })
            .returning();

        return NextResponse.json(newSubject, { status: 201 });
    } catch (error) {
        console.error('Error creating subject:', error);
        return NextResponse.json(
            { error: 'Failed to create subject' },
            { status: 500 }
        );
    }
}

// PUT /api/subjects - Update subject
export async function PUT(req: NextRequest) {
    try {
        const session = await auth();

        if (!session || !['admin', 'staff'].includes(session.user.role)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { id, name, code, description, credits } = body;

        if (!id) {
            return NextResponse.json(
                { error: 'Subject ID is required' },
                { status: 400 }
            );
        }

        // Check if subject exists
        const [existing] = await db
            .select()
            .from(subjects)
            .where(eq(subjects.id, id))
            .limit(1);

        if (!existing) {
            return NextResponse.json(
                { error: 'Subject not found' },
                { status: 404 }
            );
        }

        // If code is being changed, check uniqueness
        if (code && code !== existing.code) {
            const [duplicate] = await db
                .select()
                .from(subjects)
                .where(eq(subjects.code, code))
                .limit(1);

            if (duplicate) {
                return NextResponse.json(
                    { error: 'Subject code already exists' },
                    { status: 400 }
                );
            }
        }

        // Update subject
        const [updatedSubject] = await db
            .update(subjects)
            .set({
                name: name || existing.name,
                code: code || existing.code,
                description: description !== undefined ? description : existing.description,
                credits: credits !== undefined ? credits : existing.credits,
            })
            .where(eq(subjects.id, id))
            .returning();

        return NextResponse.json(updatedSubject);
    } catch (error) {
        console.error('Error updating subject:', error);
        return NextResponse.json(
            { error: 'Failed to update subject' },
            { status: 500 }
        );
    }
}

// DELETE /api/subjects - Delete subject
export async function DELETE(req: NextRequest) {
    try {
        const session = await auth();

        if (!session || session.user.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json(
                { error: 'Subject ID is required' },
                { status: 400 }
            );
        }

        // Check if subject exists
        const [existing] = await db
            .select()
            .from(subjects)
            .where(eq(subjects.id, id))
            .limit(1);

        if (!existing) {
            return NextResponse.json(
                { error: 'Subject not found' },
                { status: 404 }
            );
        }

        // Check if subject is being used in modules
        const [moduleCount] = await db
            .select({ count: sql<number>`cast(count(*) as int)` })
            .from(modules)
            .where(eq(modules.subjectId, id));

        if (moduleCount.count > 0) {
            return NextResponse.json(
                {
                    error: 'Cannot delete subject. It is being used in modules.',
                    usedIn: 'modules',
                    count: moduleCount.count
                },
                { status: 400 }
            );
        }

        // Check if subject is being used in grades
        const [gradeCount] = await db
            .select({ count: sql<number>`cast(count(*) as int)` })
            .from(grades)
            .where(eq(grades.subjectId, id));

        if (gradeCount.count > 0) {
            return NextResponse.json(
                {
                    error: 'Cannot delete subject. It has associated grades.',
                    usedIn: 'grades',
                    count: gradeCount.count
                },
                { status: 400 }
            );
        }

        // Safe to delete
        await db.delete(subjects).where(eq(subjects.id, id));

        return NextResponse.json({
            success: true,
            message: 'Subject deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting subject:', error);
        return NextResponse.json(
            { error: 'Failed to delete subject' },
            { status: 500 }
        );
    }
}
