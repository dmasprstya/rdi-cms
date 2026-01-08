import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/db';
import { announcements } from '@/db/schema';
import { eq, and } from 'drizzle-orm';

// GET /api/guru/announcements - List announcements created by logged-in teacher
export async function GET(req: NextRequest) {
    try {
        const session = await auth();

        if (!session || session.user.role !== 'guru') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Get announcements created by this user (teacher)
        const userAnnouncements = await db
            .select()
            .from(announcements)
            .where(eq(announcements.authorId, session.user.id))
            .orderBy(announcements.createdAt);

        return NextResponse.json(userAnnouncements);
    } catch (error) {
        console.error('Error fetching guru announcements:', error);
        return NextResponse.json(
            { error: 'Failed to fetch announcements' },
            { status: 500 }
        );
    }
}

// POST /api/guru/announcements - Create a new announcement
export async function POST(req: NextRequest) {
    try {
        const session = await auth();

        if (!session || session.user.role !== 'guru') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { title, content, isActive, targetRole } = body;

        if (!title || !content) {
            return NextResponse.json(
                { error: 'Title and content are required' },
                { status: 400 }
            );
        }

        // Create announcement with auto-assigned authorId
        const [newAnnouncement] = await db.insert(announcements).values({
            title,
            content,
            authorId: session.user.id,
            isActive: isActive ?? true,
        }).returning();

        return NextResponse.json(newAnnouncement, { status: 201 });
    } catch (error) {
        console.error('Error creating announcement:', error);
        return NextResponse.json(
            { error: 'Failed to create announcement' },
            { status: 500 }
        );
    }
}
