import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/db';
import { landingPageContent } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { revalidateTag } from 'next/cache';
import { ProgramsContent } from '@/lib/program-data';

// GET - Fetch programs content
export async function GET(request: NextRequest) {
    try {
        const content = await db.query.landingPageContent.findFirst({
            where: eq(landingPageContent.section, 'rdi-programs'),
        });

        return NextResponse.json({
            success: true,
            data: content || null,
        });
    } catch (error) {
        console.error('Error fetching programs content:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to fetch programs content',
                details: errorMessage,
            },
            { status: 500 }
        );
    }
}

// POST - Create or update programs content
export async function POST(request: NextRequest) {
    try {
        const session = await auth();

        if (!session || session.user.role !== 'editor') {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Unauthorized. Only editors can modify content.'
                },
                { status: 401 }
            );
        }

        const body = await request.json();
        const { content, isPublished } = body as {
            content: ProgramsContent;
            isPublished?: boolean;
        };

        if (!content) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Content is required'
                },
                { status: 400 }
            );
        }

        // Validate content structure
        if (!content.categories || !Array.isArray(content.categories)) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Invalid content structure: categories must be an array'
                },
                { status: 400 }
            );
        }

        if (!content.items || !Array.isArray(content.items)) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Invalid content structure: items must be an array'
                },
                { status: 400 }
            );
        }

        // Validate unique slugs within categories
        const categorySlugs = content.categories.map(c => c.slug);
        if (new Set(categorySlugs).size !== categorySlugs.length) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Category slugs must be unique'
                },
                { status: 400 }
            );
        }

        // Check if section exists
        const existingContent = await db.query.landingPageContent.findFirst({
            where: eq(landingPageContent.section, 'rdi-programs'),
        });

        let result;

        if (existingContent) {
            // Update existing content
            [result] = await db
                .update(landingPageContent)
                .set({
                    content,
                    isPublished: isPublished ?? existingContent.isPublished,
                    lastEditedBy: session.user.id,
                    updatedAt: new Date(),
                })
                .where(eq(landingPageContent.section, 'rdi-programs'))
                .returning();
        } else {
            // Create new content
            [result] = await db
                .insert(landingPageContent)
                .values({
                    section: 'rdi-programs',
                    content,
                    isPublished: isPublished ?? true,
                    lastEditedBy: session.user.id,
                })
                .returning();
        }

        // Revalidate cache - must match tags used in unstable_cache
        revalidateTag('programs-content'); // This is the tag used in program-data.ts
        revalidateTag('rdi-section-rdi-programs'); // Keep for backwards compatibility
        revalidateTag('rdi-content');

        // Also revalidate pages that use this content
        const { revalidatePath } = await import('next/cache');
        revalidatePath('/'); // Landing page
        revalidatePath('/program'); // Program list page

        return NextResponse.json({
            success: true,
            data: result,
            message: existingContent ? 'Programs updated successfully' : 'Programs created successfully',
        });
    } catch (error) {
        console.error('Error saving programs content:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to save programs content',
                details: errorMessage,
            },
            { status: 500 }
        );
    }
}
