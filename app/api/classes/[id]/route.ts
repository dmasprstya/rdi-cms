import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/db';
import { classes } from '@/db/schema';
import { eq } from 'drizzle-orm';

// GET /api/classes/[id] - Get class details
export async function GET(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await auth();

        if (!session || (session.user.role !== 'admin' && session.user.role !== 'staff')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const [classData] = await db
            .select()
            .from(classes)
            .where(eq(classes.id, params.id))
            .limit(1);

        if (!classData) {
            return NextResponse.json({ error: 'Class not found' }, { status: 404 });
        }

        return NextResponse.json(classData);
    } catch (error) {
        console.error('Error fetching class:', error);
        return NextResponse.json(
            { error: 'Failed to fetch class' },
            { status: 500 }
        );
    }
}

// PUT /api/classes/[id] - Update class
export async function PUT(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await auth();

        if (!session || (session.user.role !== 'admin' && session.user.role !== 'staff')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { name, academicYear } = body;

        if (!name || !academicYear) {
            return NextResponse.json(
                { error: 'Name and academic year are required' },
                { status: 400 }
            );
        }

        const [updatedClass] = await db
            .update(classes)
            .set({
                name,
                academicYear,
            })
            .where(eq(classes.id, params.id))
            .returning();

        if (!updatedClass) {
            return NextResponse.json({ error: 'Class not found' }, { status: 404 });
        }

        return NextResponse.json(updatedClass);
    } catch (error) {
        console.error('Error updating class:', error);
        return NextResponse.json(
            { error: 'Failed to update class' },
            { status: 500 }
        );
    }
}

// DELETE /api/classes/[id] - Delete class
export async function DELETE(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await auth();

        if (!session || (session.user.role !== 'admin' && session.user.role !== 'staff')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const [deletedClass] = await db
            .delete(classes)
            .where(eq(classes.id, params.id))
            .returning();

        if (!deletedClass) {
            return NextResponse.json({ error: 'Class not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting class:', error);
        return NextResponse.json(
            { error: 'Failed to delete class' },
            { status: 500 }
        );
    }
}
