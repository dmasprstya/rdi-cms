// Quick script to check CTA data in database
import { db } from '../db';
import { landingPageContent } from '../db/schema';
import { eq } from 'drizzle-orm';

async function checkCTAData() {
    try {
        console.log('🔍 Checking CTA data in database...\n');

        const ctaData = await db.query.landingPageContent.findFirst({
            where: eq(landingPageContent.section, 'rdi-cta')
        });

        if (!ctaData) {
            console.log('❌ No CTA data found in database!');
            console.log('   This means the page will use fallback/default values.');
            console.log('   Default WhatsApp numbers: 6281234567890 and 6281234567891');
            return;
        }

        console.log('✅ CTA data found in database:');
        console.log('\nSection:', ctaData.section);
        console.log('Published:', ctaData.isPublished);
        console.log('Last Updated:', ctaData.updatedAt);
        console.log('\nContent:', JSON.stringify(ctaData.content, null, 2));

        const content = ctaData.content as any;
        console.log('\n📱 WhatsApp Numbers:');
        console.log('  - Overseas:', content.waNumberOverseas);
        console.log('  - HALTEC:', content.waNumberHaltec);

        // Test URL generation
        const overseasUrl = `https://wa.me/${content.waNumberOverseas}?text=${encodeURIComponent(content.messageOverseas)}`;
        const haltecUrl = `https://wa.me/${content.waNumberHaltec}?text=${encodeURIComponent(content.messageHaltec)}`;

        console.log('\n🔗 Generated URLs:');
        console.log('  - Overseas:', overseasUrl);
        console.log('  - HALTEC:', haltecUrl);

    } catch (error) {
        console.error('❌ Error checking database:', error);
    } finally {
        process.exit(0);
    }
}

checkCTAData();
