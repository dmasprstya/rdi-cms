import { db } from '../db';
import { landingPageContent } from '../db/schema';
import { eq } from 'drizzle-orm';

async function updateContactText() {
    try {
        // Fetch current navbar content
        const navbarContent = await db.query.landingPageContent.findFirst({
            where: eq(landingPageContent.section, 'rdi-navbar'),
        });

        if (navbarContent && navbarContent.content) {
            // Update contactText to 'DAFTAR'
            const updatedContent = {
                ...(navbarContent.content as any),
                contactText: 'DAFTAR'
            };

            // Update database
            await db.update(landingPageContent)
                .set({ content: updatedContent })
                .where(eq(landingPageContent.section, 'rdi-navbar'));

            console.log('✅ Successfully updated contactText to "DAFTAR"');
            console.log('Updated content:', updatedContent);
        } else {
            console.log('❌ Navbar content not found in database');
        }
    } catch (error) {
        console.error('❌ Error updating contact text:', error);
    } finally {
        process.exit(0);
    }
}

updateContactText();
