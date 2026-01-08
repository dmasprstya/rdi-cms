import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/db';
import { announcements } from '@/db/schema';
import { eq, and } from 'drizzle-orm';

// GET /api/guru/announcements/[id] - Get announcement details (ensure teacher owns it)
export async function GET(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await auth();

        if (!session || session.user.role !== 'guru') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const [announcement] = await db
            .select()
            .from(announcements)
            .where(
                and(
                    eq(announcements.id, params.id),
                    eq(announcements.authorId, session.user.id)
                )
            )
            .limit(1);

        if (!announcement) {
            return NextResponse.json({ error: 'Announcement not found or access denied' }, { status: 404 });
        }

        return NextResponse.json(announcement);
    } catch (error) {
        console.error('Error fetching announcement:', error);
        return NextResponse.json(
            { error: 'Failed to fetch announcement' },
            { status: 500 }
        );
    }
}

// PUT /api/guru/announcements/[id] - Update announcement (ensure teacher owns it)
export async function PUT(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
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

        const [updatedAnnouncement] = await db
            .update(announcements)
            .set({
                title,
                content,
                isActive: isActive ?? true,
                updatedAt: new Date(),
            })
            .where(
                and(
                    eq(announcements.id, params.id),
                    eq(announcements.authorId, session.user.id)
                )
            )
            .returning();

        if (!updatedAnnouncement) {
            return NextResponse.json({ error: 'Announcement not found or access denied' }, { status: 404 });
        }

        return NextResponse.json(updatedAnnouncement);
    } catch (error) {
        console.error('Error updating announcement:', error);
        return NextResponse.json(
            { error: 'Failed to update announcement' },
            { status: 500 }
        );
    }
}

// DELETE /api/guru/announcements/[id] - Delete announcement (ensure teacher owns it)
export async function DELETE(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await auth();

        if (!session || session.user.role !== 'guru') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const [deletedAnnouncement] = await db
            .delete(announcements)
            .where(
                and(
                    eq(announcements.id, params.id),
                    eq(announcements.authorId, session.user.id)
                )
            )
            .returning();

        if (!deletedAnnouncement) {
            return NextResponse.json({ error: 'Announcement not found or access denied' }, { status: 404 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting announcement:', error);
        return NextResponse.json(
            { error: 'Failed to delete announcement' },
            { status: 500 }
        );
    }
}
