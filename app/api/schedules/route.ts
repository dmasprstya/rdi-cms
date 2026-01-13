import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/db';
import { schedules, classes, subjects, teachers } from '@/db/schema';
import { eq, and } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

// GET /api/schedules - Get all schedules with filters
export async function GET(req: NextRequest) {
    try {
        const session = await auth();

        if (!session || !['admin', 'staff', 'guru'].includes(session.user.role)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const classId = searchParams.get('classId');
        const teacherId = searchParams.get('teacherId');
        const day = searchParams.get('day');

        // Build query conditions
        const conditions = [];
        if (classId) conditions.push(eq(schedules.classId, classId));
        if (teacherId) conditions.push(eq(schedules.teacherId, teacherId));
        if (day) conditions.push(eq(schedules.day, day as any));

        const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

        // Fetch schedules with related data
        const allSchedules = await db.query.schedules.findMany({
            where: whereClause,
            with: {
                class: {
                    columns: {
                        id: true,
                        name: true,
                    }
                },
                subject: {
                    columns: {
                        id: true,
                        name: true,
                        code: true,
                    }
                },
                teacher: {
                    columns: {
                        id: true,
                        nip: true,
                        subject: true,
                    },
                    with: {
                        user: {
                            columns: {
                                name: true,
                            }
                        }
                    }
                }
            },
            orderBy: (schedules, { asc }) => [
                asc(schedules.day),
                asc(schedules.startTime)
            ]
        });

        return NextResponse.json(allSchedules);
    } catch (error) {
        console.error('Error fetching schedules:', error);
        return NextResponse.json(
            { error: 'Failed to fetch schedules' },
            { status: 500 }
        );
    }
}

// POST /api/schedules - Create new schedule
export async function POST(req: NextRequest) {
    try {
        const session = await auth();

        if (!session || !['admin', 'staff'].includes(session.user.role)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { classId, subjectId, teacherId, day, startTime, endTime, room } = body;

        // Validation
        if (!classId || !subjectId || !teacherId || !day || !startTime || !endTime) {
            return NextResponse.json(
                { error: 'All fields except room are required' },
                { status: 400 }
            );
        }

        // Validate day of week
        const validDays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
        if (!validDays.includes(day.toLowerCase())) {
            return NextResponse.json(
                { error: 'Invalid day of week' },
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

        const [teacher] = await db
            .select()
            .from(teachers)
            .where(eq(teachers.id, teacherId))
            .limit(1);

        if (!teacher) {
            return NextResponse.json(
                { error: 'Teacher not found' },
                { status: 400 }
            );
        }

        // Check for time conflicts for the class
        const conflicts = await db
            .select()
            .from(schedules)
            .where(
                and(
                    eq(schedules.classId, classId),
                    eq(schedules.day, day.toLowerCase() as any)
                )
            );

        // Simple time overlap check
        for (const conflict of conflicts) {
            if (
                (startTime >= conflict.startTime && startTime < conflict.endTime) ||
                (endTime > conflict.startTime && endTime <= conflict.endTime) ||
                (startTime <= conflict.startTime && endTime >= conflict.endTime)
            ) {
                return NextResponse.json(
                    {
                        error: 'Time conflict detected for this class',
                        conflictWith: conflict
                    },
                    { status: 400 }
                );
            }
        }

        // Create schedule
        const [newSchedule] = await db
            .insert(schedules)
            .values({
                classId,
                subjectId,
                teacherId,
                day: day.toLowerCase() as any,
                startTime,
                endTime,
                room: room || null,
            })
            .returning();

        return NextResponse.json(newSchedule, { status: 201 });
    } catch (error) {
        console.error('Error creating schedule:', error);
        return NextResponse.json(
            { error: 'Failed to create schedule' },
            { status: 500 }
        );
    }
}

// PUT /api/schedules - Update schedule
export async function PUT(req: NextRequest) {
    try {
        const session = await auth();

        if (!session || !['admin', 'staff'].includes(session.user.role)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { id, classId, subjectId, teacherId, day, startTime, endTime, room } = body;

        if (!id) {
            return NextResponse.json(
                { error: 'Schedule ID is required' },
                { status: 400 }
            );
        }

        // Check if schedule exists
        const [existing] = await db
            .select()
            .from(schedules)
            .where(eq(schedules.id, id))
            .limit(1);

        if (!existing) {
            return NextResponse.json(
                { error: 'Schedule not found' },
                { status: 404 }
            );
        }

        // If changing time/day, check for conflicts
        if (day || startTime || endTime) {
            const finalDay = day ? day.toLowerCase() : existing.day;
            const finalStart = startTime || existing.startTime;
            const finalEnd = endTime || existing.endTime;
            const finalClass = classId || existing.classId;

            const conflicts = await db
                .select()
                .from(schedules)
                .where(
                    and(
                        eq(schedules.classId, finalClass),
                        eq(schedules.day, finalDay as any)
                    )
                );

            for (const conflict of conflicts) {
                // Skip self
                if (conflict.id === id) continue;

                if (
                    (finalStart >= conflict.startTime && finalStart < conflict.endTime) ||
                    (finalEnd > conflict.startTime && finalEnd <= conflict.endTime) ||
                    (finalStart <= conflict.startTime && finalEnd >= conflict.endTime)
                ) {
                    return NextResponse.json(
                        {
                            error: 'Time conflict detected',
                            conflictWith: conflict
                        },
                        { status: 400 }
                    );
                }
            }
        }

        // Update schedule
        const updateData: any = {
            classId: classId || existing.classId,
            subjectId: subjectId || existing.subjectId,
            teacherId: teacherId || existing.teacherId,
            day: day ? day.toLowerCase() : existing.day,
            startTime: startTime || existing.startTime,
            endTime: endTime || existing.endTime,
            room: room !== undefined ? room : existing.room,
        };

        const [updated] = await db
            .update(schedules)
            .set(updateData)
            .where(eq(schedules.id, id))
            .returning();

        return NextResponse.json(updated);
    } catch (error) {
        console.error('Error updating schedule:', error);
        return NextResponse.json(
            { error: 'Failed to update schedule' },
            { status: 500 }
        );
    }
}

// DELETE /api/schedules - Delete schedule
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
                { error: 'Schedule ID is required' },
                { status: 400 }
            );
        }

        // Check if schedule exists
        const [existing] = await db
            .select()
            .from(schedules)
            .where(eq(schedules.id, id))
            .limit(1);

        if (!existing) {
            return NextResponse.json(
                { error: 'Schedule not found' },
                { status: 404 }
            );
        }

        // Delete schedule
        await db.delete(schedules).where(eq(schedules.id, id));

        return NextResponse.json({
            success: true,
            message: 'Schedule deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting schedule:', error);
        return NextResponse.json(
            { error: 'Failed to delete schedule' },
            { status: 500 }
        );
    }
}
