import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/db';
import { classes } from '@/db/schema';

export const dynamic = 'force-dynamic';

// GET /api/staff/classes - Get all classes (read-only for staff)
export async function GET(req: NextRequest) {
    try {
        const session = await auth();

        if (!session || !['staff', 'admin'].includes(session.user.role)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const allClasses = await db
            .select()
            .from(classes)
            .orderBy(classes.name);

        return NextResponse.json(allClasses);
    } catch (error) {
        console.error('Error fetching classes:', error);
        return NextResponse.json(
            { error: 'Failed to fetch classes' },
            { status: 500 }
        );
    }
}
