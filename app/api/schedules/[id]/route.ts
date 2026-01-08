import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/db';
import { schedules } from '@/db/schema';
import { eq } from 'drizzle-orm';

// GET /api/schedules/[id] - Get single schedule
export async function GET(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await auth();

        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const schedule = await db.query.schedules.findFirst({
            where: eq(schedules.id, params.id),
            with: {
                class: true,
                subject: true,
                teacher: {
                    with: {
                        user: true,
                    }
                }
            }
        });

        if (!schedule) {
            return NextResponse.json(
                { error: 'Schedule not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(schedule);
    } catch (error) {
        console.error('Error fetching schedule:', error);
        return NextResponse.json(
            { error: 'Failed to fetch schedule' },
            { status: 500 }
        );
    }
}
