import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/db';
import { modules, teachers, students } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { readFile } from 'fs/promises';
import { getFilePathFromId } from '@/lib/file-utils';

export async function GET(
    req: NextRequest,
    { params }: { params: { fileId: string } }
) {
    try {
        // 1. Authentication check
        const session = await auth();
        if (!session) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const fileId = params.fileId;

        // 2. Find module with this file
        const moduleRecord = await db
            .select()
            .from(modules)
            .where(eq(modules.fileUrl, `/api/guru/files/${fileId}`))
            .limit(1);

        if (!moduleRecord || moduleRecord.length === 0) {
            return NextResponse.json(
                { error: 'File not found' },
                { status: 404 }
            );
        }

        const moduleData = moduleRecord[0];

        // 3. Access control check
        let hasAccess = false;

        if (session.user.role === 'guru') {
            // Check if user is the teacher who created this module
            const [teacher] = await db
                .select()
                .from(teachers)
                .where(eq(teachers.userId, session.user.id))
                .limit(1);

            if (teacher && teacher.id === moduleData.teacherId) {
                hasAccess = true;
            }
        } else if (session.user.role === 'student') {
            // Check if student is enrolled in the class
            const [student] = await db
                .select()
                .from(students)
                .where(eq(students.userId, session.user.id))
                .limit(1);

            if (student) {
                // If module is for specific class, check enrollment
                if (moduleData.classId) {
                    hasAccess = student.classId === moduleData.classId;
                } else {
                    // Module is for all classes, allow access
                    hasAccess = true;
                }
            }
        } else if (session.user.role === 'admin') {
            // Admin has full access
            hasAccess = true;
        }

        if (!hasAccess) {
            return NextResponse.json(
                { error: 'Access denied' },
                { status: 403 }
            );
        }

        // 4. Read and serve file
        const filePath = getFilePathFromId(fileId);
        const fileBuffer = await readFile(filePath);

        // 5. Return file with proper headers
        return new NextResponse(fileBuffer, {
            status: 200,
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `inline; filename="${moduleData.fileName || fileId}"`,
                'Cache-Control': 'private, max-age=3600',
            },
        });
    } catch (error: any) {
        console.error('Error serving file:', error);

        if (error.code === 'ENOENT') {
            return NextResponse.json(
                { error: 'File not found on server' },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { error: 'Failed to serve file' },
            { status: 500 }
        );
    }
}
