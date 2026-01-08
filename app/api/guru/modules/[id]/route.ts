import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/db';
import { modules, teachers } from '@/db/schema';
import { eq, and } from 'drizzle-orm';

// GET /api/guru/modules/[id] - Get module details (ensure teacher owns it)
export async function GET(
    req: NextRequest,
    { params }: { params: { id: string } }
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

        // Get module and verify ownership
        const [module] = await db
            .select()
            .from(modules)
            .where(
                and(
                    eq(modules.id, params.id),
                    eq(modules.teacherId, teacher.id)
                )
            )
            .limit(1);

        if (!module) {
            return NextResponse.json({ error: 'Module not found or access denied' }, { status: 404 });
        }

        return NextResponse.json(module);
    } catch (error) {
        console.error('Error fetching module:', error);
        return NextResponse.json(
            { error: 'Failed to fetch module' },
            { status: 500 }
        );
    }
}

// PUT /api/guru/modules/[id] - Update module (ensure teacher owns it)
export async function PUT(
    req: NextRequest,
    { params }: { params: { id: string } }
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

        const body = await req.json();
        const { title, description, content, fileUrl, subjectId, classId, isPublished } = body;

        if (!title || !subjectId) {
            return NextResponse.json(
                { error: 'Title and subject are required' },
                { status: 400 }
            );
        }

        // Update module (only if teacher owns it)
        const [updatedModule] = await db
            .update(modules)
            .set({
                title,
                description: description || null,
                content: content || null,
                fileUrl: fileUrl || null,
                subjectId,
                classId: classId || null,
                isPublished: isPublished ?? true,
                updatedAt: new Date(),
            })
            .where(
                and(
                    eq(modules.id, params.id),
                    eq(modules.teacherId, teacher.id)
                )
            )
            .returning();

        if (!updatedModule) {
            return NextResponse.json({ error: 'Module not found or access denied' }, { status: 404 });
        }

        return NextResponse.json(updatedModule);
    } catch (error) {
        console.error('Error updating module:', error);
        return NextResponse.json(
            { error: 'Failed to update module' },
            { status: 500 }
        );
    }
}

// DELETE /api/guru/modules/[id] - Delete module (ensure teacher owns it)
export async function DELETE(
    req: NextRequest,
    { params }: { params: { id: string } }
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

        // Delete module (only if teacher owns it)
        const [deletedModule] = await db
            .delete(modules)
            .where(
                and(
                    eq(modules.id, params.id),
                    eq(modules.teacherId, teacher.id)
                )
            )
            .returning();

        if (!deletedModule) {
            return NextResponse.json({ error: 'Module not found or access denied' }, { status: 404 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting module:', error);
        return NextResponse.json(
            { error: 'Failed to delete module' },
            { status: 500 }
        );
    }
}
