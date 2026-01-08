import { NextResponse } from 'next/server';
import { db } from '@/db';
import { dropdownMenu } from '@/db/schema';
import { eq, asc } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

// GET - Fetch all published dropdown menu items
export async function GET() {
    try {
        const items = await db
            .select({
                id: dropdownMenu.id,
                title: dropdownMenu.title,
                slug: dropdownMenu.slug,
                order: dropdownMenu.order,
            })
            .from(dropdownMenu)
            .where(eq(dropdownMenu.isPublished, true))
            .orderBy(asc(dropdownMenu.order));

        return NextResponse.json({
            success: true,
            data: items,
        });
    } catch (error) {
        console.error('Error fetching dropdown menu:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch dropdown menu' },
            { status: 500 }
        );
    }
}
