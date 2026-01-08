import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/db';
import { landingPageContent } from '@/db/schema';
import { eq } from 'drizzle-orm';

// GET - Fetch landing page content by section
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const section = searchParams.get('section');

        if (section) {
            // Fetch specific section
            const content = await db.query.landingPageContent.findFirst({
                where: eq(landingPageContent.section, section),
            });

            return NextResponse.json({
                success: true,
                data: content || null,
            });
        }

        // Fetch all sections
        const allContent = await db.query.landingPageContent.findMany();
        return NextResponse.json({
            success: true,
            data: allContent,
        });
    } catch (error) {
        console.error('Error fetching CMS content:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to fetch content',
                details: errorMessage,
            },
            { status: 500 }
        );
    }
}

// POST - Create or update landing page content
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
        const { section, content, isPublished } = body;

        if (!section || !content) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Section and content are required'
                },
                { status: 400 }
            );
        }

        // Check if section exists
        const existingContent = await db.query.landingPageContent.findFirst({
            where: eq(landingPageContent.section, section),
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
                .where(eq(landingPageContent.section, section))
                .returning();
        } else {
            // Create new content
            [result] = await db
                .insert(landingPageContent)
                .values({
                    section,
                    content,
                    isPublished: isPublished ?? true,
                    lastEditedBy: session.user.id,
                })
                .returning();
        }

        return NextResponse.json({
            success: true,
            data: result,
            message: existingContent ? 'Content updated successfully' : 'Content created successfully',
        });
    } catch (error) {
        console.error('Error saving CMS content:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to save content',
                details: errorMessage,
            },
            { status: 500 }
        );
    }
}
