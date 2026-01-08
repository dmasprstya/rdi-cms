import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { dropdownMenu } from '@/db/schema';
import { eq, asc } from 'drizzle-orm';
import { auth } from '@/auth';

export const dynamic = 'force-dynamic';

// GET - Fetch all dropdown menu items (for CMS)
export async function GET() {
    try {
        const session = await auth();

        if (!session || session.user.role !== 'editor') {
            return NextResponse.json(
                { success: false, error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const items = await db
            .select()
            .from(dropdownMenu)
            .orderBy(asc(dropdownMenu.order));

        return NextResponse.json({
            success: true,
            data: items,
        });
    } catch (error) {
        console.error('Error fetching dropdown menu:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        const isTableNotFound = errorMessage.includes('does not exist');

        return NextResponse.json(
            {
                success: false,
                error: isTableNotFound
                    ? 'Table dropdown_menu does not exist. Please run setup first.'
                    : 'Failed to fetch dropdown menu',
                details: errorMessage,
            },
            { status: isTableNotFound ? 404 : 500 }
        );
    }
}

// POST - Create new dropdown menu item
export async function POST(request: NextRequest) {
    try {
        const session = await auth();

        if (!session || session.user.role !== 'editor') {
            return NextResponse.json(
                { success: false, error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const body = await request.json();
        const { title, slug, content, order, isPublished } = body;

        if (!title || !slug || !content) {
            return NextResponse.json(
                { success: false, error: 'Missing required fields' },
                { status: 400 }
            );
        }

        const [newItem] = await db
            .insert(dropdownMenu)
            .values({
                title,
                slug,
                content,
                order: order || 0,
                isPublished: isPublished ?? true,
                lastEditedBy: session.user.id,
            })
            .returning();

        return NextResponse.json({
            success: true,
            data: newItem,
        });
    } catch (error) {
        console.error('Error creating dropdown menu item:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to create dropdown menu item' },
            { status: 500 }
        );
    }
}

// PUT - Update dropdown menu item
export async function PUT(request: NextRequest) {
    try {
        const session = await auth();

        if (!session || session.user.role !== 'editor') {
            return NextResponse.json(
                { success: false, error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const body = await request.json();
        const { id, title, slug, content, order, isPublished } = body;

        if (!id || !title || !slug || !content) {
            return NextResponse.json(
                { success: false, error: 'Missing required fields' },
                { status: 400 }
            );
        }

        const [updatedItem] = await db
            .update(dropdownMenu)
            .set({
                title,
                slug,
                content,
                order: order || 0,
                isPublished: isPublished ?? true,
                lastEditedBy: session.user.id,
                updatedAt: new Date(),
            })
            .where(eq(dropdownMenu.id, id))
            .returning();

        return NextResponse.json({
            success: true,
            data: updatedItem,
        });
    } catch (error) {
        console.error('Error updating dropdown menu item:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to update dropdown menu item' },
            { status: 500 }
        );
    }
}

// DELETE - Delete dropdown menu item
export async function DELETE(request: NextRequest) {
    try {
        const session = await auth();

        if (!session || session.user.role !== 'editor') {
            return NextResponse.json(
                { success: false, error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json(
                { success: false, error: 'Missing id parameter' },
                { status: 400 }
            );
        }

        await db
            .delete(dropdownMenu)
            .where(eq(dropdownMenu.id, id));

        return NextResponse.json({
            success: true,
            message: 'Dropdown menu item deleted successfully',
        });
    } catch (error) {
        console.error('Error deleting dropdown menu item:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to delete dropdown menu item' },
            { status: 500 }
        );
    }
}
