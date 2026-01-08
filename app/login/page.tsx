import { LoginClient } from './login-client';
import { getNavbarContent } from '@/lib/rdi-data';

/**
 * Server component for login page
 * Fetches navbar logo from CMS and passes it to client component
 */
export default async function LoginPage() {
    const navbarContent = await getNavbarContent();

    return (
        <LoginClient
            logoUrl={navbarContent.logoUrl}
            logoTextColor={navbarContent.logoTextColor}
        />
    );
}
