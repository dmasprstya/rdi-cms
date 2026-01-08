import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/db';
import { modules, teachers, subjects, classes } from '@/db/schema';
import { eq, and } from 'drizzle-orm';

// GET /api/guru/modules - List modules created by logged-in teacher
export async function GET(req: NextRequest) {
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

        // Get all modules created by this teacher with subject and class info
        const teacherModules = await db
            .select({
                id: modules.id,
                title: modules.title,
                description: modules.description,
                content: modules.content,
                fileUrl: modules.fileUrl,
                subjectId: modules.subjectId,
                classId: modules.classId,
                isPublished: modules.isPublished,
                createdAt: modules.createdAt,
                updatedAt: modules.updatedAt,
                subjectName: subjects.name,
                subjectCode: subjects.code,
                className: classes.name,
            })
            .from(modules)
            .leftJoin(subjects, eq(modules.subjectId, subjects.id))
            .leftJoin(classes, eq(modules.classId, classes.id))
            .where(eq(modules.teacherId, teacher.id))
            .orderBy(modules.createdAt);

        return NextResponse.json(teacherModules);
    } catch (error) {
        console.error('Error fetching guru modules:', error);
        return NextResponse.json(
            { error: 'Failed to fetch modules' },
            { status: 500 }
        );
    }
}

// POST /api/guru/modules - Create a new module (auto-assign teacherId)
export async function POST(req: NextRequest) {
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

        // Create module with auto-assigned teacherId
        const [newModule] = await db.insert(modules).values({
            title,
            description: description || null,
            content: content || null,
            fileUrl: fileUrl || null,
            subjectId,
            classId: classId || null,
            teacherId: teacher.id, // Auto-assign
            isPublished: isPublished ?? true,
        }).returning();

        return NextResponse.json(newModule, { status: 201 });
    } catch (error) {
        console.error('Error creating module:', error);
        return NextResponse.json(
            { error: 'Failed to create module' },
            { status: 500 }
        );
    }
}
