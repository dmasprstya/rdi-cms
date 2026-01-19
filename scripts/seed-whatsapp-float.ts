import 'dotenv/config';
import { db } from '../db';
import { landingPageContent } from '../db/schema';
import { eq } from 'drizzle-orm';

async function seedWhatsAppFloat() {
    console.log('🌱 Seeding WhatsApp Float Button configuration...');

    const section = 'rdi-whatsapp-float';
    const content = {
        enabled: true,
        phoneNumber: '6281234567890',
        defaultMessage: 'Halo, saya ingin bertanya tentang program RDI',
        position: 'right',
        tooltipText: 'Chat dengan kami via WhatsApp',
    };

    try {
        // Check if section already exists
        const existing = await db.query.landingPageContent.findFirst({
            where: eq(landingPageContent.section, section),
        });

        if (existing) {
            // Update existing record
            await db
                .update(landingPageContent)
                .set({
                    content,
                    isPublished: true,
                    updatedAt: new Date(),
                })
                .where(eq(landingPageContent.section, section));

            console.log('✅ WhatsApp Float Button configuration updated successfully!');
        } else {
            // Insert new record
            await db.insert(landingPageContent).values({
                section,
                content,
                isPublished: true,
            });

            console.log('✅ WhatsApp Float Button configuration created successfully!');
        }

        console.log('\n📱 Configuration:');
        console.log('   Enabled:', content.enabled);
        console.log('   Phone Number:', content.phoneNumber);
        console.log('   Default Message:', content.defaultMessage);
        console.log('   Position:', content.position);
        console.log('   Tooltip:', content.tooltipText);
        console.log('\n✨ Done! You can now edit this configuration at /editor/whatsapp-float');
    } catch (error) {
        console.error('❌ Error seeding WhatsApp Float Button:', error);
        throw error;
    }
}

// Run the seeder
seedWhatsAppFloat()
    .then(() => {
        console.log('\n🎉 Seeding completed successfully!');
        process.exit(0);
    })
    .catch((error) => {
        console.error('\n💥 Seeding failed:', error);
        process.exit(1);
    });
