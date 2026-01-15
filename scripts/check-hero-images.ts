/**
 * Diagnostic script to check hero images in database
 * Run with: npx tsx scripts/check-hero-images.ts
 */

import { db } from '@/db';
import { heroImages, landingPageContent } from '@/db/schema';
import { eq } from 'drizzle-orm';

async function checkHeroImages() {
    console.log('🔍 Checking Hero Section Configuration...\n');

    try {
        // 1. Check hero content
        console.log('1️⃣ Checking hero content in landing_page_content table:');
        const heroContent = await db.query.landingPageContent.findFirst({
            where: eq(landingPageContent.section, 'rdi-hero'),
        });

        if (heroContent) {
            console.log('✅ Hero content found:');
            console.log(JSON.stringify(heroContent.content, null, 2));
        } else {
            console.log('⚠️ No hero content found in database');
        }

        console.log('\n2️⃣ Checking hero images in hero_images table:');
        const images = await db.query.heroImages.findMany({
            where: eq(heroImages.sectionId, 'rdi-hero'),
        });

        if (images.length === 0) {
            console.log('⚠️ No hero images found in database');
            console.log('   This means the hero section will use DefaultHeroLayout (gradient background)');
        } else {
            console.log(`✅ Found ${images.length} hero image(s):\n`);

            for (const img of images) {
                console.log(`  Image ID: ${img.id}`);
                console.log(`  Order: ${img.order}`);
                console.log(`  URL: ${img.imageUrl}`);
                console.log(`  Alt Text: ${img.altText}`);
                console.log(`  Created: ${img.createdAt}`);

                // Check if URL is valid
                if (img.imageUrl.startsWith('http')) {
                    console.log(`  ✅ URL format looks valid (external)`);

                    // Check if it's a Vercel Blob URL
                    if (img.imageUrl.includes('blob.vercel-storage.com')) {
                        console.log(`  ✅ Using Vercel Blob Storage`);
                    } else {
                        console.log(`  ⚠️ Not using Vercel Blob Storage`);
                    }
                } else if (img.imageUrl.startsWith('/')) {
                    console.log(`  ⚠️ Using local path - may not work on Vercel`);
                } else {
                    console.log(`  ❌ Invalid URL format`);
                }

                console.log('');
            }

            // Check for duplicate orders
            const orders = images.map(img => img.order);
            const duplicates = orders.filter((item, index) => orders.indexOf(item) !== index);
            if (duplicates.length > 0) {
                console.log(`⚠️ Warning: Duplicate order numbers found: ${duplicates.join(', ')}`);
            }
        }

        console.log('\n3️⃣ Summary:');
        console.log(`   - Hero content: ${heroContent ? '✅ Configured' : '⚠️ Using defaults'}`);
        console.log(`   - Hero images: ${images.length > 0 ? `✅ ${images.length} image(s)` : '⚠️ No images (will show gradient)'}`);

        if (heroContent?.content && typeof heroContent.content === 'object' && 'logoUrl' in heroContent.content) {
            const logoUrl = (heroContent.content as any).logoUrl;
            console.log(`   - Logo URL: ${logoUrl || '⚠️ Not configured'}`);
        }

    } catch (error) {
        console.error('❌ Error checking hero images:', error);
        if (error instanceof Error) {
            console.error('   Message:', error.message);
            console.error('   Stack:', error.stack);
        }
    }

    process.exit(0);
}

checkHeroImages();
