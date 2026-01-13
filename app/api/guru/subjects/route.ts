import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/db';
import { subjects, kelasMataPelajaran, modules, grades, schedules } from '@/db/schema';
import { eq, and, sql } from 'drizzle-orm';

// Validation helper
function validateSubjectData(data: any): { valid: boolean; errors: Record<string, string> } {
    const errors: Record<string, string> = {};

    // Trim and clean inputs
    const cleanName = data.name?.trim() || '';
    const cleanCode = data.code?.trim().toUpperCase() || '';
    const cleanDescription = data.description?.trim() || '';

    // Name validation
    if (cleanName.length === 0) {
        errors.name = 'Nama mata pelajaran wajib diisi';
    } else if (cleanName.length > 100) {
        errors.name = 'Nama maksimal 100 karakter';
    }

    // Code validation
    if (cleanCode.length === 0) {
        errors.code = 'Kode mata pelajaran wajib diisi';
    } else if (!/^[A-Z0-9_-]+$/.test(cleanCode)) {
        errors.code = 'Kode hanya boleh huruf, angka, dash, dan underscore';
    } else if (cleanCode.length > 20) {
        errors.code = 'Kode maksimal 20 karakter';
    }

    // Credits validation
    const credits = parseInt(data.credits);
    if (isNaN(credits) || credits < 1 || credits > 8) {
        errors.credits = 'SKS harus antara 1-8';
    }

    // Description validation
    if (cleanDescription.length > 500) {
        errors.description = 'Deskripsi maksimal 500 karakter';
    }

    return {
        valid: Object.keys(errors).length === 0,
        errors
    };
}

// GET /api/guru/subjects - Get all subjects
export async function GET(req: NextRequest) {
    try {
        const session = await auth();

        if (!session || session.user.role !== 'guru') {
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

// POST /api/guru/subjects - Create new subject
export async function POST(req: NextRequest) {
    try {
        const session = await auth();

        if (!session || session.user.role !== 'guru') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();

        // Validate input
        const validation = validateSubjectData(body);
        if (!validation.valid) {
            return NextResponse.json(
                { error: 'Validation failed', errors: validation.errors },
                { status: 400 }
            );
        }

        // Sanitize data
        const sanitizedData = {
            name: body.name.trim(),
            code: body.code.trim().toUpperCase(),
            credits: parseInt(body.credits),
            description: body.description?.trim() || null,
        };

        // Check for duplicate code (already uppercased in sanitization)
        const existingSubject = await db
            .select()
            .from(subjects)
            .where(eq(subjects.code, sanitizedData.code))
            .limit(1);

        if (existingSubject.length > 0) {
            return NextResponse.json(
                { error: 'Duplicate code', message: 'Kode mata pelajaran sudah digunakan' },
                { status: 409 }
            );
        }

        // Create subject
        const [newSubject] = await db
            .insert(subjects)
            .values(sanitizedData)
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

// PUT /api/guru/subjects - Update existing subject
export async function PUT(req: NextRequest) {
    try {
        const session = await auth();

        if (!session || session.user.role !== 'guru') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();

        if (!body.id) {
            return NextResponse.json(
                { error: 'Subject ID is required' },
                { status: 400 }
            );
        }

        // Validate input
        const validation = validateSubjectData(body);
        if (!validation.valid) {
            return NextResponse.json(
                { error: 'Validation failed', errors: validation.errors },
                { status: 400 }
            );
        }

        // Check if subject exists
        const existingSubject = await db
            .select()
            .from(subjects)
            .where(eq(subjects.id, body.id))
            .limit(1);

        if (existingSubject.length === 0) {
            return NextResponse.json(
                { error: 'Subject not found' },
                { status: 404 }
            );
        }

        // Sanitize data
        const sanitizedData = {
            name: body.name.trim(),
            code: body.code.trim().toUpperCase(),
            credits: parseInt(body.credits),
            description: body.description?.trim() || null,
        };

        // Check for duplicate code (excluding current subject)
        const duplicateSubject = await db
            .select()
            .from(subjects)
            .where(
                and(
                    eq(subjects.code, sanitizedData.code),
                    sql`${subjects.id} != ${body.id}`
                )
            )
            .limit(1);

        if (duplicateSubject.length > 0) {
            return NextResponse.json(
                { error: 'Duplicate code', message: 'Kode mata pelajaran sudah digunakan' },
                { status: 409 }
            );
        }

        // Check for related data counts
        const relatedDataQuery = await db.execute(sql`
            SELECT
                (SELECT COUNT(*) FROM kelas_mata_pelajaran WHERE subject_id = ${body.id}) as class_count,
                (SELECT COUNT(*) FROM modules WHERE subject_id = ${body.id}) as module_count,
                (SELECT COUNT(*) FROM grades WHERE subject_id = ${body.id}) as grade_count,
                (SELECT COUNT(*) FROM schedules WHERE subject_id = ${body.id}) as schedule_count
        `);

        const counts = (relatedDataQuery as any)[0] || (relatedDataQuery as any).rows?.[0];
        const relatedDataCount = {
            classes: parseInt(counts.class_count),
            modules: parseInt(counts.module_count),
            grades: parseInt(counts.grade_count),
            schedules: parseInt(counts.schedule_count),
        };

        // Update subject
        const [updatedSubject] = await db
            .update(subjects)
            .set(sanitizedData)
            .where(eq(subjects.id, body.id))
            .returning();

        return NextResponse.json({
            ...updatedSubject,
            relatedDataCount
        });
    } catch (error) {
        console.error('Error updating subject:', error);
        return NextResponse.json(
            { error: 'Failed to update subject' },
            { status: 500 }
        );
    }
}

// DELETE /api/guru/subjects - Delete subject
export async function DELETE(req: NextRequest) {
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

        // Re-check for related data (handle race condition)
        const hasRelatedDataQuery = await db.execute(sql`
            SELECT EXISTS(
                SELECT 1 FROM kelas_mata_pelajaran WHERE subject_id = ${id}
                UNION ALL
                SELECT 1 FROM modules WHERE subject_id = ${id}
                UNION ALL
                SELECT 1 FROM grades WHERE subject_id = ${id}
                UNION ALL
                SELECT 1 FROM schedules WHERE subject_id = ${id}
                LIMIT 1
            ) as has_related_data
        `);

        const hasRelatedData = ((hasRelatedDataQuery as any)[0] || (hasRelatedDataQuery as any).rows?.[0])?.has_related_data;

        if (hasRelatedData) {
            // Get detailed counts for error message
            const countsQuery = await db.execute(sql`
                SELECT
                    (SELECT COUNT(*) FROM kelas_mata_pelajaran WHERE subject_id = ${id}) as class_count,
                    (SELECT COUNT(*) FROM modules WHERE subject_id = ${id}) as module_count,
                    (SELECT COUNT(*) FROM grades WHERE subject_id = ${id}) as grade_count,
                    (SELECT COUNT(*) FROM schedules WHERE subject_id = ${id}) as schedule_count
            `);

            const counts = (countsQuery as any)[0] || (countsQuery as any).rows?.[0];

            return NextResponse.json(
                {
                    error: 'Cannot delete subject',
                    message: 'Mata pelajaran ini masih digunakan dan tidak dapat dihapus',
                    details: {
                        classCount: parseInt(counts.class_count),
                        moduleCount: parseInt(counts.module_count),
                        gradeCount: parseInt(counts.grade_count),
                        scheduleCount: parseInt(counts.schedule_count),
                    },
                    suggestion: 'Hapus semua data terkait terlebih dahulu, atau hubungi admin untuk arsip mata pelajaran ini',
                },
                { status: 409 }
            );
        }

        // Delete subject
        await db.delete(subjects).where(eq(subjects.id, id));

        return NextResponse.json({ message: 'Subject deleted successfully' });
    } catch (error) {
        console.error('Error deleting subject:', error);
        return NextResponse.json(
            { error: 'Failed to delete subject' },
            { status: 500 }
        );
    }
}
