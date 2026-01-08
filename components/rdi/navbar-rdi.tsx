import { NavbarRDI as NavbarRDIClient } from './navbar-rdi-client';
import { getNavbarContent } from '@/lib/rdi-data';
import { getProgramsContent } from '@/lib/program-data';

/**
 * Server wrapper component for NavbarRDI
 * Fetches data server-side and passes to client component
 */
export async function NavbarRDI() {
    const content = await getNavbarContent();
    const programsContent = await getProgramsContent();

    return <NavbarRDIClient content={content} programsContent={programsContent} />;
}
