import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { auth } from '@/auth';
import { db } from '@/db';
import { landingPageContent } from '@/db/schema';
import { eq } from 'drizzle-orm';

// RDI Landing Page sections
const RDI_SECTIONS = [
    'rdi-hero',
    'rdi-trust-partners',
    // 'rdi-core-pillars' - REMOVED: Programs are dynamically fetched from the 'programs' database table
    //                       This provides automatic updates when new programs are added
    //                       Edit programs via /program admin page, NOT via CMS
    'rdi-why-rdi',
    'rdi-founders',
    'rdi-latest-news',
    'rdi-cta',
    'rdi-footer',
    'rdi-navbar'
];

// GET - Fetch RDI landing page content by section
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const section = searchParams.get('section');

        if (section) {
            // Validate that section is an RDI section
            if (!RDI_SECTIONS.includes(section)) {
                return NextResponse.json(
                    {
                        success: false,
                        error: 'Invalid RDI section',
                    },
                    { status: 400 }
                );
            }

            // Fetch specific RDI section
            const content = await db.query.landingPageContent.findFirst({
                where: eq(landingPageContent.section, section),
            });

            return NextResponse.json({
                success: true,
                data: content || null,
            });
        }

        // Fetch all RDI sections
        const allContent = await db.query.landingPageContent.findMany({
            where: (fields, { inArray }) => inArray(fields.section, RDI_SECTIONS),
        });

        return NextResponse.json({
            success: true,
            data: allContent,
        });
    } catch (error) {
        console.error('Error fetching RDI CMS content:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to fetch RDI content',
                details: errorMessage,
            },
            { status: 500 }
        );
    }
}

// POST - Create or update RDI landing page content
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

        // Validate that section is an RDI section
        if (!RDI_SECTIONS.includes(section)) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Invalid RDI section',
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

        // Revalidate cached data
        // Revalidate the specific section cache
        const { revalidateTag } = await import('next/cache');
        revalidateTag(`rdi-section-${section}`);
        revalidateTag('rdi-content');

        // Also revalidate pages that use this content
        revalidatePath('/'); // Landing page
        revalidatePath('/program/luar-negeri'); // Program pages
        revalidatePath('/program/haltec');

        return NextResponse.json({
            success: true,
            data: result,
            message: existingContent ? 'RDI content updated successfully' : 'RDI content created successfully',
        });
    } catch (error) {
        console.error('Error saving RDI CMS content:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to save RDI content',
                details: errorMessage,
            },
            { status: 500 }
        );
    }
}
