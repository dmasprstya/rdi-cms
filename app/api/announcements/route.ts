import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { announcements, users } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { auth } from '@/auth';

export const dynamic = 'force-dynamic';

// GET - Fetch all announcements
export async function GET() {
    try {
        const session = await auth();
        if (!session) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        // Fetch all announcements with author info, ordered by newest first
        const announcementsData = await db
            .select({
                id: announcements.id,
                title: announcements.title,
                content: announcements.content,
                authorId: announcements.authorId,
                isActive: announcements.isActive,
                createdAt: announcements.createdAt,
                updatedAt: announcements.updatedAt,
                authorName: users.name,
            })
            .from(announcements)
            .leftJoin(users, eq(announcements.authorId, users.id))
            .orderBy(desc(announcements.createdAt));

        return NextResponse.json(announcementsData);
    } catch (error) {
        console.error('Error fetching announcements:', error);
        return NextResponse.json(
            { error: 'Failed to fetch announcements' },
            { status: 500 }
        );
    }
}

// POST - Create new announcement
export async function POST(request: NextRequest) {
    try {
        const session = await auth();
        if (!session || session.user.role !== 'admin') {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const body = await request.json();
        const { title, content, isActive } = body;

        // Validate required fields
        if (!title || !content) {
            return NextResponse.json(
                { error: 'Judul dan konten wajib diisi' },
                { status: 400 }
            );
        }

        // Create announcement
        const [newAnnouncement] = await db
            .insert(announcements)
            .values({
                title,
                content,
                authorId: session.user.id,
                isActive: isActive !== undefined ? isActive : true,
            })
            .returning();

        return NextResponse.json({
            success: true,
            announcement: newAnnouncement
        }, { status: 201 });
    } catch (error) {
        console.error('Error creating announcement:', error);
        return NextResponse.json(
            { error: 'Gagal membuat pengumuman' },
            { status: 500 }
        );
    }
}

// PUT - Update announcement
export async function PUT(request: NextRequest) {
    try {
        const session = await auth();
        if (!session || session.user.role !== 'admin') {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const body = await request.json();
        const { id, title, content, isActive } = body;

        if (!id) {
            return NextResponse.json(
                { error: 'ID pengumuman wajib diisi' },
                { status: 400 }
            );
        }

        // Check if announcement exists
        const existingAnnouncement = await db
            .select()
            .from(announcements)
            .where(eq(announcements.id, id))
            .limit(1);

        if (existingAnnouncement.length === 0) {
            return NextResponse.json(
                { error: 'Pengumuman tidak ditemukan' },
                { status: 404 }
            );
        }

        // Update announcement
        await db
            .update(announcements)
            .set({
                ...(title && { title }),
                ...(content && { content }),
                ...(isActive !== undefined && { isActive }),
                updatedAt: new Date(),
            })
            .where(eq(announcements.id, id));

        return NextResponse.json({
            success: true,
            message: 'Pengumuman berhasil diperbarui'
        });
    } catch (error) {
        console.error('Error updating announcement:', error);
        return NextResponse.json(
            { error: 'Gagal memperbarui pengumuman' },
            { status: 500 }
        );
    }
}

// DELETE - Delete announcement
export async function DELETE(request: NextRequest) {
    try {
        const session = await auth();
        if (!session || session.user.role !== 'admin') {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json(
                { error: 'ID pengumuman wajib diisi' },
                { status: 400 }
            );
        }

        // Check if announcement exists
        const announcement = await db
            .select()
            .from(announcements)
            .where(eq(announcements.id, id))
            .limit(1);

        if (announcement.length === 0) {
            return NextResponse.json(
                { error: 'Pengumuman tidak ditemukan' },
                { status: 404 }
            );
        }

        // Delete announcement
        await db
            .delete(announcements)
            .where(eq(announcements.id, id));

        return NextResponse.json({
            success: true,
            message: 'Pengumuman berhasil dihapus'
        });
    } catch (error) {
        console.error('Error deleting announcement:', error);
        return NextResponse.json(
            { error: 'Gagal menghapus pengumuman' },
            { status: 500 }
        );
    }
}
