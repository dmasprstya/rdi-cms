import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/db';
import { subjects } from '@/db/schema';

export const dynamic = 'force-dynamic';

// GET /api/staff/subjects - Get all subjects (read-only for staff)
export async function GET(req: NextRequest) {
    try {
        const session = await auth();

        if (!session || !['staff', 'admin'].includes(session.user.role)) {
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
