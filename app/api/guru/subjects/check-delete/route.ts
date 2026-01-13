import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/db';
import { subjects } from '@/db/schema';
import { eq, sql } from 'drizzle-orm';

// GET /api/guru/subjects/check-delete - Check if subject can be deleted
export async function GET(req: NextRequest) {
    try {
        const session = await auth();

        if (!session || session.user.role !== 'guru') {
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
        const existingSubject = await db
            .select()
            .from(subjects)
            .where(eq(subjects.id, id))
            .limit(1);

        if (existingSubject.length === 0) {
            return NextResponse.json(
                { error: 'Subject not found' },
                { status: 404 }
            );
        }

        // Optimized query: Use EXISTS to check, then COUNT only if exists
        const checkQuery = await db.execute(sql`
            SELECT
                EXISTS(SELECT 1 FROM kelas_mata_pelajaran WHERE subject_id = ${id}) as has_classes,
                EXISTS(SELECT 1 FROM modules WHERE subject_id = ${id}) as has_modules,
                EXISTS(SELECT 1 FROM grades WHERE subject_id = ${id}) as has_grades,
                EXISTS(SELECT 1 FROM schedules WHERE subject_id = ${id}) as has_schedules,
                CASE WHEN EXISTS(SELECT 1 FROM kelas_mata_pelajaran WHERE subject_id = ${id})
                    THEN (SELECT COUNT(*) FROM kelas_mata_pelajaran WHERE subject_id = ${id})
                    ELSE 0 END as class_count,
                CASE WHEN EXISTS(SELECT 1 FROM modules WHERE subject_id = ${id})
                    THEN (SELECT COUNT(*) FROM modules WHERE subject_id = ${id})
                    ELSE 0 END as module_count,
                CASE WHEN EXISTS(SELECT 1 FROM grades WHERE subject_id = ${id})
                    THEN (SELECT COUNT(*) FROM grades WHERE subject_id = ${id})
                    ELSE 0 END as grade_count,
                CASE WHEN EXISTS(SELECT 1 FROM schedules WHERE subject_id = ${id})
                    THEN (SELECT COUNT(*) FROM schedules WHERE subject_id = ${id})
                    ELSE 0 END as schedule_count
        `);

        const result = (checkQuery as any)[0] || (checkQuery as any).rows?.[0];

        const hasRelatedData = result.has_classes || result.has_modules || result.has_grades || result.has_schedules;

        return NextResponse.json({
            canDelete: !hasRelatedData,
            details: {
                classCount: parseInt(result.class_count),
                moduleCount: parseInt(result.module_count),
                gradeCount: parseInt(result.grade_count),
                scheduleCount: parseInt(result.schedule_count),
            },
        });
    } catch (error) {
        console.error('Error checking subject delete:', error);
        return NextResponse.json(
            { error: 'Failed to check subject' },
            { status: 500 }
        );
    }
}
