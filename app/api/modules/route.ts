import { NextResponse } from 'next/server';
import { db } from '@/db';
import { modules, classes, subjects, teachers, users } from '@/db/schema';
import { eq, desc, and } from 'drizzle-orm';
import { auth } from '@/auth';

// GET all modules (admin only)
export async function GET() {
    try {
        const session = await auth();

        if (!session?.user || session.user.role !== 'admin') {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const allModules = await db
            .select({
                id: modules.id,
                title: modules.title,
                description: modules.description,
                content: modules.content,
                fileUrl: modules.fileUrl,
                subjectId: modules.subjectId,
                classId: modules.classId,
                teacherId: modules.teacherId,
                isPublished: modules.isPublished,
                createdAt: modules.createdAt,
                updatedAt: modules.updatedAt,
                subjectName: subjects.name,
                subjectCode: subjects.code,
                className: classes.name,
                classGrade: classes.grade,
                teacherName: users.name,
            })
            .from(modules)
            .leftJoin(subjects, eq(modules.subjectId, subjects.id))
            .leftJoin(classes, eq(modules.classId, classes.id))
            .leftJoin(teachers, eq(modules.teacherId, teachers.id))
            .leftJoin(users, eq(teachers.userId, users.id))
            .orderBy(desc(modules.createdAt));

        return NextResponse.json(allModules);
    } catch (error) {
        console.error('Error fetching modules:', error);
        return NextResponse.json(
            { error: 'Failed to fetch modules' },
            { status: 500 }
        );
    }
}

// POST create new module (admin only)
export async function POST(request: Request) {
    try {
        const session = await auth();

        if (!session?.user || session.user.role !== 'admin') {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const body = await request.json();
        const { title, description, content, fileUrl, subjectId, classId, teacherId, isPublished } = body;

        // Validation
        if (!title || !subjectId || !teacherId) {
            return NextResponse.json(
                { error: 'Title, subject, and teacher are required' },
                { status: 400 }
            );
        }

        const [newModule] = await db
            .insert(modules)
            .values({
                title,
                description: description || null,
                content: content || null,
                fileUrl: fileUrl || null,
                subjectId,
                classId: classId || null,
                teacherId,
                isPublished: isPublished ?? true,
            })
            .returning();

        return NextResponse.json(newModule, { status: 201 });
    } catch (error) {
        console.error('Error creating module:', error);
        return NextResponse.json(
            { error: 'Failed to create module' },
            { status: 500 }
        );
    }
}

// PATCH update module (admin only)
export async function PATCH(request: Request) {
    try {
        const session = await auth();

        if (!session?.user || session.user.role !== 'admin') {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const body = await request.json();
        const { id, title, description, content, fileUrl, subjectId, classId, teacherId, isPublished } = body;

        if (!id) {
            return NextResponse.json(
                { error: 'Module ID is required' },
                { status: 400 }
            );
        }

        const [updatedModule] = await db
            .update(modules)
            .set({
                title,
                description,
                content,
                fileUrl,
                subjectId,
                classId: classId || null,
                teacherId,
                isPublished,
                updatedAt: new Date(),
            })
            .where(eq(modules.id, id))
            .returning();

        if (!updatedModule) {
            return NextResponse.json(
                { error: 'Module not found' },
                { status: 404 }
            );
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

// DELETE module (admin only)
export async function DELETE(request: Request) {
    try {
        const session = await auth();

        if (!session?.user || session.user.role !== 'admin') {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json(
                { error: 'Module ID is required' },
                { status: 400 }
            );
        }

        await db.delete(modules).where(eq(modules.id, id));

        return NextResponse.json({ message: 'Module deleted successfully' });
    } catch (error) {
        console.error('Error deleting module:', error);
        return NextResponse.json(
            { error: 'Failed to delete module' },
            { status: 500 }
        );
    }
}
